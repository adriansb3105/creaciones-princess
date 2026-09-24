import { getYouTubeId } from '@/lib/utils';

// Probado en vivo (sep-2026): el oEmbed público de YouTube da título, canal y
// miniatura, pero NUNCA la descripción — para eso hace falta la Data API v3
// con una clave (gratis, cuota diaria). Sin clave, el texto queda como
// "no disponible" y se pega a mano; nunca se inventa.
export async function getYouTubeMetadata(url) {
  const videoId = getYouTubeId(url);
  if (!videoId) {
    return { platform: 'youtube', title: null, author: null, thumbnail: null, rawText: null, textSource: 'no_disponible' };
  }

  const apiKey = process.env.YOUTUBE_API_KEY;
  if (apiKey) {
    try {
      const res = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${apiKey}`
      );
      if (res.ok) {
        const data = await res.json();
        const snippet = data.items?.[0]?.snippet;
        if (snippet) {
          return {
            platform: 'youtube',
            title: snippet.title || null,
            author: snippet.channelTitle || null,
            thumbnail: snippet.thumbnails?.high?.url || snippet.thumbnails?.default?.url || null,
            rawText: snippet.description || null,
            textSource: snippet.description ? 'fuente_descripcion' : 'no_disponible',
          };
        }
      }
    } catch {
      // seguimos al respaldo por oEmbed
    }
  }

  try {
    const res = await fetch(`https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`);
    if (!res.ok) throw new Error('oEmbed falló');
    const data = await res.json();
    return {
      platform: 'youtube',
      title: data.title || null,
      author: data.author_name || null,
      thumbnail: data.thumbnail_url || null,
      rawText: null,
      textSource: 'no_disponible',
    };
  } catch {
    return { platform: 'youtube', title: null, author: null, thumbnail: null, rawText: null, textSource: 'no_disponible' };
  }
}
