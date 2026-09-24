import { parseRecipeText } from '@/lib/recipes/parse-text';
import { filterByEvidence } from '@/lib/recipes/evidence';

// Punto único para "convertir texto en receta estructurada". Hoy usa el
// parser determinista (gratis, sin IA); si en el futuro se agrega una vía
// con IA, se enchufa aquí sin tocar el resto del sistema — la firma
// (texto + origen -> {ingredients, steps, unclassified}) no cambia.
export function structureRecipe(text, origin = 'fuente_descripcion') {
  if (!text || !text.trim()) {
    return { ingredients: [], steps: [], unclassified: [] };
  }

  const parsed = parseRecipeText(text);

  // Filtro de seguridad: cualquier item cuya "evidencia" no sea un fragmento
  // literal del texto fuente se descarta (no debería pasar nunca con el
  // parser determinista, pero es la red de seguridad si algo cambia).
  const ingredients = filterByEvidence(parsed.ingredients, text).map((item) => ({
    ...item,
    origin,
    reviewed: false,
  }));
  const steps = filterByEvidence(parsed.steps, text).map((item) => ({
    ...item,
    origin,
    reviewed: false,
  }));

  return { ingredients, steps, unclassified: parsed.unclassified };
}
