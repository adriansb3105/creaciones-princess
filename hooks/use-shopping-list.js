'use client';

import { createContext, useContext, useEffect, useReducer } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { normalizeIngredientName, sameIngredient, parseQuantity } from '@/lib/recipes/normalize';

const STORAGE_KEY = 'cp_shopping_list';
const ShoppingListContext = createContext(null);

function addIngredientToItems(items, ingredient, recipeTitle) {
  const parsedQuantity = parseQuantity(ingredient.quantity);
  const existing = items.find((item) => sameIngredient(item, ingredient));

  // Solo se combina con una fila existente si AMBAS cantidades son números
  // reales — si alguna es texto libre ("al gusto") se agrega aparte, nunca
  // se inventa una suma.
  if (existing && parsedQuantity !== null && existing.quantity !== null) {
    return items.map((item) =>
      item.id === existing.id
        ? {
            ...item,
            quantity: item.quantity + parsedQuantity,
            sources: recipeTitle && !item.sources.includes(recipeTitle) ? [...item.sources, recipeTitle] : item.sources,
          }
        : item
    );
  }

  return [
    ...items,
    {
      id: uuidv4(),
      name: ingredient.name,
      normalizedName: normalizeIngredientName(ingredient.name),
      unit: ingredient.unit || '',
      quantity: parsedQuantity,
      quantityLabel: parsedQuantity === null ? ingredient.quantity || '' : '',
      checked: false,
      note: '',
      sources: recipeTitle ? [recipeTitle] : [],
    },
  ];
}

function reducer(state, action) {
  switch (action.type) {
    case 'HYDRATE':
      return action.items;
    case 'ADD_INGREDIENT':
      return addIngredientToItems(state, action.ingredient, action.recipeTitle);
    case 'TOGGLE_CHECKED':
      return state.map((item) => (item.id === action.id ? { ...item, checked: !item.checked } : item));
    case 'UPDATE_ITEM':
      return state.map((item) => (item.id === action.id ? { ...item, ...action.updates } : item));
    case 'REMOVE_ITEM':
      return state.filter((item) => item.id !== action.id);
    case 'CLEAR_CHECKED':
      return state.filter((item) => !item.checked);
    case 'CLEAR_ALL':
      return [];
    default:
      return state;
  }
}

export function ShoppingListProvider({ children }) {
  const [items, dispatch] = useReducer(reducer, []);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) dispatch({ type: 'HYDRATE', items: JSON.parse(stored) });
    } catch {
      // localStorage no disponible o datos corruptos, seguimos con lista vacía
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // ignorar si localStorage no está disponible
    }
  }, [items]);

  const addIngredient = (ingredient, recipeTitle) => dispatch({ type: 'ADD_INGREDIENT', ingredient, recipeTitle });
  const addIngredients = (ingredients, recipeTitle) =>
    ingredients.forEach((ingredient) => dispatch({ type: 'ADD_INGREDIENT', ingredient, recipeTitle }));
  const toggleChecked = (id) => dispatch({ type: 'TOGGLE_CHECKED', id });
  const updateItem = (id, updates) => dispatch({ type: 'UPDATE_ITEM', id, updates });
  const removeItem = (id) => dispatch({ type: 'REMOVE_ITEM', id });
  const clearChecked = () => dispatch({ type: 'CLEAR_CHECKED' });
  const clearAll = () => dispatch({ type: 'CLEAR_ALL' });

  return (
    <ShoppingListContext.Provider
      value={{ items, addIngredient, addIngredients, toggleChecked, updateItem, removeItem, clearChecked, clearAll }}
    >
      {children}
    </ShoppingListContext.Provider>
  );
}

export function useShoppingList() {
  const context = useContext(ShoppingListContext);
  if (!context) {
    throw new Error('useShoppingList debe usarse dentro de un ShoppingListProvider');
  }
  return context;
}
