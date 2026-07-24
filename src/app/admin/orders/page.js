'use client';

import { useState, useEffect } from 'react';
import { useShop } from '@/context/ShopContext';
import { cn } from '@/lib/utils';
import { Search, Filter, Truck, X } from 'lucide-react';
import axios from 'axios';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5000/api';

export default function OrdersPage() {
  const { user } = useShop();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const [isTrackingModalOpen, setIsTrackingModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [trackingForm, setTrackingForm] = useState({ status: '', location: '', message: '', trackingNumber: '' });
  const [updatingTracking, setUpdatingTracking] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, [user]);

  const fetchOrders = async () => {
    if (!user?.token) return;
    try {
      const { data } = await axios.get(`${API}/orders`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setOrders(data);
    } catch (error) {
      console.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, status) => {
    try {
      await axios.put(
        `${API}/orders/${orderId}/status`,
        { status },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setOrders(orders.map(o => o._id === orderId ? { ...o, status } : o));
    } catch (error) {
      alert('Failed to update status');
    }
  };

  const openTrackingModal = (order) => {
    setSelectedOrder(order);
    setTrackingForm({
      status: order.status,
      location: '',
      message: '',
      trackingNumber: order.trackingNumber || ''
    });
    setIsTrackingModalOpen(true);
  };

  const submitTrackingUpdate = async (e) => {
    e.preventDefault();
    setUpdatingTracking(true);
    try {
      const { data } = await axios.put(
        `${API}/orders/${selectedOrder._id}/tracking`,
        trackingForm,
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setOrders(orders.map(o => o._id === data._id ? data : o));
      setIsTrackingModalOpen(false);
    } catch (err) {
      alert('Failed to update tracking');
    } finally {
      setUpdatingTracking(false);
    }
  };

  const filteredOrders = orders.filter(o => {
    const matchesSearch = 
      (o.trackingNumber || o._id).toLowerCase().includes(search.toLowerCase()) ||
      o.shippingAddress?.firstName?.toLowerCase().includes(search.toLowerCase());
    
    const matchesStatus = statusFilter === 'All' || o.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-zinc-900">Orders</h2>
        <p className="text-sm text-zinc-500 mt-1">Manage and track customer orders.</p>
      </div>

      <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-zinc-100 bg-zinc-50/50 flex flex-col sm:flex-row gap-4 justify-between">
          <div className="relative max-w-sm w-full">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              placeholder="Search by ID or customer..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-zinc-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-white border border-zinc-200 rounded-xl px-3 py-2 text-sm text-zinc-700 focus:outline-none focus:ring-2 focus:ring-zinc-900"
            >
              <option value="All">All Statuses</option>
              <option value="Processing">Processing</option>
              <option value="Shipped">Shipped</option>
              <option value="In Transit">In Transit</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-zinc-50 text-xs text-zinc-500 font-semibold uppercase tracking-wider border-b border-zinc-200">
              <tr>
                <th className="px-6 py-4">Order ID</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Total</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {loading ? (
                <tr><td colSpan={6} className="px-6 py-12 text-center text-zinc-500">Loading orders...</td></tr>
              ) : filteredOrders.map((o) => (
                <tr key={o._id} className="hover:bg-zinc-50 transition-colors">
                  <td className="px-6 py-4 font-mono text-xs font-medium text-zinc-600">
                    {o.trackingNumber || String(o._id).slice(-8)}
                  </td>
                  <td className="px-6 py-4 text-zinc-500">
                    {new Date(o.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 font-medium text-zinc-900">
                    {o.shippingAddress?.firstName || '—'} {o.shippingAddress?.lastName || ''}
                  </td>
                  <td className="px-6 py-4 font-bold text-zinc-900">
                    ${(o.totalPrice || 0).toFixed(2)}
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={o.status || 'Processing'}
                      onChange={(e) => handleStatusChange(o._id, e.target.value)}
                      className={cn(
                        'text-xs font-semibold rounded-lg px-2 py-1.5 focus:outline-none border',
                        o.status === 'Delivered' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' :
                        o.status === 'Shipped' ? 'bg-blue-50 border-blue-200 text-blue-700' :
                        o.status === 'In Transit' ? 'bg-purple-50 border-purple-200 text-purple-700' :
                        o.status === 'Cancelled' ? 'bg-red-50 border-red-200 text-red-700' :
                        'bg-zinc-100 border-zinc-200 text-zinc-700'
                      )}
                    >
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="In Transit">In Transit</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => openTrackingModal(o)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 rounded-lg text-xs font-semibold transition-colors"
                    >
                      <Truck size={14} /> Tracking
                    </button>
                  </td>
                </tr>
              ))}
              {!loading && filteredOrders.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-zinc-500">
                    No orders found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Tracking Modal */}
      {isTrackingModalOpen && selectedOrder && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-zinc-900/40 backdrop-blur-sm" onClick={() => setIsTrackingModalOpen(false)} />
          <div className="relative w-full max-w-lg bg-white border border-zinc-200 rounded-3xl p-6 sm:p-8 shadow-2xl animate-in slide-in-from-bottom-4 duration-300">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-zinc-900">Update Tracking</h3>
              <button onClick={() => setIsTrackingModalOpen(false)} className="p-2 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 rounded-xl transition-colors">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={submitTrackingUpdate} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-zinc-700 uppercase tracking-wider mb-2 block">Tracking Number</label>
                <input
                  type="text"
                  value={trackingForm.trackingNumber}
                  onChange={(e) => setTrackingForm({ ...trackingForm, trackingNumber: e.target.value })}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2.5 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900"
                  placeholder="e.g. UPS-123456789"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-zinc-700 uppercase tracking-wider mb-2 block">Order Status</label>
                <select
                  value={trackingForm.status}
                  onChange={(e) => setTrackingForm({ ...trackingForm, status: e.target.value })}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2.5 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900"
                  required
                >
                  <option value="Processing">Processing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="In Transit">In Transit</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-zinc-700 uppercase tracking-wider mb-2 block">Current Location</label>
                <input
                  type="text"
                  value={trackingForm.location}
                  onChange={(e) => setTrackingForm({ ...trackingForm, location: e.target.value })}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2.5 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900"
                  placeholder="e.g. Sort Facility, NY"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-zinc-700 uppercase tracking-wider mb-2 block">Update Message</label>
                <textarea
                  rows={2}
                  value={trackingForm.message}
                  onChange={(e) => setTrackingForm({ ...trackingForm, message: e.target.value })}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2.5 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900 resize-none"
                  placeholder="e.g. Package has arrived at the carrier facility."
                  required
                />
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-zinc-100">
                <button type="submit" disabled={updatingTracking} className="px-6 py-2.5 bg-zinc-900 text-white rounded-xl font-medium text-sm hover:bg-zinc-800 transition-colors disabled:opacity-50 flex items-center gap-2">
                  {updatingTracking ? 'Updating...' : 'Push Update'}
                </button>
                <button type="button" onClick={() => setIsTrackingModalOpen(false)} className="px-6 py-2.5 bg-white border border-zinc-200 text-zinc-700 rounded-xl font-medium text-sm hover:bg-zinc-50 transition-colors">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
