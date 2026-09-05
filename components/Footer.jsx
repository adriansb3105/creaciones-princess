'use client';

import Link from 'next/link';
import { Heart, Facebook, Instagram, Mail, Phone, MapPin } from 'lucide-react';
import {
  BUSINESS_NAME,
  BUSINESS_EMAIL,
  BUSINESS_HOURS,
  BUSINESS_LOCATION_NOTE,
  WHATSAPP_PRIMARY_DISPLAY,
} from '@/lib/constants';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-pink-50 via-mint-50 to-pink-50 pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Heart className="h-8 w-8 text-primary fill-primary" />
              <div>
                <h3 className="text-xl font-cursive text-primary">{BUSINESS_NAME}</h3>
              </div>
            </div>
            <p className="text-gray-600 text-sm">
              Endulzamos tus momentos especiales con amor y dedicación artesanal.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-gray-800 mb-4">Enlaces Rápidos</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-600 hover:text-primary transition-colors text-sm">
                  Inicio
                </Link>
              </li>
              <li>
                <Link href="/productos" className="text-gray-600 hover:text-primary transition-colors text-sm">
                  Tienda
                </Link>
              </li>
              <li>
                <Link href="/galeria" className="text-gray-600 hover:text-primary transition-colors text-sm">
                  Galería
                </Link>
              </li>
              <li>
                <Link href="/sobre-nosotros" className="text-gray-600 hover:text-primary transition-colors text-sm">
                  Sobre Nosotros
                </Link>
              </li>
              <li>
                <Link href="/contacto" className="text-gray-600 hover:text-primary transition-colors text-sm">
                  Contacto
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold text-gray-800 mb-4">Contacto</h4>
            <ul className="space-y-3">
              <li className="flex items-start space-x-2 text-sm text-gray-600">
                <Phone className="h-4 w-4 mt-0.5 text-primary" />
                <span>{WHATSAPP_PRIMARY_DISPLAY}</span>
              </li>
              <li className="flex items-start space-x-2 text-sm text-gray-600">
                <Mail className="h-4 w-4 mt-0.5 text-primary" />
                <span>{BUSINESS_EMAIL}</span>
              </li>
              <li className="flex items-start space-x-2 text-sm text-gray-600">
                <MapPin className="h-4 w-4 mt-0.5 text-primary" />
                <span>{BUSINESS_LOCATION_NOTE}</span>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h4 className="font-semibold text-gray-800 mb-4">Síguenos</h4>
            <div className="flex space-x-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center hover:bg-pink-200 transition-colors"
              >
                <Facebook className="h-5 w-5 text-primary" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-mint-100 flex items-center justify-center hover:bg-mint-200 transition-colors"
              >
                <Instagram className="h-5 w-5 text-mint-700" />
              </a>
            </div>
            <p className="text-xs text-gray-500 mt-4">Horario: {BUSINESS_HOURS}</p>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-pink-200 pt-6 text-center">
          <p className="text-sm text-gray-600">
            © {new Date().getFullYear()} {BUSINESS_NAME}. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
