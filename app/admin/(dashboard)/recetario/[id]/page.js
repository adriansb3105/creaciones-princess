'use client';

import { use, useEffect, useState } from 'react';
import RecipeForm from '@/components/admin/RecipeForm';

export default function EditRecipePage({ params }) {
  const { id } = use(params);
  const [recipe, setRecipe] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetch(`/api/recipes/${id}`).then((r) => r.json()), fetch('/api/recipe-categories').then((r) => r.json())])
      .then(([recipeData, categoriesData]) => {
        setRecipe(recipeData?.recipe || null);
        setCategories(categoriesData?.categories || []);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p className="text-gray-500">Cargando...</p>;
  if (!recipe) return <p className="text-gray-500">Receta no encontrada.</p>;

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">Editar receta</h1>
      <RecipeForm recipe={recipe} categories={categories} />
    </div>
  );
}
