import { connectToDatabase } from '@/lib/mongodb';
import { requireAdmin } from '@/lib/auth';
import { slugify } from '@/lib/utils';

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const { db } = await connectToDatabase();
    const category = await db.collection('categories').findOne({ $or: [{ id }, { slug: id }] });

    if (!category) {
      return Response.json({ error: 'Categoría no encontrada' }, { status: 404 });
    }

    return Response.json({ category });
  } catch (error) {
    console.error('GET /api/categories/[id] error:', error);
    return Response.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const session = await requireAdmin(request);
    if (!session) {
      return Response.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { id } = await params;
    const { db } = await connectToDatabase();
    const body = await request.json();
    const { name, description, image, order } = body;

    const updateData = { updatedAt: new Date() };
    if (name) {
      updateData.name = name;
      updateData.slug = slugify(name);
    }
    if (description !== undefined) updateData.description = description;
    if (image !== undefined) updateData.image = image;
    if (order !== undefined) updateData.order = order;

    const result = await db.collection('categories').updateOne({ id }, { $set: updateData });

    if (result.matchedCount === 0) {
      return Response.json({ error: 'Categoría no encontrada' }, { status: 404 });
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error('PUT /api/categories/[id] error:', error);
    return Response.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const session = await requireAdmin(request);
    if (!session) {
      return Response.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { id } = await params;
    const { db } = await connectToDatabase();

    const productsUsingCategory = await db.collection('products').countDocuments({ categoryId: id });
    if (productsUsingCategory > 0) {
      return Response.json(
        { error: `No se puede eliminar: ${productsUsingCategory} producto(s) usan esta categoría` },
        { status: 409 }
      );
    }

    const result = await db.collection('categories').deleteOne({ id });
    if (result.deletedCount === 0) {
      return Response.json({ error: 'Categoría no encontrada' }, { status: 404 });
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/categories/[id] error:', error);
    return Response.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
