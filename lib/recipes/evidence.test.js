import { describe, it, expect } from 'vitest';
import { validateEvidence, filterByEvidence } from '@/lib/recipes/evidence';

describe('validateEvidence', () => {
  it('acepta un fragmento que sí aparece literal en el texto fuente', () => {
    expect(validateEvidence('2 tazas de harina', 'Ingredientes:\n2 tazas de harina\n1 huevo')).toBe(true);
  });

  it('rechaza un fragmento inventado que no está en el texto fuente', () => {
    expect(validateEvidence('3 tazas de azúcar', 'Ingredientes:\n2 tazas de harina\n1 huevo')).toBe(false);
  });

  it('rechaza evidencia o texto fuente vacíos', () => {
    expect(validateEvidence('', 'algo')).toBe(false);
    expect(validateEvidence('algo', '')).toBe(false);
    expect(validateEvidence(null, 'algo')).toBe(false);
  });
});

describe('filterByEvidence', () => {
  it('descarta items cuya evidencia no está en el texto fuente', () => {
    const source = '2 tazas de harina';
    const items = [
      { name: 'harina', evidence: '2 tazas de harina' },
      { name: 'azúcar (inventado)', evidence: '3 tazas de azúcar' },
    ];
    expect(filterByEvidence(items, source)).toEqual([{ name: 'harina', evidence: '2 tazas de harina' }]);
  });
});
