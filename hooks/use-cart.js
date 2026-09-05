'use client';

import { createContext, useContext, useEffect, useReducer } from 'react';

const CART_STORAGE_KEY = 'cp_cart';
const CartContext = createContext(null);

function cartReducer(state, action) {
  switch (action.type) {
    case 'HYDRATE':
      return action.items;

    case 'ADD_ITEM': {
      const existing = state.find((i) => i.productId === action.item.productId);
      if (existing) {
        return state.map((i) =>
          i.productId === action.item.productId
            ? { ...i, quantity: i.quantity + action.item.quantity }
            : i
        );
      }
      return [...state, action.item];
    }

    case 'UPDATE_QUANTITY':
      return state
        .map((i) => (i.productId === action.productId ? { ...i, quantity: action.quantity } : i))
        .filter((i) => i.quantity > 0);

    case 'REMOVE_ITEM':
      return state.filter((i) => i.productId !== action.productId);

    case 'CLEAR':
      return [];

    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [items, dispatch] = useReducer(cartReducer, []);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      if (stored) {
        dispatch({ type: 'HYDRATE', items: JSON.parse(stored) });
      }
    } catch {
      // localStorage no disponible o datos corruptos, seguimos con carrito vacío
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch {
      // ignorar si localStorage no está disponible
    }
  }, [items]);

  const addItem = (product, quantity = 1) => {
    dispatch({
      type: 'ADD_ITEM',
      item: {
        productId: product.id,
        name: product.name,
        image: product.images?.[0] || null,
        price: product.price,
        quantity,
      },
    });
  };

  const updateQuantity = (productId, quantity) => dispatch({ type: 'UPDATE_QUANTITY', productId, quantity });
  const removeItem = (productId) => dispatch({ type: 'REMOVE_ITEM', productId });
  const clearCart = () => dispatch({ type: 'CLEAR' });

  const count = items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addItem, updateQuantity, removeItem, clearCart, count, subtotal }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart debe usarse dentro de un CartProvider');
  }
  return context;
}
