'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Plus, Trash2, PlayCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import CloudinaryUploader from '@/components/admin/CloudinaryUploader';
import { useToast } from '@/hooks/use-toast';

export default function AdminGalleryPage() {
  const { toast } = useToast();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [type, setType] = useState('image');
  const [image, setImage] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [caption, setCaption] = useState('');
  const [saving, setSaving] = useState(false);

  const loadItems = () => {
    fetch('/api/gallery')
      .then((r) => r.json())
      .then((data) => setItems(data?.items || []))
      .finally(() => setLoading(false));
  };

  useEffect(loadItems, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const response = await fetch('/api/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, url: image, youtubeUrl, caption }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'No se pudo agregar');
      setImage('');
      setYoutubeUrl('');
      setCaption('');
      loadItems();
      toast({ title: 'Agregado a la galería' });
    } catch (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar este elemento de la galería?')) return;
    const response = await fetch(`/api/gallery/${id}`, { method: 'DELETE' });
    if (response.ok) loadItems();
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">Galería</h1>

      <Card className="border-pink-100 mb-8 max-w-xl">
        <CardContent className="p-6 space-y-4">
          <RadioGroup value={type} onValueChange={setType} className="flex gap-6">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="image" id="type-image" />
              <Label htmlFor="type-image">Imagen</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="video" id="type-video" />
              <Label htmlFor="type-video">Video de YouTube</Label>
            </div>
          </RadioGroup>

          {type === 'image' ? (
            <div>
              <Label>Imagen</Label>
              <div className="mt-1">
                <CloudinaryUploader images={image ? [image] : []} onChange={(imgs) => setImage(imgs[0] || '')} multiple={false} />
              </div>
            </div>
          ) : (
            <div>
              <Label htmlFor="youtubeUrl">URL de YouTube</Label>
              <Input
                id="youtubeUrl"
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                className="mt-1"
              />
            </div>
          )}

          <div>
            <Label htmlFor="caption">Descripción (opcional)</Label>
            <Input id="caption" value={caption} onChange={(e) => setCaption(e.target.value)} className="mt-1" />
          </div>

          <Button onClick={handleAdd} disabled={saving} className="bg-gradient-to-r from-primary to-pink-500">
            <Plus className="h-4 w-4 mr-2" />
            Agregar a la galería
          </Button>
        </CardContent>
      </Card>

      {loading ? (
        <p className="text-gray-500">Cargando...</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {items.map((item) => (
            <div key={item.id} className="relative group rounded-lg overflow-hidden border border-pink-100 h-32">
              <Image
                src={item.type === 'video' ? `https://img.youtube.com/vi/${item.youtubeVideoId}/hqdefault.jpg` : item.url}
                alt={item.caption || 'Galería'}
                fill
                className="object-cover"
              />
              {item.type === 'video' && (
                <PlayCircle className="absolute inset-0 m-auto h-8 w-8 text-white/90" />
              )}
              <button
                onClick={() => handleDelete(item.id)}
                className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
