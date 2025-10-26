'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { Heart, Award, Users, Sparkles } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const SobreNosotrosPage = () => {
  const values = [
    {
      icon: Heart,
      title: 'Amor y Dedicación',
      description: 'Cada creación es hecha con amor y atención a cada detalle para que sea única y especial.',
    },
    {
      icon: Award,
      title: 'Calidad Artesanal',
      description: 'Utilizamos ingredientes de primera calidad y técnicas artesanales tradicionales.',
    },
    {
      icon: Users,
      title: 'Personalización',
      description: 'Trabajamos contigo para crear algo que refleje tu visión y haga realidad tus sueños.',
    },
    {
      icon: Sparkles,
      title: 'Creatividad',
      description: 'Innovamos constantemente para ofrecerte diseños frescos y únicos que sorprendan.',
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-pink-50 via-cream-50 to-pink-50 py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-6xl font-cursive text-pink-500 mb-4">Sobre Nosotros</h1>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Conoce la historia detrás de Creaciones Princess y nuestra pasión por endulzar momentos especiales
            </p>
          </motion.div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative h-96 rounded-2xl overflow-hidden shadow-2xl"
            >
              <Image
                src="https://images.unsplash.com/photo-1672081211046-f494525f9a1b"
                alt="Our story"
                fill
                className="object-cover"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-cursive text-pink-500 mb-6">Nuestra Historia</h2>
              <p className="text-gray-600 mb-4 leading-relaxed">
                Creaciones Princess nació del sueño de crear momentos mágicos a través de dulces y decoraciones
                artesanales. Lo que comenzó en una pequeña cocina familiar, hoy se ha convertido en un negocio
                que endulza la vida de cientos de familias.
              </p>
              <p className="text-gray-600 mb-4 leading-relaxed">
                Cada pastel, cada postre y cada decoración lleva el sello distintivo de nuestro compromiso con
                la excelencia y la personalización. Creemos que cada celebración es única y merece ser memorable.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Con años de experiencia en repostería artesanal y decoración de eventos, nos hemos ganado la
                confianza de nuestros clientes por nuestra dedicación, creatividad y sabor excepcional.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gradient-to-br from-pink-50 via-white to-cream-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-cursive text-pink-500 mb-4">Nuestros Valores</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Estos son los principios que guían cada una de nuestras creaciones
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="h-full border-pink-100 hover:shadow-lg transition-shadow">
                    <CardContent className="p-6 text-center">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-pink-100 flex items-center justify-center">
                        <Icon className="h-8 w-8 text-pink-500" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-800 mb-3">{value.title}</h3>
                      <p className="text-gray-600 text-sm">{value.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Founder Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-cursive text-pink-500 mb-4">Nuestra Fundadora</h2>
              <p className="text-gray-600">Conoce a la persona detrás de cada creación</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Card className="border-pink-100">
                <CardContent className="p-8">
                  <div className="flex flex-col md:flex-row gap-8 items-center">
                    <div className="relative w-48 h-48 rounded-full overflow-hidden shadow-xl flex-shrink-0">
                      <Image
                        src="https://images.unsplash.com/photo-1506806732259-39c2d0268443"
                        alt="Founder"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="text-2xl font-semibold text-pink-500 mb-2">María Princess</h3>
                      <p className="text-gray-500 mb-4">Fundadora y Chef Pastelera</p>
                      <p className="text-gray-600 leading-relaxed mb-4">
                        María comenzó su viaje en el mundo de la repostería hace más de 15 años, impulsada por su
                        amor por crear experiencias dulces y memorables. Su pasión por la perfección y su ojo
                        para los detalles la han convertido en una referencia en el arte de la repostería
                        artesanal.
                      </p>
                      <p className="text-gray-600 leading-relaxed">
                        "Cada pastel, cada postre es una oportunidad para crear alegría. Me encanta ver las
                        sonrisas de mis clientes cuando ven sus creaciones hechas realidad."
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SobreNosotrosPage;