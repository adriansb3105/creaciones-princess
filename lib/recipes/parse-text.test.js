import { describe, it, expect } from 'vitest';
import { parseRecipeText } from '@/lib/recipes/parse-text';

describe('parseRecipeText', () => {
  it('reconoce líneas de ingredientes con cantidad, unidad y nombre', () => {
    const text = '2 tazas de harina\n1/2 cdta de sal\n3 huevos';
    const { ingredients } = parseRecipeText(text);

    expect(ingredients).toEqual([
      { name: 'harina', quantity: '2', unit: 'tazas', evidence: '2 tazas de harina' },
      { name: 'sal', quantity: '1/2', unit: 'cdta', evidence: '1/2 cdta de sal' },
      { name: 'huevos', quantity: '3', unit: '', evidence: '3 huevos' },
    ]);
  });

  it('reconoce cantidades mixtas (entero + fracción) y decimales con coma', () => {
    const text = '1 1/2 tazas de leche\n1,5 kg de pollo';
    const { ingredients } = parseRecipeText(text);
    expect(ingredients[0]).toMatchObject({ quantity: '1 1/2', unit: 'tazas', name: 'leche' });
    expect(ingredients[1]).toMatchObject({ quantity: '1,5', unit: 'kg', name: 'pollo' });
  });

  it('ignora viñetas al inicio de la línea', () => {
    const text = '- 2 tazas de harina\n• 1 huevo';
    const { ingredients } = parseRecipeText(text);
    expect(ingredients).toHaveLength(2);
    expect(ingredients[0].name).toBe('harina');
  });

  it('reconoce pasos numerados en distintos formatos', () => {
    const text = '1. Batir los huevos\n2) Agregar la harina\nPaso 3: Hornear 20 minutos';
    const { steps } = parseRecipeText(text);
    expect(steps).toEqual([
      { text: 'Batir los huevos', evidence: '1. Batir los huevos' },
      { text: 'Agregar la harina', evidence: '2) Agregar la harina' },
      { text: 'Hornear 20 minutos', evidence: 'Paso 3: Hornear 20 minutos' },
    ]);
  });

  it('manda a "unclassified" lo que no es claramente ingrediente ni paso', () => {
    const text = 'Receta de mi abuela\nQuedan buenísimos\nSígueme para más recetas';
    const { ingredients, steps, unclassified } = parseRecipeText(text);
    expect(ingredients).toHaveLength(0);
    expect(steps).toHaveLength(0);
    expect(unclassified).toEqual(['Receta de mi abuela', 'Quedan buenísimos', 'Sígueme para más recetas']);
  });

  it('respeta encabezados de sección explícitos ("Ingredientes:", "Preparación:")', () => {
    const text = ['Ingredientes:', 'Harina', 'Sal al gusto', '', 'Preparación:', 'Mezclar todo', 'Hornear'].join('\n');
    const { ingredients, steps, unclassified } = parseRecipeText(text);

    expect(ingredients.map((i) => i.name)).toEqual(['Harina', 'Sal al gusto']);
    expect(ingredients.every((i) => i.quantity === null)).toBe(true);
    expect(steps.map((s) => s.text)).toEqual(['Mezclar todo', 'Hornear']);
    expect(unclassified).toHaveLength(0);
  });

  it('no agrega relleno de redes sociales como si fuera un paso, aunque venga tras "Preparación:"', () => {
    const text = ['Preparación:', '1. Mezclar todo', '2. Hornear 20 minutos', 'Sígueme para más recetas!', '#reposteria #recetafacil'].join(
      '\n'
    );
    const { steps, unclassified } = parseRecipeText(text);
    expect(steps.map((s) => s.text)).toEqual(['Mezclar todo', 'Hornear 20 minutos']);
    expect(unclassified).toEqual(['Sígueme para más recetas!', '#reposteria #recetafacil']);
  });

  it('una línea con cantidad dentro de la sección de pasos NO se clasifica como ingrediente', () => {
    const text = ['Preparación:', '1. Agrega 2 tazas de harina y mezcla'].join('\n');
    const { ingredients, steps } = parseRecipeText(text);
    expect(ingredients).toHaveLength(0);
    expect(steps).toEqual([{ text: 'Agrega 2 tazas de harina y mezcla', evidence: '1. Agrega 2 tazas de harina y mezcla' }]);
  });

  it('cada evidencia es un fragmento literal del texto original', () => {
    const text = '2 tazas de harina\n1. Batir los huevos\nUn comentario cualquiera';
    const { ingredients, steps, unclassified } = parseRecipeText(text);
    [...ingredients.map((i) => i.evidence), ...steps.map((s) => s.evidence), ...unclassified].forEach((evidence) => {
      expect(text.includes(evidence)).toBe(true);
    });
  });

  it('devuelve todo vacío para texto vacío o nulo', () => {
    expect(parseRecipeText('')).toEqual({ ingredients: [], steps: [], unclassified: [] });
    expect(parseRecipeText(null)).toEqual({ ingredients: [], steps: [], unclassified: [] });
  });
});
