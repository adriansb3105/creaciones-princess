'use client';

import { MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { WHATSAPP_PRIMARY_WA, buildWhatsAppLink } from '@/lib/constants';

const WhatsAppButton = () => {
  const href = buildWhatsAppLink(WHATSAPP_PRIMARY_WA, '¡Hola! Me gustaría hacer un pedido personalizado.');

  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-40 w-14 h-14 bg-green-500 rounded-full flex items-center justify-center shadow-lg hover:bg-green-600 transition-colors"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 1 }}
      aria-label="Escríbenos por WhatsApp"
    >
      <MessageCircle className="h-7 w-7 text-white" />
    </motion.a>
  );
};

export default WhatsAppButton;
