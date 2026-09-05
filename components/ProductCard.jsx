'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useCart } from '@/hooks/use-cart';
import { useToast } from '@/hooks/use-toast';
import { formatPrice } from '@/lib/utils';

const ProductCard = ({ product, categoryName }) => {
  const { addItem } = useCart();
  const { toast } = useToast();

  const handleAddToCart = () => {
    addItem(product, 1);
    toast({
      title: 'Agregado al carrito',
      description: product.name,
    });
  };

  const image = product.images?.[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <Card className="overflow-hidden hover:shadow-xl transition-shadow duration-300 border-pink-100 h-full flex flex-col">
        <Link href={`/productos/${product.slug}`}>
          <div className="relative h-64 overflow-hidden group">
            {image ? (
              <Image
                src={image}
                alt={product.name}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-300"
              />
            ) : (
              <div className="w-full h-full bg-mint-50" />
            )}
          </div>
        </Link>
        <CardContent className="p-6 flex flex-col flex-1">
          {categoryName && (
            <div className="mb-2">
              <span className="text-xs font-medium text-primary bg-pink-50 px-3 py-1 rounded-full">
                {categoryName}
              </span>
            </div>
          )}
          <Link href={`/productos/${product.slug}`}>
            <h3 className="text-xl font-semibold text-gray-800 mb-2 hover:text-primary transition-colors">
              {product.name}
            </h3>
          </Link>
          <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-1">{product.description}</p>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-primary">{formatPrice(product.price)}</span>
            <Button size="sm" className="bg-gradient-to-r from-primary to-pink-500" onClick={handleAddToCart}>
              <ShoppingCart className="h-4 w-4 mr-2" />
              Agregar
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ProductCard;
