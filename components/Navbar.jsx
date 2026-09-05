'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X, Heart, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/use-cart';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { count } = useCart();

  const menuItems = [
    { name: 'Inicio', href: '/' },
    { name: 'Tienda', href: '/productos' },
    { name: 'Galería', href: '/galeria' },
    { name: 'Sobre Nosotros', href: '/sobre-nosotros' },
    { name: 'Contacto', href: '/contacto' },
  ];

  return (
    <nav className="bg-white/95 backdrop-blur-sm shadow-md fixed w-full z-50 top-0">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Heart className="h-8 w-8 text-primary fill-primary" />
            <div>
              <h1 className="text-2xl font-cursive text-primary">Creaciones Princess</h1>
              <p className="text-xs text-mint-600">Endulzando tus momentos</p>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-700 hover:text-primary transition-colors font-medium"
              >
                {item.name}
              </Link>
            ))}
            <Link href="/carrito" className="relative">
              <ShoppingBag className="h-6 w-6 text-gray-700 hover:text-primary transition-colors" />
              {count > 0 && (
                <span className="absolute -top-2 -right-2 bg-mint-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {count}
                </span>
              )}
            </Link>
            <Link href="/productos">
              <Button className="bg-gradient-to-r from-primary to-pink-500 hover:from-pink-500 hover:to-primary">
                Haz tu Pedido
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-4">
            <Link href="/carrito" className="relative">
              <ShoppingBag className="h-6 w-6 text-gray-700" />
              {count > 0 && (
                <span className="absolute -top-2 -right-2 bg-mint-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {count}
                </span>
              )}
            </Link>
            <button className="text-gray-700" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden pb-4"
            >
              {menuItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block py-3 text-gray-700 hover:text-primary transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <Link href="/productos" onClick={() => setIsOpen(false)}>
                <Button className="w-full mt-2 bg-gradient-to-r from-primary to-pink-500">
                  Haz tu Pedido
                </Button>
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navbar;
