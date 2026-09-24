export const RECIPE_PLATFORMS = ['youtube', 'tiktok', 'instagram', 'facebook'];

export const PLATFORM_LABELS = {
  youtube: 'YouTube',
  tiktok: 'TikTok',
  instagram: 'Instagram',
  facebook: 'Facebook',
};

const HOST_MAP = [
  { platform: 'youtube', hosts: ['youtube.com', 'www.youtube.com', 'm.youtube.com', 'youtu.be'] },
  { platform: 'tiktok', hosts: ['tiktok.com', 'www.tiktok.com', 'vm.tiktok.com', 'vt.tiktok.com'] },
  { platform: 'instagram', hosts: ['instagram.com', 'www.instagram.com'] },
  { platform: 'facebook', hosts: ['facebook.com', 'www.facebook.com', 'm.facebook.com', 'fb.watch'] },
];

export function isValidUrl(url) {
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

// Devuelve 'youtube' | 'tiktok' | 'instagram' | 'facebook' | null (sin adivinar).
export function detectPlatform(url) {
  if (!isValidUrl(url)) return null;

  const hostname = new URL(url).hostname.toLowerCase();
  const match = HOST_MAP.find((entry) => entry.hosts.includes(hostname));
  return match ? match.platform : null;
}
