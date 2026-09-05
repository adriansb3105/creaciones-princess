'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadMessages = () => {
    fetch('/api/contact-messages')
      .then((r) => r.json())
      .then((data) => setMessages(data?.messages || []))
      .finally(() => setLoading(false));
  };

  useEffect(loadMessages, []);

  const markAsRead = async (id) => {
    await fetch(`/api/contact-messages?id=${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ read: true }),
    });
    loadMessages();
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">Mensajes de contacto</h1>

      {loading ? (
        <p className="text-gray-500">Cargando...</p>
      ) : messages.length === 0 ? (
        <p className="text-gray-500">No hay mensajes todavía.</p>
      ) : (
        <div className="space-y-4 max-w-2xl">
          {messages.map((msg) => (
            <Card key={msg.id} className="border-pink-100">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-semibold text-gray-800">{msg.name}</p>
                    <p className="text-sm text-gray-500">
                      {msg.email} {msg.phone && `· ${msg.phone}`}
                    </p>
                  </div>
                  {!msg.read && <Badge>Nuevo</Badge>}
                </div>
                <p className="text-gray-600 text-sm mb-3">{msg.message}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">{new Date(msg.createdAt).toLocaleString('es-CR')}</span>
                  {!msg.read && (
                    <Button size="sm" variant="outline" onClick={() => markAsRead(msg.id)}>
                      Marcar como leído
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
