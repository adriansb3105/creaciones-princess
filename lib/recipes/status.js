// Estados posibles de una receta, del menos al más confiable.
export const RECIPE_STATUSES = ['borrador', 'incompleta', 'requiere_revision', 'verificada'];

export const RECIPE_STATUS_LABELS = {
  borrador: 'Borrador',
  incompleta: 'Incompleta',
  requiere_revision: 'Requiere revisión',
  verificada: 'Verificada',
};

// El estado nunca se "auto-aprueba": si faltan ingredientes/pasos, o si algo
// viene de una extracción automática sin marcar como revisado, no puede
// quedar como "verificada" aunque el campo `status` lo diga.
export function computeRecipeStatus(recipe) {
  const ingredients = Array.isArray(recipe?.ingredients) ? recipe.ingredients : [];
  const steps = Array.isArray(recipe?.steps) ? recipe.steps : [];

  if (ingredients.length === 0 || steps.length === 0) {
    return 'incompleta';
  }

  const needsReview = [...ingredients, ...steps].some(
    (item) => item?.origin && item.origin !== 'manual' && !item.reviewed
  );
  if (needsReview) {
    return 'requiere_revision';
  }

  return recipe?.status === 'verificada' ? 'verificada' : recipe?.status || 'borrador';
}
