'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ShoppingBasket, Trash2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent } from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from '@/components/ui/alert-dialog';
import { useShoppingList } from '@/hooks/use-shopping-list';
import { cn } from '@/lib/utils';

export default function ListaDeComprasPage() {
  const { items, toggleChecked, updateItem, removeItem, clearChecked, clearAll } = useShoppingList();

  const checkedCount = items.filter((i) => i.checked).length;

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 px-4 text-center">
        <ShoppingBasket className="h-16 w-16 text-pink-200" />
        <h1 className="text-3xl font-cursive text-primary">Tu lista de compras está vacía</h1>
        <p className="text-gray-600 max-w-md">
          Agrega ingredientes desde cualquier receta con el botón "Agregar a la lista de compras".
        </p>
        <Link href="/recetario">
          <Button className="bg-gradient-to-r from-primary to-pink-500">Explorar recetas</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-cursive text-primary">Lista de Compras</h1>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={clearChecked} disabled={checkedCount === 0}>
              Vaciar comprados ({checkedCount})
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" size="sm" className="border-red-200 text-red-500 hover:bg-red-50">
                  Vaciar todo
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>¿Vaciar toda la lista?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Se eliminarán los {items.length} elementos de tu lista de compras. Esta acción no se puede deshacer.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction onClick={clearAll} className="bg-red-500 hover:bg-red-600">
                    Vaciar todo
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        <div className="space-y-3">
          {items.map((item) => (
            <motion.div key={item.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <Card className={cn('border-pink-100', item.checked && 'bg-mint-50/50')}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Checkbox checked={item.checked} onCheckedChange={() => toggleChecked(item.id)} className="flex-shrink-0" />
                    <Input
                      value={item.quantity ?? item.quantityLabel ?? ''}
                      onChange={(e) => {
                        const raw = e.target.value;
                        const asNumber = raw === '' ? null : Number(raw);
                        updateItem(item.id, Number.isFinite(asNumber) && raw.trim() !== '' ? { quantity: asNumber, quantityLabel: '' } : { quantity: null, quantityLabel: raw });
                      }}
                      placeholder="Cant."
                      className="w-16 flex-shrink-0"
                    />
                    <Input
                      value={item.unit}
                      onChange={(e) => updateItem(item.id, { unit: e.target.value })}
                      placeholder="Unidad"
                      className="w-24 flex-shrink-0"
                    />
                    <Input
                      value={item.name}
                      onChange={(e) => updateItem(item.id, { name: e.target.value })}
                      className={cn('flex-1', item.checked && 'line-through text-gray-400')}
                    />
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors flex-shrink-0"
                      aria-label="Eliminar"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="flex items-center gap-3 mt-2 pl-9">
                    <Input
                      value={item.note}
                      onChange={(e) => updateItem(item.id, { note: e.target.value })}
                      placeholder="Nota (opcional)"
                      className="h-8 text-sm flex-1"
                    />
                    {item.sources?.length > 0 && (
                      <span className="text-xs text-gray-400 flex-shrink-0 truncate max-w-[40%]">
                        de: {item.sources.join(', ')}
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
