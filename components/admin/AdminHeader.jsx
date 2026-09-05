'use client';

import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';

const AdminHeader = ({ adminEmail }) => {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin/login');
    router.refresh();
  };

  return (
    <header className="h-20 border-b border-pink-100 flex items-center justify-between px-6 bg-white">
      <p className="text-sm text-gray-500">{adminEmail}</p>
      <Button variant="outline" size="sm" onClick={handleLogout} className="border-pink-200">
        <LogOut className="h-4 w-4 mr-2" />
        Cerrar sesión
      </Button>
    </header>
  );
};

export default AdminHeader;
