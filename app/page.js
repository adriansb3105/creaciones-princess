'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Cake, Sparkles, Heart, Star, ChevronRight, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import ProductCard from '@/components/ProductCard';

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      const response = await fetch('/api/products?featured=true');
      const data = await response.json();
      setFeaturedProducts(data?.products || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    {
      name: 'Pasteles',
      icon: Cake,
      image: 'https://images.unsplash.com/photo-1581745071812-e69f8cf9e898',
      description: 'Pasteles personalizados para cada ocasión especial'
    },
    {
      name: 'Postres',
      icon: Sparkles,
      image: 'https://images.unsplash.com/photo-1614707267537-b85aaf00c4b7',
      description: 'Postres artesanales que endulzan tu día'
    },
    {
      name: 'Artesanías',
      icon: Heart,
      image: 'https://images.unsplash.com/photo-1506806732259-39c2d0268443',
      description: 'Creaciones únicas hechas a mano con amor'
    },
    {
      name: 'Decoraciones',
      icon: Star,
      image: 'https://images.unsplash.com/photo-1617201460038-6e5555a8a1f5',
      description: 'Decoraciones elegantes para tus fiestas'
    },
  ];

  const testimonials = [
    {
      name: 'María González',
      text: '¡El pastel de cumpleaños fue increíble! No solo se veía hermoso, sino que estaba delicioso. Todos mis invitados quedaron encantados.',
      rating: 5,
    },
    {
      name: 'Carlos Ramírez',
      text: 'Las decoraciones para la fiesta de mi hija fueron perfectas. Cada detalle hecho con amor y dedicación. ¡Muy recomendado!',
      rating: 5,
    },
    {
      name: 'Ana Martínez',
      text: 'Los postres artesanales son simplemente exóticos. La calidad y el sabor son excepcionales. Mi lugar favorito para endulzar momentos especiales.',
      rating: 5,
    },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1581745071812-e69f8cf9e898"
            alt="Hero"
            fill
            className="object-cover brightness-50"
            priority
          />
        </div>
        <div className="relative z-10 text-center text-white px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-cursive mb-4">Creaciones Princess</h1>
            <p className="text-xl md:text-2xl mb-8 font-light">
              Endulzamos tus momentos con amor 💖
            </p>
            <Link href="/contacto">
              <Button size="lg" className="bg-gradient-to-r from-pink-400 to-pink-500 hover:from-pink-500 hover:to-pink-600 text-lg px-8">
                Haz tu Pedido Personalizado
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-gradient-to-br from-pink-50 via-white to-cream-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-cursive text-pink-500 mb-4">Nuestras Especialidades</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Cada creación nace de nuestras manos, con amor y dedicación para que tus momentos sean inolvidables
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {categories.map((category, index) => {
              const Icon = category.icon;
              return (
                <motion.div
                  key={category.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link href={`/productos?category=${category.name}`}>
                    <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 border-pink-100 cursor-pointer">
                      <div className="relative h-48 overflow-hidden">
                        <Image
                          src={category.image}
                          alt={category.name}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <div className="absolute bottom-4 left-4 text-white">
                          <Icon className="h-8 w-8 mb-2" />
                          <h3 className="text-2xl font-semibold">{category.name}</h3>
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <p className="text-gray-600 text-sm">{category.description}</p>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-cursive text-pink-500 mb-4">Productos Destacados</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Descubre nuestras creaciones más populares y solicitadas
            </p>
          </motion.div>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-600">Cargando productos...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
              {featuredProducts.slice(0, 6).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          <div className="text-center">
            <Link href="/productos">
              <Button variant="outline" size="lg" className="border-pink-300 text-pink-500 hover:bg-pink-50">
                Ver Todos los Productos
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* About Preview */}
      <section className="py-20 bg-gradient-to-br from-cream-50 via-pink-50 to-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-cursive text-pink-500 mb-6">Sobre Nosotros</h2>
              <p className="text-gray-600 mb-4 leading-relaxed">
                En <span className="font-semibold text-pink-500">Creaciones Princess</span>, cada dulce y cada
                detalle nace de nuestras manos, con amor y dedicación para que tus momentos sean inolvidables.
              </p>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Somos una empresa familiar dedicada a crear experiencias dulces y memorables. Desde pasteles
                personalizados hasta decoraciones únicas, ponemos nuestro corazón en cada creación.
              </p>
              <Link href="/sobre-nosotros">
                <Button className="bg-gradient-to-r from-pink-400 to-pink-500">
                  Conoce Nuestra Historia
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative h-96 rounded-2xl overflow-hidden shadow-2xl"
            >
              <Image
                src="https://images.unsplash.com/photo-1672081211046-f494525f9a1b"
                alt="About us"
                fill
                className="object-cover"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-cursive text-pink-500 mb-4">Lo Que Dicen Nuestros Clientes</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              La satisfacción de nuestros clientes es nuestra mayor recompensa
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full border-pink-100">
                  <CardContent className="p-6">
                    <div className="flex mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <p className="text-gray-600 mb-4 italic">"{testimonial.text}"</p>
                    <p className="font-semibold text-pink-500">{testimonial.name}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-pink-400 to-pink-500">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-cursive text-white mb-6">
              ¿Listo para Endulzar tu Momento Especial?
            </h2>
            <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
              Contáctanos hoy y hagamos realidad la celebración de tus sueños
            </p>
            <Link href="/contacto">
              <Button size="lg" variant="secondary" className="bg-white text-pink-500 hover:bg-pink-50 text-lg px-8">
                Haz tu Pedido Ahora
                <Heart className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;