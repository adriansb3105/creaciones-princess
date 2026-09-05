'use client';

import { Suspense, useEffect, useState, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

function ProductosContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const selectedCategory = searchParams.get('category') || 'todos';
  const selectedSubcategory = searchParams.get('subcategory') || 'todos';

  useEffect(() => {
    fetch('/api/categories')
      .then((r) => r.json())
      .then((data) => setCategories(data?.categories || []))
      .catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (selectedCategory !== 'todos') params.set('category', selectedCategory);
    if (selectedSubcategory !== 'todos') params.set('subcategory', selectedSubcategory);
    if (searchTerm) params.set('search', searchTerm);

    fetch(`/api/products?${params.toString()}`)
      .then((r) => r.json())
      .then((data) => setProducts(data?.products || []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [selectedCategory, selectedSubcategory, searchTerm]);

  const updateFilters = useCallback(
    (categorySlug, subcategorySlug) => {
      const params = new URLSearchParams();
      if (categorySlug && categorySlug !== 'todos') params.set('category', categorySlug);
      if (subcategorySlug && subcategorySlug !== 'todos') params.set('subcategory', subcategorySlug);
      router.push(`/productos${params.toString() ? `?${params.toString()}` : ''}`, { scroll: false });
    },
    [router]
  );

  const activeCategory = categories.find((c) => c.slug === selectedCategory);
  const categoryNameById = (categoryId) => categories.find((c) => c.id === categoryId)?.name;

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-pink-50 via-mint-50 to-pink-50 py-20">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
            <h1 className="text-5xl md:text-6xl font-cursive text-primary mb-4">Nuestra Tienda</h1>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Postres, agendas y decoraciones artesanales — cada una hecha con amor y dedicación
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="py-8 bg-white sticky top-20 z-30 shadow-sm">
        <div className="container mx-auto px-4 space-y-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex flex-wrap gap-2">
              <Button
                onClick={() => updateFilters('todos', 'todos')}
                variant={selectedCategory === 'todos' ? 'default' : 'outline'}
                className={
                  selectedCategory === 'todos'
                    ? 'bg-gradient-to-r from-primary to-pink-500'
                    : 'border-pink-300 text-primary hover:bg-pink-50'
                }
              >
                Todos
              </Button>
              {categories.map((category) => (
                <Button
                  key={category.id}
                  onClick={() => updateFilters(category.slug, 'todos')}
                  variant={selectedCategory === category.slug ? 'default' : 'outline'}
                  className={
                    selectedCategory === category.slug
                      ? 'bg-gradient-to-r from-primary to-pink-500'
                      : 'border-pink-300 text-primary hover:bg-pink-50'
                  }
                >
                  {category.name}
                </Button>
              ))}
            </div>

            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="text"
                placeholder="Buscar productos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-pink-200 focus:border-primary"
              />
            </div>
          </div>

          {activeCategory && activeCategory.subcategories?.length > 0 && (
            <div className="flex flex-wrap gap-2">
              <Button
                size="sm"
                onClick={() => updateFilters(selectedCategory, 'todos')}
                variant={selectedSubcategory === 'todos' ? 'secondary' : 'ghost'}
                className="text-mint-700"
              >
                Todas
              </Button>
              {activeCategory.subcategories.map((sub) => (
                <Button
                  key={sub.id}
                  size="sm"
                  onClick={() => updateFilters(selectedCategory, sub.slug)}
                  variant={selectedSubcategory === sub.slug ? 'secondary' : 'ghost'}
                  className="text-mint-700"
                >
                  {sub.name}
                </Button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="text-center py-20">
              <p className="text-gray-600 text-lg">Cargando productos...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-600 text-lg">No se encontraron productos</p>
            </div>
          ) : (
            <>
              <p className="text-gray-600 mb-6">
                Mostrando {products.length} producto{products.length !== 1 ? 's' : ''}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} categoryName={categoryNameById(product.categoryId)} />
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}

export default function ProductosPage() {
  return (
    <Suspense fallback={<div className="min-h-screen" />}>
      <ProductosContent />
    </Suspense>
  );
}
