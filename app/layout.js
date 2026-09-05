import Providers from '@/components/Providers';
import SiteChrome from '@/components/SiteChrome';
import './globals.css';

export const metadata = {
  title: 'Creaciones Princess - Endulzamos tus momentos con amor',
  description: 'Postres, agendas y decoraciones artesanales hechas a mano. Pide por WhatsApp y coordina tu adelanto por Sinpe Móvil o transferencia.',
  keywords: 'postres, agendas, decoraciones, repostería, fiestas, celebraciones, Costa Rica',
  openGraph: {
    title: 'Creaciones Princess',
    description: 'Endulzamos tus momentos con amor',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        <Providers>
          <SiteChrome>{children}</SiteChrome>
        </Providers>
      </body>
    </html>
  );
}