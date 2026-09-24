import { detectPlatform, isValidUrl } from '@/lib/recipes/platforms';
import { getYouTubeMetadata } from '@/lib/recipes/extractors/youtube';
import { getTikTokMetadata } from '@/lib/recipes/extractors/tiktok';
import { getInstagramMetadata } from '@/lib/recipes/extractors/instagram';
import { getFacebookMetadata } from '@/lib/recipes/extractors/facebook';

const EXTRACTORS = {
  youtube: getYouTubeMetadata,
  tiktok: getTikTokMetadata,
  instagram: getInstagramMetadata,
  facebook: getFacebookMetadata,
};

// Punto único de entrada: valida la URL, detecta la plataforma y trae lo que
// esa red da gratis y de forma oficial. Nunca lanza — si algo falla, devuelve
// los campos en null con textSource: 'no_disponible' para que el admin
// complete a mano.
export async function detectAndFetchMetadata(url) {
  if (!isValidUrl(url)) {
    return { platform: null, title: null, author: null, thumbnail: null, rawText: null, textSource: 'url_invalida' };
  }

  const platform = detectPlatform(url);
  if (!platform) {
    return { platform: null, title: null, author: null, thumbnail: null, rawText: null, textSource: 'plataforma_no_soportada' };
  }

  try {
    return await EXTRACTORS[platform](url);
  } catch {
    return { platform, title: null, author: null, thumbnail: null, rawText: null, textSource: 'no_disponible' };
  }
}
