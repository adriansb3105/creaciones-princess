import { v4 as uuidv4 } from 'uuid';
import { connectToDatabase } from '@/lib/mongodb';
import { requireAdmin } from '@/lib/auth';
import { getYouTubeId } from '@/lib/utils';
import { ensureGallerySeeded } from '@/lib/seed';

export async function GET() {
  try {
    const { db } = await connectToDatabase();
    await ensureGallerySeeded(db);

    const items = await db.collection('gallery_items').find({}).sort({ order: 1 }).toArray();
    return Response.json({ items });
  } catch (error) {
    console.error('GET /api/gallery error:', error);
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
    const { type, url, youtubeUrl, caption } = body;

    if (!['image', 'video', 'clip'].includes(type)) {
      return Response.json({ error: 'Tipo inválido' }, { status: 400 });
    }

    if ((type === 'image' || type === 'clip') && !url) {
      return Response.json({ error: type === 'clip' ? 'El video es requerido' : 'La imagen es requerida' }, { status: 400 });
    }

    const youtubeVideoId = type === 'video' ? getYouTubeId(youtubeUrl) : null;
    if (type === 'video' && !youtubeVideoId) {
      return Response.json({ error: 'URL de YouTube inválida' }, { status: 400 });
    }

    const collection = db.collection('gallery_items');
    const count = await collection.countDocuments();

    const item = {
      id: uuidv4(),
      type,
      url: type === 'image' || type === 'clip' ? url : null,
      youtubeVideoId,
      caption: caption || '',
      order: count,
      createdAt: new Date(),
    };

    await collection.insertOne(item);
    return Response.json({ success: true, item }, { status: 201 });
  } catch (error) {
    console.error('POST /api/gallery error:', error);
    return Response.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
