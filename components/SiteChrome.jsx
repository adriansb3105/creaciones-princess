'use client';

import { usePathname } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';

// El panel /admin tiene su propio layout (sidebar/header) y no debe llevar
// el navbar/footer/botón de WhatsApp del sitio público.
const SiteChrome = ({ children }) => {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-20">{children}</main>
      <Footer />
      <WhatsAppButton />
    </>
  );
};

export default SiteChrome;
