'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, Send, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import {
  BUSINESS_EMAIL,
  BUSINESS_HOURS,
  BUSINESS_LOCATION_NOTE,
  WHATSAPP_PRIMARY_DISPLAY,
  WHATSAPP_PRIMARY_WA,
  WHATSAPP_SECONDARY_DISPLAY,
  buildWhatsAppLink,
} from '@/lib/constants';

const ContactoPage = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: '¡Mensaje enviado!',
          description: 'Gracias por contactarnos. Te responderemos pronto.',
        });
        setFormData({ name: '', email: '', phone: '', message: '' });
      } else {
        throw new Error(data.error || 'Error al enviar mensaje');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message || 'Hubo un problema al enviar tu mensaje. Inténtalo de nuevo.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: Phone,
      title: 'WhatsApp',
      content: `${WHATSAPP_PRIMARY_DISPLAY} / ${WHATSAPP_SECONDARY_DISPLAY}`,
    },
    {
      icon: Mail,
      title: 'Email',
      content: BUSINESS_EMAIL,
    },
    {
      icon: Clock,
      title: 'Horario',
      content: BUSINESS_HOURS,
    },
    {
      icon: MapPin,
      title: 'Ubicación',
      content: BUSINESS_LOCATION_NOTE,
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-pink-50 via-cream-50 to-pink-50 py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-6xl font-cursive text-pink-500 mb-4">Contacto</h1>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Estamos aquí para hacer realidad tus sueños. Contáctanos y conversemos sobre tu próxima celebración
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Card className="border-pink-100 shadow-lg">
                <CardContent className="p-8">
                  <h2 className="text-3xl font-cursive text-pink-500 mb-6">Envíanos un Mensaje</h2>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                        Nombre Completo *
                      </label>
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="border-pink-200 focus:border-pink-400"
                        placeholder="Tu nombre"
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                        Correo Electrónico *
                      </label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="border-pink-200 focus:border-pink-400"
                        placeholder="tu@email.com"
                      />
                    </div>

                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                        Teléfono
                      </label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        className="border-pink-200 focus:border-pink-400"
                        placeholder="+1 234 567 8900"
                      />
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                        Mensaje *
                      </label>
                      <Textarea
                        id="message"
                        name="message"
                        required
                        value={formData.message}
                        onChange={handleChange}
                        rows={5}
                        className="border-pink-200 focus:border-pink-400"
                        placeholder="Cuéntanos sobre tu evento o pedido..."
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-gradient-to-r from-pink-400 to-pink-500 hover:from-pink-500 hover:to-pink-600"
                      size="lg"
                    >
                      {isSubmitting ? 'Enviando...' : 'Enviar Mensaje'}
                      <Send className="ml-2 h-5 w-5" />
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6">
              <div>
                <h2 className="text-3xl font-cursive text-pink-500 mb-6">Información de Contacto</h2>
                <p className="text-gray-600 mb-8">
                  Estamos disponibles para atender tus consultas y hacer realidad tus ideas. No dudes en
                  contactarnos por cualquier medio.
                </p>
              </div>

              <div className="space-y-4">
                {contactInfo.map((info, index) => {
                  const Icon = info.icon;
                  return (
                    <motion.div
                      key={info.title}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="border-pink-100 hover:shadow-md transition-shadow">
                        <CardContent className="p-6">
                          <div className="flex items-start space-x-4">
                            <div className="w-12 h-12 rounded-full bg-pink-100 flex items-center justify-center flex-shrink-0">
                              <Icon className="h-6 w-6 text-pink-500" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-800 mb-1">{info.title}</h3>
                              <p className="text-gray-600 text-sm">{info.content}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>

              {/* WhatsApp CTA */}
              <a
                href={buildWhatsAppLink(WHATSAPP_PRIMARY_WA, '¡Hola! Me gustaría hacer una consulta.')}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Card className="border-pink-100 overflow-hidden hover:shadow-md transition-shadow">
                  <CardContent className="p-6 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                      <MessageCircle className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-1">Escríbenos directo por WhatsApp</h3>
                      <p className="text-gray-600 text-sm">Respuesta más rápida para pedidos y consultas</p>
                    </div>
                  </CardContent>
                </Card>
              </a>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactoPage;