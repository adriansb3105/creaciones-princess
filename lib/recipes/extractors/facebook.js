// Probado en vivo (sep-2026): el oEmbed de Facebook (oembed_post) responde
// sin token, pero NUNCA trae el texto del post — solo devuelve un `<div>`
// placeholder que Facebook rellena con JavaScript en el navegador. No hay
// forma gratuita y oficial de traer el texto de un post de Facebook por API,
// así que no vale la pena ni llamarla: siempre queda "no disponible" y el
// texto se pega a mano.
export async function getFacebookMetadata() {
  return { platform: 'facebook', title: null, author: null, thumbnail: null, rawText: null, textSource: 'no_disponible' };
}
