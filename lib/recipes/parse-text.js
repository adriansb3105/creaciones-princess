// Parser DETERMINISTA (sin IA) de ingredientes y pasos a partir de texto
// libre (descripción de un video, caption, o texto pegado a mano).
//
// Principio rector: mejor clasificar de menos que "inventar". Fuera de una
// sección con encabezado explícito ("Ingredientes:", "Preparación:"), una
// línea solo se toma como ingrediente si empieza con una cantidad reconocible,
// y solo se toma como paso si está numerada. Todo lo demás cae en
// `unclassified` para que el admin lo revise a mano — nunca se le asigna una
// categoría por adivinanza.

const BULLET_RE = /^[-*•·▪◦‣⁃]\s*/;
const QUANTITY_RE = /^(\d+\s+\d+\/\d+|\d+\/\d+|\d+[.,]\d+|\d+)/;

const UNIT_WORDS = [
  'tazas?',
  'cucharadas?',
  'cdas?',
  'cucharaditas?',
  'cdtas?',
  'gramos?',
  'gr',
  'g',
  'kilos?',
  'kg',
  'mililitros?',
  'ml',
  'litros?',
  'l',
  'unidades?',
  'und',
  'pizcas?',
  'dientes?',
  'rebanadas?',
  'rodajas?',
  'hojas?',
  'latas?',
  'sobres?',
  'pu[nñ]ados?',
  'ramas?',
  'tallos?',
];
const UNIT_RE = new RegExp(`^\\s*(${UNIT_WORDS.join('|')})\\b`, 'i');

const STEP_RE = /^(?:paso\s*)?(\d+)\s*[.):]\s+(.+)$/i;

// Relleno típico de redes sociales (hashtags, "sígueme", links) que a veces
// queda pegado justo debajo de "Preparación:" sin otro encabezado que lo
// separe. Si aparece, se corta la confianza en la sección — mejor mandarlo a
// "sin clasificar" que agregarlo como si fuera un paso de la receta.
const NOISE_RE = /^#|https?:\/\/|s[ií]guenos|s[ií]gueme|suscr[ií]bete|dale\s*like|comenta|comparte|link en (mi\s*)?bio/i;

const SECTION_HEADERS = {
  ingredients: /^ingredientes?$/i,
  steps: /^(preparaci[oó]n|pasos|instrucciones|modo de preparaci[oó]n|procedimiento|elaboraci[oó]n)$/i,
};

function detectSectionHeader(line) {
  const clean = line.replace(/[:：]\s*$/, '').trim();
  if (SECTION_HEADERS.ingredients.test(clean)) return 'ingredients';
  if (SECTION_HEADERS.steps.test(clean)) return 'steps';
  return null;
}

// "2 tazas de harina" -> { name: 'harina', quantity: '2', unit: 'tazas' }
// Devuelve null si no hay una cantidad reconocible al inicio (nunca inventa
// una cantidad ni un nombre).
function matchIngredientLine(rawLine) {
  const line = rawLine.replace(BULLET_RE, '').trim();
  const quantityMatch = line.match(QUANTITY_RE);
  if (!quantityMatch) return null;

  const quantity = quantityMatch[0];
  let rest = line.slice(quantity.length).trim();

  let unit = '';
  const unitMatch = rest.match(UNIT_RE);
  if (unitMatch) {
    unit = unitMatch[0].trim();
    rest = rest.slice(unitMatch[0].length).trim();
  }
  rest = rest.replace(/^de\s+/i, '').trim();

  if (!rest) return null;
  return { name: rest, quantity, unit };
}

// "1. Batir los huevos" / "Paso 2) Agregar la harina" -> texto del paso.
function matchStepLine(rawLine) {
  const line = rawLine.replace(BULLET_RE, '').trim();
  const match = line.match(STEP_RE);
  return match ? match[2].trim() : null;
}

export function parseRecipeText(text) {
  const ingredients = [];
  const steps = [];
  const unclassified = [];

  if (!text) return { ingredients, steps, unclassified };

  let section = null;
  const lines = text.split(/\r?\n/);

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) continue;

    const header = detectSectionHeader(line);
    if (header) {
      section = header;
      continue;
    }

    if (NOISE_RE.test(line)) {
      section = null;
      unclassified.push(line);
      continue;
    }

    const stepText = matchStepLine(line);
    if (stepText) {
      steps.push({ text: stepText, evidence: line });
      continue;
    }

    const ingredientMatch = matchIngredientLine(line);
    if (ingredientMatch && section !== 'steps') {
      ingredients.push({ ...ingredientMatch, evidence: line });
      continue;
    }

    // Dentro de una sección con encabezado explícito, confiamos en la
    // estructura que ya puso el autor del texto — no es adivinar, es leer.
    if (section === 'ingredients') {
      ingredients.push({ name: line, quantity: null, unit: '', evidence: line });
      continue;
    }
    if (section === 'steps') {
      steps.push({ text: line, evidence: line });
      continue;
    }

    unclassified.push(line);
  }

  return { ingredients, steps, unclassified };
}
