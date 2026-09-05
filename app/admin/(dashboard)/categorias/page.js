'use client';

import { useEffect, useState } from 'react';
import { Plus, Save, Trash2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import CloudinaryUploader from '@/components/admin/CloudinaryUploader';
import { useToast } from '@/hooks/use-toast';

function CategoryCard({ category, onChanged }) {
  const { toast } = useToast();
  const [name, setName] = useState(category.name);
  const [description, setDescription] = useState(category.description || '');
  const [image, setImage] = useState(category.image || '');
  const [newSubName, setNewSubName] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch(`/api/categories/${category.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description, image }),
      });
      if (!response.ok) throw new Error('No se pudo guardar');
      toast({ title: 'Categoría actualizada' });
      onChanged();
    } catch (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteCategory = async () => {
    if (!confirm(`¿Eliminar la categoría "${category.name}"?`)) return;
    const response = await fetch(`/api/categories/${category.id}`, { method: 'DELETE' });
    const data = await response.json();
    if (!response.ok) {
      toast({ title: 'No se pudo eliminar', description: data.error, variant: 'destructive' });
      return;
    }
    toast({ title: 'Categoría eliminada' });
    onChanged();
  };

  const handleAddSubcategory = async (e) => {
    e.preventDefault();
    if (!newSubName.trim()) return;
    const response = await fetch(`/api/categories/${category.id}/subcategories`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newSubName }),
    });
    if (response.ok) {
      setNewSubName('');
      onChanged();
    } else {
      toast({ title: 'No se pudo agregar la subcategoría', variant: 'destructive' });
    }
  };

  const handleDeleteSubcategory = async (subId, subName) => {
    if (!confirm(`¿Eliminar la subcategoría "${subName}"?`)) return;
    const response = await fetch(`/api/categories/${category.id}/subcategories/${subId}`, { method: 'DELETE' });
    const data = await response.json();
    if (!response.ok) {
      toast({ title: 'No se pudo eliminar', description: data.error, variant: 'destructive' });
      return;
    }
    onChanged();
  };

  return (
    <Card className="border-pink-100">
      <CardContent className="p-6 space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 space-y-3">
            <div>
              <Label>Nombre</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} className="mt-1" />
            </div>
            <div>
              <Label>Descripción</Label>
              <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} className="mt-1" />
            </div>
          </div>
          <div>
            <Label>Imagen</Label>
            <div className="mt-1">
              <CloudinaryUploader images={image ? [image] : []} onChange={(imgs) => setImage(imgs[0] || '')} multiple={false} />
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <Button size="sm" onClick={handleSave} disabled={saving} className="bg-gradient-to-r from-primary to-pink-500">
            <Save className="h-4 w-4 mr-2" />
            Guardar
          </Button>
          <Button size="sm" variant="outline" onClick={handleDeleteCategory} className="border-red-200 text-red-500">
            <Trash2 className="h-4 w-4 mr-2" />
            Eliminar categoría
          </Button>
        </div>

        <div className="pt-2 border-t">
          <p className="text-sm font-medium text-gray-700 mb-2">Subcategorías</p>
          <div className="flex flex-wrap gap-2 mb-3">
            {category.subcategories?.map((sub) => (
              <Badge key={sub.id} variant="secondary" className="pl-3 pr-1 py-1 flex items-center gap-1">
                {sub.name}
                <button onClick={() => handleDeleteSubcategory(sub.id, sub.name)} className="hover:text-red-500">
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
            {(!category.subcategories || category.subcategories.length === 0) && (
              <span className="text-sm text-gray-400">Sin subcategorías</span>
            )}
          </div>
          <form onSubmit={handleAddSubcategory} className="flex gap-2">
            <Input
              value={newSubName}
              onChange={(e) => setNewSubName(e.target.value)}
              placeholder="Nueva subcategoría"
              className="max-w-xs"
            />
            <Button type="submit" size="sm" variant="outline">
              <Plus className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </CardContent>
    </Card>
  );
}

export default function AdminCategoriesPage() {
  const { toast } = useToast();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newCategoryName, setNewCategoryName] = useState('');

  const loadCategories = () => {
    fetch('/api/categories')
      .then((r) => r.json())
      .then((data) => setCategories(data?.categories || []))
      .finally(() => setLoading(false));
  };

  useEffect(loadCategories, []);

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    const response = await fetch('/api/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newCategoryName }),
    });
    if (response.ok) {
      setNewCategoryName('');
      loadCategories();
    } else {
      toast({ title: 'No se pudo crear la categoría', variant: 'destructive' });
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">Categorías</h1>

      <Card className="border-pink-100 mb-6">
        <CardContent className="p-6">
          <form onSubmit={handleCreateCategory} className="flex gap-2">
            <Input
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="Nombre de la nueva categoría"
            />
            <Button type="submit" className="bg-gradient-to-r from-primary to-pink-500">
              <Plus className="h-4 w-4 mr-2" />
              Crear
            </Button>
          </form>
        </CardContent>
      </Card>

      {loading ? (
        <p className="text-gray-500">Cargando...</p>
      ) : (
        <div className="space-y-4">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} onChanged={loadCategories} />
          ))}
        </div>
      )}
    </div>
  );
}
