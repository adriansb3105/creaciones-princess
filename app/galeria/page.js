'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { PlayCircle } from 'lucide-react';
import Lightbox from '@/components/Lightbox';

const GaleriaPage = () => {
  const [items, setItems] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/gallery')
      .then((r) => r.json())
      .then((data) => setItems(data?.items || []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  const handleNext = () => setCurrentIndex((prev) => (prev + 1) % items.length);
  const handlePrev = () => setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-pink-50 via-mint-50 to-pink-50 py-20">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
            <h1 className="text-5xl md:text-6xl font-cursive text-primary mb-4">Galería</h1>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Explora nuestras creaciones más especiales. Cada imagen y video cuenta una historia de amor y dedicación
            </p>
          </motion.div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="text-center py-20">
              <p className="text-gray-600 text-lg">Cargando galería...</p>
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-600 text-lg">Muy pronto compartiremos nuestras creaciones aquí</p>
            </div>
          ) : (
            <div className="columns-1 md:columns-2 lg:columns-3 gap-4 space-y-4">
              {items.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="break-inside-avoid cursor-pointer group relative overflow-hidden rounded-lg"
                  onClick={() => setCurrentIndex(index)}
                >
                  <div className="relative">
                    <Image
                      src={item.type === 'video' ? `https://img.youtube.com/vi/${item.youtubeVideoId}/hqdefault.jpg` : item.url}
                      alt={item.caption || `Galería ${index + 1}`}
                      width={600}
                      height={400}
                      className="w-full h-auto object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
                      {item.type === 'video' ? (
                        <PlayCircle className="h-14 w-14 text-white/90 group-hover:scale-110 transition-transform duration-300" />
                      ) : (
                        <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 font-medium">
                          Click para ampliar
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      {currentIndex !== null && (
        <Lightbox
          images={items}
          currentIndex={currentIndex}
          onClose={() => setCurrentIndex(null)}
          onNext={handleNext}
          onPrev={handlePrev}
        />
      )}
    </div>
  );
};

export default GaleriaPage;
