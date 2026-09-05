import { connectToDatabase } from '@/lib/mongodb';
import { requireAdmin } from '@/lib/auth';
import { slugify } from '@/lib/utils';

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const { db } = await connectToDatabase();
    const session = await requireAdmin(request);

    const query = { $or: [{ id }, { slug: id }] };
    const product = await db.collection('products').findOne(query);

    if (!product || (!session && !product.active)) {
      return Response.json({ error: 'Producto no encontrado' }, { status: 404 });
    }

    let related = [];
    if (product.categoryId) {
      related = await db
        .collection('products')
        .find({ categoryId: product.categoryId, id: { $ne: product.id }, active: true })
        .limit(4)
        .toArray();
    }

    return Response.json({ product, related });
  } catch (error) {
    console.error('GET /api/products/[id] error:', error);
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
    const {
      name,
      description,
      price,
      categoryId,
      subcategoryId,
      images,
      youtubeVideoId,
      featured,
      active,
      availabilityNote,
    } = body;

    const updateData = { updatedAt: new Date() };
    if (name) {
      updateData.name = name;
      updateData.slug = slugify(name);
    }
    if (description !== undefined) updateData.description = description;
    if (price !== undefined) updateData.price = Number(price);
    if (categoryId !== undefined) updateData.categoryId = categoryId;
    if (subcategoryId !== undefined) updateData.subcategoryId = subcategoryId || null;
    if (images !== undefined) updateData.images = images;
    if (youtubeVideoId !== undefined) updateData.youtubeVideoId = youtubeVideoId || null;
    if (featured !== undefined) updateData.featured = Boolean(featured);
    if (active !== undefined) updateData.active = Boolean(active);
    if (availabilityNote !== undefined) updateData.availabilityNote = availabilityNote;

    const result = await db.collection('products').updateOne({ id }, { $set: updateData });

    if (result.matchedCount === 0) {
      return Response.json({ error: 'Producto no encontrado' }, { status: 404 });
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error('PUT /api/products/[id] error:', error);
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
    const result = await db.collection('products').deleteOne({ id });

    if (result.deletedCount === 0) {
      return Response.json({ error: 'Producto no encontrado' }, { status: 404 });
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/products/[id] error:', error);
    return Response.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
