'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import Lightbox from '@/components/Lightbox';

const GaleriaPage = () => {
  const [currentImage, setCurrentImage] = useState(null);
  const [loading, setLoading] = useState(true);

  const galleryImages = [
    'https://images.unsplash.com/photo-1620525429871-81919b5bd668',
    'https://images.unsplash.com/photo-1562054437-e9b315c0ff4f',
    'https://images.unsplash.com/photo-1727419912925-240f548f28f6',
    'https://images.pexels.com/photos/5864214/pexels-photo-5864214.jpeg',
    'https://images.pexels.com/photos/853006/pexels-photo-853006.jpeg',
    'https://images.unsplash.com/photo-1614707267537-b85aaf00c4b7',
    'https://images.unsplash.com/photo-1519869325930-281384150729',
    'https://images.unsplash.com/photo-1617201460038-6e5555a8a1f5',
    'https://images.unsplash.com/photo-1673555363891-a514a04fb91f',
    'https://images.unsplash.com/photo-1737700088028-fae0666feb83',
    'https://images.unsplash.com/photo-1761016324065-f28bd12961df',
    'https://images.unsplash.com/photo-1759240535632-9dd2fb02d323',
    'https://images.unsplash.com/photo-1618411640026-24e40dcde1ab',
    'https://images.unsplash.com/photo-1615283304245-c7c1c124e92a',
    'https://images.pexels.com/photos/34427807/pexels-photo-34427807.png',
  ];

  useEffect(() => {
    // Simulate loading
    setTimeout(() => setLoading(false), 500);
  }, []);

  const handleNext = () => {
    setCurrentImage((prev) => (prev + 1) % galleryImages.length);
  };

  const handlePrev = () => {
    setCurrentImage((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
  };

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
            <h1 className="text-5xl md:text-6xl font-cursive text-pink-500 mb-4">Galería</h1>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Explora nuestras creaciones más especiales. Cada imagen cuenta una historia de amor y dedicación
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
          ) : (
            <div className="columns-1 md:columns-2 lg:columns-3 gap-4 space-y-4">
              {galleryImages.map((image, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="break-inside-avoid cursor-pointer group relative overflow-hidden rounded-lg"
                  onClick={() => setCurrentImage(index)}
                >
                  <div className="relative">
                    <Image
                      src={image}
                      alt={`Gallery image ${index + 1}`}
                      width={600}
                      height={400}
                      className="w-full h-auto object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
                      <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 font-medium">
                        Click para ampliar
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      {currentImage !== null && (
        <Lightbox
          images={galleryImages}
          currentIndex={currentImage}
          onClose={() => setCurrentImage(null)}
          onNext={handleNext}
          onPrev={handlePrev}
        />
      )}
    </div>
  );
};

export default GaleriaPage;