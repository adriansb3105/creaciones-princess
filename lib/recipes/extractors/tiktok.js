// Probado en vivo (sep-2026): el oEmbed público de TikTok trae el "title",
// que en la práctica ES el caption/descripción del video — sin necesidad de
// cuenta ni token.
export async function getTikTokMetadata(url) {
  try {
    const res = await fetch(`https://www.tiktok.com/oembed?url=${encodeURIComponent(url)}`);
    if (!res.ok) throw new Error('oEmbed falló');
    const data = await res.json();
    const caption = data.title || null;
    return {
      platform: 'tiktok',
      title: caption,
      author: data.author_name || null,
      thumbnail: data.thumbnail_url || null,
      rawText: caption,
      textSource: caption ? 'fuente_descripcion' : 'no_disponible',
    };
  } catch {
    return { platform: 'tiktok', title: null, author: null, thumbnail: null, rawText: null, textSource: 'no_disponible' };
  }
}
