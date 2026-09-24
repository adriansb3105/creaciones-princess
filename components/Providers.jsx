'use client';

import { CartProvider } from '@/hooks/use-cart';
import { RecipeFavoritesProvider } from '@/hooks/use-recipe-favorites';
import { ShoppingListProvider } from '@/hooks/use-shopping-list';
import { Toaster } from '@/components/ui/toaster';

const Providers = ({ children }) => {
  return (
    <CartProvider>
      <RecipeFavoritesProvider>
        <ShoppingListProvider>
          {children}
          <Toaster />
        </ShoppingListProvider>
      </RecipeFavoritesProvider>
    </CartProvider>
  );
};

export default Providers;
