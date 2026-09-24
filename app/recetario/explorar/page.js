'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Search, SlidersHorizontal } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import RecipeCard from '@/components/recetario/RecipeCard';
import { DIFFICULTY_OPTIONS, COOKING_METHOD_OPTIONS } from '@/lib/recipes/constants';
import { PLATFORM_LABELS } from '@/lib/recipes/platforms';

function FiltersContent({ categories, selectedCategory, difficulty, method, platform, onChange }) {
  return (
    <div className="space-y-5">
      <div>
        <p className="text-sm font-medium text-gray-700 mb-2">Categoría</p>
        <div className="flex flex-wrap gap-2">
          <Button
            size="sm"
            onClick={() => onChange('categoria', 'todos')}
            variant={selectedCategory === 'todos' ? 'default' : 'outline'}
            className={selectedCategory === 'todos' ? 'bg-gradient-to-r from-primary to-pink-500' : 'border-pink-300 text-primary'}
          >
            Todas
          </Button>
          {categories.map((cat) => (
            <Button
              key={cat.id}
              size="sm"
              onClick={() => onChange('categoria', cat.slug)}
              variant={selectedCategory === cat.slug ? 'default' : 'outline'}
              className={selectedCategory === cat.slug ? 'bg-gradient-to-r from-primary to-pink-500' : 'border-pink-300 text-primary'}
            >
              {cat.name}
            </Button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-sm font-medium text-gray-700 mb-2">Dificultad</p>
        <Select value={difficulty} onValueChange={(v) => onChange('dificultad', v)}>
          <SelectTrigger>
            <SelectValue placeholder="Cualquiera" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Cualquiera</SelectItem>
            {DIFFICULTY_OPTIONS.map((d) => (
              <SelectItem key={d.value} value={d.value}>
                {d.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <p className="text-sm font-medium text-gray-700 mb-2">Método de cocción</p>
        <Select value={method} onValueChange={(v) => onChange('metodo', v)}>
          <SelectTrigger>
            <SelectValue placeholder="Cualquiera" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Cualquiera</SelectItem>
            {COOKING_METHOD_OPTIONS.map((m) => (
              <SelectItem key={m.value} value={m.value}>
                {m.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <p className="text-sm font-medium text-gray-700 mb-2">Plataforma de origen</p>
        <Select value={platform} onValueChange={(v) => onChange('plataforma', v)}>
          <SelectTrigger>
            <SelectValue placeholder="Cualquiera" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Cualquiera</SelectItem>
            {Object.entries(PLATFORM_LABELS).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

function ExplorarContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [categories, setCategories] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('busqueda') || '');

  const selectedCategory = searchParams.get('categoria') || 'todos';
  const difficulty = searchParams.get('dificultad') || 'todos';
  const method = searchParams.get('metodo') || 'todos';
  const platform = searchParams.get('plataforma') || 'todos';
  const search = searchParams.get('busqueda') || '';

  useEffect(() => {
    fetch('/api/recipe-categories')
      .then((r) => r.json())
      .then((data) => setCategories(data?.categories || []))
      .catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (selectedCategory !== 'todos') params.set('categoria', selectedCategory);
    if (difficulty !== 'todos') params.set('dificultad', difficulty);
    if (method !== 'todos') params.set('metodo', method);
    if (platform !== 'todos') params.set('plataforma', platform);
    if (search) params.set('busqueda', search);

    fetch(`/api/recipes?${params.toString()}`)
      .then((r) => r.json())
      .then((data) => setRecipes(data?.recipes || []))
      .catch(() => setRecipes([]))
      .finally(() => setLoading(false));
  }, [selectedCategory, difficulty, method, platform, search]);

  const updateParam = (key, value) => {
    const params = new URLSearchParams(searchParams.toString());
    if (!value || value === 'todos') {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    router.push(`/recetario/explorar${params.toString() ? `?${params.toString()}` : ''}`, { scroll: false });
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    updateParam('busqueda', searchTerm);
  };

  const categoryName = (categoryId) => categories.find((c) => c.id === categoryId)?.name;

  return (
    <div className="min-h-screen">
      <section className="bg-gradient-to-br from-pink-50 via-mint-50 to-pink-50 py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-cursive text-primary mb-4">Explorar Recetas</h1>
          <form onSubmit={handleSearchSubmit} className="max-w-lg mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por nombre o ingrediente..."
              className="pl-11 h-12 border-pink-200 focus:border-primary bg-white"
            />
          </form>
        </div>
      </section>

      <section className="py-10">
        <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-8">
          {/* Filters — desktop */}
          <aside className="hidden lg:block">
            <div className="bg-white border border-pink-100 rounded-xl p-5 sticky top-28">
              <FiltersContent
                categories={categories}
                selectedCategory={selectedCategory}
                difficulty={difficulty}
                method={method}
                platform={platform}
                onChange={updateParam}
              />
            </div>
          </aside>

          {/* Filters — mobile */}
          <div className="lg:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="border-pink-300 text-primary w-full">
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  Filtros
                </Button>
              </SheetTrigger>
              <SheetContent side="bottom" className="max-h-[80vh] overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>Filtros</SheetTitle>
                </SheetHeader>
                <div className="mt-4">
                  <FiltersContent
                    categories={categories}
                    selectedCategory={selectedCategory}
                    difficulty={difficulty}
                    method={method}
                    platform={platform}
                    onChange={updateParam}
                  />
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Results */}
          <div>
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <Skeleton key={i} className="h-72 rounded-xl" />
                ))}
              </div>
            ) : recipes.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-gray-600 text-lg">No encontramos recetas con esos filtros.</p>
              </div>
            ) : (
              <>
                <p className="text-gray-600 mb-6">
                  {recipes.length} receta{recipes.length !== 1 ? 's' : ''}
                </p>
                <motion.div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {recipes.map((recipe) => (
                    <RecipeCard key={recipe.id} recipe={recipe} categoryName={categoryName(recipe.categoryId)} />
                  ))}
                </motion.div>
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

export default function ExplorarPage() {
  return (
    <Suspense fallback={<div className="min-h-screen" />}>
      <ExplorarContent />
    </Suspense>
  );
}
