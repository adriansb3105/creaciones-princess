'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';

const AdminDashboardShell = ({ children }) => {
  const router = useRouter();
  const [admin, setAdmin] = useState(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    fetch('/api/admin/me')
      .then((r) => {
        if (!r.ok) {
          router.push('/admin/login');
          return null;
        }
        return r.json();
      })
      .then((data) => {
        if (data) setAdmin(data.admin);
      })
      .finally(() => setChecked(true));
  }, [router]);

  if (!checked) {
    return <div className="min-h-screen flex items-center justify-center text-gray-500">Cargando...</div>;
  }

  return (
    <div className="flex">
      <AdminSidebar />
      <div className="flex-1 min-w-0">
        <AdminHeader adminEmail={admin?.email} />
        <main className="p-6 bg-mint-50/30 min-h-[calc(100vh-5rem)]">{children}</main>
      </div>
    </div>
  );
};

export default AdminDashboardShell;
