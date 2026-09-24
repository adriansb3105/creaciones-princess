import { describe, it, expect } from 'vitest';
import { computeRecipeStatus } from '@/lib/recipes/status';

const ingredient = (overrides = {}) => ({ name: 'Harina', origin: 'manual', ...overrides });
const step = (overrides = {}) => ({ text: 'Mezclar todo', origin: 'manual', ...overrides });

describe('computeRecipeStatus', () => {
  it('es "incompleta" si faltan ingredientes', () => {
    expect(computeRecipeStatus({ ingredients: [], steps: [step()], status: 'verificada' })).toBe('incompleta');
  });

  it('es "incompleta" si faltan pasos', () => {
    expect(computeRecipeStatus({ ingredients: [ingredient()], steps: [], status: 'verificada' })).toBe('incompleta');
  });

  it('es "requiere_revision" si algo viene de una extracción automática sin revisar', () => {
    const recipe = {
      ingredients: [ingredient({ origin: 'fuente_descripcion', reviewed: false })],
      steps: [step()],
      status: 'verificada',
    };
    expect(computeRecipeStatus(recipe)).toBe('requiere_revision');
  });

  it('respeta "verificada" si todo es manual y está completa', () => {
    const recipe = { ingredients: [ingredient()], steps: [step()], status: 'verificada' };
    expect(computeRecipeStatus(recipe)).toBe('verificada');
  });

  it('cae a "borrador" si está completa pero sin estado explícito', () => {
    const recipe = { ingredients: [ingredient()], steps: [step()] };
    expect(computeRecipeStatus(recipe)).toBe('borrador');
  });

  it('un item marcado como "reviewed" no fuerza revisión', () => {
    const recipe = {
      ingredients: [ingredient({ origin: 'fuente_descripcion', reviewed: true })],
      steps: [step()],
      status: 'verificada',
    };
    expect(computeRecipeStatus(recipe)).toBe('verificada');
  });
});
