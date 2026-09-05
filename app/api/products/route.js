import { v4 as uuidv4 } from 'uuid';
import { connectToDatabase } from '@/lib/mongodb';
import { requireAdmin } from '@/lib/auth';
import { slugify } from '@/lib/utils';
import { ensureProductsSeeded } from '@/lib/seed';

export async function GET(request) {
  try {
    const { db } = await connectToDatabase();
    await ensureProductsSeeded(db);

    const { searchParams } = new URL(request.url);
    const categorySlug = searchParams.get('category');
    const subcategorySlug = searchParams.get('subcategory');
    const featured = searchParams.get('featured');
    const search = searchParams.get('search');

    const session = await requireAdmin(request);

    const query = {};
    if (!session) {
      query.active = true;
    }

    if (categorySlug) {
      const category = await db.collection('categories').findOne({ slug: categorySlug });
      if (!category) {
        return Response.json({ products: [] });
      }
      query.categoryId = category.id;

      if (subcategorySlug) {
        const subcategory = category.subcategories.find((s) => s.slug === subcategorySlug);
        if (!subcategory) {
          return Response.json({ products: [] });
        }
        query.subcategoryId = subcategory.id;
      }
    }

    if (featured === 'true') {
      query.featured = true;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const products = await db.collection('products').find(query).sort({ createdAt: -1 }).toArray();

    return Response.json({ products });
  } catch (error) {
    console.error('GET /api/products error:', error);
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

    if (!name || !description || price === undefined || !categoryId) {
      return Response.json({ error: 'Nombre, descripción, precio y categoría son requeridos' }, { status: 400 });
    }

    const now = new Date();
    const product = {
      id: uuidv4(),
      slug: slugify(name),
      name,
      description,
      price: Number(price),
      categoryId,
      subcategoryId: subcategoryId || null,
      images: Array.isArray(images) ? images : [],
      youtubeVideoId: youtubeVideoId || null,
      featured: Boolean(featured),
      active: active === undefined ? true : Boolean(active),
      availabilityNote: availabilityNote || '',
      createdAt: now,
      updatedAt: now,
    };

    await db.collection('products').insertOne(product);
    return Response.json({ success: true, product }, { status: 201 });
  } catch (error) {
    console.error('POST /api/products error:', error);
    return Response.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
