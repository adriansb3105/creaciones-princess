#!/usr/bin/env node
// Reemplaza el campo `image` de cada receta por una foto de stock de Pexels
// (gratis) que representa el plato, en vez de la miniatura del video
// original. Busca por una consulta en inglés curada a mano por receta
// (pexels-queries.json), sube la mejor foto a Cloudinary (aloja la URL
// remota, sin descargar nada localmente) y actualiza la receta.
//
// Uso:
//   PEXELS_API_KEY=... ADMIN_EMAIL=... ADMIN_PASSWORD=... node imagenes-pexels.mjs

import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import crypto from 'node:crypto';

const SITE_URL = process.env.SITE_URL || 'http://localhost:3000';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const PEXELS_API_KEY = process.env.PEXELS_API_KEY;

if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
  console.error('Faltan las variables de entorno ADMIN_EMAIL / ADMIN_PASSWORD');
  process.exit(1);
}
if (!PEXELS_API_KEY) {
  console.error('Falta la variable de entorno PEXELS_API_KEY');
  process.exit(1);
}

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

const queries = JSON.parse(readFileSync(resolve(import.meta.dirname, 'pexels-queries.json'), 'utf-8'));

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

async function searchPexels(query) {
  const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=1&orientation=landscape`;
  const res = await fetch(url, { headers: { Authorization: PEXELS_API_KEY } });
  if (!res.ok) throw new Error(`Pexels HTTP ${res.status}`);
  const data = await res.json();
  const photo = data.photos?.[0];
  if (!photo) throw new Error('sin resultados en Pexels');
  return photo.src.large;
}

async function uploadToCloudinary(imageUrl) {
  const timestamp = Math.round(Date.now() / 1000);
  const paramsToSign = `folder=${CLOUDINARY_UPLOAD_FOLDER}&timestamp=${timestamp}${CLOUDINARY_API_SECRET}`;
  const signature = crypto.createHash('sha1').update(paramsToSign).digest('hex');

  const form = new FormData();
  form.append('file', imageUrl);
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
  console.log(`Recetas totales: ${recipes.length}\n`);

  const resultados = { ok: [], error: [] };
  let i = 0;
  for (const receta of recipes) {
    i++;
    const query = queries[receta.id];
    process.stdout.write(`[${i}/${recipes.length}] "${receta.title}" -> "${query}"... `);
    if (!query) {
      console.log('SIN QUERY, salto');
      resultados.error.push({ title: receta.title, error: 'sin query definida' });
      continue;
    }
    try {
      const pexelsUrl = await searchPexels(query);
      const cloudinaryUrl = await uploadToCloudinary(pexelsUrl);
      await setRecipeImage(receta.id, cloudinaryUrl, cookie);
      console.log('OK');
      resultados.ok.push({ title: receta.title, query, image: cloudinaryUrl });
    } catch (err) {
      console.log(`ERROR: ${err.message}`);
      resultados.error.push({ title: receta.title, query, error: err.message });
    }
    await sleep(350);
  }

  writeFileSync(resolve(import.meta.dirname, 'reporte-imagenes-pexels.json'), JSON.stringify(resultados, null, 2));
  console.log(`\nListo. OK: ${resultados.ok.length}  Error: ${resultados.error.length}`);
  console.log('Detalle en scripts/recetario/reporte-imagenes-pexels.json');
}

main().catch((err) => {
  console.error('Error fatal:', err);
  process.exit(1);
});
