import { connectToDatabase } from '@/lib/mongodb';
import { requireAdmin } from '@/lib/auth';
import { slugify } from '@/lib/utils';

export async function PUT(request, { params }) {
  try {
    const session = await requireAdmin(request);
    if (!session) {
      return Response.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { id, subId } = await params;
    const { db } = await connectToDatabase();
    const body = await request.json();
    const { name } = body;

    if (!name) {
      return Response.json({ error: 'El nombre es requerido' }, { status: 400 });
    }

    const result = await db.collection('categories').updateOne(
      { id, 'subcategories.id': subId },
      {
        $set: {
          'subcategories.$.name': name,
          'subcategories.$.slug': slugify(name),
          updatedAt: new Date(),
        },
      }
    );

    if (result.matchedCount === 0) {
      return Response.json({ error: 'Subcategoría no encontrada' }, { status: 404 });
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error('PUT /api/categories/[id]/subcategories/[subId] error:', error);
    return Response.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const session = await requireAdmin(request);
    if (!session) {
      return Response.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { id, subId } = await params;
    const { db } = await connectToDatabase();

    const productsUsingSub = await db.collection('products').countDocuments({ subcategoryId: subId });
    if (productsUsingSub > 0) {
      return Response.json(
        { error: `No se puede eliminar: ${productsUsingSub} producto(s) usan esta subcategoría` },
        { status: 409 }
      );
    }

    const result = await db
      .collection('categories')
      .updateOne({ id }, { $pull: { subcategories: { id: subId } }, $set: { updatedAt: new Date() } });

    if (result.matchedCount === 0) {
      return Response.json({ error: 'Categoría no encontrada' }, { status: 404 });
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/categories/[id]/subcategories/[subId] error:', error);
    return Response.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
