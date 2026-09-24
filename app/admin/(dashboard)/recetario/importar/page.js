'use client';

import { useEffect, useState } from 'react';
import { Search, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import RecipeForm from '@/components/admin/RecipeForm';
import { useToast } from '@/hooks/use-toast';

export default function ImportarRecetaPage() {
  const { toast } = useToast();
  const [categories, setCategories] = useState([]);
  const [url, setUrl] = useState('');
  const [pastedText, setPastedText] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    fetch('/api/recipe-categories')
      .then((r) => r.json())
      .then((data) => setCategories(data?.categories || []))
      .catch(() => setCategories([]));
  }, []);

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!url.trim() && !pastedText.trim()) {
      toast({ title: 'Pega un enlace o un texto para analizar', variant: 'destructive' });
      return;
    }

    setAnalyzing(true);
    try {
      const response = await fetch('/api/admin/recipes/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: url.trim(), pastedText: pastedText.trim() }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'No se pudo analizar');
      setResult(data);

      const { ingredients, steps } = data.parsed;
      if (ingredients.length === 0 && steps.length === 0) {
        toast({
          title: 'No se detectó nada automáticamente',
          description: 'Completa ingredientes y pasos a mano abajo.',
        });
      } else {
        toast({ title: 'Analizado', description: `${ingredients.length} ingredientes y ${steps.length} pasos detectados — revísalos abajo` });
      }
    } catch (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } finally {
      setAnalyzing(false);
    }
  };

  if (!result) {
    return (
      <div>
        <h1 className="text-2xl font-semibold text-gray-800 mb-2">Importar receta</h1>
        <p className="text-gray-500 mb-6 max-w-2xl">
          Pega el enlace del video/publicación y/o el texto (descripción, transcripción). El sistema intenta separar
          ingredientes y pasos automáticamente — vos revisás y editás todo antes de guardar. Nunca se inventa
          información: lo que no se reconoce queda aparte para que lo completes a mano.
        </p>

        <Card className="border-pink-100 max-w-2xl">
          <CardContent className="p-6">
            <form onSubmit={handleAnalyze} className="space-y-4">
              <div>
                <Label htmlFor="url">Enlace (YouTube, TikTok, Instagram, Facebook) — opcional</Label>
                <div className="flex gap-2 mt-1">
                  <Input id="url" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://..." />
                </div>
              </div>
              <div>
                <Label htmlFor="pastedText">Texto (descripción / transcripción) — opcional</Label>
                <Textarea
                  id="pastedText"
                  rows={8}
                  value={pastedText}
                  onChange={(e) => setPastedText(e.target.value)}
                  className="mt-1"
                  placeholder={'Ingredientes:\n2 tazas de harina\n1 huevo\n\nPreparación:\n1. Mezclar todo\n2. Hornear 20 minutos'}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Funciona mejor si el texto tiene encabezados "Ingredientes:" / "Preparación:", o líneas que empiezan
                  con una cantidad ("2 tazas de harina") y pasos numerados ("1. Mezclar todo").
                </p>
              </div>
              <Button type="submit" disabled={analyzing} className="bg-gradient-to-r from-primary to-pink-500">
                {analyzing ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Search className="h-4 w-4 mr-2" />}
                Analizar
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  const draft = {
    title: result.metadata?.title || '',
    image: result.metadata?.thumbnail || '',
    source: {
      url,
      platform: result.metadata?.platform || null,
      author: result.metadata?.author || null,
      thumbnail: result.metadata?.thumbnail || null,
      textSource: result.job?.textSource || null,
      rawText: result.sourceText || '',
    },
    ingredients: result.parsed.ingredients,
    steps: result.parsed.steps,
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-800 mb-2">Revisar receta importada</h1>
      <p className="text-gray-500 mb-6 max-w-2xl">
        Revisá cada ingrediente/paso contra el texto de la fuente (abajo, en el formulario), corrige lo que haga falta
        y completa lo que falte antes de guardar.
      </p>

      {result.parsed.unclassified.length > 0 && (
        <Card className="border-amber-200 bg-amber-50/50 max-w-3xl mb-6">
          <CardContent className="p-4">
            <p className="text-sm font-medium text-amber-800 flex items-center gap-2 mb-2">
              <AlertCircle className="h-4 w-4" />
              Texto sin clasificar (no se pudo reconocer como ingrediente ni paso)
            </p>
            <ul className="text-sm text-amber-700 space-y-1 list-disc list-inside">
              {result.parsed.unclassified.map((line, i) => (
                <li key={i}>{line}</li>
              ))}
            </ul>
            <p className="text-xs text-amber-600 mt-2">
              Cópialas manualmente a un ingrediente o paso abajo si corresponde.
            </p>
          </CardContent>
        </Card>
      )}

      <RecipeForm recipe={draft} categories={categories} />
    </div>
  );
}
