'use client';

import { useShop } from '@/context/ShopContext';
import { useQuery } from '@tanstack/react-query';
import { cn } from '@/lib/utils';
import { TrendingUp, ShoppingBag, PackageSearch, Users, DollarSign, ArrowUpRight, ArrowDownRight, MoreHorizontal, TicketPercent } from 'lucide-react';
import Link from 'next/link';
import axios from 'axios';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5000/api';

const fetchAdminProducts = async () => {
  const { data } = await axios.get(`${API}/products`);
  const raw = data.products || data || [];
  return raw.map(p => ({ ...p, id: String(p._id) }));
};

export default function DashboardPage() {
  const { user, orders = [] } = useShop();
  const { data: products = [] } = useQuery({
    queryKey: ['admin-products'],
    queryFn: fetchAdminProducts,
  });
  
  if (user?.role !== 'admin') {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-zinc-500">
        <h2 className="text-xl font-bold text-zinc-900 mb-2">Welcome, {user?.name}</h2>
        <p>Use the sidebar to navigate available lister tools.</p>
      </div>
    );
  }

  const totalRevenue = orders.reduce((sum, o) => sum + (o.totalPrice || o.total || 0), 0);
  const paidOrders = orders.filter((o) => o.isPaid).length;

  const stats = [
    { label: 'Total Revenue', value: `$${totalRevenue.toFixed(2)}`, icon: DollarSign, trend: '+12.5%', isUp: true },
    { label: 'Total Orders', value: orders.length, icon: ShoppingBag, trend: `${paidOrders} paid`, isUp: true },
    { label: 'Active Products', value: products.filter(p => p.inStock).length, icon: PackageSearch, trend: `${products.length} total`, isUp: true },
    { label: 'Avg Order Value', value: orders.length ? `$${(totalRevenue / orders.length).toFixed(2)}` : '$0', icon: TrendingUp, trend: '-2.1%', isUp: false },
  ];

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-zinc-900">Dashboard</h2>
          <p className="text-sm text-zinc-500 mt-1">Here's an overview of your store's performance.</p>
        </div>
        <div className="hidden sm:flex items-center gap-3">
          <button className="px-4 py-2 bg-white border border-zinc-200 text-xs font-bold rounded-lg text-zinc-600 hover:text-zinc-900 hover:border-zinc-300 transition-all shadow-sm">Export Report</button>
          <button className="px-4 py-2 bg-zinc-900 text-white text-xs font-bold rounded-lg hover:bg-zinc-800 transition-all shadow-md shadow-zinc-900/20">View Live Store</button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="relative overflow-hidden bg-white rounded-2xl border border-zinc-200 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] p-6 group hover:shadow-lg transition-all duration-300">
            {/* Ambient Background Glow */}
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-gradient-to-br from-zinc-100 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="relative z-10 flex flex-col gap-5">
              <div className="flex items-center justify-between text-zinc-500">
                <span className="text-[11px] font-bold uppercase tracking-widest text-zinc-400">{stat.label}</span>
                <div className="w-8 h-8 rounded-full bg-zinc-50 border border-zinc-100 flex items-center justify-center text-zinc-900 shadow-sm">
                  <stat.icon size={14} />
                </div>
              </div>
              <div className="flex items-end justify-between">
                <span className="text-4xl font-extrabold tracking-tight text-zinc-900">{stat.value}</span>
                <span className={cn('flex items-center text-[11px] font-bold px-2 py-1 rounded-full', stat.isUp ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600')}>
                  {stat.isUp ? <ArrowUpRight size={12} className="mr-1" /> : <ArrowDownRight size={12} className="mr-1" />}
                  {stat.trend}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Orders Table */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-zinc-200 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] overflow-hidden flex flex-col">
          <div className="px-6 py-5 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/50">
            <h3 className="text-sm font-bold tracking-wide text-zinc-900">Recent Orders</h3>
            <button className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 hover:text-zinc-900 transition-colors">View All →</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-white text-[10px] text-zinc-400 font-bold uppercase tracking-widest border-b border-zinc-100">
                <tr>
                  <th className="px-6 py-4 font-semibold">Order ID</th>
                  <th className="px-6 py-4 font-semibold">Customer</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold text-right">Amount</th>
                  <th className="px-6 py-4 font-semibold text-right"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {orders.slice(0, 5).map((o) => (
                  <tr key={o.id || o._id} className="group hover:bg-zinc-50/50 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs font-bold text-zinc-900">
                      {o.trackingNumber || String(o.id || o._id).slice(-8).toUpperCase()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center shrink-0">
                          <span className="text-[10px] font-bold text-zinc-600 uppercase">
                            {(o.shippingAddress?.firstName?.charAt(0) || '') + (o.shippingAddress?.lastName?.charAt(0) || '')}
                          </span>
                        </div>
                        <div>
                          <p className="font-semibold text-zinc-900 text-xs">{o.shippingAddress?.firstName || '—'} {o.shippingAddress?.lastName || ''}</p>
                          <p className="text-[10px] text-zinc-400">{o.shippingAddress?.email || 'Customer'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        'px-2.5 py-1 rounded-full text-[9px] font-extrabold uppercase tracking-widest border',
                        o.isPaid ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'
                      )}>
                        {o.isPaid ? 'Paid' : o.status || 'Processing'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-zinc-900 text-sm">
                      ${(o.totalPrice || o.total || 0).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-2 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg transition-colors opacity-0 group-hover:opacity-100">
                        <MoreHorizontal size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
                {orders.length === 0 && (
                  <tr><td colSpan={5} className="px-6 py-12 text-center text-zinc-400 text-sm">No recent orders found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Action Panel */}
        <div className="bg-zinc-900 rounded-2xl shadow-xl overflow-hidden flex flex-col relative">
          <div className="absolute top-0 right-0 p-12 bg-gradient-to-bl from-zinc-800 to-transparent rounded-full opacity-50 pointer-events-none blur-3xl" />
          <div className="px-6 py-5 border-b border-zinc-800/50 flex items-center justify-between relative z-10">
            <h3 className="text-sm font-bold tracking-wide text-white">Quick Actions</h3>
          </div>
          <div className="flex-1 p-6 flex flex-col gap-4 relative z-10">
            <Link href="/admin/products" className="p-4 rounded-xl bg-zinc-800/50 border border-zinc-700/50 hover:bg-zinc-800 transition-colors cursor-pointer group block">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-zinc-700 flex items-center justify-center text-white shadow-inner">
                  <PackageSearch size={18} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">Add New Product</h4>
                  <p className="text-xs text-zinc-400 mt-0.5">Update your catalog</p>
                </div>
              </div>
            </Link>
            
            <Link href="/admin/discounts" className="p-4 rounded-xl bg-zinc-800/50 border border-zinc-700/50 hover:bg-zinc-800 transition-colors cursor-pointer group block">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-zinc-700 flex items-center justify-center text-white shadow-inner">
                  <TicketPercent size={18} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white group-hover:text-indigo-400 transition-colors">Create Discount</h4>
                  <p className="text-xs text-zinc-400 mt-0.5">Run a new promotion</p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
