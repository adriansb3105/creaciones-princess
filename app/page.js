'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Heart, Star, ChevronRight, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import ProductCard from '@/components/ProductCard';
import YouTubeEmbed from '@/components/YouTubeEmbed';
import { BUSINESS_NAME } from '@/lib/constants';

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [videoItem, setVideoItem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/products?featured=true').then((r) => r.json()),
      fetch('/api/categories').then((r) => r.json()),
      fetch('/api/gallery').then((r) => r.json()),
    ])
      .then(([productsData, categoriesData, galleryData]) => {
        setFeaturedProducts(productsData?.products || []);
        setCategories(categoriesData?.categories || []);
        setVideoItem((galleryData?.items || []).find((i) => i.type === 'video') || null);
      })
      .catch((error) => console.error('Error loading home data:', error))
      .finally(() => setLoading(false));
  }, []);

  const categoryNameById = (categoryId) => categories.find((c) => c.id === categoryId)?.name;

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
      text: 'La agenda personalizada quedó espectacular. La calidad y el cuidado en cada detalle son excepcionales.',
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
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <h1 className="text-5xl md:text-7xl font-cursive mb-4">{BUSINESS_NAME}</h1>
            <p className="text-xl md:text-2xl mb-8 font-light">Endulzamos tus momentos con amor 💖</p>
            <Link href="/productos">
              <Button size="lg" className="bg-gradient-to-r from-primary to-pink-500 hover:from-pink-500 hover:to-primary text-lg px-8">
                Haz tu Pedido Personalizado
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-gradient-to-br from-pink-50 via-white to-mint-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-cursive text-primary mb-4">Nuestras Especialidades</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Cada creación nace de nuestras manos, con amor y dedicación para que tus momentos sean inolvidables
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {categories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Link href={`/productos?category=${category.slug}`}>
                  <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 border-pink-100 cursor-pointer">
                    <div className="relative h-48 overflow-hidden">
                      {category.image && (
                        <Image
                          src={category.image}
                          alt={category.name}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute bottom-4 left-4 text-white">
                        <h3 className="text-2xl font-semibold">{category.name}</h3>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <p className="text-gray-600 text-sm">{category.description}</p>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
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
            <h2 className="text-4xl md:text-5xl font-cursive text-primary mb-4">Productos Destacados</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Descubre nuestras creaciones más populares y solicitadas</p>
          </motion.div>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-600">Cargando productos...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
              {featuredProducts.slice(0, 6).map((product) => (
                <ProductCard key={product.id} product={product} categoryName={categoryNameById(product.categoryId)} />
              ))}
            </div>
          )}

          <div className="text-center">
            <Link href="/productos">
              <Button variant="outline" size="lg" className="border-pink-300 text-primary hover:bg-pink-50">
                Ver Toda la Tienda
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Video Section */}
      {videoItem && (
        <section className="py-20 bg-mint-50">
          <div className="container mx-auto px-4 max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-10"
            >
              <h2 className="text-4xl md:text-5xl font-cursive text-primary mb-4">Conócenos</h2>
              <p className="text-gray-600">Así preparamos cada creación, con amor y dedicación</p>
            </motion.div>
            <YouTubeEmbed videoId={videoItem.youtubeVideoId} title="Creaciones Princess" />
          </div>
        </section>
      )}

      {/* About Preview */}
      <section className="py-20 bg-gradient-to-br from-mint-50 via-pink-50 to-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <h2 className="text-4xl md:text-5xl font-cursive text-primary mb-6">Sobre Nosotros</h2>
              <p className="text-gray-600 mb-4 leading-relaxed">
                En <span className="font-semibold text-primary">{BUSINESS_NAME}</span>, cada dulce, cada agenda y
                cada detalle nace de nuestras manos, con amor y dedicación para que tus momentos sean inolvidables.
              </p>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Somos una empresa familiar dedicada a crear experiencias dulces y memorables. Desde postres
                personalizados hasta decoraciones únicas, ponemos nuestro corazón en cada creación.
              </p>
              <Link href="/sobre-nosotros">
                <Button className="bg-gradient-to-r from-primary to-pink-500">
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
              <Image src="https://images.unsplash.com/photo-1672081211046-f494525f9a1b" alt="About us" fill className="object-cover" />
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
            <h2 className="text-4xl md:text-5xl font-cursive text-primary mb-4">Lo Que Dicen Nuestros Clientes</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">La satisfacción de nuestros clientes es nuestra mayor recompensa</p>
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
                    <p className="text-gray-600 mb-4 italic">&ldquo;{testimonial.text}&rdquo;</p>
                    <p className="font-semibold text-primary">{testimonial.name}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-pink-500">
        <div className="container mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-4xl md:text-5xl font-cursive text-white mb-6">¿Listo para Endulzar tu Momento Especial?</h2>
            <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
              Contáctanos hoy y hagamos realidad la celebración de tus sueños
            </p>
            <Link href="/productos">
              <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-pink-50 text-lg px-8">
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
