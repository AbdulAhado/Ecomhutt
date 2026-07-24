'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { ChevronLeft, ChevronRight, Heart, ShoppingBag, Loader2 } from 'lucide-react';
import { fetchProducts } from '@/lib/api';

// Fallback mock data so sliders always render even without backend
const MOCK_PRODUCTS = [
  { id: 'm1', name: 'Classic Leather Tote', category: 'Bags', price: 129.00, image: '/images/categories/fashion.png' },
  { id: 'm2', name: 'Premium Sneakers', category: 'Shoes', price: 89.00, image: '/images/categories/shoes.png' },
  { id: 'm3', name: 'Glow Serum Set', category: 'Beauty', price: 64.00, image: '/images/categories/beauty.png' },
  { id: 'm4', name: 'Wireless Earbuds Pro', category: 'Electronics', price: 199.00, image: '/images/categories/electronics.png' },
  { id: 'm5', name: 'Linen Blazer', category: 'Fashion', price: 149.00, image: '/images/categories/fashion.png' },
  { id: 'm6', name: 'Minimalist Watch', category: 'Accessories', price: 245.00, image: '/images/categories/beauty.png' },
  { id: 'm7', name: 'Running Shoes', category: 'Shoes', price: 110.00, image: '/images/categories/shoes.png' },
  { id: 'm8', name: 'Smart Speaker', category: 'Electronics', price: 89.00, image: '/images/categories/electronics.png' },
  { id: 'm9', name: 'Oak Side Table', category: 'Furniture', price: 320.00, image: '/images/categories/furniture.png' },
  { id: 'm10', name: 'Silk Midi Dress', category: 'Fashion', price: 175.00, image: '/images/categories/fashion.png' },
];

const MOCK_BESTSELLERS = [
  { id: 'b1', name: 'Velvet Lounge Chair', category: 'Furniture', price: 499.00, image: '/images/categories/furniture.png' },
  { id: 'b2', name: 'Rose Gold Perfume', category: 'Beauty', price: 88.00, image: '/images/categories/beauty.png' },
  { id: 'b3', name: 'Slim Fit Trousers', category: 'Fashion', price: 95.00, image: '/images/categories/fashion.png' },
  { id: 'b4', name: 'Noise-Cancel Headphones', category: 'Electronics', price: 279.00, image: '/images/categories/electronics.png' },
  { id: 'b5', name: 'Leather Chelsea Boots', category: 'Shoes', price: 195.00, image: '/images/categories/shoes.png' },
  { id: 'b6', name: 'Face Glow Mask', category: 'Beauty', price: 42.00, image: '/images/categories/beauty.png' },
  { id: 'b7', name: 'Structured Handbag', category: 'Bags', price: 215.00, image: '/images/categories/fashion.png' },
  { id: 'b8', name: 'Marble Coffee Table', category: 'Furniture', price: 680.00, image: '/images/categories/furniture.png' },
  { id: 'b9', name: 'Cashmere Sweater', category: 'Fashion', price: 185.00, image: '/images/categories/fashion.png' },
  { id: 'b10', name: 'Slim Smartphone Stand', category: 'Electronics', price: 39.00, image: '/images/categories/electronics.png' },
];

function SliderCard({ product }) {
  const [wishlisted, setWishlisted] = useState(false);
  const [added, setAdded] = useState(false);

  const displayImage = product.image || (product.images && product.images[0]);

  return (
    <Link
      href={`/product/${product._id || product.id}`}
      className="group flex-shrink-0 w-[230px] flex flex-col cursor-pointer"
    >
      {/* Image */}
      <div className="relative w-full aspect-[3/4] bg-[#f2f2f2] overflow-hidden">
        {displayImage ? (
          <img
            src={displayImage}
            alt={product.name || 'Product'}
            className="w-full h-full object-cover object-center transition-transform duration-[2s] group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-zinc-400 text-xs font-medium">
            {product.name}
          </div>
        )}

        {/* Wishlist */}
        <button
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); setWishlisted(w => !w); }}
          className="absolute top-3 right-3 text-zinc-400 hover:text-red-500 transition-colors z-10"
          aria-label="Wishlist"
        >
          <Heart size={16} strokeWidth={2} fill={wishlisted ? 'currentColor' : 'none'} className={wishlisted ? 'text-red-500' : ''} />
        </button>

        {/* Quick Add — slides up on hover */}
        <div className="absolute bottom-0 left-0 w-full translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out z-10 p-3">
          <button
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); setAdded(true); setTimeout(() => setAdded(false), 2000); }}
            className={`w-full py-2.5 text-[9px] font-bold uppercase tracking-[0.15em] flex items-center justify-center gap-1.5 transition-colors ${
              added ? 'bg-zinc-900 text-white' : 'bg-white/95 backdrop-blur-md text-zinc-900 hover:bg-zinc-900 hover:text-white'
            }`}
          >
            <ShoppingBag size={11} />
            {added ? 'Added!' : 'Quick Add'}
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="mt-4 px-0.5 flex flex-col gap-1">
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

function ProductSlider({ title, subtitle, products, accentColor }) {
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

  return (
    <section className="py-20 bg-white overflow-hidden">
      <div className="max-w-[1600px] mx-auto px-6 md:px-12">

        {/* Header */}
        <div className="flex items-end justify-between mb-12">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-zinc-400 block mb-3">{subtitle}</span>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-zinc-900 leading-none">
              {title.split(' ').map((word, i) => (
                <span key={i} className={i === 0 ? `relative z-10 inline-block after:content-[''] after:absolute after:bottom-1 after:left-0 after:w-full after:h-3 after:bg-[#d6ff00]/60 after:-z-10 mr-3` : ''}>
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
          className="flex gap-6 overflow-x-auto scroll-smooth pb-4"
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

export default function ProductSliders({ initialProducts = [] }) {
  const { data: apiProducts = initialProducts, isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
    initialData: initialProducts.length > 0 ? initialProducts : undefined,
  });

  if (isLoading) {
    return (
      <div className="py-32 flex items-center justify-center bg-white">
        <Loader2 className="animate-spin text-zinc-300" size={28} />
      </div>
    );
  }

  // Use real API data if available, otherwise fall back to mock data
  const featured = apiProducts.length > 0 ? apiProducts.slice(0, 10) : MOCK_PRODUCTS;
  const bestSellers = apiProducts.length > 0 ? [...apiProducts].reverse().slice(0, 10) : MOCK_BESTSELLERS;

  return (
    <>
      <div className="max-w-[1600px] mx-auto px-12">
        <div className="h-px bg-zinc-100" />
      </div>

      <ProductSlider
        title="Featured Products"
        subtitle="Curated Selection"
        products={featured}
      />

      <div className="max-w-[1600px] mx-auto px-12">
        <div className="h-px bg-zinc-100" />
      </div>

      <ProductSlider
        title="Hot Selling"
        subtitle="Most Loved Right Now"
        products={bestSellers}
      />
    </>
  );
}
