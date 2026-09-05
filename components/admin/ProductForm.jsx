'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import CloudinaryUploader from '@/components/admin/CloudinaryUploader';
import { useToast } from '@/hooks/use-toast';
import { getYouTubeId } from '@/lib/utils';

const ProductForm = ({ product, categories }) => {
  const router = useRouter();
  const { toast } = useToast();
  const isEditing = Boolean(product);

  const [form, setForm] = useState({
    name: product?.name || '',
    description: product?.description || '',
    price: product?.price || '',
    categoryId: product?.categoryId || '',
    subcategoryId: product?.subcategoryId || '',
    images: product?.images || [],
    youtubeUrl: product?.youtubeVideoId || '',
    availabilityNote: product?.availabilityNote || '',
    featured: product?.featured || false,
    active: product?.active === undefined ? true : product.active,
  });
  const [saving, setSaving] = useState(false);

  const selectedCategory = categories.find((c) => c.id === form.categoryId);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const payload = {
        name: form.name,
        description: form.description,
        price: Number(form.price),
        categoryId: form.categoryId,
        subcategoryId: form.subcategoryId || null,
        images: form.images,
        youtubeVideoId: getYouTubeId(form.youtubeUrl),
        availabilityNote: form.availabilityNote,
        featured: form.featured,
        active: form.active,
      };

      const response = await fetch(isEditing ? `/api/products/${product.id}` : '/api/products', {
        method: isEditing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'No se pudo guardar el producto');
      }

      toast({ title: isEditing ? 'Producto actualizado' : 'Producto creado' });
      router.push('/admin/productos');
      router.refresh();
    } catch (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      <Card className="border-pink-100">
        <CardContent className="p-6 space-y-4">
          <div>
            <Label htmlFor="name">Nombre *</Label>
            <Input id="name" required value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} className="mt-1" />
          </div>

          <div>
            <Label htmlFor="description">Descripción *</Label>
            <Textarea
              id="description"
              required
              rows={4}
              value={form.description}
              onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
              className="mt-1"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="price">Precio (₡) *</Label>
              <Input
                id="price"
                type="number"
                min="0"
                required
                value={form.price}
                onChange={(e) => setForm((p) => ({ ...p, price: e.target.value }))}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="availabilityNote">Nota de disponibilidad</Label>
              <Input
                id="availabilityNote"
                value={form.availabilityNote}
                onChange={(e) => setForm((p) => ({ ...p, availabilityNote: e.target.value }))}
                className="mt-1"
                placeholder="Ej: Bajo pedido, 3 días"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Categoría *</Label>
              <Select
                value={form.categoryId}
                onValueChange={(value) => setForm((p) => ({ ...p, categoryId: value, subcategoryId: '' }))}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Selecciona una categoría" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Subcategoría</Label>
              <Select
                value={form.subcategoryId}
                onValueChange={(value) => setForm((p) => ({ ...p, subcategoryId: value }))}
                disabled={!selectedCategory?.subcategories?.length}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Ninguna" />
                </SelectTrigger>
                <SelectContent>
                  {selectedCategory?.subcategories?.map((sub) => (
                    <SelectItem key={sub.id} value={sub.id}>
                      {sub.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="youtubeUrl">Video de YouTube (opcional)</Label>
            <Input
              id="youtubeUrl"
              value={form.youtubeUrl}
              onChange={(e) => setForm((p) => ({ ...p, youtubeUrl: e.target.value }))}
              className="mt-1"
              placeholder="https://www.youtube.com/watch?v=..."
            />
          </div>

          <div>
            <Label>Imágenes</Label>
            <div className="mt-1">
              <CloudinaryUploader images={form.images} onChange={(images) => setForm((p) => ({ ...p, images }))} />
            </div>
          </div>

          <div className="flex items-center gap-8 pt-2">
            <div className="flex items-center gap-2">
              <Switch checked={form.featured} onCheckedChange={(v) => setForm((p) => ({ ...p, featured: v }))} />
              <Label>Destacado</Label>
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={form.active} onCheckedChange={(v) => setForm((p) => ({ ...p, active: v }))} />
              <Label>Activo (visible en la tienda)</Label>
            </div>
          </div>
        </CardContent>
      </Card>

      <Button type="submit" disabled={saving} className="bg-gradient-to-r from-primary to-pink-500">
        {saving ? 'Guardando...' : isEditing ? 'Guardar cambios' : 'Crear producto'}
      </Button>
    </form>
  );
};

export default ProductForm;
