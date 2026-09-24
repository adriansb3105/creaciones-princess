'use client';

import { createContext, useContext, useEffect, useReducer } from 'react';

const FAVORITES_STORAGE_KEY = 'cp_recipe_favorites';
const FavoritesContext = createContext(null);

function reducer(state, action) {
  switch (action.type) {
    case 'HYDRATE':
      return action.ids;
    case 'TOGGLE':
      return state.includes(action.recipeId)
        ? state.filter((id) => id !== action.recipeId)
        : [...state, action.recipeId];
    default:
      return state;
  }
}

export function RecipeFavoritesProvider({ children }) {
  const [favoriteIds, dispatch] = useReducer(reducer, []);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(FAVORITES_STORAGE_KEY);
      if (stored) {
        dispatch({ type: 'HYDRATE', ids: JSON.parse(stored) });
      }
    } catch {
      // localStorage no disponible o datos corruptos, seguimos sin favoritos
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favoriteIds));
    } catch {
      // ignorar si localStorage no está disponible
    }
  }, [favoriteIds]);

  const toggleFavorite = (recipeId) => dispatch({ type: 'TOGGLE', recipeId });
  const isFavorite = (recipeId) => favoriteIds.includes(recipeId);

  return (
    <FavoritesContext.Provider value={{ favoriteIds, toggleFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useRecipeFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useRecipeFavorites debe usarse dentro de un RecipeFavoritesProvider');
  }
  return context;
}
