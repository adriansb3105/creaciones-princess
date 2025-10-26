'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const ProductCard = ({ product }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <Card className="overflow-hidden hover:shadow-xl transition-shadow duration-300 border-pink-100">
        <div className="relative h-64 overflow-hidden group">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-300"
          />
        </div>
        <CardContent className="p-6">
          <div className="mb-2">
            <span className="text-xs font-medium text-pink-500 bg-pink-50 px-3 py-1 rounded-full">
              {product.category}
            </span>
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">{product.name}</h3>
          <p className="text-gray-600 text-sm mb-4">{product.description}</p>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-pink-500">${product.price}</span>
            <Button size="sm" className="bg-gradient-to-r from-pink-400 to-pink-500">
              <ShoppingCart className="h-4 w-4 mr-2" />
              Ordenar
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ProductCard;