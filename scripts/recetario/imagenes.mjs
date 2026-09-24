#!/usr/bin/env node
// Rellena el campo `image` de cada receta usando la miniatura del video de
// origen (Facebook/Instagram/YouTube): yt-dlp saca la URL de la miniatura
// (sin descargar audio/video) y Cloudinary la aloja pidiéndole que la
// busque ella misma (upload por URL remota), sin pagar nada.
//
// Uso:
//   ADMIN_EMAIL=... ADMIN_PASSWORD=... node imagenes.mjs

import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import crypto from 'node:crypto';

const execFileAsync = promisify(execFile);

const SITE_URL = process.env.SITE_URL || 'http://localhost:3000';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
  console.error('Faltan las variables de entorno ADMIN_EMAIL / ADMIN_PASSWORD');
  process.exit(1);
}

// Carga las credenciales de Cloudinary desde .env (este script corre fuera de Next).
function loadEnv(filePath) {
  const env = {};
  const content = readFileSync(filePath, 'utf-8');
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    env[key] = value;
  }
  return env;
}

const rootEnv = loadEnv(resolve(import.meta.dirname, '../../.env'));
const CLOUDINARY_CLOUD_NAME = rootEnv.CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_API_KEY = rootEnv.CLOUDINARY_API_KEY;
const CLOUDINARY_API_SECRET = rootEnv.CLOUDINARY_API_SECRET;
const CLOUDINARY_UPLOAD_FOLDER = rootEnv.CLOUDINARY_UPLOAD_FOLDER || 'creaciones-princess';

if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
  console.error('Faltan credenciales de Cloudinary en .env');
  process.exit(1);
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function login() {
  const res = await fetch(`${SITE_URL}/api/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD }),
  });
  if (!res.ok) throw new Error(`Login falló: ${res.status}`);
  const setCookie = res.headers.get('set-cookie');
  if (!setCookie) throw new Error('Login no devolvió cookie de sesión');
  return setCookie.split(';')[0];
}

async function getRecipes(cookie) {
  const res = await fetch(`${SITE_URL}/api/recipes?limit=1000&admin=1`, { headers: { Cookie: cookie } });
  const data = await res.json();
  return data.recipes || [];
}

// Saca solo la URL de la miniatura, sin descargar audio ni video.
async function fetchThumbnailUrl(sourceUrl) {
  const { stdout } = await execFileAsync(
    'python',
    ['-m', 'yt_dlp', '--skip-download', '--dump-json', '--no-warnings', sourceUrl],
    { timeout: 45_000, maxBuffer: 20 * 1024 * 1024 }
  );
  const line = stdout.split('\n').find((l) => l.trim().startsWith('{'));
  if (!line) throw new Error('yt-dlp no devolvió metadata JSON');
  const info = JSON.parse(line);
  if (!info.thumbnail) throw new Error('el video no tiene miniatura');
  return info.thumbnail;
}

// Le pide a Cloudinary que descargue ella misma la miniatura (upload remoto por URL).
async function uploadThumbnailToCloudinary(thumbnailUrl) {
  const timestamp = Math.round(Date.now() / 1000);
  const paramsToSign = `folder=${CLOUDINARY_UPLOAD_FOLDER}&timestamp=${timestamp}${CLOUDINARY_API_SECRET}`;
  const signature = crypto.createHash('sha1').update(paramsToSign).digest('hex');

  const form = new FormData();
  form.append('file', thumbnailUrl);
  form.append('api_key', CLOUDINARY_API_KEY);
  form.append('timestamp', String(timestamp));
  form.append('signature', signature);
  form.append('folder', CLOUDINARY_UPLOAD_FOLDER);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, {
    method: 'POST',
    body: form,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || `Cloudinary HTTP ${res.status}`);
  return data.secure_url;
}

async function setRecipeImage(id, imageUrl, cookie) {
  const res = await fetch(`${SITE_URL}/api/recipes/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Cookie: cookie },
    body: JSON.stringify({ image: imageUrl }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || `HTTP ${res.status}`);
  }
}

async function main() {
  const cookie = await login();
  const recipes = await getRecipes(cookie);
  console.log(`Recetas totales: ${recipes.length}`);

  // Solo las que aún no tienen imagen.
  const pending = recipes.filter((r) => !r.image);
  console.log(`Sin imagen: ${pending.length}`);

  // Agrupamos por URL de origen: varias recetas pueden venir del mismo video
  // (videos partidos en varias recetas, marinados, etc.) — así no pedimos ni
  // subimos la misma miniatura más de una vez.
  const byUrl = new Map();
  for (const r of pending) {
    const url = r.source?.url;
    if (!url) continue;
    if (!byUrl.has(url)) byUrl.set(url, []);
    byUrl.get(url).push(r);
  }
  console.log(`URLs de origen únicas a procesar: ${byUrl.size}\n`);

  const LIMIT = process.env.LIMIT ? Number(process.env.LIMIT) : Infinity;
  const entradas = [...byUrl.entries()].slice(0, LIMIT);

  const resultados = { ok: [], error: [] };
  let i = 0;
  for (const [sourceUrl, recetasDeEstaUrl] of entradas) {
    i++;
    const etiqueta = recetasDeEstaUrl.map((r) => r.title).join(' / ');
    process.stdout.write(`[${i}/${byUrl.size}] ${sourceUrl} (${recetasDeEstaUrl.length} receta/s: ${etiqueta})... `);
    try {
      const thumbnailUrl = await fetchThumbnailUrl(sourceUrl);
      const cloudinaryUrl = await uploadThumbnailToCloudinary(thumbnailUrl);
      for (const receta of recetasDeEstaUrl) {
        await setRecipeImage(receta.id, cloudinaryUrl, cookie);
      }
      console.log('OK');
      resultados.ok.push({ url: sourceUrl, recetas: recetasDeEstaUrl.map((r) => r.title), image: cloudinaryUrl });
    } catch (err) {
      console.log(`ERROR: ${err.message}`);
      resultados.error.push({ url: sourceUrl, recetas: recetasDeEstaUrl.map((r) => r.title), error: err.message });
    }
    // Pausa breve entre videos para no golpear de más a Facebook/Instagram/YouTube.
    await sleep(1500);
  }

  writeFileSync(resolve(import.meta.dirname, 'reporte-imagenes.json'), JSON.stringify(resultados, null, 2));
  console.log(`\nListo. OK: ${resultados.ok.length}  Error: ${resultados.error.length}`);
  console.log('Detalle en scripts/recetario/reporte-imagenes.json');
}

main().catch((err) => {
  console.error('Error fatal:', err);
  process.exit(1);
});
