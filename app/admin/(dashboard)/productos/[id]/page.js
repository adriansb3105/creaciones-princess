'use client';

import { use, useEffect, useState } from 'react';
import ProductForm from '@/components/admin/ProductForm';

export default function EditProductPage({ params }) {
  const { id } = use(params);
  const [product, setProduct] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetch(`/api/products/${id}`).then((r) => r.json()), fetch('/api/categories').then((r) => r.json())])
      .then(([productData, categoriesData]) => {
        setProduct(productData?.product || null);
        setCategories(categoriesData?.categories || []);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p className="text-gray-500">Cargando...</p>;
  if (!product) return <p className="text-gray-500">Producto no encontrado.</p>;

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">Editar producto</h1>
      <ProductForm product={product} categories={categories} />
    </div>
  );
}
