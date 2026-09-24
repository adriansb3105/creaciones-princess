import { describe, it, expect } from 'vitest';
import { normalizeIngredientName, sameIngredient, parseQuantity } from '@/lib/recipes/normalize';

describe('normalizeIngredientName', () => {
  it('pasa a minúsculas, quita tildes y espacios de más', () => {
    expect(normalizeIngredientName('Harina')).toBe('harina');
    expect(normalizeIngredientName('  Azúcar   Morena  ')).toBe('azucar morena');
    expect(normalizeIngredientName('Limón')).toBe('limon');
  });

  it('devuelve string vacío para valores vacíos', () => {
    expect(normalizeIngredientName('')).toBe('');
    expect(normalizeIngredientName(null)).toBe('');
    expect(normalizeIngredientName(undefined)).toBe('');
  });
});

describe('sameIngredient', () => {
  it('considera el mismo ingrediente solo si coincide nombre normalizado Y unidad', () => {
    expect(sameIngredient({ name: 'Harina', unit: 'taza' }, { name: 'harina', unit: 'Taza' })).toBe(true);
  });

  it('NO combina cantidades con unidades distintas aunque el nombre coincida', () => {
    expect(sameIngredient({ name: 'Harina', unit: 'taza' }, { name: 'Harina', unit: 'g' })).toBe(false);
  });

  it('no combina ingredientes distintos', () => {
    expect(sameIngredient({ name: 'Harina', unit: 'taza' }, { name: 'Azúcar', unit: 'taza' })).toBe(false);
  });
});

describe('parseQuantity', () => {
  it('reconoce enteros y decimales', () => {
    expect(parseQuantity('2')).toBe(2);
    expect(parseQuantity('1.5')).toBe(1.5);
    expect(parseQuantity('1,5')).toBe(1.5);
  });

  it('reconoce fracciones simples y mixtas', () => {
    expect(parseQuantity('1/2')).toBe(0.5);
    expect(parseQuantity('1 1/2')).toBe(1.5);
  });

  it('devuelve null para texto no numérico — nunca se inventa un número', () => {
    expect(parseQuantity('al gusto')).toBeNull();
    expect(parseQuantity('')).toBeNull();
    expect(parseQuantity(null)).toBeNull();
    expect(parseQuantity(undefined)).toBeNull();
  });
});
