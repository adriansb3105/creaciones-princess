'use client';

import { useEffect, useState } from 'react';
import RecipeForm from '@/components/admin/RecipeForm';

export default function NewRecipePage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/recipe-categories')
      .then((r) => r.json())
      .then((data) => setCategories(data?.categories || []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">Nueva receta</h1>
      {!loading && <RecipeForm categories={categories} />}
    </div>
  );
}
