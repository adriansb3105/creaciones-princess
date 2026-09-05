import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"
import { CURRENCY_CODE, CURRENCY_LOCALE } from "@/lib/constants"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatPrice(amount) {
  return new Intl.NumberFormat(CURRENCY_LOCALE, {
    style: 'currency',
    currency: CURRENCY_CODE,
    maximumFractionDigits: 0,
  }).format(amount || 0);
}

export function slugify(text) {
  return text
    .toString()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function getYouTubeId(url) {
  if (!url) return null;
  if (/^[a-zA-Z0-9_-]{11}$/.test(url)) return url;
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([a-zA-Z0-9_-]{11})/);
  return match ? match[1] : null;
}

// Cloudinary puede generar una miniatura JPG de un video subido insertando
// "so_0" (screenshot offset 0s) en la URL y cambiando la extensión.
export function getCloudinaryVideoThumbnail(videoUrl) {
  if (!videoUrl) return null;
  return videoUrl.replace('/video/upload/', '/video/upload/so_0/').replace(/\.[a-zA-Z0-9]+$/, '.jpg');
}
