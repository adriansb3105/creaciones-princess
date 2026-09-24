export const DIFFICULTY_OPTIONS = [
  { value: 'facil', label: 'Fácil' },
  { value: 'media', label: 'Media' },
  { value: 'dificil', label: 'Difícil' },
];

export const DIFFICULTY_LABELS = Object.fromEntries(DIFFICULTY_OPTIONS.map((d) => [d.value, d.label]));

// Lista fija (en vez de texto libre) para que el filtro "Método" tenga
// siempre valores consistentes.
export const COOKING_METHOD_OPTIONS = [
  { value: 'horno', label: 'Horno' },
  { value: 'sarten', label: 'Sartén' },
  { value: 'olla', label: 'Olla' },
  { value: 'sin_coccion', label: 'Sin cocción' },
  { value: 'freidora_aire', label: 'Freidora de aire' },
  { value: 'parrilla', label: 'Parrilla' },
  { value: 'microondas', label: 'Microondas' },
];

export const COOKING_METHOD_LABELS = Object.fromEntries(COOKING_METHOD_OPTIONS.map((m) => [m.value, m.label]));

export const INGREDIENT_ORIGIN_LABELS = {
  manual: 'Manual',
  fuente_descripcion: 'Descripción de la fuente',
  fuente_transcripcion: 'Transcripción',
  estimado: 'Estimado',
};
