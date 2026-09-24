// Verifica que una "cita de evidencia" sea de verdad un fragmento literal
// del texto fuente — la red de seguridad final contra cualquier dato que no
// venga textualmente de la fuente original.
export function validateEvidence(evidence, sourceText) {
  if (!evidence || !sourceText) return false;
  return sourceText.includes(evidence);
}

// Filtra una lista de items (ingredientes o pasos) dejando solo los que
// tienen una evidencia real dentro del texto fuente.
export function filterByEvidence(items, sourceText) {
  return items.filter((item) => validateEvidence(item.evidence, sourceText));
}
