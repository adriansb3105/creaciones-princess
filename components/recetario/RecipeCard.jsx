'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Heart, Clock, ChefHat } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useRecipeFavorites } from '@/hooks/use-recipe-favorites';
import { DIFFICULTY_LABELS } from '@/lib/recipes/constants';
import { cn } from '@/lib/utils';

const RecipeCard = ({ recipe, categoryName }) => {
  const { isFavorite, toggleFavorite } = useRecipeFavorites();
  const favorite = isFavorite(recipe.id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <Card className="relative overflow-hidden hover:shadow-xl transition-shadow duration-300 border-pink-100 h-full flex flex-col">
        <Link href={`/recetario/receta/${recipe.slug}`}>
          <div className="relative h-48 overflow-hidden group">
            {recipe.image ? (
              <Image
                src={recipe.image}
                alt={recipe.title}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-300"
              />
            ) : (
              <div className="w-full h-full bg-mint-50" />
            )}
          </div>
        </Link>
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            toggleFavorite(recipe.id);
          }}
          className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow hover:scale-110 transition-transform"
          aria-label={favorite ? 'Quitar de favoritas' : 'Agregar a favoritas'}
        >
          <Heart className={cn('h-4 w-4', favorite ? 'fill-primary text-primary' : 'text-gray-400')} />
        </button>

        <CardContent className="p-5 flex flex-col flex-1">
          {categoryName && (
            <span className="text-xs font-medium text-primary bg-pink-50 px-3 py-1 rounded-full w-fit mb-2">
              {categoryName}
            </span>
          )}
          <Link href={`/recetario/receta/${recipe.slug}`}>
            <h3 className="text-lg font-semibold text-gray-800 mb-2 hover:text-primary transition-colors line-clamp-2">
              {recipe.title}
            </h3>
          </Link>
          <div className="flex items-center gap-4 text-sm text-gray-500 mt-auto pt-2">
            {recipe.totalMinutes ? (
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {recipe.totalMinutes} min
              </span>
            ) : null}
            {recipe.difficulty && (
              <span className="flex items-center gap-1">
                <ChefHat className="h-3.5 w-3.5" />
                {DIFFICULTY_LABELS[recipe.difficulty] || recipe.difficulty}
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default RecipeCard;
