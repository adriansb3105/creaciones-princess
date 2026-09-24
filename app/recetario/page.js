'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Search, Coffee, Sandwich, Moon, Cookie, Heart, ShoppingBasket } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import RecipeCard from '@/components/recetario/RecipeCard';
import { useRecipeFavorites } from '@/hooks/use-recipe-favorites';
import { useShoppingList } from '@/hooks/use-shopping-list';

const CATEGORY_ICONS = {
  desayunos: Coffee,
  almuerzos: Sandwich,
  cenas: Moon,
  snacks: Cookie,
};

export default function RecetarioPage() {
  const router = useRouter();
  const { favoriteIds } = useRecipeFavorites();
  const { items: shoppingItems } = useShoppingList();

  const [categories, setCategories] = useState([]);
  const [recent, setRecent] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    Promise.all([
      fetch('/api/recipe-categories').then((r) => r.json()),
      fetch('/api/recipes').then((r) => r.json()),
    ])
      .then(([categoriesData, recipesData]) => {
        setCategories(categoriesData?.categories || []);
        setRecent((recipesData?.recipes || []).slice(0, 6));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (favoriteIds.length === 0) {
      setFavorites([]);
      return;
    }
    fetch('/api/recipes')
      .then((r) => r.json())
      .then((data) => {
        const all = data?.recipes || [];
        setFavorites(all.filter((r) => favoriteIds.includes(r.id)));
      })
      .catch(() => setFavorites([]));
  }, [favoriteIds]);

  const categoryName = (categoryId) => categories.find((c) => c.id === categoryId)?.name;

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchTerm) params.set('busqueda', searchTerm);
    router.push(`/recetario/explorar${params.toString() ? `?${params.toString()}` : ''}`);
  };

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-pink-50 via-mint-50 to-pink-50 py-20">
        <div className="container mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-5xl md:text-6xl font-cursive text-primary mb-4">Recetario</h1>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto mb-8">
              Nuestras recetas favoritas, guardadas de videos y publicaciones — con ingredientes y preparación
              paso a paso.
            </p>
            <div className="flex items-center gap-3 max-w-lg mx-auto">
              <form onSubmit={handleSearch} className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar por nombre o ingrediente..."
                  className="pl-11 h-12 border-pink-200 focus:border-primary bg-white"
                />
              </form>
              <Link href="/recetario/lista-de-compras" className="relative flex-shrink-0">
                <Button size="icon" variant="outline" className="h-12 w-12 border-pink-200 bg-white">
                  <ShoppingBasket className="h-5 w-5 text-primary" />
                </Button>
                {shoppingItems.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-mint-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                    {shoppingItems.length}
                  </span>
                )}
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-cursive text-primary mb-8 text-center">Categorías</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((category) => {
              const Icon = CATEGORY_ICONS[category.slug] || Coffee;
              return (
                <Link key={category.id} href={`/recetario/explorar?categoria=${category.slug}`}>
                  <motion.div
                    whileHover={{ scale: 1.03 }}
                    className="bg-gradient-to-br from-mint-50 to-pink-50 rounded-2xl p-8 text-center border border-pink-100 hover:shadow-lg transition-shadow"
                  >
                    <Icon className="h-8 w-8 text-primary mx-auto mb-3" />
                    <span className="font-semibold text-gray-800">{category.name}</span>
                  </motion.div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Favorites */}
      {favorites.length > 0 && (
        <section className="py-8">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-cursive text-primary mb-8 text-center flex items-center justify-center gap-2">
              <Heart className="h-6 w-6 fill-primary text-primary" />
              Tus favoritas
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {favorites.map((recipe) => (
                <RecipeCard key={recipe.id} recipe={recipe} categoryName={categoryName(recipe.categoryId)} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Recent */}
      <section className="py-16 bg-mint-50/30">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-cursive text-primary">Recetas recientes</h2>
            <Link href="/recetario/explorar">
              <Button variant="outline" className="border-pink-300 text-primary hover:bg-pink-50">
                Ver todas
              </Button>
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-72 rounded-xl" />
              ))}
            </div>
          ) : recent.length === 0 ? (
            <p className="text-center text-gray-500 py-12">Todavía no hay recetas publicadas.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {recent.map((recipe) => (
                <RecipeCard key={recipe.id} recipe={recipe} categoryName={categoryName(recipe.categoryId)} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
