import { v4 as uuidv4 } from 'uuid';
import { connectToDatabase } from '@/lib/mongodb';
import { requireAdmin } from '@/lib/auth';
import { slugify } from '@/lib/utils';

export async function POST(request, { params }) {
  try {
    const session = await requireAdmin(request);
    if (!session) {
      return Response.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { id } = await params;
    const { db } = await connectToDatabase();
    const body = await request.json();
    const { name } = body;

    if (!name) {
      return Response.json({ error: 'El nombre es requerido' }, { status: 400 });
    }

    const subcategory = { id: uuidv4(), name, slug: slugify(name) };

    const result = await db
      .collection('categories')
      .updateOne({ id }, { $push: { subcategories: subcategory }, $set: { updatedAt: new Date() } });

    if (result.matchedCount === 0) {
      return Response.json({ error: 'Categoría no encontrada' }, { status: 404 });
    }

    return Response.json({ success: true, subcategory }, { status: 201 });
  } catch (error) {
    console.error('POST /api/categories/[id]/subcategories error:', error);
    return Response.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
