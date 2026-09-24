#!/usr/bin/env node
// Saca los enlaces de YouTube/TikTok/Instagram/Facebook de un chat de
// WhatsApp exportado como .txt, los limpia y los deja en un archivo con uno
// por línea, listo para el resto de la Fase 4 (transcripción + importación).
//
// Uso:
//   node scripts/recetario/extraer-links.mjs "ruta/al/chat exportado.txt"
//
// No depende de Next.js ni de Mongo — corre standalone con Node.

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const HOST_PLATFORM = [
  { platform: 'youtube', hosts: ['youtube.com', 'www.youtube.com', 'm.youtube.com', 'youtu.be'] },
  { platform: 'tiktok', hosts: ['tiktok.com', 'www.tiktok.com', 'vm.tiktok.com', 'vt.tiktok.com'] },
  { platform: 'instagram', hosts: ['instagram.com', 'www.instagram.com'] },
  { platform: 'facebook', hosts: ['facebook.com', 'www.facebook.com', 'm.facebook.com', 'fb.watch'] },
];

const TRACKING_PARAMS = ['si', 'igshid', 'igsh', 'utm_source', 'utm_medium', 'utm_campaign', 'feature', 'fbclid'];

function detectPlatform(urlString) {
  try {
    const hostname = new URL(urlString).hostname.toLowerCase();
    return HOST_PLATFORM.find((entry) => entry.hosts.includes(hostname))?.platform || null;
  } catch {
    return null;
  }
}

function cleanUrl(urlString) {
  try {
    const url = new URL(urlString);
    TRACKING_PARAMS.forEach((param) => url.searchParams.delete(param));
    let clean = url.toString();
    if ([...url.searchParams].length === 0) clean = clean.replace(/\?$/, '');
    return clean;
  } catch {
    return urlString;
  }
}

// youtube.com/watch?v=X y youtu.be/X pueden apuntar al mismo video — se
// normalizan a una sola forma para no transcribirlo dos veces.
function getYouTubeId(urlString) {
  try {
    const url = new URL(urlString);
    if (url.hostname.includes('youtu.be')) return url.pathname.slice(1).split('/')[0] || null;
    if (url.pathname.startsWith('/shorts/')) return url.pathname.split('/')[2] || null;
    return url.searchParams.get('v');
  } catch {
    return null;
  }
}

const inputPath = process.argv[2];
if (!inputPath) {
  console.error('Uso: node scripts/recetario/extraer-links.mjs "ruta/al/chat exportado.txt"');
  process.exit(1);
}

const raw = readFileSync(resolve(inputPath), 'utf-8');

// Cualquier URL en el texto, sin importar el formato de línea de WhatsApp
// (Android/iPhone difieren) — se busca en todo el archivo de una vez.
const urlMatches = raw.match(/https?:\/\/[^\s)>\]"']+/g) || [];

const seen = new Set();
const seenYouTubeIds = new Set();
const byPlatform = { youtube: [], tiktok: [], instagram: [], facebook: [] };
const unsupported = new Set();

for (const match of urlMatches) {
  // Quita puntuación de cierre que suele quedar pegada al final en el chat.
  const url = cleanUrl(match.replace(/[.,;:!?)\]}'"]+$/, ''));
  const platform = detectPlatform(url);

  if (!platform) {
    unsupported.add(url);
    continue;
  }

  if (platform === 'youtube') {
    const videoId = getYouTubeId(url);
    if (videoId) {
      if (seenYouTubeIds.has(videoId)) continue;
      seenYouTubeIds.add(videoId);
    } else if (seen.has(url)) {
      continue;
    }
    seen.add(url);
    byPlatform.youtube.push(url);
    continue;
  }

  if (seen.has(url)) continue;
  seen.add(url);
  byPlatform[platform].push(url);
}

const allLinks = [...byPlatform.youtube, ...byPlatform.tiktok, ...byPlatform.instagram, ...byPlatform.facebook];

// Siempre en la misma carpeta que este script, sin importar desde dónde se
// haya invocado `node` (evita rutas duplicadas como .../recetario/recetario/).
const outputPath = resolve(import.meta.dirname, 'links.txt');
const nuevosPath = resolve(import.meta.dirname, 'links-nuevos.txt');
const checkpointPath = resolve(import.meta.dirname, 'checkpoint.json');

// Si ya hay una corrida anterior (links.txt de la última exportación), lo que
// no estaba ahí es justo lo nuevo desde la última vez — así no hay que andar
// buscando a mano cuáles enlaces se agregaron al chat después.
const yaConocidos = new Set();
if (existsSync(outputPath)) {
  readFileSync(outputPath, 'utf-8')
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean)
    .forEach((l) => yaConocidos.add(l));
}
const nuevos = allLinks.filter((url) => !yaConocidos.has(url));

writeFileSync(outputPath, allLinks.join('\n') + '\n', 'utf-8');
writeFileSync(nuevosPath, (nuevos.length ? nuevos.join('\n') + '\n' : ''), 'utf-8');
writeFileSync(
  checkpointPath,
  JSON.stringify(
    {
      marcadoEn: new Date().toISOString(),
      nota:
        nuevos.length > 0
          ? `Última extracción: ${allLinks.length} enlaces totales, ${nuevos.length} nuevos desde la vez anterior (ver links-nuevos.txt). Corré transcribir.py normal — se salta solo los que ya tienen salida/, no hace falta hacer nada especial con los nuevos.`
          : `Última extracción: ${allLinks.length} enlaces totales, ninguno nuevo desde la vez anterior.`,
      enlacesTotales: allLinks.length,
      enlacesNuevos: nuevos.length,
    },
    null,
    2
  ),
  'utf-8'
);

console.log(`\n✅ ${allLinks.length} enlaces guardados en ${outputPath}`);
if (yaConocidos.size > 0) {
  console.log(`   (${nuevos.length} son nuevos desde la última vez — quedaron también en links-nuevos.txt)`);
}
console.log('\nPor plataforma:');
for (const [platform, links] of Object.entries(byPlatform)) {
  console.log(`  ${platform}: ${links.length}`);
}
if (unsupported.size > 0) {
  console.log(`\n⚠️  ${unsupported.size} enlace(s) no soportados (no son de YouTube/TikTok/Instagram/Facebook) — se omitieron:`);
  [...unsupported].forEach((url) => console.log(`  - ${url}`));
}
