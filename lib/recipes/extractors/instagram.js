// Probado en vivo (sep-2026): el oEmbed de Instagram vía graph.facebook.com
// SIN token devuelve error incluso con posts públicos reales ("OAuthException:
// Media Not Found") — la promesa de acceso "sin token" no se cumplió en la
// prueba. Si ya configuraste META_PAGE_ACCESS_TOKEN (mismo token que usa
// /admin/publicar para Facebook/Instagram), lo reutilizamos aquí; si no,
// devolvemos "no disponible" en vez de fingir que se extrajo algo.
export async function getInstagramMetadata(url) {
  const token = process.env.META_PAGE_ACCESS_TOKEN;
  const empty = { platform: 'instagram', title: null, author: null, thumbnail: null, rawText: null, textSource: 'no_disponible' };

  if (!token) return empty;

  try {
    const endpoint = new URL('https://graph.facebook.com/v21.0/instagram_oembed');
    endpoint.searchParams.set('url', url);
    endpoint.searchParams.set('omitscript', 'true');
    endpoint.searchParams.set('access_token', token);

    const res = await fetch(endpoint.toString());
    if (!res.ok) return empty;

    const data = await res.json();
    const caption = data.title || null;
    return {
      platform: 'instagram',
      title: caption,
      author: data.author_name || null,
      thumbnail: data.thumbnail_url || null,
      rawText: caption,
      textSource: caption ? 'fuente_descripcion' : 'no_disponible',
    };
  } catch {
    return empty;
  }
}
