'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Heart, Instagram, Facebook, Loader2, CheckCircle2, XCircle, Clock, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import CloudinaryUploader from '@/components/admin/CloudinaryUploader';
import { useToast } from '@/hooks/use-toast';

function ResultRow({ icon: Icon, label, result, onRetry }) {
  const statusConfig = {
    skipped: { icon: null, text: 'No seleccionado', color: 'text-gray-400' },
    pending: { icon: Loader2, text: 'Publicando...', color: 'text-mint-600', spin: true },
    processing: { icon: Clock, text: 'Instagram sigue procesando el video', color: 'text-amber-600' },
    success: { icon: CheckCircle2, text: 'Publicado', color: 'text-mint-600' },
    error: { icon: XCircle, text: result?.error || 'Error', color: 'text-red-500' },
  };
  const config = statusConfig[result?.status] || statusConfig.skipped;
  const StatusIcon = config.icon;

  return (
    <div className="flex items-center gap-3 py-2">
      <Icon className="h-5 w-5 text-gray-500 flex-shrink-0" />
      <span className="font-medium text-gray-700 w-20 flex-shrink-0">{label}</span>
      <span className={`flex items-center gap-1.5 text-sm ${config.color}`}>
        {StatusIcon && <StatusIcon className={`h-4 w-4 ${config.spin ? 'animate-spin' : ''}`} />}
        {result?.status === 'success' && result?.permalink ? (
          <a href={result.permalink} target="_blank" rel="noopener noreferrer" className="underline">
            Ver publicación
          </a>
        ) : (
          config.text
        )}
      </span>
      {result?.status === 'processing' && (
        <Button size="sm" variant="outline" onClick={onRetry} className="ml-auto">
          <RefreshCw className="h-3 w-3 mr-1" />
          Reintentar
        </Button>
      )}
    </div>
  );
}

export default function PublicarPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [products, setProducts] = useState([]);
  const [productId, setProductId] = useState('');
  const [caption, setCaption] = useState('');
  const [images, setImages] = useState([]);
  const [videoUrl, setVideoUrl] = useState('');
  const [postToInstagram, setPostToInstagram] = useState(true);
  const [postToFacebook, setPostToFacebook] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    fetch('/api/admin/me')
      .then((r) => {
        if (!r.ok) router.push('/admin/login');
        return r.ok;
      })
      .finally(() => setCheckingAuth(false));

    fetch('/api/products')
      .then((r) => r.json())
      .then((data) => setProducts(data?.products || []))
      .catch(() => setProducts([]));
  }, [router]);

  const selectedProduct = products.find((p) => p.id === productId);

  const handleSuggestCaption = () => {
    if (!selectedProduct) return;
    setCaption(`${selectedProduct.name} 💕\n\n${selectedProduct.description}\n\n¡Pedidos por WhatsApp!`);
  };

  const resetForm = () => {
    setProductId('');
    setCaption('');
    setImages([]);
    setVideoUrl('');
    setResult(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (images.length === 0 && !videoUrl) {
      toast({ title: 'Agrega al menos una foto o un video', variant: 'destructive' });
      return;
    }

    setSubmitting(true);
    setResult(null);
    try {
      const response = await fetch('/api/social/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: productId || null,
          productName: selectedProduct?.name || '',
          images,
          videoUrl: videoUrl || null,
          caption,
          targets: { instagram: postToInstagram, facebook: postToFacebook },
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'No se pudo publicar');
      setResult(data.post);
    } catch (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleRetryInstagram = async () => {
    if (!result) return;
    const response = await fetch(`/api/social/publish/${result.id}/retry-instagram`, { method: 'POST' });
    const data = await response.json();
    if (response.ok) {
      setResult((prev) => ({ ...prev, results: { ...prev.results, instagram: data.instagram } }));
    } else {
      toast({ title: 'Error', description: data.error, variant: 'destructive' });
    }
  };

  if (checkingAuth) {
    return <div className="min-h-screen flex items-center justify-center text-gray-500">Cargando...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-mint-50 to-pink-50 py-8 px-4">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-6">
          <Heart className="h-8 w-8 text-primary fill-primary mx-auto mb-1" />
          <h1 className="text-2xl font-cursive text-primary">Publicar entrega</h1>
          <p className="text-sm text-gray-500">Sube fotos y video — se publica en la web, Instagram y Facebook</p>
        </div>

        {result ? (
          <Card className="border-pink-100">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 text-mint-700 font-medium mb-4">
                <CheckCircle2 className="h-5 w-5" />
                Guardado en el sitio web
              </div>
              <div className="divide-y">
                <ResultRow icon={Instagram} label="Instagram" result={result.results.instagram} onRetry={handleRetryInstagram} />
                <ResultRow icon={Facebook} label="Facebook" result={result.results.facebook} />
              </div>
              <Button onClick={resetForm} className="w-full mt-6 bg-gradient-to-r from-primary to-pink-500">
                Publicar otra entrega
              </Button>
            </CardContent>
          </Card>
        ) : (
          <form onSubmit={handleSubmit}>
            <Card className="border-pink-100">
              <CardContent className="p-6 space-y-5">
                <div>
                  <Label>Producto (opcional)</Label>
                  <Select value={productId} onValueChange={setProductId}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Sin producto específico" />
                    </SelectTrigger>
                    <SelectContent>
                      {products.map((p) => (
                        <SelectItem key={p.id} value={p.id}>
                          {p.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Fotos</Label>
                  <div className="mt-1">
                    <CloudinaryUploader images={images} onChange={setImages} multiple resourceType="image" />
                  </div>
                </div>

                <div>
                  <Label>Video (opcional)</Label>
                  <div className="mt-1">
                    <CloudinaryUploader
                      images={videoUrl ? [videoUrl] : []}
                      onChange={(vids) => setVideoUrl(vids[0] || '')}
                      multiple={false}
                      resourceType="video"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <Label htmlFor="caption">Descripción</Label>
                    {selectedProduct && (
                      <button type="button" onClick={handleSuggestCaption} className="text-xs text-primary underline">
                        Sugerir texto
                      </button>
                    )}
                  </div>
                  <Textarea
                    id="caption"
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    rows={5}
                    placeholder="Escribe la descripción para las publicaciones..."
                  />
                </div>

                <div className="space-y-3 pt-2 border-t">
                  <div className="flex items-center justify-between">
                    <Label className="flex items-center gap-2">
                      <Instagram className="h-4 w-4" /> Instagram
                    </Label>
                    <Switch checked={postToInstagram} onCheckedChange={setPostToInstagram} />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="flex items-center gap-2">
                      <Facebook className="h-4 w-4" /> Facebook
                    </Label>
                    <Switch checked={postToFacebook} onCheckedChange={setPostToFacebook} />
                  </div>
                </div>

                <Button type="submit" size="lg" disabled={submitting} className="w-full bg-gradient-to-r from-primary to-pink-500">
                  {submitting ? 'Publicando...' : 'Publicar'}
                </Button>
              </CardContent>
            </Card>
          </form>
        )}
      </div>
    </div>
  );
}
