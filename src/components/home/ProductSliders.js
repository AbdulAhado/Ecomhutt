'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import { ChevronLeft, ChevronRight, Heart, ShoppingBag, Loader2, Package, ArrowRight, Sparkles } from 'lucide-react';
import { fetchProducts } from '@/lib/api';

/* ──────────────────────────────────────────────────────────────
   Single Product Card  (only rendered with real API products)
────────────────────────────────────────────────────────────── */
function SliderCard({ product }) {
  const [wishlisted, setWishlisted] = useState(false);
  const [added, setAdded] = useState(false);

  const displayImage = product.image || (product.images && product.images[0]);

  return (
    <Link
      href={`/product/${product._id || product.id}`}
      className="group flex-shrink-0 w-[200px] sm:w-[230px] flex flex-col cursor-pointer"
    >
      {/* Image */}
      <div className="relative w-full aspect-[3/4] bg-[#f2f2f2] overflow-hidden rounded-xl">
        {displayImage ? (
          <Image
            src={displayImage}
            alt={product.name || 'Product'}
            fill
            sizes="(max-width: 640px) 200px, 230px"
            className="object-cover object-center transition-transform duration-[2s] group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-zinc-100">
            <Package size={32} className="text-zinc-300" />
          </div>
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />

        {/* Wishlist */}
        <button
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); setWishlisted(w => !w); }}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center text-zinc-400 hover:text-red-500 transition-colors z-10 shadow-sm"
          aria-label="Add to wishlist"
        >
          <Heart size={14} strokeWidth={2} fill={wishlisted ? 'currentColor' : 'none'} className={wishlisted ? 'text-red-500' : ''} />
        </button>

        {/* Quick Add — slides up on hover */}
        <div className="absolute bottom-0 left-0 w-full translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out z-10 p-3">
          <button
            onClick={(e) => {
              e.preventDefault(); e.stopPropagation();
              setAdded(true);
              setTimeout(() => setAdded(false), 2000);
            }}
            className={`w-full py-2.5 text-[9px] font-bold uppercase tracking-[0.15em] flex items-center justify-center gap-1.5 rounded-lg transition-colors ${
              added ? 'bg-zinc-900 text-white' : 'bg-white/95 backdrop-blur-md text-zinc-900 hover:bg-zinc-900 hover:text-white'
            }`}
          >
            <ShoppingBag size={11} />
            {added ? 'Added!' : 'Quick Add'}
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="mt-3 px-0.5 flex flex-col gap-0.5">
        <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-400">{product.category}</span>
        <h4 className="text-[11px] font-semibold uppercase tracking-[0.08em] text-zinc-900 truncate group-hover:underline underline-offset-4 decoration-1">
          {product.name}
        </h4>
        <span className="text-xs font-bold text-zinc-900 mt-0.5">
          ${typeof product.price === 'number' ? product.price.toFixed(2) : product.price}
        </span>
      </div>
    </Link>
  );
}

/* ──────────────────────────────────────────────────────────────
   Professional "Coming Soon" Empty State — like Amazon / ASOS
────────────────────────────────────────────────────────────── */
function ComingSoonBanner() {
  const categories = [
    { icon: '👗', label: 'Fashion' },
    { icon: '📱', label: 'Electronics' },
    { icon: '👟', label: 'Footwear' },
    { icon: '💄', label: 'Beauty' },
    { icon: '🛋️', label: 'Home' },
    { icon: '⌚', label: 'Accessories' },
  ];

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-[900px] mx-auto px-6 text-center">

        {/* Animated icon */}
        <div className="relative inline-flex mb-8">
          <div className="w-20 h-20 rounded-2xl bg-zinc-50 border border-zinc-100 flex items-center justify-center shadow-sm">
            <Package size={36} className="text-zinc-300" />
          </div>
          <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-[#d6ff00] flex items-center justify-center shadow-sm animate-bounce">
            <Sparkles size={13} className="text-zinc-900" />
          </span>
        </div>

        {/* Heading */}
        <h2 className="text-2xl md:text-4xl font-bold text-zinc-900 tracking-tight mb-4">
          Products Are On Their Way
        </h2>
        <p className="text-zinc-500 text-base md:text-lg max-w-lg mx-auto leading-relaxed mb-10">
          Our team is busy curating an amazing selection just for you — from fashion and electronics to beauty and home essentials. Check back soon!
        </p>

        {/* Category pills */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {categories.map(({ icon, label }) => (
            <span
              key={label}
              className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-50 border border-zinc-100 rounded-full text-sm font-medium text-zinc-600 hover:border-zinc-300 hover:text-zinc-900 transition-colors cursor-default"
            >
              <span>{icon}</span>
              {label}
            </span>
          ))}
        </div>

        {/* Divider */}
        <div className="flex items-center gap-4 mb-8">
          <div className="flex-1 h-px bg-zinc-100" />
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-300">In the meantime</span>
          <div className="flex-1 h-px bg-zinc-100" />
        </div>

        {/* CTA row */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-7 py-3.5 bg-zinc-900 text-white text-sm font-bold uppercase tracking-[0.1em] rounded-full hover:bg-zinc-700 transition-colors"
          >
            Browse All Products
            <ArrowRight size={14} />
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-7 py-3.5 border border-zinc-200 text-zinc-700 text-sm font-bold uppercase tracking-[0.1em] rounded-full hover:border-zinc-400 transition-colors"
          >
            Notify Me
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────────────────────
   Slider section  (only rendered when products exist)
────────────────────────────────────────────────────────────── */
function ProductSlider({ title, subtitle, products }) {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  };

  const scroll = (dir) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === 'left' ? -480 : 480, behavior: 'smooth' });
  };

  if (!products || products.length === 0) return null;

  return (
    <section className="py-16 md:py-20 bg-white overflow-hidden">
      <div className="max-w-[1600px] mx-auto px-4 md:px-12">
        {/* Header */}
        <div className="flex items-end justify-between mb-8 md:mb-12">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-zinc-400 block mb-3">{subtitle}</span>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-zinc-900 leading-none">
              {title.split(' ').map((word, i) => (
                <span
                  key={i}
                  className={
                    i === 0
                      ? "relative z-10 inline-block after:content-[''] after:absolute after:bottom-1 after:left-0 after:w-full after:h-3 after:bg-[#d6ff00]/60 after:-z-10 mr-3"
                      : ''
                  }
                >
                  {word}{' '}
                </span>
              ))}
            </h2>
          </div>
          <div className="hidden sm:flex items-center gap-3">
            <button
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
              className="w-11 h-11 rounded-full border border-zinc-200 flex items-center justify-center text-zinc-500 hover:border-zinc-900 hover:text-zinc-900 disabled:opacity-20 disabled:cursor-not-allowed transition-all duration-200"
              aria-label="Scroll Left"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => scroll('right')}
              disabled={!canScrollRight}
              className="w-11 h-11 rounded-full border border-zinc-200 flex items-center justify-center text-zinc-500 hover:border-zinc-900 hover:text-zinc-900 disabled:opacity-20 disabled:cursor-not-allowed transition-all duration-200"
              aria-label="Scroll Right"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* Slider Track */}
        <div
          ref={scrollRef}
          onScroll={checkScroll}
          className="flex gap-4 md:gap-6 overflow-x-auto scroll-smooth pb-4"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {products.map((product, i) => (
            <SliderCard key={product._id || product.id || i} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────────────────────
   Root export
────────────────────────────────────────────────────────────── */
export default function ProductSliders({ initialProducts = [] }) {
  const { data: apiProducts, isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
    initialData: initialProducts.length > 0 ? initialProducts : undefined,
  });

  /* Loading skeleton */
  if (isLoading) {
    return (
      <div className="py-32 flex items-center justify-center bg-white">
        <Loader2 className="animate-spin text-zinc-300" size={28} />
      </div>
    );
  }

  /* Filter products: only keep ones that have a real image URL */
  const realProducts = (apiProducts || []).filter(
    (p) => p.image && (p.image.startsWith('http') || p.image.startsWith('/uploads'))
  );

  const hasProducts = realProducts.length > 0;

  /* No real products → professional coming-soon state, no sliders */
  if (!hasProducts) {
    return <ComingSoonBanner />;
  }

  const featured    = realProducts.slice(0, 10);
  const bestSellers = [...realProducts].reverse().slice(0, 10);

  return (
    <>
      <div className="max-w-[1600px] mx-auto px-4 md:px-12">
        <div className="h-px bg-zinc-100" />
      </div>

      <ProductSlider
        title="Featured Products"
        subtitle="Curated Selection"
        products={featured}
      />

      {bestSellers.length > 0 && (
        <>
          <div className="max-w-[1600px] mx-auto px-4 md:px-12">
            <div className="h-px bg-zinc-100" />
          </div>
          <ProductSlider
            title="Hot Selling"
            subtitle="Most Loved Right Now"
            products={bestSellers}
          />
        </>
      )}
    </>
  );
}
