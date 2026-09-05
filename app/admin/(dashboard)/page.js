'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Package, ClipboardList, Mail, Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { formatPrice } from '@/lib/utils';

export default function AdminDashboardPage() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/products').then((r) => r.json()),
      fetch('/api/orders').then((r) => r.json()),
      fetch('/api/contact-messages').then((r) => r.json()),
    ])
      .then(([productsData, ordersData, messagesData]) => {
        setProducts(productsData?.products || []);
        setOrders(ordersData?.orders || []);
        setMessages(messagesData?.messages || []);
      })
      .finally(() => setLoading(false));
  }, []);

  const pendingOrders = orders.filter((o) => o.status === 'pending_payment').length;
  const unreadMessages = messages.filter((m) => !m.read).length;

  const stats = [
    { label: 'Productos activos', value: products.filter((p) => p.active).length, icon: Package, href: '/admin/productos' },
    { label: 'Pedidos pendientes', value: pendingOrders, icon: Clock, href: '/admin/pedidos' },
    { label: 'Total de pedidos', value: orders.length, icon: ClipboardList, href: '/admin/pedidos' },
    { label: 'Mensajes sin leer', value: unreadMessages, icon: Mail, href: '/admin/mensajes' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link key={stat.label} href={stat.href}>
              <Card className="border-pink-100 hover:shadow-md transition-shadow">
                <CardContent className="p-5 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-pink-50 flex items-center justify-center">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-800">{loading ? '—' : stat.value}</p>
                    <p className="text-sm text-gray-500">{stat.label}</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      <Card className="border-pink-100">
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Pedidos recientes</h2>
          {orders.length === 0 ? (
            <p className="text-gray-500 text-sm">Todavía no hay pedidos.</p>
          ) : (
            <div className="space-y-3">
              {orders.slice(0, 5).map((order) => (
                <Link
                  key={order.id}
                  href={`/admin/pedidos/${order.id}`}
                  className="flex items-center justify-between text-sm py-2 border-b last:border-0 hover:bg-mint-50/50 -mx-2 px-2 rounded"
                >
                  <span className="font-medium text-gray-700">{order.orderNumber}</span>
                  <span className="text-gray-500">{order.customer?.name}</span>
                  <span className="font-semibold text-primary">{formatPrice(order.total)}</span>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
