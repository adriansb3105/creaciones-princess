import crypto from 'crypto';
import { requireAdmin } from '@/lib/auth';

export async function POST(request) {
  try {
    const session = await requireAdmin(request);
    if (!session) {
      return Response.json({ error: 'No autorizado' }, { status: 401 });
    }

    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
      return Response.json({ error: 'Cloudinary no está configurado en el servidor' }, { status: 500 });
    }

    const timestamp = Math.round(Date.now() / 1000);
    const folder = process.env.CLOUDINARY_UPLOAD_FOLDER || 'creaciones-princess';

    // Firma = SHA-1(parámetros ordenados alfabéticamente + api_secret)
    const paramsToSign = `folder=${folder}&timestamp=${timestamp}${apiSecret}`;
    const signature = crypto.createHash('sha1').update(paramsToSign).digest('hex');

    return Response.json({ cloudName, apiKey, timestamp, folder, signature });
  } catch (error) {
    console.error('POST /api/admin/cloudinary/sign error:', error);
    return Response.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
