import { normalizeIngredientName } from '@/lib/recipes/normalize';

// Normaliza un ingrediente/paso que llega del formulario (o de una
// importación) al shape que se guarda en Mongo. Compartido entre POST y PUT
// de /api/recipes para no duplicar la lógica.
export function buildIngredient(input) {
  return {
    name: input.name || '',
    normalizedName: normalizeIngredientName(input.name),
    quantity: input.quantity === '' || input.quantity === undefined ? null : input.quantity,
    unit: input.unit || '',
    originalText: input.originalText || input.name || '',
    optional: Boolean(input.optional),
    origin: input.origin || 'manual',
    evidence: input.evidence || null,
    reviewed: Boolean(input.reviewed),
    flags: Array.isArray(input.flags) ? input.flags : [],
  };
}

export function buildStep(input, index) {
  return {
    order: index + 1,
    text: input.text || '',
    origin: input.origin || 'manual',
    evidence: input.evidence || null,
    reviewed: Boolean(input.reviewed),
    flags: Array.isArray(input.flags) ? input.flags : [],
  };
}
