'use client';

import { use, useEffect, useState } from 'react';
import { MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { formatPrice } from '@/lib/utils';
import { STATUS_LABELS } from '@/lib/orderStatus';
import { buildWhatsAppLink } from '@/lib/constants';

export default function AdminOrderDetailPage({ params }) {
  const { id } = use(params);
  const { toast } = useToast();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadOrder = () => {
    fetch(`/api/orders/${id}`)
      .then((r) => r.json())
      .then((data) => setOrder(data?.order || null))
      .finally(() => setLoading(false));
  };

  useEffect(loadOrder, [id]);

  const handleStatusChange = async (status) => {
    setSaving(true);
    const response = await fetch(`/api/orders/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    setSaving(false);
    if (response.ok) {
      toast({ title: 'Estado actualizado' });
      loadOrder();
    } else {
      toast({ title: 'No se pudo actualizar el estado', variant: 'destructive' });
    }
  };

  if (loading) return <p className="text-gray-500">Cargando...</p>;
  if (!order) return <p className="text-gray-500">Pedido no encontrado.</p>;

  const customerWaNumber = order.customer.phone.replace(/\D/g, '');
  const followUpMessage = `¡Hola ${order.customer.name}! Te escribimos sobre tu pedido ${order.orderNumber} en Creaciones Princess.`;

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Pedido {order.orderNumber}</h1>
        <Select value={order.status} onValueChange={handleStatusChange} disabled={saving}>
          <SelectTrigger className="w-56">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(STATUS_LABELS).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card className="border-pink-100">
          <CardContent className="p-6">
            <h2 className="font-semibold text-gray-800 mb-3">Cliente</h2>
            <p className="text-sm text-gray-600">{order.customer.name}</p>
            <p className="text-sm text-gray-600">{order.customer.phone}</p>
            {order.customer.email && <p className="text-sm text-gray-600">{order.customer.email}</p>}
            {customerWaNumber && (
              <a href={buildWhatsAppLink(customerWaNumber, followUpMessage)} target="_blank" rel="noopener noreferrer">
                <Button size="sm" variant="outline" className="mt-3 border-green-500 text-green-600 hover:bg-green-50">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Escribir por WhatsApp
                </Button>
              </a>
            )}
          </CardContent>
        </Card>

        <Card className="border-pink-100">
          <CardContent className="p-6">
            <h2 className="font-semibold text-gray-800 mb-3">Entrega</h2>
            <p className="text-sm text-gray-600 capitalize">
              {order.delivery.method === 'delivery' ? 'Entrega a domicilio' : 'Retiro'}
            </p>
            {order.delivery.address && <p className="text-sm text-gray-600">{order.delivery.address}</p>}
            {order.delivery.requestedDate && (
              <p className="text-sm text-gray-600">Fecha deseada: {order.delivery.requestedDate}</p>
            )}
            {order.delivery.notes && <p className="text-sm text-gray-600 mt-2 italic">"{order.delivery.notes}"</p>}
          </CardContent>
        </Card>
      </div>

      <Card className="border-pink-100">
        <CardContent className="p-6">
          <h2 className="font-semibold text-gray-800 mb-4">Artículos</h2>
          <div className="space-y-2 mb-4">
            {order.items.map((item) => (
              <div key={item.productId} className="flex justify-between text-sm text-gray-600">
                <span>
                  {item.name} x{item.quantity}
                </span>
                <span>{formatPrice(item.subtotal)}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-between font-bold text-gray-800 border-t pt-3">
            <span>Total</span>
            <span>{formatPrice(order.total)}</span>
          </div>
          <div className="flex justify-between text-sm text-mint-700 mt-1">
            <span>Adelanto ({order.depositPercentage * 100}%)</span>
            <span>{formatPrice(order.depositAmount)}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
