'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, Package, Heart, LogOut, Settings, MapPin, ChevronRight } from 'lucide-react';
import { useShop } from '@/context/ShopContext';
import { cn } from '@/lib/utils';

export default function DashboardPage() {
  const router = useRouter();
  const { user, orders, wishlist, logout, updateUserProfile } = useShop();

  const [isEditing, setIsEditing] = useState(false);
  const [profileForm, setProfileForm] = useState({ name: user?.name || '', email: user?.email || '', password: '' });
  const [profileStatus, setProfileStatus] = useState({ type: '', message: '' });

  const handleLogout = () => { logout(); router.push('/login'); };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileStatus({ type: 'loading', message: 'Updating...' });
    const res = await updateUserProfile(profileForm);
    if (res.success) {
      setProfileStatus({ type: 'success', message: 'Profile updated successfully!' });
      setIsEditing(false);
      setProfileForm((prev) => ({ ...prev, password: '' }));
    } else {
      setProfileStatus({ type: 'error', message: res.message });
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-white pt-[90px] flex flex-col items-center justify-center text-center gap-6 px-6">
        <div className="w-20 h-20 bg-[#f8f8f8] border border-zinc-100 flex items-center justify-center">
          <User size={28} className="text-zinc-300" />
        </div>
        <h2 className="text-3xl font-bold text-zinc-900">Sign In Required</h2>
        <p className="text-sm text-zinc-500 max-w-sm">Access your dashboard by signing in to your account.</p>
        <Link href="/login" className="px-10 py-4 bg-zinc-900 text-white text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-zinc-800 transition-colors">Sign In</Link>
      </div>
    );
  }

  const inputClass = 'w-full bg-white border border-zinc-200 px-4 py-3 text-sm text-zinc-900 placeholder-zinc-300 focus:outline-none focus:border-zinc-900 transition-colors';
  const labelClass = 'text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-400 mb-2 block';

  return (
    <div className="min-h-screen bg-white pt-[90px]">
      <div className="max-w-[1300px] mx-auto px-6 md:px-12 py-16 space-y-12">

        {/* Header */}
        <div className="border-b border-zinc-100 pb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-zinc-400 block mb-3">EcomHutt</span>
            <h1 className="text-5xl font-bold text-zinc-900 tracking-tight">My Account</h1>
            <p className="text-sm text-zinc-500 mt-2 font-medium">Welcome back, {user.name}.</p>
          </div>
          <div className="flex items-center gap-3">
            {(user.role === 'admin' || user.role === 'lister') && (
              <Link href="/admin" className="px-5 py-2.5 border border-zinc-200 text-zinc-900 text-[10px] font-bold uppercase tracking-[0.15em] hover:border-zinc-900 transition-colors">
                Admin Panel
              </Link>
            )}
            <button onClick={handleLogout} className="flex items-center gap-2 px-5 py-2.5 bg-[#f8f8f8] border border-zinc-100 text-zinc-600 text-[10px] font-bold uppercase tracking-[0.15em] hover:text-zinc-900 hover:border-zinc-300 transition-colors">
              <LogOut size={13} /> Sign Out
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            { icon: Package, label: 'Total Orders', value: orders.length, href: '#orders' },
            { icon: Heart, label: 'Saved Items', value: wishlist.length, href: '/wishlist' },
            { icon: User, label: 'Account Level', value: user.role === 'admin' ? 'Admin' : 'Member', href: '#profile' },
          ].map(({ icon: Icon, label, value, href }) => (
            <Link key={label} href={href} className="p-7 bg-[#f8f8f8] border border-zinc-100 flex items-center gap-5 hover:border-zinc-300 transition-colors group">
              <div className="w-12 h-12 bg-white border border-zinc-100 flex items-center justify-center">
                <Icon size={20} className="text-zinc-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-zinc-900">{value}</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mt-0.5">{label}</p>
              </div>
            </Link>
          ))}
        </div>

        {/* Profile */}
        <div id="profile" className="border border-zinc-100 p-8">
          <div className="flex items-center justify-between mb-8 pb-6 border-b border-zinc-100">
            <h2 className="text-lg font-bold text-zinc-900">Profile Information</h2>
            {!isEditing && (
              <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-zinc-400 hover:text-zinc-900 transition-colors">
                <Settings size={12} /> Edit
              </button>
            )}
          </div>

          {isEditing ? (
            <form onSubmit={handleProfileSubmit} className="space-y-5">
              {profileStatus.message && (
                <div className={cn('p-4 text-xs font-medium', profileStatus.type === 'error' ? 'bg-red-50 border border-red-100 text-red-600' : 'bg-green-50 border border-green-100 text-green-700')}>
                  {profileStatus.message}
                </div>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div><label className={labelClass}>Full Name</label><input type="text" value={profileForm.name} onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })} className={inputClass} /></div>
                <div><label className={labelClass}>Email</label><input type="email" value={profileForm.email} onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })} className={inputClass} /></div>
                <div className="sm:col-span-2"><label className={labelClass}>New Password (leave blank to keep current)</label><input type="password" value={profileForm.password} onChange={(e) => setProfileForm({ ...profileForm, password: e.target.value })} placeholder="••••••••" className={inputClass} /></div>
              </div>
              <div className="flex gap-3">
                <button type="submit" disabled={profileStatus.type === 'loading'} className="px-8 py-3 bg-zinc-900 text-white text-[10px] font-bold uppercase tracking-[0.15em] hover:bg-zinc-800 disabled:opacity-60 transition-colors">Save Changes</button>
                <button type="button" onClick={() => setIsEditing(false)} className="px-8 py-3 border border-zinc-200 text-zinc-600 text-[10px] font-bold uppercase tracking-[0.15em] hover:border-zinc-900 transition-colors">Cancel</button>
              </div>
            </form>
          ) : (
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 bg-zinc-900 flex items-center justify-center text-xl font-bold text-white shrink-0">
                {user.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-lg font-bold text-zinc-900">{user.name}</p>
                <p className="text-sm text-zinc-500">{user.email}</p>
                {user.address && (
                  <p className="text-xs text-zinc-400 flex items-center gap-1 mt-1"><MapPin size={11} />{user.address.street}, {user.address.city}</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Orders */}
        <div id="orders">
          <h2 className="text-2xl font-bold text-zinc-900 tracking-tight mb-6">Order History</h2>

          {orders.length === 0 ? (
            <div className="border border-zinc-100 bg-[#f8f8f8] p-16 text-center flex flex-col items-center gap-4">
              <Package size={28} className="text-zinc-300" />
              <p className="text-sm text-zinc-500">You haven&apos;t placed any orders yet.</p>
              <Link href="/shop" className="px-8 py-3 bg-zinc-900 text-white text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-zinc-800 transition-colors">Start Shopping</Link>
            </div>
          ) : (
            <div className="border border-zinc-100">
              <div className="hidden sm:grid grid-cols-6 text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-400 px-6 py-4 border-b border-zinc-100 bg-[#f8f8f8]">
                <span className="col-span-2">Order</span><span>Date</span><span>Items</span><span>Total</span><span>Status</span>
              </div>
              {orders.map((order, idx) => (
                <div key={order.id || order._id} className={cn('grid grid-cols-2 sm:grid-cols-6 gap-2 px-6 py-5 items-center hover:bg-[#fafafa] transition-colors', idx !== orders.length - 1 && 'border-b border-zinc-100')}>
                  <div className="col-span-2">
                    <p className="text-xs font-bold text-zinc-900 font-mono">{order.trackingNumber || String(order.id || order._id).slice(-8).toUpperCase()}</p>
                  </div>
                  <p className="text-xs text-zinc-400 hidden sm:block">{new Date(order.createdAt || order.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                  <p className="text-xs text-zinc-400 hidden sm:block">{(order.orderItems || order.items || []).length} items</p>
                  <p className="text-xs font-bold text-zinc-900 hidden sm:block">${(order.totalPrice || order.total || 0).toFixed(2)}</p>
                  <div className="flex items-center justify-between sm:justify-start gap-3">
                    <span className={cn('px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider', order.isPaid ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200')}>
                      {order.isPaid ? 'Paid' : (order.status || 'Processing')}
                    </span>
                    <Link href={`/order/${order.id || order._id}`} className="text-[9px] font-bold uppercase tracking-widest text-zinc-400 hover:text-zinc-900 flex items-center gap-1 transition-colors">
                      Track <ChevronRight size={11} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
