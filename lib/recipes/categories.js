import { v4 as uuidv4 } from 'uuid';
import { slugify } from '@/lib/utils';

// Categorías fijas del recetario. Se pueden agregar más desde Mongo sin tocar
// componentes — todo lo que lee categorías las trae de /api/recipe-categories.
const STARTER_RECIPE_CATEGORIES = ['Desayunos', 'Almuerzos', 'Cenas', 'Snacks'];

export async function ensureRecipeCategoriesSeeded(db) {
  const collection = db.collection('recipe_categories');
  const count = await collection.countDocuments();
  if (count > 0) return;

  const docs = STARTER_RECIPE_CATEGORIES.map((name, index) => ({
    id: uuidv4(),
    slug: slugify(name),
    name,
    order: index,
  }));

  await collection.insertMany(docs);
  return docs;
}
