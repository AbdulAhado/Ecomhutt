'use client';

import { useState, useMemo, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { SlidersHorizontal, ChevronDown, X } from 'lucide-react';
import ProductCard from '@/components/product/ProductCard';
import { useShop } from '@/context/ShopContext';
import { useQuery } from '@tanstack/react-query';
import { fetchProducts } from '@/lib/api';
import { cn } from '@/lib/utils';

function ShopContent() {
  const { data: products = [] } = useQuery({ queryKey: ['products'], queryFn: fetchProducts });
  const searchParams = useSearchParams();
  const router = useRouter();

  const [categoryFilter, setCategoryFilter] = useState(searchParams.get('category') || 'all');
  const [sortBy, setSortBy] = useState('featured');
  const [filterOpen, setFilterOpen] = useState(false);

  const categories = useMemo(() => {
    const cats = new Set(products.map((p) => p.category).filter(Boolean));
    return ['all', ...Array.from(cats)];
  }, [products]);

  const searchVal = searchParams.get('search') || '';

  const handleCategoryChange = (cat) => {
    setCategoryFilter(cat);
    const params = new URLSearchParams(searchParams.toString());
    cat === 'all' ? params.delete('category') : params.set('category', cat);
    router.push(`/shop?${params.toString()}`);
  };

  const filteredProducts = products.filter((product) => {
    if (searchVal && !product.name?.toLowerCase().includes(searchVal.toLowerCase())) return false;
    if (categoryFilter !== 'all' && product.category?.toLowerCase() !== categoryFilter.toLowerCase()) return false;
    return true;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
    return (b.inStock ? 1 : 0) - (a.inStock ? 1 : 0);
  });

  return (
    <div className="min-h-screen bg-white pt-[90px]">

      {/* Page Hero */}
      <div className="border-b border-zinc-100 py-16 px-6 md:px-12 max-w-[1600px] mx-auto">
        <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-zinc-400 block mb-4">EcomHutt Collection</span>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-zinc-900 leading-none">
            Shop All
          </h1>
          {searchVal && (
            <p className="text-sm text-zinc-500 font-medium">
              Results for &ldquo;<span className="text-zinc-900 font-bold">{searchVal}</span>&rdquo; — {filteredProducts.length} items
            </p>
          )}
        </div>
      </div>

      {/* Toolbar */}
      <div className="sticky top-[90px] z-30 bg-white border-b border-zinc-100">
        <div className="max-w-[1600px] mx-auto px-6 md:px-12 h-14 flex items-center justify-between gap-4 text-[10px] font-bold uppercase tracking-[0.2em]">
          <div className="flex items-center gap-8">
            <button
              onClick={() => setFilterOpen(!filterOpen)}
              className="flex items-center gap-2 text-zinc-900 hover:text-zinc-500 transition-colors"
            >
              <SlidersHorizontal size={13} /> Filters
            </button>
            {/* Category Pills */}
            <div className="hidden md:flex items-center gap-6 text-zinc-400">
              {categories.slice(0, 6).map(cat => (
                <button
                  key={cat}
                  onClick={() => handleCategoryChange(cat)}
                  className={cn(
                    'hover:text-zinc-900 transition-colors pb-0.5',
                    categoryFilter.toLowerCase() === cat.toLowerCase()
                      ? 'text-zinc-900 border-b border-zinc-900'
                      : ''
                  )}
                >
                  {cat === 'all' ? 'All' : cat}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 text-zinc-400">
            <span className="hidden sm:inline">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent text-zinc-900 font-bold focus:outline-none cursor-pointer text-[10px] uppercase tracking-[0.2em]"
            >
              <option value="featured">Featured</option>
              <option value="price-asc">Price ↑</option>
              <option value="price-desc">Price ↓</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
        </div>
      </div>

      {/* Filter Drawer (mobile) */}
      {filterOpen && (
        <div className="fixed inset-0 z-50 bg-white pt-24 px-8 flex flex-col gap-8 animate-in fade-in duration-200 md:hidden">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-widest">Filters</h3>
            <button onClick={() => setFilterOpen(false)}><X size={20} /></button>
          </div>
          <div className="flex flex-col gap-4">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">Category</span>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => { handleCategoryChange(cat); setFilterOpen(false); }}
                className={cn('text-left text-sm font-semibold transition-colors', categoryFilter.toLowerCase() === cat.toLowerCase() ? 'text-zinc-900' : 'text-zinc-400')}
              >
                {cat === 'all' ? 'All Products' : cat}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Products Grid */}
      <div className="max-w-[1600px] mx-auto px-6 md:px-12 py-16">
        <div className="flex items-center justify-between mb-10">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">
            {sortedProducts.length} Products
          </span>
          {categoryFilter !== 'all' && (
            <button onClick={() => handleCategoryChange('all')} className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-zinc-500 hover:text-zinc-900 transition-colors">
              <X size={12} /> Clear Filter
            </button>
          )}
        </div>

        {sortedProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-14">
            {sortedProducts.map((product) => (
              <ProductCard key={product.id || product._id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-32 space-y-5">
            <div className="text-6xl text-zinc-200">∅</div>
            <h3 className="text-xl font-bold text-zinc-900">No items found</h3>
            <p className="text-sm text-zinc-500 max-w-sm mx-auto">Your current filter did not match any products.</p>
            <button onClick={() => handleCategoryChange('all')} className="mt-4 px-8 py-3 bg-zinc-900 text-white text-[10px] font-bold uppercase tracking-[0.15em] hover:bg-zinc-800 transition-colors">
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white pt-32 text-center text-zinc-400 text-sm">Loading catalog...</div>}>
      <ShopContent />
    </Suspense>
  );
}
