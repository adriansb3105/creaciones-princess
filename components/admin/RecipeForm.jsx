'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Trash2, Search, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import CloudinaryUploader from '@/components/admin/CloudinaryUploader';
import { useToast } from '@/hooks/use-toast';
import { DIFFICULTY_OPTIONS, COOKING_METHOD_OPTIONS, INGREDIENT_ORIGIN_LABELS } from '@/lib/recipes/constants';
import { RECIPE_STATUSES, RECIPE_STATUS_LABELS } from '@/lib/recipes/status';
import { PLATFORM_LABELS } from '@/lib/recipes/platforms';

const RecipeForm = ({ recipe, categories }) => {
  const router = useRouter();
  const { toast } = useToast();
  // `recipe` puede venir sin `id` como borrador prellenado desde /admin/recetario/importar
  // (ahí SÍ debe crear con POST, no intentar un PUT a un id inexistente).
  const isEditing = Boolean(recipe?.id);

  const [form, setForm] = useState({
    title: recipe?.title || '',
    description: recipe?.description || '',
    categoryId: recipe?.categoryId || '',
    image: recipe?.image || '',
    servings: recipe?.servings || '',
    prepMinutes: recipe?.prepMinutes || '',
    cookMinutes: recipe?.cookMinutes || '',
    difficulty: recipe?.difficulty || '',
    cookingMethods: recipe?.cookingMethods || [],
    notes: recipe?.notes || '',
    published: recipe?.published || false,
    status: recipe?.status || 'borrador',
    source: {
      url: recipe?.source?.url || '',
      platform: recipe?.source?.platform || null,
      author: recipe?.source?.author || null,
      thumbnail: recipe?.source?.thumbnail || null,
      textSource: recipe?.source?.textSource || null,
      rawText: recipe?.source?.rawText || '',
    },
    ingredients: recipe?.ingredients?.length
      ? recipe.ingredients.map((i) => ({
          name: i.name,
          quantity: i.quantity ?? '',
          unit: i.unit || '',
          optional: i.optional || false,
          origin: i.origin || 'manual',
          evidence: i.evidence || null,
          reviewed: Boolean(i.reviewed),
        }))
      : [{ name: '', quantity: '', unit: '', optional: false, origin: 'manual', evidence: null, reviewed: true }],
    steps: recipe?.steps?.length
      ? recipe.steps.map((s) => ({ text: s.text, origin: s.origin || 'manual', evidence: s.evidence || null, reviewed: Boolean(s.reviewed) }))
      : [{ text: '', origin: 'manual', evidence: null, reviewed: true }],
  });
  const [saving, setSaving] = useState(false);
  const [detecting, setDetecting] = useState(false);
  const [confirmReviewed, setConfirmReviewed] = useState(false);

  const updateField = (field, value) => setForm((p) => ({ ...p, [field]: value }));

  const toggleCookingMethod = (value) => {
    setForm((p) => ({
      ...p,
      cookingMethods: p.cookingMethods.includes(value)
        ? p.cookingMethods.filter((m) => m !== value)
        : [...p.cookingMethods, value],
    }));
  };

  const handleDetect = async () => {
    if (!form.source.url) return;
    setDetecting(true);
    try {
      const response = await fetch('/api/admin/recipes/detect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: form.source.url }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'No se pudo detectar la fuente');

      const meta = data.metadata;
      setForm((p) => ({
        ...p,
        title: p.title || meta.title || '',
        image: p.image || meta.thumbnail || '',
        source: {
          url: p.source.url,
          platform: meta.platform,
          author: meta.author,
          thumbnail: meta.thumbnail,
          textSource: meta.textSource,
          rawText: meta.rawText || '',
        },
      }));

      if (meta.textSource === 'no_disponible') {
        toast({
          title: 'No se pudo traer texto automáticamente',
          description: 'Pega manualmente la descripción/transcripción abajo y completa ingredientes y pasos.',
        });
      } else {
        toast({ title: 'Detectado', description: `Plataforma: ${PLATFORM_LABELS[meta.platform] || meta.platform}` });
      }
    } catch (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } finally {
      setDetecting(false);
    }
  };

  // Ingredientes
  const addIngredient = () =>
    setForm((p) => ({
      ...p,
      ingredients: [...p.ingredients, { name: '', quantity: '', unit: '', optional: false, origin: 'manual', evidence: null, reviewed: true }],
    }));
  const removeIngredient = (index) => setForm((p) => ({ ...p, ingredients: p.ingredients.filter((_, i) => i !== index) }));
  const updateIngredient = (index, field, value) =>
    setForm((p) => ({ ...p, ingredients: p.ingredients.map((ing, i) => (i === index ? { ...ing, [field]: value } : ing)) }));

  // Pasos
  const addStep = () =>
    setForm((p) => ({ ...p, steps: [...p.steps, { text: '', origin: 'manual', evidence: null, reviewed: true }] }));
  const removeStep = (index) => setForm((p) => ({ ...p, steps: p.steps.filter((_, i) => i !== index) }));
  const updateStep = (index, value) =>
    setForm((p) => ({ ...p, steps: p.steps.map((s, i) => (i === index ? { ...s, text: value } : s)) }));

  // Hay ingredientes/pasos que vinieron de una detección automática y todavía
  // nadie confirmó haberlos revisado contra la fuente.
  const hasUnreviewedImported =
    form.ingredients.some((i) => i.origin !== 'manual' && !i.reviewed) || form.steps.some((s) => s.origin !== 'manual' && !s.reviewed);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const payload = {
        title: form.title,
        description: form.description,
        categoryId: form.categoryId,
        image: form.image,
        servings: form.servings || null,
        prepMinutes: form.prepMinutes || null,
        cookMinutes: form.cookMinutes || null,
        difficulty: form.difficulty || null,
        cookingMethods: form.cookingMethods,
        notes: form.notes,
        published: form.published,
        source: form.source,
        ingredients: form.ingredients
          .filter((i) => i.name.trim())
          .map((i) => (confirmReviewed && i.origin !== 'manual' ? { ...i, reviewed: true } : i)),
        steps: form.steps
          .filter((s) => s.text.trim())
          .map((s) => (confirmReviewed && s.origin !== 'manual' ? { ...s, reviewed: true } : s)),
      };
      if (isEditing) payload.status = form.status;

      const response = await fetch(isEditing ? `/api/recipes/${recipe.id}` : '/api/recipes', {
        method: isEditing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'No se pudo guardar la receta');
      }

      toast({ title: isEditing ? 'Receta actualizada' : 'Receta creada' });
      router.push('/admin/recetario');
      router.refresh();
    } catch (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
      {/* Fuente */}
      <Card className="border-pink-100">
        <CardContent className="p-6 space-y-3">
          <Label htmlFor="sourceUrl">Enlace de origen (YouTube, TikTok, Instagram, Facebook)</Label>
          <div className="flex gap-2">
            <Input
              id="sourceUrl"
              value={form.source.url}
              onChange={(e) => updateField('source', { ...form.source, url: e.target.value })}
              placeholder="https://..."
            />
            <Button type="button" variant="outline" onClick={handleDetect} disabled={detecting || !form.source.url}>
              {detecting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
            </Button>
          </div>
          {form.source.platform && (
            <p className="text-xs text-gray-500">
              Plataforma: {PLATFORM_LABELS[form.source.platform] || form.source.platform}
              {form.source.author ? ` · ${form.source.author}` : ''}
            </p>
          )}
          <div>
            <Label htmlFor="rawText">Texto de la fuente (descripción/transcripción — pégalo si no se detectó solo)</Label>
            <Textarea
              id="rawText"
              rows={4}
              value={form.source.rawText}
              onChange={(e) => updateField('source', { ...form.source, rawText: e.target.value, textSource: e.target.value ? 'manual' : form.source.textSource })}
              className="mt-1"
              placeholder="Pega aquí la descripción del video o la transcripción para copiar ingredientes y pasos abajo"
            />
          </div>
        </CardContent>
      </Card>

      {/* Datos generales */}
      <Card className="border-pink-100">
        <CardContent className="p-6 space-y-4">
          <div>
            <Label htmlFor="title">Título *</Label>
            <Input id="title" required value={form.title} onChange={(e) => updateField('title', e.target.value)} className="mt-1" />
          </div>

          <div>
            <Label htmlFor="description">Descripción</Label>
            <Textarea id="description" rows={2} value={form.description} onChange={(e) => updateField('description', e.target.value)} className="mt-1" />
          </div>

          <div>
            <Label>Categoría *</Label>
            <Select value={form.categoryId} onValueChange={(v) => updateField('categoryId', v)}>
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

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="servings">Porciones</Label>
              <Input id="servings" type="number" min="0" value={form.servings} onChange={(e) => updateField('servings', e.target.value)} className="mt-1" />
            </div>
            <div>
              <Label htmlFor="prepMinutes">Prep. (min)</Label>
              <Input id="prepMinutes" type="number" min="0" value={form.prepMinutes} onChange={(e) => updateField('prepMinutes', e.target.value)} className="mt-1" />
            </div>
            <div>
              <Label htmlFor="cookMinutes">Cocción (min)</Label>
              <Input id="cookMinutes" type="number" min="0" value={form.cookMinutes} onChange={(e) => updateField('cookMinutes', e.target.value)} className="mt-1" />
            </div>
            <div>
              <Label>Dificultad</Label>
              <Select value={form.difficulty} onValueChange={(v) => updateField('difficulty', v)}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="—" />
                </SelectTrigger>
                <SelectContent>
                  {DIFFICULTY_OPTIONS.map((d) => (
                    <SelectItem key={d.value} value={d.value}>
                      {d.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label>Métodos de cocción</Label>
            <div className="flex flex-wrap gap-4 mt-2">
              {COOKING_METHOD_OPTIONS.map((m) => (
                <label key={m.value} className="flex items-center gap-2 text-sm text-gray-700">
                  <Checkbox checked={form.cookingMethods.includes(m.value)} onCheckedChange={() => toggleCookingMethod(m.value)} />
                  {m.label}
                </label>
              ))}
            </div>
          </div>

          <div>
            <Label>Imagen</Label>
            <div className="mt-1">
              <CloudinaryUploader images={form.image ? [form.image] : []} onChange={(imgs) => updateField('image', imgs[0] || '')} multiple={false} />
            </div>
          </div>

          <div>
            <Label htmlFor="notes">Notas</Label>
            <Textarea id="notes" rows={2} value={form.notes} onChange={(e) => updateField('notes', e.target.value)} className="mt-1" />
          </div>
        </CardContent>
      </Card>

      {/* Ingredientes */}
      <Card className="border-pink-100">
        <CardContent className="p-6 space-y-3">
          <Label>Ingredientes</Label>
          {form.ingredients.map((ing, index) => (
            <div key={index} className="space-y-1">
              <div className="flex gap-2 items-center">
                <Input
                  placeholder="Cantidad"
                  value={ing.quantity}
                  onChange={(e) => updateIngredient(index, 'quantity', e.target.value)}
                  className="w-24"
                />
                <Input placeholder="Unidad" value={ing.unit} onChange={(e) => updateIngredient(index, 'unit', e.target.value)} className="w-28" />
                <Input
                  placeholder="Ingrediente"
                  value={ing.name}
                  onChange={(e) => updateIngredient(index, 'name', e.target.value)}
                  className="flex-1"
                />
                <label className="flex items-center gap-1.5 text-xs text-gray-500 flex-shrink-0">
                  <Checkbox checked={ing.optional} onCheckedChange={(v) => updateIngredient(index, 'optional', Boolean(v))} />
                  Opcional
                </label>
                <Button type="button" variant="ghost" size="icon" onClick={() => removeIngredient(index)}>
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
              {ing.evidence && (
                <p className="text-xs text-gray-400 pl-1">
                  <span className="text-mint-600">{INGREDIENT_ORIGIN_LABELS[ing.origin] || ing.origin}:</span> "{ing.evidence}"
                  {ing.reviewed && <span className="text-mint-600"> · revisado</span>}
                </p>
              )}
            </div>
          ))}
          <Button type="button" variant="outline" size="sm" onClick={addIngredient}>
            <Plus className="h-4 w-4 mr-2" />
            Agregar ingrediente
          </Button>
        </CardContent>
      </Card>

      {/* Pasos */}
      <Card className="border-pink-100">
        <CardContent className="p-6 space-y-3">
          <Label>Preparación</Label>
          {form.steps.map((step, index) => (
            <div key={index} className="space-y-1">
              <div className="flex gap-2 items-start">
                <span className="flex-shrink-0 w-7 h-7 mt-1.5 rounded-full bg-mint-100 text-mint-700 flex items-center justify-center text-sm font-medium">
                  {index + 1}
                </span>
                <Textarea
                  rows={2}
                  placeholder="Describe este paso..."
                  value={step.text}
                  onChange={(e) => updateStep(index, e.target.value)}
                  className="flex-1"
                />
                <Button type="button" variant="ghost" size="icon" onClick={() => removeStep(index)}>
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
              {step.evidence && (
                <p className="text-xs text-gray-400 pl-9">
                  <span className="text-mint-600">{INGREDIENT_ORIGIN_LABELS[step.origin] || step.origin}:</span> "{step.evidence}"
                  {step.reviewed && <span className="text-mint-600"> · revisado</span>}
                </p>
              )}
            </div>
          ))}
          <Button type="button" variant="outline" size="sm" onClick={addStep}>
            <Plus className="h-4 w-4 mr-2" />
            Agregar paso
          </Button>
        </CardContent>
      </Card>

      {hasUnreviewedImported && (
        <Card className="border-mint-200 bg-mint-50/50">
          <CardContent className="p-6">
            <label className="flex items-start gap-3">
              <Checkbox checked={confirmReviewed} onCheckedChange={(v) => setConfirmReviewed(Boolean(v))} className="mt-0.5" />
              <span className="text-sm text-gray-700">
                <span className="font-medium">Confirmo que revisé</span> cada ingrediente y paso marcado arriba contra el
                texto de la fuente (comparándolos con "Texto de la fuente" al inicio del formulario) y son correctos.
                {!confirmReviewed && ' Mientras no marques esto, la receta queda como "Requiere revisión".'}
              </span>
            </label>
          </CardContent>
        </Card>
      )}

      {/* Publicación */}
      <Card className="border-pink-100">
        <CardContent className="p-6 space-y-4">
          {isEditing && (
            <div>
              <Label>Estado</Label>
              <Select value={form.status} onValueChange={(v) => updateField('status', v)}>
                <SelectTrigger className="mt-1 w-56">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {RECIPE_STATUSES.map((s) => (
                    <SelectItem key={s} value={s}>
                      {RECIPE_STATUS_LABELS[s]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-500 mt-1">
                Si faltan ingredientes o pasos, el sistema la marca como "Incompleta" aunque elijas otro estado.
              </p>
            </div>
          )}
          <div className="flex items-center gap-2">
            <Switch checked={form.published} onCheckedChange={(v) => updateField('published', v)} />
            <Label>Publicada (visible en el sitio)</Label>
          </div>
        </CardContent>
      </Card>

      <Button type="submit" disabled={saving} className="bg-gradient-to-r from-primary to-pink-500">
        {saving ? 'Guardando...' : isEditing ? 'Guardar cambios' : 'Crear receta'}
      </Button>
    </form>
  );
};

export default RecipeForm;
