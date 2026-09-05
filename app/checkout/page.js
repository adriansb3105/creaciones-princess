'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent } from '@/components/ui/card';
import { useCart } from '@/hooks/use-cart';
import { useToast } from '@/hooks/use-toast';
import { formatPrice } from '@/lib/utils';
import { DEPOSIT_PERCENTAGE, SINPE_PHONE_DISPLAY } from '@/lib/constants';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, clearCart } = useCart();
  const { toast } = useToast();

  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    method: 'pickup',
    address: '',
    requestedDate: '',
    notes: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const depositAmount = Math.round(subtotal * DEPOSIT_PERCENTAGE);

  const handleChange = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (items.length === 0) return;
    setSubmitting(true);

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer: { name: form.name, phone: form.phone, email: form.email },
          delivery: {
            method: form.method,
            address: form.address,
            notes: form.notes,
            requestedDate: form.requestedDate,
          },
          items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'No se pudo crear el pedido');
      }

      clearCart();
      router.push(`/pedido-confirmado/${data.order.id}`);
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 px-4 text-center">
        <h1 className="text-3xl font-cursive text-primary">No hay nada que ordenar todavía</h1>
        <Link href="/productos">
          <Button className="bg-gradient-to-r from-primary to-pink-500">Ir a la tienda</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        <h1 className="text-4xl md:text-5xl font-cursive text-primary mb-10 text-center">Finalizar Pedido</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-6">
            <Card className="border-pink-100">
              <CardContent className="p-6 space-y-4">
                <h2 className="text-xl font-semibold text-gray-800">Tus datos</h2>
                <div>
                  <Label htmlFor="name">Nombre completo *</Label>
                  <Input id="name" required value={form.name} onChange={handleChange('name')} className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="phone">Teléfono *</Label>
                  <Input id="phone" type="tel" required value={form.phone} onChange={handleChange('phone')} className="mt-1" placeholder="8888 8888" />
                </div>
                <div>
                  <Label htmlFor="email">Email (opcional)</Label>
                  <Input id="email" type="email" value={form.email} onChange={handleChange('email')} className="mt-1" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-pink-100">
              <CardContent className="p-6 space-y-4">
                <h2 className="text-xl font-semibold text-gray-800">Entrega</h2>
                <RadioGroup value={form.method} onValueChange={(value) => setForm((p) => ({ ...p, method: value }))}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="pickup" id="pickup" />
                    <Label htmlFor="pickup">Retiro coordinado por WhatsApp</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="delivery" id="delivery" />
                    <Label htmlFor="delivery">Entrega a domicilio</Label>
                  </div>
                </RadioGroup>

                {form.method === 'delivery' && (
                  <div>
                    <Label htmlFor="address">Dirección de entrega</Label>
                    <Textarea id="address" value={form.address} onChange={handleChange('address')} className="mt-1" rows={2} />
                  </div>
                )}

                <div>
                  <Label htmlFor="requestedDate">Fecha deseada</Label>
                  <Input
                    id="requestedDate"
                    type="date"
                    value={form.requestedDate}
                    onChange={handleChange('requestedDate')}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="notes">Notas adicionales</Label>
                  <Textarea
                    id="notes"
                    value={form.notes}
                    onChange={handleChange('notes')}
                    className="mt-1"
                    rows={3}
                    placeholder="Mensaje personalizado, alergias, colores, etc."
                  />
                </div>
              </CardContent>
            </Card>

            <Button type="submit" size="lg" disabled={submitting} className="w-full bg-gradient-to-r from-primary to-pink-500">
              {submitting ? 'Enviando...' : 'Confirmar Pedido'}
            </Button>
          </form>

          {/* Summary */}
          <div>
            <Card className="border-pink-100 sticky top-28">
              <CardContent className="p-6 space-y-4">
                <h2 className="text-2xl font-cursive text-primary mb-2">Resumen</h2>
                {items.map((item) => (
                  <div key={item.productId} className="flex justify-between text-sm text-gray-600">
                    <span>
                      {item.name} x{item.quantity}
                    </span>
                    <span>{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
                <div className="flex justify-between font-bold text-lg text-gray-800 border-t pt-4">
                  <span>Total</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="bg-mint-50 rounded-lg p-4 text-sm text-mint-800">
                  Adelanto requerido ({DEPOSIT_PERCENTAGE * 100}%): <span className="font-bold">{formatPrice(depositAmount)}</span>
                  <br />
                  Vía Sinpe Móvil ({SINPE_PHONE_DISPLAY}) o transferencia — te confirmamos los detalles por WhatsApp.
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
