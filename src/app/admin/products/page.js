'use client';

import { useState, useEffect } from 'react';
import { useShop } from '@/context/ShopContext';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { cn } from '@/lib/utils';
import { Plus, Edit3, Trash2, X, ImageOff, Search, Upload, Loader2 } from 'lucide-react';
import axios from 'axios';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5000/api';

const fetchAdminProducts = async () => {
  const { data } = await axios.get(`${API}/products`);
  const raw = data.products || data || [];
  return raw.map(p => ({ ...p, id: String(p._id) }));
};

export default function ProductsPage() {
  const { createProduct, updateProduct, deleteProduct, user, getCategories } = useShop();
  const queryClient = useQueryClient();
  const { data: products = [], isLoading } = useQuery({
    queryKey: ['admin-products'],
    queryFn: fetchAdminProducts,
  });
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [dbCategories, setDbCategories] = useState([]);

  useEffect(() => {
    const fetchCats = async () => {
      const data = await getCategories();
      setDbCategories(data || []);
    };
    fetchCats();
  }, [getCategories]);

  const emptyForm = { name: '', price: '', category: '', images: [], description: '', inStock: true, imageColor: '#e5e7eb', imageText: 'Product' };
  const [form, setForm] = useState(emptyForm);

  const filteredProducts = products.filter((p) =>
    p.name?.toLowerCase().includes(search.toLowerCase()) ||
    p.category?.toLowerCase().includes(search.toLowerCase())
  );

  const openAdd = () => {
    setEditingProduct(null);
    setForm(emptyForm);
    setIsModalOpen(true);
  };

  const openEdit = (p) => {
    setEditingProduct(p);
    setForm({
      name: p.name,
      price: p.price,
      category: p.category,
      images: p.images?.length ? p.images : (p.image ? [p.image] : []),
      description: p.description || '',
      inStock: p.inStock !== false,
      imageColor: p.imageColor || '#e5e7eb',
      imageText: p.imageText || p.name.split(' ')[0],
    });
    setIsModalOpen(true);
  };

  const uploadImages = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    if (form.images.length + files.length > 3) {
      alert('Max 3 images per product.');
      return;
    }
    const fd = new FormData();
    files.forEach((f) => fd.append('images', f));
    setUploadingImage(true);
    try {
      const { data } = await axios.post(`${API}/upload`, fd, {
        headers: { Authorization: `Bearer ${user?.token}` },
      });
      setForm((prev) => ({ ...prev, images: [...prev.images, ...data].slice(0, 3) }));
    } catch {
      alert('Upload failed.');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...form, price: Number(form.price), image: form.images[0] || '' };
    try {
      if (editingProduct) {
        await updateProduct(String(editingProduct._id || editingProduct.id), payload);
      } else {
        await createProduct(payload);
      }
      // Invalidate the admin-products query to refetch fresh data
      await queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      setIsModalOpen(false);
    } catch (err) {
      alert('Failed to save product.');
    }
  };

  const handleDelete = async (p) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await deleteProduct(String(p._id || p.id));
      await queryClient.invalidateQueries({ queryKey: ['admin-products'] });
    } catch {
      alert('Failed to delete.');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {isLoading && (
        <div className="flex items-center justify-center h-48">
          <Loader2 className="animate-spin text-zinc-400" size={24} />
        </div>
      )}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900">Products</h2>
          <p className="text-sm text-zinc-500 mt-1">Manage your store's inventory and catalog.</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2.5 bg-zinc-900 text-white rounded-xl font-medium text-sm hover:bg-zinc-800 transition-colors w-full sm:w-auto justify-center"
        >
          <Plus size={16} /> Add Product
        </button>
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
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {filteredProducts.map((p) => {
                const img = p.images?.[0] || p.image;
                return (
                  <tr key={p.id || p._id} className="hover:bg-zinc-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg border border-zinc-200 bg-zinc-50 overflow-hidden flex items-center justify-center shrink-0">
                          {img ? (
                            <img src={img} alt={p.name} className="w-full h-full object-cover" />
                          ) : (
                            <ImageOff size={16} className="text-zinc-400" />
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-zinc-900 truncate max-w-[200px]">{p.name}</p>
                          {p.isNew && <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mt-1 block">New Arrival</span>}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-zinc-500 capitalize">{p.category}</td>
                    <td className="px-6 py-4 font-bold text-zinc-900">${Number(p.price).toFixed(2)}</td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        'px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border',
                        p.inStock !== false ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-red-50 text-red-600 border-red-200'
                      )}>
                        {p.inStock !== false ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEdit(p)}
                          className="p-2 text-zinc-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Edit3 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(p)}
                          className="p-2 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-zinc-500">
                    No products found. Adjust your search or add a new one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-zinc-900/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="relative w-full max-w-2xl bg-white border border-zinc-200 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-y-auto max-h-[90vh] animate-in slide-in-from-bottom-4 duration-300">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-zinc-900">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 rounded-xl transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold text-zinc-700 uppercase tracking-wider mb-2 block">Product Name</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2.5 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900"
                    required
                  />
                </div>
                
                <div>
                  <label className="text-xs font-semibold text-zinc-700 uppercase tracking-wider mb-2 block">Price ($)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2.5 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-zinc-700 uppercase tracking-wider mb-2 block">Category</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2.5 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900"
                    required
                  >
                    <option value="" disabled>Select a category</option>
                    {dbCategories.map(c => (
                      <option key={c._id || c.id} value={c.slug}>{c.name}</option>
                    ))}
                    {dbCategories.length === 0 && <option value="general">General</option>}
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold text-zinc-700 uppercase tracking-wider mb-2 block">Description</label>
                  <textarea
                    rows={4}
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2.5 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900 resize-none"
                  />
                </div>
              </div>

              {/* Images */}
              <div>
                <label className="text-xs font-semibold text-zinc-700 uppercase tracking-wider mb-3 block">Images (Max 3)</label>
                <div className="flex flex-wrap gap-4">
                  {form.images.map((img, idx) => (
                    <div key={idx} className="relative w-24 h-24 rounded-xl border border-zinc-200 overflow-hidden bg-zinc-50 group">
                      <img src={img} alt={`Preview ${idx}`} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setForm((p) => ({ ...p, images: p.images.filter((_, i) => i !== idx) }))}
                        className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                  {form.images.length < 3 && (
                    <label className="w-24 h-24 rounded-xl border-2 border-dashed border-zinc-300 hover:border-zinc-400 hover:bg-zinc-50 flex flex-col items-center justify-center cursor-pointer text-zinc-500 transition-colors">
                      {uploadingImage ? (
                        <span className="text-[10px] font-medium">Uploading...</span>
                      ) : (
                        <>
                          <Upload size={20} className="mb-1" />
                          <span className="text-[10px] font-medium">Upload</span>
                        </>
                      )}
                      <input type="file" multiple accept="image/*" className="hidden" onChange={uploadImages} disabled={uploadingImage} />
                    </label>
                  )}
                </div>
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-3 cursor-pointer select-none w-max">
                  <div className="relative flex items-center">
                    <input
                      type="checkbox"
                      checked={form.inStock}
                      onChange={(e) => setForm({ ...form, inStock: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-10 h-6 bg-zinc-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-zinc-900"></div>
                  </div>
                  <span className="text-sm font-medium text-zinc-900">Product is in stock</span>
                </label>
              </div>

              <div className="flex items-center gap-3 pt-6 border-t border-zinc-100">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-zinc-900 text-white rounded-xl font-medium text-sm hover:bg-zinc-800 transition-colors"
                >
                  {editingProduct ? 'Save Changes' : 'Create Product'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-2.5 bg-white border border-zinc-200 text-zinc-700 rounded-xl font-medium text-sm hover:bg-zinc-50 transition-colors"
                >
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
