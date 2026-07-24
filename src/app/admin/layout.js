'use client';

import { useState } from 'react';
import AdminGuard from '@/components/admin/AdminGuard';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminTopHeader from '@/components/admin/AdminTopHeader';

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <AdminGuard>
      <div className="min-h-screen bg-zinc-50">
        <AdminSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
        <div className="flex flex-col min-w-0 lg:pl-64 min-h-screen transition-all duration-300">
          <AdminTopHeader setSidebarOpen={setSidebarOpen} />
          <main className="flex-1 p-4 sm:p-8">
            <div className="max-w-[1200px] mx-auto w-full pb-20">
              {children}
            </div>
          </main>
        </div>
      </div>
    </AdminGuard>
  );
}
