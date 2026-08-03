'use client';

import { useState, useEffect, useRef } from 'react';
import { useShop } from '@/context/ShopContext';
import Image from 'next/image';
import { Plus, Edit3, Trash2, X, Search, Upload, ImageIcon, CheckCircle2, AlertCircle, Loader2, LayoutGrid } from 'lucide-react';
import axios from 'axios';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5000/api';
const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://127.0.0.1:5000';

// 5 hero section default categories — match exactly with public/images/categories/
const HERO_DEFAULTS = [
  { name: 'Beauty',      slug: 'beauty',      icon: '💄', image: '/images/categories/beauty.png',      description: 'Premium skincare and cosmetics for the modern lifestyle.' },
  { name: 'Shoes',       slug: 'shoes',       icon: '👟', image: '/images/categories/shoes.png',       description: 'Handcrafted leather shoes blending luxury and comfort.' },
  { name: 'Fashion',     slug: 'fashion',     icon: '👗', image: '/images/categories/fashion.png',     description: 'Natural fabrics and elegant silhouettes for every occasion.' },
  { name: 'Electronics', slug: 'electronics', icon: '📱', image: '/images/categories/electronics.png', description: 'State-of-the-art gadgets for your minimalist workspace.' },
  { name: 'Furniture',   slug: 'furniture',   icon: '🛋️', image: '/images/categories/furniture.png',   description: 'Curated home interiors for elegant and tranquil living.' },
];

function Toggle({ checked, onChange, label }) {
  return (
    <label className="flex items-center gap-3 cursor-pointer select-none">
      <div className="relative flex items-center">
        <input type="checkbox" checked={checked} onChange={onChange} className="sr-only peer" />
        <div className="w-10 h-6 bg-zinc-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-zinc-900" />
      </div>
      <span className="text-sm font-medium text-zinc-900">{label}</span>
    </label>
  );
}

export default function CategoriesPage() {
  const { user } = useShop();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [seeding, setSeeding] = useState(false);
  const [seedMsg, setSeedMsg] = useState('');
  const fileRef = useRef(null);

  const emptyForm = {
    name: '', slug: '', icon: '🛒', description: '',
    image: '', isActive: true, showInHero: false, order: 0,
  };
  const [form, setForm] = useState(emptyForm);
  const [imagePreview, setImagePreview] = useState('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => { fetchCategories(); }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${API}/categories`);
      setCategories(data);
    } catch { /* silent */ } finally {
      setLoading(false);
    }
  };

  // ── Seed 5 default hero categories ──────────────────────────
  const seedDefaults = async () => {
    if (!window.confirm('This will add the 5 hero section categories (Beauty, Shoes, Fashion, Electronics, Furniture) if they don\'t already exist. Continue?')) return;
    setSeeding(true);
    setSeedMsg('');
    const config = { headers: { Authorization: `Bearer ${user?.token}` } };
    let added = 0;
    for (const cat of HERO_DEFAULTS) {
      const exists = categories.find(c => c.slug === cat.slug);
      if (!exists) {
        try {
          await axios.post(`${API}/categories`, { ...cat, isActive: true, showInHero: true, order: HERO_DEFAULTS.indexOf(cat) }, config);
          added++;
        } catch { /* already exists */ }
      }
    }
    await fetchCategories();
    setSeeding(false);
    setSeedMsg(added === 0 ? 'All default categories already exist.' : `${added} default categor${added > 1 ? 'ies' : 'y'} added!`);
    setTimeout(() => setSeedMsg(''), 4000);
  };

  const filteredCategories = categories.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const openAdd = () => {
    setEditingCategory(null);
    setForm({ ...emptyForm, order: categories.length });
    setImagePreview('');
    setIsModalOpen(true);
  };

  const openEdit = (c) => {
    setEditingCategory(c);
    setForm({
      name: c.name, slug: c.slug, icon: c.icon || '🛒',
      description: c.description || '', image: c.image || '',
      isActive: c.isActive, showInHero: c.showInHero, order: c.order || 0,
    });
    setImagePreview(c.image ? (c.image.startsWith('http') ? c.image : `${BACKEND}${c.image}`) : '');
    setIsModalOpen(true);
  };

  // ── Image upload ─────────────────────────────────────────────
  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Local preview immediately
    setImagePreview(URL.createObjectURL(file));
    setUploading(true);

    const fd = new FormData();
    fd.append('images', file);
    try {
      const { data } = await axios.post(`${API.replace('/api', '')}/api/upload`, fd, {
        headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${user?.token}` },
      });
      const url = Array.isArray(data) ? data[0] : data;
      setForm(f => ({ ...f, image: url }));
      setImagePreview(url);
    } catch (err) {
      alert('Image upload failed. Check Cloudinary config.');
      setImagePreview('');
    } finally {
      setUploading(false);
    }
  };

  // ── Save ─────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    const config = { headers: { Authorization: `Bearer ${user?.token}` } };
    try {
      if (editingCategory) {
        await axios.put(`${API}/categories/${editingCategory._id}`, form, config);
      } else {
        await axios.post(`${API}/categories`, form, config);
      }
      fetchCategories();
      setIsModalOpen(false);
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to save category');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this category?')) return;
    const config = { headers: { Authorization: `Bearer ${user?.token}` } };
    try {
      await axios.delete(`${API}/categories/${id}`, config);
      fetchCategories();
    } catch { alert('Failed to delete category'); }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900">Categories</h2>
          <p className="text-sm text-zinc-500 mt-1">Organize your products into collections.</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Seed defaults button */}
          <button
            onClick={seedDefaults}
            disabled={seeding}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-zinc-200 text-zinc-700 rounded-xl font-medium text-sm hover:bg-zinc-50 hover:border-zinc-300 transition-colors disabled:opacity-60"
          >
            {seeding ? <Loader2 size={15} className="animate-spin" /> : <LayoutGrid size={15} />}
            Seed 5 Defaults
          </button>
          <button
            onClick={openAdd}
            className="flex items-center gap-2 px-4 py-2.5 bg-zinc-900 text-white rounded-xl font-medium text-sm hover:bg-zinc-800 transition-colors"
          >
            <Plus size={16} /> Add Category
          </button>
        </div>
      </div>

      {/* Seed success message */}
      {seedMsg && (
        <div className="flex items-center gap-2 px-4 py-3 bg-emerald-50 border border-emerald-200 rounded-xl text-sm text-emerald-700 font-medium">
          <CheckCircle2 size={16} /> {seedMsg}
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-zinc-100 bg-zinc-50/50">
          <div className="relative max-w-sm">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text" placeholder="Search categories..."
              value={search} onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-zinc-50 text-xs text-zinc-500 font-semibold uppercase tracking-wider border-b border-zinc-200">
              <tr>
                <th className="px-5 py-4">Category</th>
                <th className="px-5 py-4">Image</th>
                <th className="px-5 py-4">Slug</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4">In Hero Nav</th>
                <th className="px-5 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {loading ? (
                <tr><td colSpan={6} className="px-5 py-12 text-center text-zinc-400"><Loader2 size={20} className="animate-spin mx-auto" /></td></tr>
              ) : filteredCategories.map((c) => {
                const imgSrc = c.image ? (c.image.startsWith('http') ? c.image : `${BACKEND}${c.image}`) : '';
                return (
                  <tr key={c._id} className="hover:bg-zinc-50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{c.icon}</span>
                        <span className="font-semibold text-zinc-900">{c.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      {imgSrc ? (
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-zinc-100">
                          <Image src={imgSrc} alt={c.name} fill className="object-cover" />
                        </div>
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-zinc-100 flex items-center justify-center">
                          <ImageIcon size={18} className="text-zinc-300" />
                        </div>
                      )}
                    </td>
                    <td className="px-5 py-4 text-zinc-500 font-mono text-xs">{c.slug}</td>
                    <td className="px-5 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${c.isActive ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-zinc-100 text-zinc-500 border-zinc-200'}`}>
                        {c.isActive ? 'Active' : 'Hidden'}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${c.showInHero ? 'bg-blue-50 text-blue-600 border-blue-200' : 'bg-zinc-100 text-zinc-500 border-zinc-200'}`}>
                        {c.showInHero ? 'Yes' : 'No'}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => openEdit(c)} className="p-2 text-zinc-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><Edit3 size={16} /></button>
                        <button onClick={() => handleDelete(c._id)} className="p-2 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {!loading && filteredCategories.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-16 text-center">
                    <p className="text-zinc-500 text-sm mb-2">No categories yet.</p>
                    <button onClick={seedDefaults} className="text-xs font-semibold text-zinc-700 underline underline-offset-2">
                      Add the 5 default hero categories
                    </button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Modal ─────────────────────────────────────────────── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-zinc-900/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="relative w-full max-w-lg bg-white border border-zinc-200 rounded-3xl p-6 sm:p-8 shadow-2xl animate-in slide-in-from-bottom-4 duration-300 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-zinc-900">{editingCategory ? 'Edit Category' : 'Add Category'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 rounded-xl transition-colors"><X size={20} /></button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Name */}
              <div>
                <label className="text-xs font-semibold text-zinc-700 uppercase tracking-wider mb-2 block">Name</label>
                <input
                  type="text" value={form.name} required
                  onChange={(e) => {
                    const name = e.target.value;
                    setForm({ ...form, name, slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') });
                  }}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2.5 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900"
                />
              </div>

              {/* Slug */}
              <div>
                <label className="text-xs font-semibold text-zinc-700 uppercase tracking-wider mb-2 block">Slug <span className="text-zinc-400 normal-case font-normal">(auto-generated from name, URL-friendly)</span></label>
                <input
                  type="text" value={form.slug} required
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2.5 text-sm text-zinc-900 font-mono focus:outline-none focus:ring-2 focus:ring-zinc-900"
                />
              </div>

              {/* Category Image */}
              <div>
                <label className="text-xs font-semibold text-zinc-700 uppercase tracking-wider mb-2 block">Category Image</label>
                <div
                  onClick={() => fileRef.current?.click()}
                  className="relative w-full h-36 border-2 border-dashed border-zinc-200 rounded-xl overflow-hidden cursor-pointer hover:border-zinc-400 transition-colors group bg-zinc-50 flex items-center justify-center"
                >
                  {imagePreview ? (
                    <>
                      <Image src={imagePreview} alt="preview" fill className="object-cover" />
                      <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="text-white text-xs font-bold uppercase tracking-widest">Change Image</span>
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-zinc-400">
                      {uploading ? <Loader2 size={24} className="animate-spin" /> : <Upload size={24} />}
                      <span className="text-xs font-medium">{uploading ? 'Uploading...' : 'Click to upload category image'}</span>
                    </div>
                  )}
                </div>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                {imagePreview && !uploading && (
                  <button
                    type="button"
                    onClick={() => { setImagePreview(''); setForm(f => ({ ...f, image: '' })); }}
                    className="mt-1.5 text-xs text-red-500 hover:underline"
                  >
                    Remove image
                  </button>
                )}
              </div>

              {/* Icon */}
              <div>
                <label className="text-xs font-semibold text-zinc-700 uppercase tracking-wider mb-2 block">Icon (Emoji)</label>
                <input
                  type="text" value={form.icon}
                  onChange={(e) => setForm({ ...form, icon: e.target.value })}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2.5 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900"
                  placeholder="e.g. 👗"
                />
              </div>

              {/* Description */}
              <div>
                <label className="text-xs font-semibold text-zinc-700 uppercase tracking-wider mb-2 block">Description <span className="text-zinc-400 normal-case font-normal">(optional)</span></label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={2}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2.5 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900 resize-none"
                  placeholder="Short description shown on the category hero page"
                />
              </div>

              {/* Toggles */}
              <div className="pt-1 flex flex-col gap-3">
                <Toggle checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} label="Active (visible to customers)" />
                <Toggle checked={form.showInHero} onChange={(e) => setForm({ ...form, showInHero: e.target.checked })} label="Show in Hero Categories Navigation" />
              </div>

              {/* Buttons */}
              <div className="flex items-center gap-3 pt-5 border-t border-zinc-100">
                <button
                  type="submit"
                  disabled={uploading}
                  className="px-6 py-2.5 bg-zinc-900 text-white rounded-xl font-medium text-sm hover:bg-zinc-800 transition-colors disabled:opacity-60"
                >
                  {uploading ? 'Uploading image…' : editingCategory ? 'Save Changes' : 'Create Category'}
                </button>
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2.5 bg-white border border-zinc-200 text-zinc-700 rounded-xl font-medium text-sm hover:bg-zinc-50 transition-colors">
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
