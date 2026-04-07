'use client';
import Sidebar from '@/components/layout/Sidebar';
import ToastContainer from '@/components/ui/Toast';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
      <ToastContainer />
    </div>
  );
}
