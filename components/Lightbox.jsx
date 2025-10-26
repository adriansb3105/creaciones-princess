'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Lightbox = ({ images, currentIndex, onClose, onNext, onPrev }) => {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onPrev();
      if (e.key === 'ArrowRight') onNext();
    };

    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'auto';
    };
  }, [onClose, onNext, onPrev]);

  if (currentIndex === null) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center"
        onClick={onClose}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white hover:text-pink-400 transition-colors z-10"
        >
          <X className="h-8 w-8" />
        </button>

        {/* Previous Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onPrev();
          }}
          className="absolute left-4 text-white hover:text-pink-400 transition-colors z-10"
        >
          <ChevronLeft className="h-12 w-12" />
        </button>

        {/* Image */}
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.8 }}
          className="relative max-w-5xl max-h-[90vh] mx-4"
          onClick={(e) => e.stopPropagation()}
        >
          <Image
            src={images[currentIndex]}
            alt={`Gallery image ${currentIndex + 1}`}
            width={1200}
            height={800}
            className="object-contain max-h-[90vh] w-auto"
          />
          <p className="text-white text-center mt-4">
            {currentIndex + 1} / {images.length}
          </p>
        </motion.div>

        {/* Next Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onNext();
          }}
          className="absolute right-4 text-white hover:text-pink-400 transition-colors z-10"
        >
          <ChevronRight className="h-12 w-12" />
        </button>
      </motion.div>
    </AnimatePresence>
  );
};

export default Lightbox;