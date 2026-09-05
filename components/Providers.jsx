'use client';

import { CartProvider } from '@/hooks/use-cart';
import { Toaster } from '@/components/ui/toaster';

const Providers = ({ children }) => {
  return (
    <CartProvider>
      {children}
      <Toaster />
    </CartProvider>
  );
};

export default Providers;
