// Genera los íconos del sitio (favicon y apple-touch-icon) recortando el
// logo en un rectángulo redondeado ("squircle"), la silueta típica de los
// íconos de apps (Android, iOS, YouTube, etc.) en vez del círculo usado
// antes. No reutiliza ningún color ni elemento de marca de terceros: solo
// la silueta genérica, aplicada sobre el logo propio de Creaciones Princess.
import sharp from 'sharp';
import { resolve } from 'node:path';

const ROOT = resolve(import.meta.dirname, '..');
const SRC = resolve(ROOT, 'public/logo.jpeg');

async function makeRoundedIcon(size, cornerRadiusRatio, outPath) {
  const r = Math.round(size * cornerRadiusRatio);
  const mask = Buffer.from(
    `<svg width="${size}" height="${size}"><rect x="0" y="0" width="${size}" height="${size}" rx="${r}" ry="${r}" fill="#fff"/></svg>`
  );

  const squared = await sharp(SRC)
    .resize(size, size, { fit: 'cover' })
    .toBuffer();

  await sharp(squared)
    .composite([{ input: mask, blend: 'dest-in' }])
    .png()
    .toFile(outPath);
}

await makeRoundedIcon(512, 0.22, resolve(ROOT, 'app/icon.png'));
await makeRoundedIcon(180, 0.22, resolve(ROOT, 'app/apple-icon.png'));

console.log('Iconos generados con esquinas redondeadas (forma tipo app icon).');
