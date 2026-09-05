'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Minus, Plus, Trash2, ArrowRight, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useCart } from '@/hooks/use-cart';
import { formatPrice } from '@/lib/utils';
import { DEPOSIT_PERCENTAGE } from '@/lib/constants';

export default function CarritoPage() {
  const { items, updateQuantity, removeItem, subtotal } = useCart();
  const depositAmount = Math.round(subtotal * DEPOSIT_PERCENTAGE);

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 px-4 text-center">
        <ShoppingBag className="h-16 w-16 text-pink-200" />
        <h1 className="text-3xl font-cursive text-primary">Tu carrito está vacío</h1>
        <p className="text-gray-600">Explora la tienda y encuentra algo especial para tu próxima celebración.</p>
        <Link href="/productos">
          <Button className="bg-gradient-to-r from-primary to-pink-500">Ir a la tienda</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl md:text-5xl font-cursive text-primary mb-10 text-center">Tu Carrito</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <motion.div
                key={item.productId}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card className="border-pink-100">
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="relative h-20 w-20 rounded-lg overflow-hidden bg-mint-50 flex-shrink-0">
                      {item.image && <Image src={item.image} alt={item.name} fill className="object-cover" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-800 truncate">{item.name}</p>
                      <p className="text-primary font-bold">{formatPrice(item.price)}</p>
                    </div>
                    <div className="flex items-center border border-pink-200 rounded-lg">
                      <button
                        className="p-2 hover:bg-pink-50"
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                        aria-label="Reducir cantidad"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <button
                        className="p-2 hover:bg-pink-50"
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        aria-label="Aumentar cantidad"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                    <button
                      onClick={() => removeItem(item.productId)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                      aria-label="Eliminar producto"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Summary */}
          <div>
            <Card className="border-pink-100 sticky top-28">
              <CardContent className="p-6 space-y-4">
                <h2 className="text-2xl font-cursive text-primary mb-2">Resumen</h2>
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg text-gray-800 border-t pt-4">
                  <span>Total</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="bg-mint-50 rounded-lg p-4 text-sm text-mint-800">
                  Adelanto requerido ({DEPOSIT_PERCENTAGE * 100}%):{' '}
                  <span className="font-bold">{formatPrice(depositAmount)}</span>
                  <br />
                  El saldo se coordina contra entrega.
                </div>
                <Link href="/checkout">
                  <Button size="lg" className="w-full bg-gradient-to-r from-primary to-pink-500">
                    Continuar Pedido
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
