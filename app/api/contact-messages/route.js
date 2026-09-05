import { connectToDatabase } from '@/lib/mongodb';
import { requireAdmin } from '@/lib/auth';

export async function GET(request) {
  try {
    const session = await requireAdmin(request);
    if (!session) {
      return Response.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { db } = await connectToDatabase();
    const messages = await db.collection('contact_messages').find({}).sort({ createdAt: -1 }).toArray();

    return Response.json({ messages });
  } catch (error) {
    console.error('GET /api/contact-messages error:', error);
    return Response.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

export async function PATCH(request) {
  try {
    const session = await requireAdmin(request);
    if (!session) {
      return Response.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { db } = await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const body = await request.json();

    const result = await db
      .collection('contact_messages')
      .updateOne({ id }, { $set: { read: Boolean(body.read) } });

    if (result.matchedCount === 0) {
      return Response.json({ error: 'Mensaje no encontrado' }, { status: 404 });
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error('PATCH /api/contact-messages error:', error);
    return Response.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
