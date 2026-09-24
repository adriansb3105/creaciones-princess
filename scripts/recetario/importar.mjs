#!/usr/bin/env node
// Toma un lote de recetas ya estructuradas a mano (leyendo cada transcripción
// de salida/) y las inserta en el sitio real a través de su propia API — el
// mismo camino que usa /admin/recetario/importar, así que pasan por las
// mismas reglas (nunca se salta la validación de evidencia).
//
// Antes de insertar CUALQUIER receta, vuelve a comprobar que cada evidencia
// de cada ingrediente/paso sea un fragmento literal de su `sourceText` — si
// una no lo es, esa receta completa se salta y se reporta como error, nunca
// se inserta a medias.
//
// Uso:
//   SITE_URL=http://localhost:3000 ADMIN_EMAIL=... ADMIN_PASSWORD=... \
//     node importar.mjs lote-1.json

import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

// Reutiliza el mismo validador que usa el sitio (mismo archivo, sin copiarlo).
import { validateEvidence } from '../../lib/recipes/evidence.js';

const SITE_URL = process.env.SITE_URL || 'http://localhost:3000';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

const filePath = process.argv[2];
if (!filePath) {
  console.error('Uso: node importar.mjs lote.json');
  process.exit(1);
}
if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
  console.error('Faltan las variables de entorno ADMIN_EMAIL / ADMIN_PASSWORD');
  process.exit(1);
}

const recetas = JSON.parse(readFileSync(resolve(filePath), 'utf-8'));

function validarReceta(receta) {
  const sourceText = receta.source?.rawText || '';
  const problemas = [];

  for (const ing of receta.ingredients || []) {
    if (ing.origin !== 'manual' && !validateEvidence(ing.evidence, sourceText)) {
      problemas.push(`ingrediente "${ing.name}": evidencia no encontrada en el texto fuente`);
    }
  }
  for (const step of receta.steps || []) {
    if (step.origin !== 'manual' && !validateEvidence(step.evidence, sourceText)) {
      problemas.push(`paso "${step.text.slice(0, 40)}...": evidencia no encontrada en el texto fuente`);
    }
  }
  return problemas;
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

async function getCategoryMap(cookie) {
  const res = await fetch(`${SITE_URL}/api/recipe-categories`, { headers: { Cookie: cookie } });
  const data = await res.json();
  return Object.fromEntries((data.categories || []).map((c) => [c.slug, c.id]));
}

// El dueño del sitio pidió aprobar automáticamente lo importado por lote (en
// vez de dejarlas todas en "Requiere revisión") y corregir a mano después
// desde /admin/recetario lo que note mal. Por eso cada ingrediente/paso se
// marca reviewed:true acá — pero esto NO evita que una receta sin
// ingredientes o sin pasos quede "Incompleta": eso lo sigue decidiendo
// computeRecipeStatus en el servidor, no se puede forzar.
function marcarComoRevisado(receta) {
  return {
    ...receta,
    ingredients: (receta.ingredients || []).map((i) => ({ ...i, reviewed: true })),
    steps: (receta.steps || []).map((s) => ({ ...s, reviewed: true })),
  };
}

async function crearReceta(receta, categoryId, cookie) {
  const revisada = marcarComoRevisado(receta);
  const payload = {
    title: revisada.title,
    description: revisada.description || '',
    categoryId,
    image: revisada.image || '',
    servings: revisada.servings || null,
    prepMinutes: revisada.prepMinutes || null,
    cookMinutes: revisada.cookMinutes || null,
    difficulty: revisada.difficulty || null,
    cookingMethods: revisada.cookingMethods || [],
    notes: revisada.notes || '',
    published: false,
    source: revisada.source,
    ingredients: revisada.ingredients,
    steps: revisada.steps,
  };

  const res = await fetch(`${SITE_URL}/api/recipes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Cookie: cookie },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);

  // El POST siempre crea en "borrador" aunque todo esté reviewed:true (así
  // funciona para el resto del sitio). Acá, un segundo paso pide
  // explícitamente pasar a "verificada" — computeRecipeStatus solo lo
  // acepta si de verdad hay ingredientes, pasos, y nada quedó sin revisar.
  const putRes = await fetch(`${SITE_URL}/api/recipes/${data.recipe.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Cookie: cookie },
    body: JSON.stringify({ status: 'verificada' }),
  });
  if (!putRes.ok) {
    console.warn(`   ⚠️  no se pudo marcar "verificada" (queda como se creó): HTTP ${putRes.status}`);
    return data.recipe;
  }

  const finalRes = await fetch(`${SITE_URL}/api/recipes/${data.recipe.id}`, { headers: { Cookie: cookie } });
  const finalData = await finalRes.json();
  return finalData.recipe || data.recipe;
}

let cookie;
try {
  cookie = await login();
} catch (err) {
  console.error(`No se pudo iniciar sesión en ${SITE_URL}: ${err.message}`);
  console.error('¿Está corriendo "yarn dev"? ¿SITE_URL/ADMIN_EMAIL/ADMIN_PASSWORD son correctos?');
  process.exit(1);
}
const categoryMap = await getCategoryMap(cookie);
console.log(`Categorías disponibles: ${Object.keys(categoryMap).join(', ')}\n`);

const resultados = { insertadas: [], saltadas: [] };

for (const receta of recetas) {
  const problemas = validarReceta(receta);
  if (problemas.length > 0) {
    console.log(`❌ "${receta.title}" — se salta:`);
    problemas.forEach((p) => console.log(`   - ${p}`));
    resultados.saltadas.push({ title: receta.title, problemas });
    continue;
  }

  const categoryId = categoryMap[receta.categorySlug];
  if (!categoryId) {
    console.log(`❌ "${receta.title}" — categoría "${receta.categorySlug}" no existe`);
    resultados.saltadas.push({ title: receta.title, problemas: [`categoría inválida: ${receta.categorySlug}`] });
    continue;
  }

  try {
    const creada = await crearReceta(receta, categoryId, cookie);
    console.log(`✅ "${receta.title}" -> ${creada.status} (/admin/recetario/${creada.id})`);
    resultados.insertadas.push({ title: receta.title, id: creada.id, status: creada.status });
  } catch (err) {
    console.log(`❌ "${receta.title}" — error al insertar: ${err.message}`);
    resultados.saltadas.push({ title: receta.title, problemas: [err.message] });
  }
}

console.log(`\n\nListo. Insertadas: ${resultados.insertadas.length}  Saltadas: ${resultados.saltadas.length}`);
