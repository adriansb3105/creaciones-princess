import { v4 as uuidv4 } from 'uuid';
import { connectToDatabase } from '@/lib/mongodb';
import { requireAdmin } from '@/lib/auth';
import { slugify } from '@/lib/utils';
import { normalizeIngredientName } from '@/lib/recipes/normalize';
import { computeRecipeStatus } from '@/lib/recipes/status';
import { buildIngredient, buildStep } from '@/lib/recipes/build';

export async function GET(request) {
  try {
    const { db } = await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const categorySlug = searchParams.get('categoria');
    const search = searchParams.get('busqueda');
    const difficulty = searchParams.get('dificultad');
    const cookingMethod = searchParams.get('metodo');
    const platform = searchParams.get('plataforma');

    const session = await requireAdmin(request);

    const query = {};
    if (!session) {
      query.published = true;
    }

    if (categorySlug) {
      const category = await db.collection('recipe_categories').findOne({ slug: categorySlug });
      if (!category) return Response.json({ recipes: [] });
      query.categoryId = category.id;
    }

    if (difficulty) query.difficulty = difficulty;
    if (cookingMethod) query.cookingMethods = cookingMethod;
    if (platform) query['source.platform'] = platform;

    if (search) {
      const normalizedSearch = normalizeIngredientName(search);
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { 'ingredients.normalizedName': { $regex: normalizedSearch, $options: 'i' } },
      ];
    }

    const recipes = await db.collection('recipes').find(query).sort({ createdAt: -1 }).toArray();
    const withComputedStatus = recipes.map((r) => ({ ...r, status: computeRecipeStatus(r) }));

    return Response.json({ recipes: withComputedStatus });
  } catch (error) {
    console.error('GET /api/recipes error:', error);
    return Response.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const session = await requireAdmin(request);
    if (!session) {
      return Response.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { db } = await connectToDatabase();
    const body = await request.json();
    const {
      title,
      description,
      categoryId,
      image,
      servings,
      prepMinutes,
      cookMinutes,
      difficulty,
      cookingMethods,
      tags,
      notes,
      published,
      source,
      ingredients,
      steps,
    } = body;

    if (!title || !categoryId) {
      return Response.json({ error: 'Título y categoría son requeridos' }, { status: 400 });
    }

    const now = new Date();
    const prep = Number(prepMinutes) || 0;
    const cook = Number(cookMinutes) || 0;

    const recipe = {
      id: uuidv4(),
      slug: slugify(title),
      title,
      description: description || '',
      categoryId,
      image: image || '',
      servings: servings ? Number(servings) : null,
      prepMinutes: prep || null,
      cookMinutes: cook || null,
      totalMinutes: prep || cook ? prep + cook : null,
      difficulty: difficulty || null,
      cookingMethods: Array.isArray(cookingMethods) ? cookingMethods : [],
      tags: Array.isArray(tags) ? tags : [],
      notes: notes || '',
      published: Boolean(published),
      status: 'borrador',
      source: {
        url: source?.url || '',
        platform: source?.platform || null,
        author: source?.author || null,
        thumbnail: source?.thumbnail || null,
        textSource: source?.textSource || null,
        rawText: source?.rawText || null,
      },
      ingredients: Array.isArray(ingredients) ? ingredients.map(buildIngredient) : [],
      steps: Array.isArray(steps) ? steps.map(buildStep) : [],
      createdAt: now,
      updatedAt: now,
    };

    recipe.status = computeRecipeStatus(recipe);

    await db.collection('recipes').insertOne(recipe);
    return Response.json({ success: true, recipe }, { status: 201 });
  } catch (error) {
    console.error('POST /api/recipes error:', error);
    return Response.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
