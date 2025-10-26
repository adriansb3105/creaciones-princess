import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import './globals.css';

export const metadata = {
  title: 'Creaciones Princess - Endulzamos tus momentos con amor',
  description: 'Postres artesanales, pasteles personalizados, artesanías y decoraciones para fiestas. Cada creación hecha con amor y dedicación.',
  keywords: 'postres, pasteles, artesanías, decoraciones, fiestas, celebraciones',
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
        <Navbar />
        <main className="min-h-screen pt-20">
          {children}
        </main>
        <Footer />
        <WhatsAppButton />
      </body>
    </html>
  );
}