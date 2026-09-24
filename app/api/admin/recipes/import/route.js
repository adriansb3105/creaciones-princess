import { v4 as uuidv4 } from 'uuid';
import { connectToDatabase } from '@/lib/mongodb';
import { requireAdmin } from '@/lib/auth';
import { detectAndFetchMetadata } from '@/lib/recipes/extractors';
import { structureRecipe } from '@/lib/recipes/structure';

export async function POST(request) {
  try {
    const session = await requireAdmin(request);
    if (!session) {
      return Response.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { db } = await connectToDatabase();
    const body = await request.json();
    const { url, pastedText } = body;

    if (!url && !pastedText) {
      return Response.json({ error: 'Pega un enlace o un texto para analizar' }, { status: 400 });
    }

    let metadata = { platform: null, title: null, author: null, thumbnail: null, rawText: null, textSource: null };
    if (url) {
      metadata = await detectAndFetchMetadata(url);
    }

    // El texto pegado a mano manda sobre lo detectado automáticamente — si el
    // admin lo pegó es porque la detección no trajo nada útil (o quiere
    // corregirla).
    let sourceText = '';
    let textOrigin = 'manual';
    if (pastedText && pastedText.trim()) {
      sourceText = pastedText.trim();
      textOrigin = 'manual';
    } else if (metadata.rawText) {
      sourceText = metadata.rawText;
      textOrigin = metadata.textSource || 'fuente_descripcion';
    }

    const parsed = structureRecipe(sourceText, textOrigin);

    const job = {
      id: uuidv4(),
      url: url || '',
      platform: metadata.platform,
      stage: sourceText ? 'revision' : 'texto',
      textSource: textOrigin,
      rawText: sourceText,
      parsedResult: parsed,
      recipeId: null,
      createdAt: new Date(),
    };
    await db.collection('recipe_import_jobs').insertOne(job);

    return Response.json({ job, metadata, sourceText, parsed });
  } catch (error) {
    console.error('POST /api/admin/recipes/import error:', error);
    return Response.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
