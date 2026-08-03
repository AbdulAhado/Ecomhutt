'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useShop } from '@/context/ShopContext';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  PackageSearch,
  Tags,
  ShoppingBag,
  Users,
  Image as ImageIcon,
  Flag,
  Archive,
  TicketPercent,
  TrendingUp,
  Settings,
  LogOut,
  X,
  ChevronRight
} from 'lucide-react';

export default function AdminSidebar({ isOpen, setIsOpen }) {
  const pathname = usePathname();
  const { user, logout } = useShop();

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  const navGroups = [
    {
      label: 'Main',
      items: [
        { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
        { name: 'Analytics', href: '/admin/analytics', icon: TrendingUp },
      ]
    },
    {
      label: 'Catalog',
      items: [
        { name: 'Products', href: '/admin/products', icon: PackageSearch },
        { name: 'Categories', href: '/admin/categories', icon: Tags },
        { name: 'Inventory', href: '/admin/inventory', icon: Archive },
      ]
    },
    {
      label: 'Commerce',
      items: [
        { name: 'Orders', href: '/admin/orders', icon: ShoppingBag },
        { name: 'Users', href: '/admin/customers', icon: Users },
        { name: 'Discounts', href: '/admin/discounts', icon: TicketPercent },
      ]
    },
    {
      label: 'Storefront',
      items: [
        { name: 'Banners', href: '/admin/banners', icon: Flag },
      ]
    }
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-[100] lg:hidden backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar - Sleek Linear Style */}
      <aside className={cn(
        'fixed inset-y-0 left-0 z-[110] w-64 bg-[#0a0a0a] border-r border-[#1f1f22] flex flex-col transition-transform duration-300 ease-in-out',
        isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      )}>
        {/* Header */}
        <div className="h-16 px-6 flex items-center justify-between border-b border-[#1f1f22] shrink-0">
          <Link href="/" className="flex items-center gap-3 text-white group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-zinc-700 to-zinc-900 border border-zinc-700 flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform">
              <span className="font-extrabold text-sm text-transparent bg-clip-text bg-gradient-to-r from-zinc-200 to-white">EH</span>
            </div>
            <span className="font-semibold text-[15px] tracking-tight">EcomHutt</span>
          </Link>
          <button
            className="lg:hidden text-zinc-400 hover:text-white transition-colors"
            onClick={() => setIsOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto min-h-0 py-6 px-3 space-y-6 custom-scrollbar overscroll-contain">
          {navGroups.map((group) => (
            <div key={group.label}>
              <div className="text-[10px] font-semibold text-zinc-500 uppercase tracking-[0.2em] mb-2 px-3">
                {group.label}
              </div>
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const isActive = pathname.startsWith(item.href);
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        'group flex items-center justify-between px-3 py-2 rounded-xl text-[13px] font-medium transition-all duration-200',
                        isActive
                          ? 'bg-[#18181b] text-white shadow-sm ring-1 ring-white/5'
                          : 'text-zinc-400 hover:bg-[#18181b] hover:text-zinc-200'
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <item.icon size={16} className={cn('transition-colors', isActive ? 'text-zinc-200' : 'text-zinc-500 group-hover:text-zinc-400')} />
                        {item.name}
                      </div>
                      {isActive && <ChevronRight size={14} className="text-zinc-600" />}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}

          <div>
            <div className="text-[10px] font-semibold text-zinc-500 uppercase tracking-[0.2em] mb-2 px-3">
              System
            </div>
            <div className="space-y-0.5">
              <Link
                href="/admin/settings"
                onClick={() => setIsOpen(false)}
                className={cn(
                  'group flex items-center justify-between px-3 py-2 rounded-xl text-[13px] font-medium transition-all duration-200',
                  pathname === '/admin/settings'
                    ? 'bg-[#18181b] text-white shadow-sm ring-1 ring-white/5'
                    : 'text-zinc-400 hover:bg-[#18181b] hover:text-zinc-200'
                )}
              >
                <div className="flex items-center gap-3">
                  <Settings size={16} className={cn('transition-colors', pathname === '/admin/settings' ? 'text-zinc-200' : 'text-zinc-500 group-hover:text-zinc-400')} />
                  Settings
                </div>
                {pathname === '/admin/settings' && <ChevronRight size={14} className="text-zinc-600" />}
              </Link>
            </div>
          </div>
        </div>

        {/* User Profile / Footer */}
        <div className="p-4 border-t border-[#1f1f22] bg-[#0a0a0a] shrink-0">
          <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-[#141417] border border-[#1f1f22]">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shrink-0">
                <span className="text-xs font-bold text-white uppercase">{user?.name?.charAt(0) || 'A'}</span>
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-white truncate">{user?.name}</p>
                <p className="text-[10px] text-zinc-500 capitalize">{user?.role}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="p-1.5 text-zinc-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
              title="Logout"
            >
              <LogOut size={14} />
            </button>
          </div>
        </div>
      </aside>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #27272a;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #3f3f46;
        }
      `}</style>
    </>
  );
}