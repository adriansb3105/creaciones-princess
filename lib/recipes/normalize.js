// Normaliza el nombre de un ingrediente para poder agruparlo/buscarlo
// (minúsculas, sin tildes, sin espacios de más) SIN perder el texto original
// que el usuario escribió — ese se guarda aparte en `originalText`.
export function normalizeIngredientName(name) {
  if (!name) return '';
  return name
    .toString()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ');
}

// Dos ingredientes se consideran "el mismo" para la lista de compras solo si
// coincide el nombre normalizado Y la unidad — nunca se suman cantidades con
// unidades distintas (ej. "2 tazas" + "100 g" no se combinan).
export function sameIngredient(a, b) {
  const unitA = (a.unit || '').toLowerCase().trim();
  const unitB = (b.unit || '').toLowerCase().trim();
  return normalizeIngredientName(a.name) === normalizeIngredientName(b.name) && unitA === unitB;
}

// Convierte una cantidad escrita a mano ("2", "1/2", "1 1/2") a número.
// Devuelve null si no es un número reconocible (ej. "al gusto") — eso NUNCA
// se suma, solo se combinan cantidades que de verdad se pueden sumar.
export function parseQuantity(value) {
  if (value === null || value === undefined || value === '') return null;
  const text = value.toString().trim();

  // "1 1/2" -> entero + fracción
  const mixed = text.match(/^(\d+)\s+(\d+)\/(\d+)$/);
  if (mixed) {
    const [, whole, num, den] = mixed;
    return Number(den) === 0 ? null : Number(whole) + Number(num) / Number(den);
  }

  // "1/2"
  const fraction = text.match(/^(\d+)\/(\d+)$/);
  if (fraction) {
    const [, num, den] = fraction;
    return Number(den) === 0 ? null : Number(num) / Number(den);
  }

  const num = Number(text.replace(',', '.'));
  return Number.isFinite(num) ? num : null;
}
