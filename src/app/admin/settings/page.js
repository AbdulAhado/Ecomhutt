'use client';

import { useState } from 'react';
import { useShop } from '@/context/ShopContext';
import { cn } from '@/lib/utils';
import axios from 'axios';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5000/api';

export default function SettingsPage() {
  const { user } = useShop();
  const [userForm, setUserForm] = useState({ name: '', email: '', password: '', role: 'lister' });
  const [userFormStatus, setUserFormStatus] = useState({ type: '', message: '' });

  const handleUserSubmit = async (e) => {
    e.preventDefault();
    setUserFormStatus({ type: 'loading', message: 'Creating...' });
    
    try {
      const { data } = await axios.post(`${API}/users/admin`, userForm, {
        headers: { Authorization: `Bearer ${user?.token}` }
      });
      setUserFormStatus({ type: 'success', message: `User "${data.name}" created!` });
      setUserForm({ name: '', email: '', password: '', role: 'lister' });
    } catch (err) {
      setUserFormStatus({ 
        type: 'error', 
        message: err.response?.data?.message || 'Failed to create user.' 
      });
    }
  };

  if (user?.role !== 'admin') {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-zinc-500">
        <h2 className="text-xl font-bold text-zinc-900 mb-2">Access Denied</h2>
        <p>Only administrators can access system settings.</p>
      </div>
    );
  }

  const inputClass = 'w-full bg-white border border-zinc-200 rounded-xl px-4 py-2.5 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900';

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-zinc-900">Settings</h2>
        <p className="text-sm text-zinc-500 mt-1">Manage store preferences and staff accounts.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-1">
          <h3 className="font-bold text-zinc-900 text-base">Staff Accounts</h3>
          <p className="text-sm text-zinc-500">Create new staff accounts with specific roles.</p>
        </div>
        
        <div className="lg:col-span-2 bg-white rounded-2xl border border-zinc-200 shadow-sm p-6 sm:p-8">
          {userFormStatus.message && (
            <div className={cn(
              'p-4 rounded-xl text-sm mb-6 font-medium', 
              userFormStatus.type === 'error' ? 'bg-red-50 text-red-600 border border-red-200' : 
              userFormStatus.type === 'success' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 
              'bg-zinc-50 text-zinc-600 border border-zinc-200'
            )}>
              {userFormStatus.message}
            </div>
          )}
          
          <form onSubmit={handleUserSubmit} className="space-y-5 max-w-md">
            <div>
              <label className="text-xs font-semibold text-zinc-700 uppercase tracking-wider mb-2 block">Full Name</label>
              <input 
                type="text" 
                value={userForm.name} 
                onChange={(e) => setUserForm({ ...userForm, name: e.target.value })} 
                placeholder="Alexandra Morrison" 
                className={inputClass} 
                required 
              />
            </div>
            
            <div>
              <label className="text-xs font-semibold text-zinc-700 uppercase tracking-wider mb-2 block">Email Address</label>
              <input 
                type="email" 
                value={userForm.email} 
                onChange={(e) => setUserForm({ ...userForm, email: e.target.value })} 
                placeholder="admin@example.com" 
                className={inputClass} 
                required 
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-zinc-700 uppercase tracking-wider mb-2 block">Password</label>
              <input 
                type="password" 
                value={userForm.password} 
                onChange={(e) => setUserForm({ ...userForm, password: e.target.value })} 
                placeholder="••••••••" 
                className={inputClass} 
                required 
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-zinc-700 uppercase tracking-wider mb-2 block">Role</label>
              <select 
                value={userForm.role} 
                onChange={(e) => setUserForm({ ...userForm, role: e.target.value })} 
                className={inputClass}
              >
                <option value="lister">Lister (Products only)</option>
                <option value="admin">Admin (Full access)</option>
              </select>
            </div>
            
            <button 
              type="submit" 
              disabled={userFormStatus.type === 'loading'} 
              className="w-full py-2.5 bg-zinc-900 text-white rounded-xl font-medium text-sm hover:bg-zinc-800 disabled:opacity-60 transition-colors mt-2"
            >
              {userFormStatus.type === 'loading' ? 'Creating...' : 'Create Staff User'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
