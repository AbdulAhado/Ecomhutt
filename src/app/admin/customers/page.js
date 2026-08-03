'use client';

import { useState, useEffect } from 'react';
import { useShop } from '@/context/ShopContext';
import { Search, MoreVertical, Shield, User, Store, AlertCircle, CheckCircle2, XCircle, ShieldCheck, Check } from 'lucide-react';
import axios from 'axios';
import { cn } from '@/lib/utils';
import ConfirmModal from '@/components/ui/ConfirmModal';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function UsersPage() {
  const { user } = useShop();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('all'); // all, admin, lister, customer
  
  // For role update menu and confirmation modal
  const [openMenuId, setOpenMenuId] = useState(null);
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    confirmText: 'Confirm',
    variant: 'danger',
    onConfirm: () => {},
  });

  useEffect(() => {
    fetchUsers();
  }, [user]);

  const fetchUsers = async () => {
    if (!user?.token || user.role !== 'admin') {
      setLoading(false);
      return;
    }
    try {
      const { data } = await axios.get(`${API}/users`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setUsers(data);
    } catch (error) {
      console.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id) => {
    setConfirmModal({
      isOpen: true,
      title: 'Delete User Account',
      message: 'Are you sure you want to delete this user? This action cannot be undone.',
      confirmText: 'Delete User',
      variant: 'danger',
      onConfirm: async () => {
        try {
          await axios.delete(`${API}/users/${id}`, {
            headers: { Authorization: `Bearer ${user.token}` }
          });
          fetchUsers();
        } catch (error) {
          console.error(error);
        } finally {
          setConfirmModal(prev => ({ ...prev, isOpen: false }));
        }
      }
    });
  };

  const handleToggleRole = async (id, targetRole) => {
    try {
      await axios.put(`${API}/users/${id}/role`, { role: targetRole }, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      fetchUsers();
    } catch (error) {
      console.error('Failed to update role', error);
    }
  };

  const handleToggleVerification = (id, currentStatus) => {
    const actionText = currentStatus ? 'unverify' : 'verify (bypass OTP)';
    setConfirmModal({
      isOpen: true,
      title: currentStatus ? 'Unverify Account' : 'Verify Account (Bypass OTP)',
      message: `Are you sure you want to ${actionText} this user account?`,
      confirmText: currentStatus ? 'Unverify' : 'Verify Account',
      variant: currentStatus ? 'warning' : 'info',
      onConfirm: async () => {
        try {
          await axios.put(`${API}/users/${id}/verify`, { isVerified: !currentStatus }, {
            headers: { Authorization: `Bearer ${user.token}` }
          });
          fetchUsers();
        } catch (error) {
          console.error(error);
        } finally {
          setConfirmModal(prev => ({ ...prev, isOpen: false }));
        }
      }
    });
  };

  if (user?.role !== 'admin') {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-zinc-500">
        <AlertCircle size={48} className="mb-4 text-red-400" />
        <h2 className="text-xl font-bold text-zinc-900 mb-2">Access Denied</h2>
        <p>You need administrator privileges to view this page.</p>
      </div>
    );
  }

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.name?.toLowerCase().includes(search.toLowerCase()) || 
                          u.email?.toLowerCase().includes(search.toLowerCase());
    const userRoles = u.roles && u.roles.length > 0 ? u.roles : [u.role || 'customer'];
    const matchesTab = activeTab === 'all' || userRoles.includes(activeTab);
    return matchesSearch && matchesTab;
  });

  const stats = {
    all: users.length,
    admin: users.filter(u => (u.roles || [u.role]).includes('admin')).length,
    lister: users.filter(u => (u.roles || [u.role]).includes('lister')).length,
    customer: users.filter(u => (u.roles || [u.role]).includes('customer')).length,
  };

  return (
    <div className="max-w-6xl mx-auto pb-12">
      <div className="space-y-6 animate-in fade-in duration-500">
        
        {/* Header */}
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900">Users & Roles</h2>
          <p className="text-sm text-zinc-500 mt-1">Manage system user roles, multiple permissions, and OTP verification status.</p>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center bg-white p-4 rounded-2xl border border-zinc-200 shadow-sm">
          
          {/* Tabs */}
          <div className="flex bg-zinc-100 p-1 rounded-xl w-full sm:w-auto overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
            {['all', 'admin', 'lister', 'customer'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  'px-4 py-2 text-xs font-semibold rounded-lg capitalize transition-all whitespace-nowrap flex-1 sm:flex-none text-center',
                  activeTab === tab 
                    ? 'bg-white text-zinc-900 shadow-sm' 
                    : 'text-zinc-500 hover:text-zinc-900'
                )}
              >
                {tab} <span className="ml-1 opacity-50">({stats[tab]})</span>
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
            <input
              type="text"
              placeholder="Search users..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 transition-all"
            />
          </div>
        </div>

        {/* Table */}
        <div className="bg-white border border-zinc-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-zinc-50 text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Active Roles</th>
                  <th className="px-6 py-4">OTP Verification</th>
                  <th className="px-6 py-4">Joined Date</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {loading ? (
                  <tr><td colSpan={5} className="px-6 py-12 text-center text-zinc-500">Loading users...</td></tr>
                ) : filteredUsers.length === 0 ? (
                  <tr><td colSpan={5} className="px-6 py-12 text-center text-zinc-500">No users found in this category.</td></tr>
                ) : filteredUsers.map((u) => {
                  const userRoles = u.roles && u.roles.length > 0 ? u.roles : [u.role || 'customer'];
                  return (
                    <tr key={u._id} className="hover:bg-zinc-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-900 font-bold uppercase overflow-hidden relative border border-zinc-200">
                             {u.image ? (
                               <Image src={u.image.startsWith('http') ? u.image : `${API.replace('/api', '')}${u.image}`} alt={u.name} fill className="object-cover" />
                             ) : (
                               u.name?.charAt(0) || 'U'
                             )}
                          </div>
                          <div>
                            <p className="font-semibold text-zinc-900">{u.name}</p>
                            <p className="text-xs text-zinc-500">{u.email}</p>
                          </div>
                        </div>
                      </td>

                      {/* Active Roles */}
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap items-center gap-1.5">
                          {userRoles.map((r) => (
                            <span 
                              key={r}
                              className={cn(
                                'px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border flex items-center gap-1',
                                r === 'admin' ? 'bg-purple-50 text-purple-600 border-purple-200' :
                                r === 'lister' ? 'bg-blue-50 text-blue-600 border-blue-200' :
                                'bg-zinc-100 text-zinc-600 border-zinc-200'
                              )}
                            >
                              {r === 'admin' && <Shield size={10} />}
                              {r === 'lister' && <Store size={10} />}
                              {r === 'customer' && <User size={10} />}
                              {r}
                            </span>
                          ))}
                        </div>
                      </td>

                      {/* Verification Status */}
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleToggleVerification(u._id, u.isVerified)}
                          title="Click to toggle OTP verification status"
                          className={cn(
                            'px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border flex items-center gap-1.5 transition-all hover:scale-105',
                            u.isVerified 
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100' 
                              : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
                          )}
                        >
                          {u.isVerified ? (
                            <>
                              <CheckCircle2 size={12} className="text-emerald-600" />
                              <span>Verified (No OTP)</span>
                            </>
                          ) : (
                            <>
                              <AlertCircle size={12} className="text-amber-600" />
                              <span>Unverified (Needs OTP)</span>
                            </>
                          )}
                        </button>
                      </td>

                      <td className="px-6 py-4 text-zinc-500 font-mono text-xs">
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>

                      {/* Actions Menu */}
                      <td className="px-6 py-4 text-right relative">
                        {u._id !== user._id && (
                          <div className="relative inline-block text-left">
                            <button
                              onClick={() => setOpenMenuId(openMenuId === u._id ? null : u._id)}
                              className="p-2 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg transition-colors"
                            >
                              <MoreVertical size={16} />
                            </button>

                            {/* Dropdown Menu */}
                            {openMenuId === u._id && (
                              <div className="absolute right-0 mt-2 w-52 bg-white border border-zinc-200 rounded-xl shadow-xl z-50 py-2 overflow-hidden animate-in fade-in zoom-in-95">
                                
                                <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-zinc-400">Toggle Roles</div>
                                
                                {['customer', 'lister', 'admin'].map((r) => {
                                  const hasRole = userRoles.includes(r);
                                  return (
                                    <button
                                      key={r}
                                      onClick={() => handleToggleRole(u._id, r)}
                                      className="w-full text-left px-3.5 py-2 text-xs font-medium flex items-center justify-between text-zinc-700 hover:bg-zinc-100 transition-colors"
                                    >
                                      <span className="capitalize">Role: {r}</span>
                                      {hasRole && <Check size={14} className="text-emerald-600 font-bold" />}
                                    </button>
                                  );
                                })}

                                <div className="h-px bg-zinc-100 my-1.5" />
                                
                                <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-zinc-400">Account Verification</div>
                                
                                <button
                                  onClick={() => {
                                    setOpenMenuId(null);
                                    handleToggleVerification(u._id, u.isVerified);
                                  }}
                                  className="w-full text-left px-3.5 py-2 text-xs font-medium text-amber-700 hover:bg-amber-50 transition-colors flex items-center gap-2"
                                >
                                  <ShieldCheck size={14} />
                                  {u.isVerified ? 'Mark Unverified' : 'Verify (Bypass OTP)'}
                                </button>

                                <div className="h-px bg-zinc-100 my-1.5" />

                                <button
                                  onClick={() => {
                                    setOpenMenuId(null);
                                    handleDelete(u._id);
                                  }}
                                  className="w-full text-left px-3.5 py-2 text-xs font-medium text-red-600 hover:bg-red-50 transition-colors"
                                >
                                  Delete User
                                </button>
                              </div>
                            )}
                          </div>
                        )}
                        
                        {/* Close menu overlay */}
                        {openMenuId === u._id && (
                          <div 
                            className="fixed inset-0 z-40" 
                            onClick={() => setOpenMenuId(null)} 
                          />
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
        onConfirm={confirmModal.onConfirm}
        title={confirmModal.title}
        message={confirmModal.message}
        confirmText={confirmModal.confirmText}
        variant={confirmModal.variant}
      />
    </div>
  );
}

