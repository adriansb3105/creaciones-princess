import { v4 as uuidv4 } from 'uuid';
import { connectToDatabase } from '@/lib/mongodb';
import { requireAdmin } from '@/lib/auth';
import { publishToFacebook, publishToInstagram } from '@/lib/social';

// El procesamiento de video de Instagram puede tardar; le damos margen a la función.
export const maxDuration = 60;

export async function POST(request) {
  try {
    const session = await requireAdmin(request);
    if (!session) {
      return Response.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { db } = await connectToDatabase();
    const body = await request.json();
    const { productId, productName, images, videoUrl, caption, targets } = body;

    const cleanImages = Array.isArray(images) ? images.filter(Boolean) : [];
    if (cleanImages.length === 0 && !videoUrl) {
      return Response.json({ error: 'Agrega al menos una foto o un video' }, { status: 400 });
    }

    const wantsInstagram = Boolean(targets?.instagram);
    const wantsFacebook = Boolean(targets?.facebook);

    // 1. Siempre se guarda en la galería del sitio.
    const galleryCollection = db.collection('gallery_items');
    let order = await galleryCollection.countDocuments();
    const now = new Date();

    for (const url of cleanImages) {
      await galleryCollection.insertOne({ id: uuidv4(), type: 'image', url, youtubeVideoId: null, caption: caption || '', order: order++, createdAt: now });
    }
    if (videoUrl) {
      await galleryCollection.insertOne({ id: uuidv4(), type: 'clip', url: videoUrl, youtubeVideoId: null, caption: caption || '', order: order++, createdAt: now });
    }

    // 2. Registro del post para poder ver el resultado y reintentar si hace falta.
    const post = {
      id: uuidv4(),
      productId: productId || null,
      productName: productName || '',
      images: cleanImages,
      videoUrl: videoUrl || null,
      caption: caption || '',
      targets: { instagram: wantsInstagram, facebook: wantsFacebook },
      results: {
        instagram: wantsInstagram ? { status: 'pending' } : { status: 'skipped' },
        facebook: wantsFacebook ? { status: 'pending' } : { status: 'skipped' },
      },
      createdAt: now,
      updatedAt: now,
    };

    const postsCollection = db.collection('delivery_posts');
    await postsCollection.insertOne(post);

    // 3. Publicar en Facebook.
    if (wantsFacebook) {
      try {
        const result = await publishToFacebook({ images: cleanImages, videoUrl, caption: caption || '' });
        post.results.facebook = { status: 'success', ...result };
      } catch (error) {
        post.results.facebook = { status: 'error', error: error.message };
      }
    }

    // 4. Publicar en Instagram.
    if (wantsInstagram) {
      try {
        const result = await publishToInstagram({ images: cleanImages, videoUrl, caption: caption || '' });
        post.results.instagram = { status: 'success', ...result };
      } catch (error) {
        if (error.message === 'TIMEOUT_PROCESSING') {
          post.results.instagram = { status: 'processing', containerId: error.containerId };
        } else {
          post.results.instagram = { status: 'error', error: error.message };
        }
      }
    }

    post.updatedAt = new Date();
    await postsCollection.updateOne({ id: post.id }, { $set: { results: post.results, updatedAt: post.updatedAt } });

    return Response.json({ success: true, post });
  } catch (error) {
    console.error('POST /api/social/publish error:', error);
    return Response.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

export async function GET(request) {
  try {
    const session = await requireAdmin(request);
    if (!session) {
      return Response.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { db } = await connectToDatabase();
    const posts = await db.collection('delivery_posts').find({}).sort({ createdAt: -1 }).toArray();
    return Response.json({ posts });
  } catch (error) {
    console.error('GET /api/social/publish error:', error);
    return Response.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
