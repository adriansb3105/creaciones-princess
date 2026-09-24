import { connectToDatabase } from '@/lib/mongodb';
import { ensureRecipeCategoriesSeeded } from '@/lib/recipes/categories';

export async function GET() {
  try {
    const { db } = await connectToDatabase();
    await ensureRecipeCategoriesSeeded(db);

    const categories = await db.collection('recipe_categories').find({}).sort({ order: 1 }).toArray();
    return Response.json({ categories });
  } catch (error) {
    console.error('GET /api/recipe-categories error:', error);
    return Response.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
