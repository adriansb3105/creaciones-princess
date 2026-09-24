import { connectToDatabase } from '@/lib/mongodb';
import { requireAdmin } from '@/lib/auth';
import { slugify } from '@/lib/utils';
import { computeRecipeStatus } from '@/lib/recipes/status';
import { buildIngredient, buildStep } from '@/lib/recipes/build';

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const { db } = await connectToDatabase();
    const session = await requireAdmin(request);

    const recipe = await db.collection('recipes').findOne({ $or: [{ id }, { slug: id }] });

    if (!recipe || (!session && !recipe.published)) {
      return Response.json({ error: 'Receta no encontrada' }, { status: 404 });
    }

    recipe.status = computeRecipeStatus(recipe);

    let related = [];
    if (recipe.categoryId) {
      related = await db
        .collection('recipes')
        .find({ categoryId: recipe.categoryId, id: { $ne: recipe.id }, published: true })
        .limit(4)
        .toArray();
    }

    return Response.json({ recipe, related });
  } catch (error) {
    console.error('GET /api/recipes/[id] error:', error);
    return Response.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const session = await requireAdmin(request);
    if (!session) {
      return Response.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { id } = await params;
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
      status,
      source,
      ingredients,
      steps,
    } = body;

    const updateData = { updatedAt: new Date() };
    if (title) {
      updateData.title = title;
      updateData.slug = slugify(title);
    }
    if (description !== undefined) updateData.description = description;
    if (categoryId !== undefined) updateData.categoryId = categoryId;
    if (image !== undefined) updateData.image = image;
    if (difficulty !== undefined) updateData.difficulty = difficulty;
    if (cookingMethods !== undefined) updateData.cookingMethods = Array.isArray(cookingMethods) ? cookingMethods : [];
    if (tags !== undefined) updateData.tags = Array.isArray(tags) ? tags : [];
    if (notes !== undefined) updateData.notes = notes;
    if (published !== undefined) updateData.published = Boolean(published);
    if (source !== undefined) {
      updateData.source = {
        url: source?.url || '',
        platform: source?.platform || null,
        author: source?.author || null,
        thumbnail: source?.thumbnail || null,
        textSource: source?.textSource || null,
        rawText: source?.rawText || null,
      };
    }
    if (ingredients !== undefined) updateData.ingredients = ingredients.map(buildIngredient);
    if (steps !== undefined) updateData.steps = steps.map(buildStep);

    if (prepMinutes !== undefined || cookMinutes !== undefined) {
      const prep = prepMinutes !== undefined ? Number(prepMinutes) || 0 : undefined;
      const cook = cookMinutes !== undefined ? Number(cookMinutes) || 0 : undefined;
      if (prep !== undefined) updateData.prepMinutes = prep || null;
      if (cook !== undefined) updateData.cookMinutes = cook || null;
    }
    if (servings !== undefined) updateData.servings = servings ? Number(servings) : null;

    // El estado se recalcula siempre desde los datos reales — un admin puede
    // pedir "verificada" (status) pero solo se respeta si de verdad está completa.
    const existing = await db.collection('recipes').findOne({ id });
    if (!existing) {
      return Response.json({ error: 'Receta no encontrada' }, { status: 404 });
    }
    const merged = { ...existing, ...updateData, status: status || existing.status };
    if (updateData.prepMinutes !== undefined || updateData.cookMinutes !== undefined) {
      const prep = updateData.prepMinutes ?? existing.prepMinutes ?? 0;
      const cook = updateData.cookMinutes ?? existing.cookMinutes ?? 0;
      updateData.totalMinutes = prep || cook ? prep + cook : null;
      merged.totalMinutes = updateData.totalMinutes;
    }
    updateData.status = computeRecipeStatus(merged);

    const result = await db.collection('recipes').updateOne({ id }, { $set: updateData });

    if (result.matchedCount === 0) {
      return Response.json({ error: 'Receta no encontrada' }, { status: 404 });
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error('PUT /api/recipes/[id] error:', error);
    return Response.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const session = await requireAdmin(request);
    if (!session) {
      return Response.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { id } = await params;
    const { db } = await connectToDatabase();
    const result = await db.collection('recipes').deleteOne({ id });

    if (result.deletedCount === 0) {
      return Response.json({ error: 'Receta no encontrada' }, { status: 404 });
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/recipes/[id] error:', error);
    return Response.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
