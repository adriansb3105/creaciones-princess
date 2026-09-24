'use client';

import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ChevronRight, Clock, Users, ChefHat, Heart, CheckCircle2, ShoppingBasket, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import RecipeCard from '@/components/recetario/RecipeCard';
import StatusBadge from '@/components/recetario/StatusBadge';
import SourceBadge from '@/components/recetario/SourceBadge';
import { useRecipeFavorites } from '@/hooks/use-recipe-favorites';
import { useShoppingList } from '@/hooks/use-shopping-list';
import { useToast } from '@/hooks/use-toast';
import { DIFFICULTY_LABELS, COOKING_METHOD_LABELS } from '@/lib/recipes/constants';
import { cn } from '@/lib/utils';

export default function RecipeDetailPage({ params }) {
  const { slug } = use(params);
  const { isFavorite, toggleFavorite } = useRecipeFavorites();
  const { addIngredient, addIngredients } = useShoppingList();
  const { toast } = useToast();

  const [recipe, setRecipe] = useState(null);
  const [related, setRelated] = useState([]);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    setLoading(true);
    setNotFound(false);
    fetch(`/api/recipes/${slug}`)
      .then(async (r) => {
        if (!r.ok) {
          setNotFound(true);
          return null;
        }
        return r.json();
      })
      .then((data) => {
        if (!data) return;
        setRecipe(data.recipe);
        setRelated(data.related || []);
        if (data.recipe?.categoryId) {
          fetch('/api/recipe-categories')
            .then((r) => r.json())
            .then((catData) => {
              setCategory((catData?.categories || []).find((c) => c.id === data.recipe.categoryId) || null);
            })
            .catch(() => setCategory(null));
        }
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600 text-lg">Cargando receta...</p>
      </div>
    );
  }

  if (notFound || !recipe) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-gray-600 text-lg">No encontramos esta receta.</p>
        <Link href="/recetario">
          <Button className="bg-gradient-to-r from-primary to-pink-500">Volver al recetario</Button>
        </Link>
      </div>
    );
  }

  const favorite = isFavorite(recipe.id);

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <div className="flex items-center flex-wrap gap-1 text-sm text-gray-500 mb-8">
          <Link href="/recetario" className="hover:text-primary">
            Recetario
          </Link>
          {category && (
            <>
              <ChevronRight className="h-4 w-4" />
              <Link href={`/recetario/explorar?categoria=${category.slug}`} className="hover:text-primary">
                {category.name}
              </Link>
            </>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Image */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <div className="relative h-96 rounded-2xl overflow-hidden shadow-lg bg-mint-50">
              {recipe.image && <Image src={recipe.image} alt={recipe.title} fill className="object-cover" priority />}
              <button
                type="button"
                onClick={() => toggleFavorite(recipe.id)}
                className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-2.5 shadow hover:scale-110 transition-transform"
                aria-label={favorite ? 'Quitar de favoritas' : 'Agregar a favoritas'}
              >
                <Heart className={cn('h-5 w-5', favorite ? 'fill-primary text-primary' : 'text-gray-400')} />
              </button>
            </div>
          </motion.div>

          {/* Info */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <div className="flex items-center gap-2 mb-3">
              <StatusBadge status={recipe.status} />
              <SourceBadge source={recipe.source} />
            </div>
            <h1 className="text-4xl font-cursive text-primary mb-4">{recipe.title}</h1>
            {recipe.description && <p className="text-gray-600 leading-relaxed mb-6">{recipe.description}</p>}

            <div className="flex flex-wrap gap-6 text-sm text-gray-700 mb-6">
              {recipe.servings && (
                <span className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-primary" />
                  {recipe.servings} porciones
                </span>
              )}
              {recipe.totalMinutes && (
                <span className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-primary" />
                  {recipe.totalMinutes} min total
                </span>
              )}
              {recipe.difficulty && (
                <span className="flex items-center gap-2">
                  <ChefHat className="h-4 w-4 text-primary" />
                  {DIFFICULTY_LABELS[recipe.difficulty] || recipe.difficulty}
                </span>
              )}
            </div>

            {recipe.cookingMethods?.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {recipe.cookingMethods.map((m) => (
                  <span key={m} className="text-xs bg-mint-50 text-mint-700 px-3 py-1 rounded-full">
                    {COOKING_METHOD_LABELS[m] || m}
                  </span>
                ))}
              </div>
            )}

            {recipe.notes && (
              <p className="text-sm text-mint-800 bg-mint-50 rounded-lg px-4 py-3">{recipe.notes}</p>
            )}
          </motion.div>
        </div>

        {/* Ingredients + Steps */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-12 mb-16">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-cursive text-primary">Ingredientes</h2>
              {recipe.ingredients?.length > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    addIngredients(recipe.ingredients, recipe.title);
                    toast({ title: 'Agregado a la lista de compras', description: `${recipe.ingredients.length} ingredientes` });
                  }}
                  className="text-primary hover:text-pink-600 transition-colors"
                  aria-label="Agregar todos los ingredientes a la lista de compras"
                  title="Agregar todo a la lista de compras"
                >
                  <ShoppingBasket className="h-5 w-5" />
                </button>
              )}
            </div>
            {recipe.ingredients?.length === 0 ? (
              <p className="text-gray-500 text-sm">Todavía no hay ingredientes cargados.</p>
            ) : (
              <ul className="space-y-3">
                {recipe.ingredients.map((ing, index) => (
                  <li key={index} className="flex items-start gap-2 text-gray-700 group">
                    <CheckCircle2 className="h-4 w-4 text-mint-500 mt-1 flex-shrink-0" />
                    <span className="flex-1">
                      {ing.quantity ? `${ing.quantity} ` : ''}
                      {ing.unit ? `${ing.unit} ` : ''}
                      {ing.name}
                      {ing.optional && <span className="text-gray-400 text-sm"> (opcional)</span>}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        addIngredient(ing, recipe.title);
                        toast({ title: 'Agregado a la lista de compras', description: ing.name });
                      }}
                      className="text-gray-300 hover:text-primary transition-colors opacity-0 group-hover:opacity-100 flex-shrink-0"
                      aria-label={`Agregar ${ing.name} a la lista de compras`}
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
            {recipe.ingredients?.length > 0 && (
              <Link href="/recetario/lista-de-compras" className="inline-block mt-4 text-sm text-mint-700 hover:underline">
                Ver lista de compras →
              </Link>
            )}
          </div>

          <div>
            <h2 className="text-2xl font-cursive text-primary mb-4">Preparación</h2>
            {recipe.steps?.length === 0 ? (
              <p className="text-gray-500 text-sm">Todavía no hay pasos cargados.</p>
            ) : (
              <ol className="space-y-4">
                {recipe.steps
                  .slice()
                  .sort((a, b) => a.order - b.order)
                  .map((step) => (
                    <li key={step.order} className="flex gap-4">
                      <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-semibold text-sm">
                        {step.order}
                      </span>
                      <p className="text-gray-700 leading-relaxed pt-1">{step.text}</p>
                    </li>
                  ))}
              </ol>
            )}
          </div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div>
            <h2 className="text-3xl font-cursive text-primary mb-8 text-center">También te puede gustar</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {related.map((r) => (
                <RecipeCard key={r.id} recipe={r} categoryName={category?.name} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
