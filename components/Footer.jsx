'use client';

import Link from 'next/link';
import { Heart, Facebook, Instagram, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-pink-50 via-cream-50 to-pink-50 pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Heart className="h-8 w-8 text-pink-400 fill-pink-400" />
              <div>
                <h3 className="text-xl font-cursive text-pink-500">Creaciones Princess</h3>
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
                <Link href="/" className="text-gray-600 hover:text-pink-500 transition-colors text-sm">
                  Inicio
                </Link>
              </li>
              <li>
                <Link href="/productos" className="text-gray-600 hover:text-pink-500 transition-colors text-sm">
                  Productos
                </Link>
              </li>
              <li>
                <Link href="/galeria" className="text-gray-600 hover:text-pink-500 transition-colors text-sm">
                  Galería
                </Link>
              </li>
              <li>
                <Link href="/sobre-nosotros" className="text-gray-600 hover:text-pink-500 transition-colors text-sm">
                  Sobre Nosotros
                </Link>
              </li>
              <li>
                <Link href="/contacto" className="text-gray-600 hover:text-pink-500 transition-colors text-sm">
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
                <Phone className="h-4 w-4 mt-0.5 text-pink-400" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-start space-x-2 text-sm text-gray-600">
                <Mail className="h-4 w-4 mt-0.5 text-pink-400" />
                <span>hola@creacionesprincess.com</span>
              </li>
              <li className="flex items-start space-x-2 text-sm text-gray-600">
                <MapPin className="h-4 w-4 mt-0.5 text-pink-400" />
                <span>Calle Principal 123<br />Ciudad, País</span>
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
                <Facebook className="h-5 w-5 text-pink-500" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center hover:bg-pink-200 transition-colors"
              >
                <Instagram className="h-5 w-5 text-pink-500" />
              </a>
            </div>
            <p className="text-xs text-gray-500 mt-4">
              Horario: Lun - Sáb<br />
              9:00 AM - 6:00 PM
            </p>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-pink-200 pt-6 text-center">
          <p className="text-sm text-gray-600">
            © {new Date().getFullYear()} Creaciones Princess. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;