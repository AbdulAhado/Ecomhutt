'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import {
  ArrowLeft,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Heart,
  ShoppingBag,
  SlidersHorizontal,
  X,
  Clock,
  Package,
} from 'lucide-react';
import { apiClient, getImageUrl } from '@/lib/api';
import { useShop } from '@/context/ShopContext';

/* ────────────────────────────────────────────────────────────
   Static category meta (hero image, title, description)
────────────────────────────────────────────────────────────── */
const CATEGORY_META = {
  beauty: { image: '/images/categories/beauty.png', title: 'Flawless Beauty', desc: 'Discover our premium range of skincare and cosmetics designed for the modern lifestyle.' },
  shoes: { image: '/images/categories/shoes.png', title: 'Step in Style', desc: 'Handcrafted leather shoes offering both luxury and unparalleled comfort for everyday wear.' },
  fashion: { image: '/images/categories/fashion.png', title: 'Modern Touch', desc: 'Natural fabrics and elegant silhouettes that highlight the feminine figure.' },
  electronics: { image: '/images/categories/electronics.png', title: 'Sleek Tech', desc: 'State-of-the-art gadgets blending seamlessly into your minimalist workspace.' },
  furniture: { image: '/images/categories/furniture.png', title: 'Living Space', desc: 'Curated home interiors that bring elegance and tranquility to your living environment.' },
};

const DEFAULT_META = { image: '/images/categories/fashion.png', title: 'Our Collection', desc: 'Browse our full range of premium products.' };
const PAGE_SIZE = 12;

/* ────────────────────────────────────────────────────────────
   API fetcher
────────────────────────────────────────────────────────────── */
async function fetchCategoryProducts({ category, page, sort }) {
  const params = new URLSearchParams({ category, page, limit: PAGE_SIZE, sort });
  const res = await apiClient.get(`/products?${params}`);
  const data = res.data;
  // normalize: backend returns { products, page, pages, total } or plain array
  if (Array.isArray(data)) {
    return { products: data, pages: 1, total: data.length, page: 1 };
  }
  return data;
}

/* ────────────────────────────────────────────────────────────
   Single product card
────────────────────────────────────────────────────────────── */
function ProductCard({ product, index }) {
  const { wishlist, toggleWishlist, addToCart } = useShop();
  const [added, setAdded] = useState(false);
  const prodId = String(product._id || product.id || '');
  const isWishlisted = wishlist?.some(id => String(id) === prodId);
  const img = getImageUrl(product.image || (product.images && product.images[0]));
  const hasRealImage = img && (img.startsWith('http') || img.startsWith('/uploads'));

  return (
    <Link
      href={`/product/${prodId}`}
      className="group w-full flex flex-col cursor-pointer animate-in fade-in zoom-in-95 duration-500"
    >
      {/* Image */}
      <div className="relative w-full aspect-[3/4] overflow-hidden bg-[#f4f4f4] rounded-lg">
        {hasRealImage ? (
          <Image
            src={img}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover object-center transition-transform duration-[2s] group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-zinc-300">
            <Package size={36} />
            <span className="text-[10px] font-medium uppercase tracking-widest">No Image</span>
          </div>
        )}

        {/* Badges */}
        {product.isNew && (
          <span className="absolute top-3 left-3 bg-zinc-900 text-white text-[9px] font-bold px-2 py-1 uppercase tracking-widest z-10 rounded-sm">
            New
          </span>
        )}

        {/* Wishlist */}
        <button
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleWishlist(prodId); }}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center text-zinc-400 hover:text-red-500 transition-colors z-10 shadow-sm"
          aria-label="Wishlist"
        >
          <Heart size={14} fill={isWishlisted ? 'currentColor' : 'none'} className={isWishlisted ? 'text-red-500' : ''} />
        </button>

        {/* Quick Add overlay */}
        <div className="absolute bottom-0 left-0 w-full translate-y-full group-hover:translate-y-0 transition-transform duration-500 z-10 p-3">
          <button
            onClick={(e) => {
              e.preventDefault(); e.stopPropagation();
              if (product.inStock !== false) {
                addToCart(product, 1, 'Standard');
                setAdded(true);
                setTimeout(() => setAdded(false), 2000);
              }
            }}
            disabled={product.inStock === false}
            className={`w-full py-2.5 text-[9px] font-bold uppercase tracking-[0.15em] flex items-center justify-center gap-1.5 rounded-md transition-colors ${
              added ? 'bg-zinc-700 text-white' : 'bg-zinc-900 text-white hover:bg-zinc-700'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            <ShoppingBag size={11} /> {added ? 'Added!' : (product.inStock !== false ? 'Add to Cart' : 'Sold Out')}
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="mt-3 px-0.5 flex flex-col gap-0.5">
        <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-400">{product.category}</span>
        <h3 className="text-[11px] font-semibold uppercase tracking-[0.08em] text-zinc-900 truncate group-hover:underline underline-offset-4 decoration-1">
          {product.name}
        </h3>
        <span className="text-xs font-bold text-zinc-900 mt-0.5">
          ${typeof product.price === 'number' ? product.price.toFixed(2) : product.price}
        </span>
      </div>
    </Link>
  );
}

/* ────────────────────────────────────────────────────────────
   Empty state inside product grid
────────────────────────────────────────────────────────────── */
function EmptyProducts({ categoryName }) {
  return (
    <div className="col-span-full flex flex-col items-center justify-center py-24 text-center">
      <div className="w-16 h-16 rounded-2xl bg-zinc-50 border border-zinc-100 flex items-center justify-center mb-5 shadow-sm">
        <Clock size={28} className="text-zinc-300 animate-pulse" />
      </div>
      <p className="text-base font-bold uppercase tracking-[0.15em] text-zinc-800 mb-2">
        {categoryName} Products Coming Very Soon
      </p>
      <p className="text-zinc-400 text-sm max-w-xs leading-relaxed">
        We&apos;re adding new items daily. Exciting {categoryName.toLowerCase()} products are on their way!
      </p>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────
   Skeleton loader cards
────────────────────────────────────────────────────────────── */
function SkeletonCards() {
  return Array.from({ length: 6 }).map((_, i) => (
    <div key={i} className="w-full flex flex-col animate-pulse">
      <div className="w-full aspect-[3/4] bg-zinc-100 rounded-lg" />
      <div className="mt-3 h-3 bg-zinc-100 rounded w-1/3" />
      <div className="mt-1.5 h-3 bg-zinc-100 rounded w-2/3" />
      <div className="mt-1.5 h-3 bg-zinc-100 rounded w-1/4" />
    </div>
  ));
}

/* ────────────────────────────────────────────────────────────
   Main Page
────────────────────────────────────────────────────────────── */
export default function CategoryPage({ params }) {
  const { slug } = React.use(params);
  const meta = CATEGORY_META[slug?.toLowerCase()] || DEFAULT_META;
  const displayName = slug ? slug.charAt(0).toUpperCase() + slug.slice(1) : 'Products';

  const [mounted, setMounted] = useState(false);
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState('newest');
  const [sortOpen, setSortOpen] = useState(false);

  useEffect(() => {
    // Tiny delay so browser paints the initial hidden state first
    const t = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(t);
  }, []);

  const SORT_OPTIONS = [
    { value: 'newest', label: 'Newest First' },
    { value: 'price_asc', label: 'Price: Low → High' },
    { value: 'price_desc', label: 'Price: High → Low' },
    { value: 'oldest', label: 'Oldest First' },
  ];

  const { data, isLoading, isError } = useQuery({
    queryKey: ['category-products', slug, page, sort],
    queryFn: () => fetchCategoryProducts({ category: slug, page, sort }),
    keepPreviousData: true,
    staleTime: 30_000,
  });

  const products = data?.products || [];
  const totalPages = data?.pages || 1;
  const total = data?.total || 0;

  // Filter: only products with real images (hide seeded placeholder entries)
  const realProducts = products.filter(
    p => (p.image || (p.images && p.images[0])) &&
      (getImageUrl(p.image || (p.images && p.images[0]))).startsWith('http') ||
      (getImageUrl(p.image || (p.images && p.images[0]))).startsWith('/uploads')
  );

  const hasProducts = !isLoading && realProducts.length > 0;

  return (
    <div className="w-full bg-white min-h-screen pt-[90px] flex flex-col">

      {/* ── Hero ─────────────────────────────────────────── */}
      <div className="relative w-full min-h-[calc(100vh-90px)] flex flex-col lg:flex-row items-center justify-between px-6 md:px-12 lg:px-20 pb-12 gap-12 lg:gap-24 bg-white">

        {/* Back Button — slides down from top */}
        <Link
          href="/"
          className="absolute top-8 left-6 md:left-12 z-30 w-12 h-12 flex items-center justify-center rounded-full border border-zinc-200 bg-white/50 backdrop-blur-md text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 transition-colors shadow-sm"
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? 'translateY(0)' : 'translateY(-32px)',
            transition: 'opacity 0.6s ease, transform 0.6s ease',
          }}
          aria-label="Go back to home"
        >
          <ArrowLeft size={20} />
        </Link>

        {/* Left Image — slides in from left */}
        <div
          className="w-full lg:w-[45%] h-[60vh] lg:h-[85vh] relative mt-20 lg:mt-0"
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? 'translateX(0)' : 'translateX(-80px)',
            transition: 'opacity 0.8s cubic-bezier(0.25,1,0.5,1), transform 0.8s cubic-bezier(0.25,1,0.5,1)',
          }}
        >
          <Image
            src={meta.image}
            alt={meta.title}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover object-center rounded-xl"
          />
        </div>

        {/* Right Content — slides in from right */}
        <div
          className="w-full lg:w-[55%] flex flex-col pt-8 lg:pt-0"
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? 'translateX(0)' : 'translateX(80px)',
            transition: 'opacity 0.8s cubic-bezier(0.25,1,0.5,1) 0.15s, transform 0.8s cubic-bezier(0.25,1,0.5,1) 0.15s',
          }}
        >

          {/* Sort bar */}
          <div className="flex items-center justify-between w-full max-w-xl mb-16 border-b border-zinc-100 pb-6">
            <div className="flex items-center gap-4 flex-1">
              <div className="w-48 h-[2px] bg-zinc-200 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1/3 h-full bg-zinc-900" />
              </div>
              <div className="w-3 h-3 bg-zinc-900 rounded-full shadow-sm" />
            </div>
            {/* Sort dropdown */}
            <div className="relative">
              <button
                onClick={() => setSortOpen(o => !o)}
                className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-500 hover:text-zinc-900 transition-colors"
              >
                Sort <ChevronDown size={14} className={`transition-transform ${sortOpen ? 'rotate-180' : ''}`} />
              </button>
              {sortOpen && (
                <div className="absolute right-0 top-7 w-48 bg-white border border-zinc-100 rounded-xl shadow-xl z-50 py-2 overflow-hidden">
                  {SORT_OPTIONS.map(opt => (
                    <button
                      key={opt.value}
                      onClick={() => { setSort(opt.value); setPage(1); setSortOpen(false); }}
                      className={`w-full text-left px-4 py-2.5 text-xs font-medium transition-colors ${sort === opt.value ? 'bg-zinc-900 text-white' : 'text-zinc-700 hover:bg-zinc-50'
                        }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <article>
            <h1 className="text-5xl md:text-7xl lg:text-[7rem] font-bold tracking-tight text-zinc-900 leading-[1.05] mb-10">
              {meta.title.split(' ').map((word, i) => (
                <span key={i} className={i === 1 ? "relative z-10 inline-block text-zinc-900 after:content-[''] after:absolute after:bottom-3 md:after:bottom-5 after:left-0 after:w-full after:h-4 md:after:h-6 after:bg-[#d6ff00]/60 after:-z-10" : ""}>
                  {word}{' '}
                  {i === 0 && <br className="hidden md:block" />}
                </span>
              ))}
            </h1>
            <p className="text-zinc-600 text-base md:text-lg font-medium leading-relaxed max-w-lg">
              {meta.desc}
            </p>
          </article>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-6 md:bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-zinc-400">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Scroll to Discover</span>
          <ChevronDown size={20} className="animate-bounce mt-1" />
        </div>
      </div>

      {/* ── Products Grid ────────────────────────────────── */}
      <div className="w-full py-16 bg-white">
        <div className="max-w-[1200px] mx-auto px-6 md:px-12">

          {/* Section header */}
          <div className="flex justify-between items-end mb-10 pb-5 border-b border-zinc-100">
            <div className="flex flex-col gap-1.5">
              <h2 className="text-2xl font-semibold tracking-tight text-zinc-900">All {displayName}</h2>
              {!isLoading && (
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                  {isError
                    ? 'Could not load products'
                    : hasProducts
                      ? `Showing ${realProducts.length} of ${total} products`
                      : 'No products yet'}
                </span>
              )}
            </div>

            {/* Active sort label */}
            <span className="hidden sm:block text-[10px] font-bold uppercase tracking-widest text-zinc-400">
              {SORT_OPTIONS.find(o => o.value === sort)?.label}
            </span>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8">
            {isLoading ? (
              <SkeletonCards />
            ) : isError ? (
              <div className="col-span-full py-20 text-center text-zinc-400 text-sm">
                Failed to load products. Please try again.
              </div>
            ) : realProducts.length === 0 ? (
              <EmptyProducts categoryName={displayName} />
            ) : (
              realProducts.map((product, i) => (
                <ProductCard key={product._id} product={product} index={i} />
              ))
            )}
          </div>

          {/* ── Pagination ────────────────────────────── */}
          {!isLoading && totalPages > 1 && (
            <div className="w-full flex flex-col items-center justify-center mt-16 mb-6 gap-4">
              <div className="flex items-center gap-2 text-xs font-bold text-zinc-500">

                {/* Prev */}
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="w-9 h-9 flex items-center justify-center rounded-full border border-zinc-200 hover:border-zinc-900 hover:text-zinc-900 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                  aria-label="Previous page"
                >
                  <ChevronLeft size={16} />
                </button>

                {/* Page numbers */}
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(n => n === 1 || n === totalPages || Math.abs(n - page) <= 1)
                  .reduce((acc, n, idx, arr) => {
                    if (idx > 0 && n - arr[idx - 1] > 1) acc.push('...');
                    acc.push(n);
                    return acc;
                  }, [])
                  .map((item, idx) =>
                    item === '...' ? (
                      <span key={`ellipsis-${idx}`} className="px-1 tracking-widest">…</span>
                    ) : (
                      <button
                        key={item}
                        onClick={() => setPage(item)}
                        className={`w-9 h-9 flex items-center justify-center rounded-full transition-all ${page === item
                            ? 'bg-zinc-900 text-white shadow-md'
                            : 'hover:bg-zinc-100 hover:text-zinc-900'
                          }`}
                      >
                        {item}
                      </button>
                    )
                  )}

                {/* Next */}
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="w-9 h-9 flex items-center justify-center rounded-full border border-zinc-200 hover:border-zinc-900 hover:text-zinc-900 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                  aria-label="Next page"
                >
                  <ChevronRight size={16} />
                </button>
              </div>

              <span className="text-[10px] font-bold text-zinc-400 tracking-widest uppercase">
                Page {page} of {totalPages}
              </span>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
