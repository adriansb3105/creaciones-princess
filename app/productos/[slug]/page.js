'use client';

import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ChevronRight, Minus, Plus, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ProductCard from '@/components/ProductCard';
import Lightbox from '@/components/Lightbox';
import YouTubeEmbed from '@/components/YouTubeEmbed';
import { useCart } from '@/hooks/use-cart';
import { useToast } from '@/hooks/use-toast';
import { formatPrice } from '@/lib/utils';

export default function ProductDetailPage({ params }) {
  const { slug } = use(params);
  const { addItem } = useCart();
  const { toast } = useToast();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    setLoading(true);
    setNotFound(false);
    fetch(`/api/products/${slug}`)
      .then(async (r) => {
        if (!r.ok) {
          setNotFound(true);
          return null;
        }
        return r.json();
      })
      .then((data) => {
        if (!data) return;
        setProduct(data.product);
        setRelated(data.related || []);
        setActiveImage(0);
        setQuantity(1);
        if (data.product?.categoryId) {
          fetch('/api/categories')
            .then((r) => r.json())
            .then((catData) => {
              setCategory((catData?.categories || []).find((c) => c.id === data.product.categoryId) || null);
            })
            .catch(() => setCategory(null));
        }
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [slug]);

  const handleAddToCart = () => {
    if (!product) return;
    addItem(product, quantity);
    toast({ title: 'Agregado al carrito', description: `${product.name} (x${quantity})` });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600 text-lg">Cargando producto...</p>
      </div>
    );
  }

  if (notFound || !product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-gray-600 text-lg">No encontramos este producto.</p>
        <Link href="/productos">
          <Button className="bg-gradient-to-r from-primary to-pink-500">Volver a la tienda</Button>
        </Link>
      </div>
    );
  }

  const images = product.images?.length ? product.images : [];
  const subcategory = category?.subcategories?.find((s) => s.id === product.subcategoryId);

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <div className="flex items-center flex-wrap gap-1 text-sm text-gray-500 mb-8">
          <Link href="/productos" className="hover:text-primary">
            Tienda
          </Link>
          {category && (
            <>
              <ChevronRight className="h-4 w-4" />
              <Link href={`/productos?category=${category.slug}`} className="hover:text-primary">
                {category.name}
              </Link>
            </>
          )}
          {subcategory && (
            <>
              <ChevronRight className="h-4 w-4" />
              <span>{subcategory.name}</span>
            </>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Images */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <div
              className="relative h-96 rounded-2xl overflow-hidden shadow-lg cursor-zoom-in mb-4 bg-mint-50"
              onClick={() => images.length && setLightboxIndex(activeImage)}
            >
              {images[activeImage] && (
                <Image src={images[activeImage]} alt={product.name} fill className="object-cover" priority />
              )}
            </div>
            {images.length > 1 && (
              <div className="flex gap-3">
                {images.map((img, index) => (
                  <button
                    key={img + index}
                    onClick={() => setActiveImage(index)}
                    className={`relative h-20 w-20 rounded-lg overflow-hidden border-2 ${
                      activeImage === index ? 'border-primary' : 'border-transparent'
                    }`}
                  >
                    <Image src={img} alt={`${product.name} ${index + 1}`} fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Info */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <h1 className="text-4xl font-cursive text-primary mb-3">{product.name}</h1>
            <p className="text-3xl font-bold text-gray-800 mb-6">{formatPrice(product.price)}</p>
            <p className="text-gray-600 leading-relaxed mb-6">{product.description}</p>
            {product.availabilityNote && (
              <p className="text-sm text-mint-700 bg-mint-50 rounded-lg px-4 py-3 mb-6">
                {product.availabilityNote}
              </p>
            )}

            <div className="flex items-center gap-4 mb-6">
              <span className="font-medium text-gray-700">Cantidad</span>
              <div className="flex items-center border border-pink-200 rounded-lg">
                <button
                  className="p-2 hover:bg-pink-50"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  aria-label="Reducir cantidad"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-10 text-center">{quantity}</span>
                <button
                  className="p-2 hover:bg-pink-50"
                  onClick={() => setQuantity((q) => q + 1)}
                  aria-label="Aumentar cantidad"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            <Button
              size="lg"
              className="w-full bg-gradient-to-r from-primary to-pink-500 hover:from-pink-500 hover:to-primary"
              onClick={handleAddToCart}
            >
              <ShoppingCart className="mr-2 h-5 w-5" />
              Agregar al carrito
            </Button>

            {product.youtubeVideoId && (
              <div className="mt-8">
                <YouTubeEmbed videoId={product.youtubeVideoId} title={product.name} />
              </div>
            )}
          </motion.div>
        </div>

        {/* Related products */}
        {related.length > 0 && (
          <div>
            <h2 className="text-3xl font-cursive text-primary mb-8 text-center">También te puede gustar</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} categoryName={category?.name} />
              ))}
            </div>
          </div>
        )}
      </div>

      {lightboxIndex !== null && (
        <Lightbox
          images={images}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNext={() => setLightboxIndex((i) => (i + 1) % images.length)}
          onPrev={() => setLightboxIndex((i) => (i - 1 + images.length) % images.length)}
        />
      )}
    </div>
  );
}
