'use client';

import { usePathname } from 'next/navigation';
import { Menu, Bell, Search } from 'lucide-react';
import { useShop } from '@/context/ShopContext';

export default function AdminTopHeader({ setSidebarOpen }) {
  const pathname = usePathname();
  const { user } = useShop();

  // Simple title generator from path
  const getPageTitle = () => {
    const parts = pathname.split('/').filter(Boolean);
    if (parts.length <= 1) return 'Dashboard';
    
    // Get last part, capitalize
    const last = parts[parts.length - 1];
    return last.charAt(0).toUpperCase() + last.slice(1);
  };

  return (
    <header className="h-16 bg-white border-b border-zinc-200 flex items-center justify-between px-4 sm:px-8 sticky top-0 z-40">
      <div className="flex items-center gap-4">
        <button
          onClick={() => setSidebarOpen(true)}
          className="lg:hidden text-zinc-500 hover:text-zinc-900"
        >
          <Menu size={20} />
        </button>
        
        <h1 className="text-lg font-bold text-zinc-900 hidden sm:block">
          {getPageTitle()}
        </h1>
      </div>

      <div className="flex items-center gap-4 sm:gap-6">
        <div className="relative hidden md:block">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            placeholder="Search admin..."
            className="pl-9 pr-4 py-1.5 bg-zinc-100 border-none rounded-full text-sm w-64 focus:outline-none focus:ring-2 focus:ring-zinc-900"
          />
        </div>

        <button className="text-zinc-500 hover:text-zinc-900 relative">
          <Bell size={18} />
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
        
        <div className="h-8 w-8 rounded-full bg-zinc-900 text-white flex items-center justify-center font-bold text-xs sm:hidden">
          {user?.name?.charAt(0) || 'A'}
        </div>
      </div>
    </header>
  );
}
