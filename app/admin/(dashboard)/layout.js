import AdminDashboardShell from '@/components/admin/AdminDashboardShell';

export const metadata = {
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }) {
  return <AdminDashboardShell>{children}</AdminDashboardShell>;
}
