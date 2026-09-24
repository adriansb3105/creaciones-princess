import { requireAdmin } from '@/lib/auth';
import { detectAndFetchMetadata } from '@/lib/recipes/extractors';

export async function POST(request) {
  try {
    const session = await requireAdmin(request);
    if (!session) {
      return Response.json({ error: 'No autorizado' }, { status: 401 });
    }

    const body = await request.json();
    const { url } = body;

    if (!url) {
      return Response.json({ error: 'La URL es requerida' }, { status: 400 });
    }

    const metadata = await detectAndFetchMetadata(url);
    return Response.json({ metadata });
  } catch (error) {
    console.error('POST /api/admin/recipes/detect error:', error);
    return Response.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
