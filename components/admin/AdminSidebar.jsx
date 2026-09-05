'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Package, FolderTree, ClipboardList, Images, Mail, Heart, Share2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Productos', href: '/admin/productos', icon: Package },
  { name: 'Categorías', href: '/admin/categorias', icon: FolderTree },
  { name: 'Pedidos', href: '/admin/pedidos', icon: ClipboardList },
  { name: 'Galería', href: '/admin/galeria', icon: Images },
  { name: 'Publicar entrega', href: '/admin/publicar', icon: Share2 },
  { name: 'Publicaciones', href: '/admin/publicaciones', icon: Share2 },
  { name: 'Mensajes', href: '/admin/mensajes', icon: Mail },
];

const AdminSidebar = () => {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white border-r border-pink-100 flex-shrink-0 min-h-screen hidden md:flex md:flex-col">
      <div className="h-20 flex items-center px-6 border-b border-pink-100">
        <Heart className="h-6 w-6 text-primary fill-primary mr-2" />
        <span className="font-cursive text-xl text-primary">Princess Admin</span>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors',
                active ? 'bg-pink-50 text-primary' : 'text-gray-600 hover:bg-mint-50 hover:text-mint-700'
              )}
            >
              <Icon className="h-4 w-4" />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default AdminSidebar;
