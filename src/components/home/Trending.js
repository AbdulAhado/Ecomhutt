'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { ArrowRight, Loader2 } from 'lucide-react';
import { fetchProducts } from '@/lib/api';
import ProductCard from '../product/ProductCard';

export default function Trending() {
  const { data: products = [], isLoading, isError } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
  });

  const featuredProducts = products
    .filter(
      (p) =>
        p.tags &&
        (p.tags.includes('featured') || p.tags.includes('new-arrivals'))
    )
    .slice(0, 4);

  const displayProducts = featuredProducts.length > 0 ? featuredProducts : products.slice(0, 4);

  return (
    <section className="py-24 bg-white/80 border-t border-zinc-900">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-zinc-500 block mb-2">
              Curated Selection
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 tracking-tight">
              Featured Pieces
            </h2>
          </div>
          <Link
            href="/shop"
            className="text-sm font-semibold text-zinc-600 hover:text-zinc-900 flex items-center gap-1.5 transition-colors group"
          >
            <span>View Full Catalog</span>
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="animate-spin text-zinc-500" size={32} />
          </div>
        ) : isError || displayProducts.length === 0 ? (
          <div className="text-center py-16 text-zinc-500 text-sm bg-zinc-50/30 rounded-3xl border border-zinc-200/50">
            No products available at the moment. Connect backend to view live inventory.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {displayProducts.map((product) => (
              <ProductCard key={product.id || product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
