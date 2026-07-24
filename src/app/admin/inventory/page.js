'use client';

import { useShop } from '@/context/ShopContext';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { cn } from '@/lib/utils';
import { Search, Loader2 } from 'lucide-react';
import { useState } from 'react';
import axios from 'axios';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5000/api';

const fetchAdminProducts = async () => {
  const { data } = await axios.get(`${API}/products`);
  const raw = data.products || data || [];
  return raw.map(p => ({ ...p, id: String(p._id) }));
};

export default function InventoryPage() {
  const { updateProduct } = useShop();
  const queryClient = useQueryClient();
  const { data: products = [], isLoading } = useQuery({
    queryKey: ['admin-products'],
    queryFn: fetchAdminProducts,
  });
  const [search, setSearch] = useState('');

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const toggleStock = async (p) => {
    try {
      await updateProduct(String(p._id || p.id), { ...p, inStock: !p.inStock });
      await queryClient.invalidateQueries({ queryKey: ['admin-products'] });
    } catch (e) {
      alert('Failed to update stock status');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {isLoading && (
        <div className="flex items-center justify-center h-48">
          <Loader2 className="animate-spin text-zinc-400" size={24} />
        </div>
      )}
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-zinc-900">Inventory</h2>
        <p className="text-sm text-zinc-500 mt-1">Quickly manage stock status for all products.</p>
      </div>

      <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-zinc-100 bg-zinc-50/50">
          <div className="relative max-w-sm">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-zinc-50 text-xs text-zinc-500 font-semibold uppercase tracking-wider border-b border-zinc-200">
              <tr>
                <th className="px-6 py-4">Product</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Current Status</th>
                <th className="px-6 py-4 text-right">Quick Toggle</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {filteredProducts.map((p) => (
                <tr key={p.id || p._id} className="hover:bg-zinc-50 transition-colors">
                  <td className="px-6 py-4 font-semibold text-zinc-900">{p.name}</td>
                  <td className="px-6 py-4 text-zinc-500">${Number(p.price).toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      'px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border',
                      p.inStock !== false ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-red-50 text-red-600 border-red-200'
                    )}>
                      {p.inStock !== false ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => toggleStock(p)}
                      className="px-4 py-1.5 rounded-lg border text-xs font-semibold hover:bg-zinc-50 transition-colors bg-white border-zinc-200 text-zinc-900"
                    >
                      {p.inStock !== false ? 'Mark Out of Stock' : 'Mark In Stock'}
                    </button>
                  </td>
                </tr>
              ))}
              {filteredProducts.length === 0 && (
                <tr><td colSpan={4} className="px-6 py-12 text-center text-zinc-500">No products found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
