import { connectToDatabase } from '@/lib/mongodb';
import { requireAdmin } from '@/lib/auth';
import { retryInstagramPublish } from '@/lib/social';

export const maxDuration = 60;

export async function POST(request, { params }) {
  try {
    const session = await requireAdmin(request);
    if (!session) {
      return Response.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { id } = await params;
    const { db } = await connectToDatabase();
    const collection = db.collection('delivery_posts');
    const post = await collection.findOne({ id });

    if (!post) {
      return Response.json({ error: 'Publicación no encontrada' }, { status: 404 });
    }

    const containerId = post.results?.instagram?.containerId;
    if (!containerId) {
      return Response.json({ error: 'Esta publicación no tiene un video pendiente de Instagram' }, { status: 400 });
    }

    let result;
    try {
      result = { status: 'success', ...(await retryInstagramPublish(containerId)) };
    } catch (error) {
      result =
        error.message === 'TIMEOUT_PROCESSING'
          ? { status: 'processing', containerId: error.containerId }
          : { status: 'error', error: error.message };
    }

    await collection.updateOne({ id }, { $set: { 'results.instagram': result, updatedAt: new Date() } });

    return Response.json({ success: true, instagram: result });
  } catch (error) {
    console.error('POST /api/social/publish/[id]/retry-instagram error:', error);
    return Response.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
