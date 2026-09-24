'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Plus, Pencil, Trash2, Link2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import StatusBadge from '@/components/recetario/StatusBadge';

export default function AdminRecipesPage() {
  const { toast } = useToast();
  const [recipes, setRecipes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = () => {
    setLoading(true);
    Promise.all([fetch('/api/recipes').then((r) => r.json()), fetch('/api/recipe-categories').then((r) => r.json())])
      .then(([recipesData, categoriesData]) => {
        setRecipes(recipesData?.recipes || []);
        setCategories(categoriesData?.categories || []);
      })
      .finally(() => setLoading(false));
  };

  useEffect(loadData, []);

  const categoryName = (id) => categories.find((c) => c.id === id)?.name || '—';

  const handleDelete = async (recipe) => {
    if (!confirm(`¿Eliminar "${recipe.title}"? Esta acción no se puede deshacer.`)) return;

    const response = await fetch(`/api/recipes/${recipe.id}`, { method: 'DELETE' });
    if (response.ok) {
      toast({ title: 'Receta eliminada' });
      loadData();
    } else {
      toast({ title: 'Error al eliminar', variant: 'destructive' });
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Recetario</h1>
        <div className="flex gap-2">
          <Link href="/admin/recetario/importar">
            <Button variant="outline" className="border-pink-300 text-primary">
              <Link2 className="h-4 w-4 mr-2" />
              Importar desde enlace
            </Button>
          </Link>
          <Link href="/admin/recetario/nueva">
            <Button className="bg-gradient-to-r from-primary to-pink-500">
              <Plus className="h-4 w-4 mr-2" />
              Nueva receta
            </Button>
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-pink-100 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead></TableHead>
              <TableHead>Título</TableHead>
              <TableHead>Categoría</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Publicada</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                  Cargando...
                </TableCell>
              </TableRow>
            ) : recipes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                  No hay recetas todavía.
                </TableCell>
              </TableRow>
            ) : (
              recipes.map((recipe) => (
                <TableRow key={recipe.id}>
                  <TableCell>
                    <div className="relative h-12 w-12 rounded-md overflow-hidden bg-mint-50">
                      {recipe.image && <Image src={recipe.image} alt={recipe.title} fill className="object-cover" />}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{recipe.title}</TableCell>
                  <TableCell>{categoryName(recipe.categoryId)}</TableCell>
                  <TableCell>
                    <StatusBadge status={recipe.status} />
                  </TableCell>
                  <TableCell>
                    <Badge variant={recipe.published ? 'secondary' : 'outline'}>{recipe.published ? 'Sí' : 'No'}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2 justify-end">
                      <Link href={`/admin/recetario/${recipe.id}`}>
                        <Button variant="ghost" size="icon">
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(recipe)}>
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
