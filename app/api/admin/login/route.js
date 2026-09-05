import { v4 as uuidv4 } from 'uuid';
import { connectToDatabase } from '@/lib/mongodb';
import { hashPassword, comparePassword, signSession, SESSION_COOKIE } from '@/lib/auth';

async function ensureAdminSeeded(db) {
  const collection = db.collection('admin_users');
  const count = await collection.countDocuments();
  if (count > 0) return;

  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) return;

  await collection.insertOne({
    id: uuidv4(),
    email: email.toLowerCase(),
    passwordHash: await hashPassword(password),
    name: 'Administrador',
    createdAt: new Date(),
    lastLoginAt: null,
  });
}

export async function POST(request) {
  try {
    const { db } = await connectToDatabase();
    await ensureAdminSeeded(db);

    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return Response.json({ error: 'Email y contraseña son requeridos' }, { status: 400 });
    }

    const admin = await db.collection('admin_users').findOne({ email: email.toLowerCase() });
    if (!admin) {
      return Response.json({ error: 'Credenciales inválidas' }, { status: 401 });
    }

    const valid = await comparePassword(password, admin.passwordHash);
    if (!valid) {
      return Response.json({ error: 'Credenciales inválidas' }, { status: 401 });
    }

    await db.collection('admin_users').updateOne({ id: admin.id }, { $set: { lastLoginAt: new Date() } });

    const token = await signSession({ sub: admin.id, email: admin.email });

    const response = Response.json({ success: true, admin: { email: admin.email, name: admin.name } });
    response.headers.set(
      'Set-Cookie',
      `${SESSION_COOKIE}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${7 * 24 * 60 * 60}${
        process.env.NODE_ENV === 'production' ? '; Secure' : ''
      }`
    );

    return response;
  } catch (error) {
    console.error('POST /api/admin/login error:', error);
    return Response.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
