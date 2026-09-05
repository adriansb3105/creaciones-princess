import { v4 as uuidv4 } from 'uuid';
import { connectToDatabase } from '@/lib/mongodb';
import { requireAdmin } from '@/lib/auth';
import { slugify } from '@/lib/utils';
import { ensureCategoriesSeeded } from '@/lib/seed';

export async function GET() {
  try {
    const { db } = await connectToDatabase();
    await ensureCategoriesSeeded(db);

    const categories = await db
      .collection('categories')
      .find({})
      .sort({ order: 1 })
      .toArray();

    return Response.json({ categories });
  } catch (error) {
    console.error('GET /api/categories error:', error);
    return Response.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const session = await requireAdmin(request);
    if (!session) {
      return Response.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { db } = await connectToDatabase();
    const body = await request.json();
    const { name, description, image } = body;

    if (!name) {
      return Response.json({ error: 'El nombre es requerido' }, { status: 400 });
    }

    const collection = db.collection('categories');
    const count = await collection.countDocuments();
    const now = new Date();

    const category = {
      id: uuidv4(),
      slug: slugify(name),
      name,
      description: description || '',
      image: image || '',
      order: count,
      subcategories: [],
      createdAt: now,
      updatedAt: now,
    };

    await collection.insertOne(category);
    return Response.json({ success: true, category }, { status: 201 });
  } catch (error) {
    console.error('POST /api/categories error:', error);
    return Response.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
