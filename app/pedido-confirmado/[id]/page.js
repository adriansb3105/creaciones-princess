'use client';

import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { CheckCircle2, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { formatPrice } from '@/lib/utils';
import {
  WHATSAPP_PRIMARY_WA,
  WHATSAPP_PRIMARY_DISPLAY,
  WHATSAPP_SECONDARY_WA,
  WHATSAPP_SECONDARY_DISPLAY,
  SINPE_PHONE_DISPLAY,
  buildWhatsAppLink,
} from '@/lib/constants';

function buildOrderMessage(order) {
  const lines = [
    `¡Hola! Quiero confirmar mi pedido *${order.orderNumber}*`,
    '',
    ...order.items.map((item) => `• ${item.name} x${item.quantity} — ${formatPrice(item.subtotal)}`),
    '',
    `Total: ${formatPrice(order.total)}`,
    `Adelanto (${order.depositPercentage * 100}%): ${formatPrice(order.depositAmount)}`,
    '',
    'Quedo atento(a) para coordinar el pago y la entrega. ¡Gracias!',
  ];
  return lines.join('\n');
}

export default function OrderConfirmationPage({ params }) {
  const { id } = use(params);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/orders/${id}`)
      .then((r) => r.json())
      .then((data) => setOrder(data.order || null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600 text-lg">Cargando pedido...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-gray-600 text-lg">No encontramos este pedido.</p>
        <Link href="/productos">
          <Button className="bg-gradient-to-r from-primary to-pink-500">Ir a la tienda</Button>
        </Link>
      </div>
    );
  }

  const message = buildOrderMessage(order);

  return (
    <div className="min-h-screen py-16">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="text-center mb-10">
          <CheckCircle2 className="h-16 w-16 text-mint-500 mx-auto mb-4" />
          <h1 className="text-4xl font-cursive text-primary mb-2">¡Pedido recibido!</h1>
          <p className="text-gray-600">
            Número de pedido: <span className="font-semibold">{order.orderNumber}</span>
          </p>
        </div>

        <Card className="border-pink-100 mb-8">
          <CardContent className="p-6 space-y-3">
            {order.items.map((item) => (
              <div key={item.productId} className="flex justify-between text-sm text-gray-600">
                <span>
                  {item.name} x{item.quantity}
                </span>
                <span>{formatPrice(item.subtotal)}</span>
              </div>
            ))}
            <div className="flex justify-between font-bold text-gray-800 border-t pt-3">
              <span>Total</span>
              <span>{formatPrice(order.total)}</span>
            </div>
            <div className="bg-mint-50 rounded-lg p-4 text-sm text-mint-800 mt-2">
              Adelanto requerido ({order.depositPercentage * 100}%): <span className="font-bold">{formatPrice(order.depositAmount)}</span>
              <br />
              Vía Sinpe Móvil a {SINPE_PHONE_DISPLAY} o transferencia bancaria — te confirmamos los detalles por
              WhatsApp. El saldo restante se coordina contra entrega.
            </div>
          </CardContent>
        </Card>

        <div className="space-y-3">
          <a href={buildWhatsAppLink(WHATSAPP_PRIMARY_WA, message)} target="_blank" rel="noopener noreferrer">
            <Button size="lg" className="w-full bg-green-500 hover:bg-green-600">
              <MessageCircle className="mr-2 h-5 w-5" />
              Confirmar por WhatsApp ({WHATSAPP_PRIMARY_DISPLAY})
            </Button>
          </a>
          <a href={buildWhatsAppLink(WHATSAPP_SECONDARY_WA, message)} target="_blank" rel="noopener noreferrer">
            <Button size="lg" variant="outline" className="w-full border-green-500 text-green-600 hover:bg-green-50">
              <MessageCircle className="mr-2 h-5 w-5" />
              O escríbenos al {WHATSAPP_SECONDARY_DISPLAY}
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
}
