'use client';

import { useEffect, useState } from 'react';
import ProductForm from '@/components/admin/ProductForm';

export default function NewProductPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/categories')
      .then((r) => r.json())
      .then((data) => setCategories(data?.categories || []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">Nuevo producto</h1>
      {!loading && <ProductForm categories={categories} />}
    </div>
  );
}
