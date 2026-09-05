// Integración con la Graph API de Meta para publicar automáticamente en la
// Página de Facebook y la cuenta de Instagram (Empresa/Creador) del negocio.
//
// Requiere en el entorno:
//   META_PAGE_ACCESS_TOKEN  - token de acceso de larga duración de la Página
//   META_PAGE_ID            - ID de la Página de Facebook
//   META_IG_BUSINESS_ID     - ID de la cuenta de Instagram Empresa vinculada
//
// Ver README para los pasos de configuración en developers.facebook.com.

const GRAPH_VERSION = 'v21.0';
const GRAPH_BASE = `https://graph.facebook.com/${GRAPH_VERSION}`;

function getMetaConfig() {
  const pageAccessToken = process.env.META_PAGE_ACCESS_TOKEN;
  const pageId = process.env.META_PAGE_ID;
  const igBusinessId = process.env.META_IG_BUSINESS_ID;

  if (!pageAccessToken || !pageId) {
    throw new Error('Falta configurar META_PAGE_ACCESS_TOKEN / META_PAGE_ID en las variables de entorno');
  }

  return { pageAccessToken, pageId, igBusinessId };
}

async function graphGet(path, params = {}) {
  const url = new URL(`${GRAPH_BASE}${path}`);
  Object.entries(params).forEach(([key, value]) => url.searchParams.set(key, value));

  const res = await fetch(url.toString());
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.error?.message || 'Error de Graph API');
  }
  return data;
}

async function graphPost(path, params = {}) {
  const url = new URL(`${GRAPH_BASE}${path}`);
  const body = new URLSearchParams(params);

  const res = await fetch(url.toString(), { method: 'POST', body });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.error?.message || 'Error de Graph API');
  }
  return data;
}

// --- Facebook Page ---

export async function publishToFacebook({ images = [], videoUrl, caption = '' }) {
  const { pageAccessToken, pageId } = getMetaConfig();

  if (videoUrl) {
    const data = await graphPost(`/${pageId}/videos`, {
      file_url: videoUrl,
      description: caption,
      access_token: pageAccessToken,
    });
    return { postId: data.id, permalink: `https://www.facebook.com/${data.id}` };
  }

  if (images.length === 1) {
    const data = await graphPost(`/${pageId}/photos`, {
      url: images[0],
      caption,
      access_token: pageAccessToken,
    });
    const postId = data.post_id || data.id;
    return { postId, permalink: `https://www.facebook.com/${postId}` };
  }

  if (images.length > 1) {
    const photoIds = [];
    for (const image of images) {
      const data = await graphPost(`/${pageId}/photos`, {
        url: image,
        published: 'false',
        access_token: pageAccessToken,
      });
      photoIds.push(data.id);
    }

    const url = new URL(`${GRAPH_BASE}/${pageId}/feed`);
    const body = new URLSearchParams({ message: caption, access_token: pageAccessToken });
    photoIds.forEach((id, index) => body.append(`attached_media[${index}]`, JSON.stringify({ media_fbid: id })));

    const res = await fetch(url.toString(), { method: 'POST', body });
    const data = await res.json();
    if (!res.ok) throw new Error(data?.error?.message || 'Error de Graph API');

    return { postId: data.id, permalink: `https://www.facebook.com/${data.id}` };
  }

  throw new Error('No hay nada para publicar en Facebook');
}

// --- Instagram (cuenta Empresa/Creador) ---

async function waitForInstagramContainer(containerId, token, { timeoutMs = 45000, intervalMs = 3000 } = {}) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    const status = await graphGet(`/${containerId}`, { fields: 'status_code', access_token: token });
    if (status.status_code === 'FINISHED') return;
    if (status.status_code === 'ERROR') throw new Error('Instagram no pudo procesar el video');
    await new Promise((resolve) => setTimeout(resolve, intervalMs));
  }
  const timeoutError = new Error('TIMEOUT_PROCESSING');
  timeoutError.containerId = containerId;
  throw timeoutError;
}

async function getInstagramPermalink(mediaId, token) {
  try {
    const data = await graphGet(`/${mediaId}`, { fields: 'permalink', access_token: token });
    return data.permalink || null;
  } catch {
    return null;
  }
}

export async function publishToInstagram({ images = [], videoUrl, caption = '' }) {
  const { pageAccessToken, igBusinessId } = getMetaConfig();
  if (!igBusinessId) {
    throw new Error('Falta configurar META_IG_BUSINESS_ID en las variables de entorno');
  }

  if (videoUrl) {
    const container = await graphPost(`/${igBusinessId}/media`, {
      video_url: videoUrl,
      caption,
      media_type: 'REELS',
      access_token: pageAccessToken,
    });
    await waitForInstagramContainer(container.id, pageAccessToken);
    return finishInstagramPublish(container.id, igBusinessId, pageAccessToken);
  }

  if (images.length === 1) {
    const container = await graphPost(`/${igBusinessId}/media`, {
      image_url: images[0],
      caption,
      access_token: pageAccessToken,
    });
    return finishInstagramPublish(container.id, igBusinessId, pageAccessToken);
  }

  if (images.length > 1) {
    const childIds = [];
    for (const image of images) {
      const child = await graphPost(`/${igBusinessId}/media`, {
        image_url: image,
        is_carousel_item: 'true',
        access_token: pageAccessToken,
      });
      childIds.push(child.id);
    }

    const container = await graphPost(`/${igBusinessId}/media`, {
      media_type: 'CAROUSEL',
      children: childIds.join(','),
      caption,
      access_token: pageAccessToken,
    });
    return finishInstagramPublish(container.id, igBusinessId, pageAccessToken);
  }

  throw new Error('No hay nada para publicar en Instagram');
}

async function finishInstagramPublish(creationId, igBusinessId, pageAccessToken) {
  const publish = await graphPost(`/${igBusinessId}/media_publish`, {
    creation_id: creationId,
    access_token: pageAccessToken,
  });
  const permalink = await getInstagramPermalink(publish.id, pageAccessToken);
  return { postId: publish.id, permalink };
}

// Reintento cuando el video de Instagram no terminó de procesar a tiempo
// (ver TIMEOUT_PROCESSING en app/api/social/publish/route.js).
export async function retryInstagramPublish(containerId) {
  const { pageAccessToken, igBusinessId } = getMetaConfig();
  await waitForInstagramContainer(containerId, pageAccessToken);
  return finishInstagramPublish(containerId, igBusinessId, pageAccessToken);
}
