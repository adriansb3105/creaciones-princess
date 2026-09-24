import { describe, it, expect } from 'vitest';
import { structureRecipe } from '@/lib/recipes/structure';

describe('structureRecipe', () => {
  it('etiqueta cada item con el origen dado y reviewed:false', () => {
    const { ingredients, steps } = structureRecipe('2 tazas de harina\n1. Mezclar todo', 'fuente_descripcion');
    expect(ingredients[0]).toMatchObject({ name: 'harina', origin: 'fuente_descripcion', reviewed: false });
    expect(steps[0]).toMatchObject({ text: 'Mezclar todo', origin: 'fuente_descripcion', reviewed: false });
  });

  it('respeta el origen "manual" cuando el texto fue pegado a mano', () => {
    const { ingredients } = structureRecipe('2 tazas de harina', 'manual');
    expect(ingredients[0].origin).toBe('manual');
  });

  it('devuelve todo vacío si no hay texto', () => {
    expect(structureRecipe('')).toEqual({ ingredients: [], steps: [], unclassified: [] });
    expect(structureRecipe(null)).toEqual({ ingredients: [], steps: [], unclassified: [] });
  });
});
