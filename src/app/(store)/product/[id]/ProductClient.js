'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Heart, ShoppingBag, ArrowLeft, Plus, Minus, Star, Truck, RefreshCw } from 'lucide-react';
import { useShop } from '@/context/ShopContext';
import ProductCard from '@/components/product/ProductCard';
import { cn } from '@/lib/utils';

export default function ProductClient({ product, recommendations }) {
  const router = useRouter();
  const { addToCart, wishlist, toggleWishlist } = useShop();

  const [selectedSize, setSelectedSize] = useState('Standard');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('details');
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [added, setAdded] = useState(false);

  const isWishlisted = wishlist.includes(product.id || product._id);

  const handleAddToCart = () => {
    if (product.inStock !== false) {
      addToCart(product.id || product._id, quantity, selectedSize);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    }
  };

  const productImages = product.images?.length > 0 ? product.images : product.image ? [product.image] : [];
  const displayImage = productImages[activeImageIndex] || null;

  return (
    <div className="min-h-screen bg-white pt-[90px]">
      {/* Back */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 pt-10">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 hover:text-zinc-900 transition-colors"
        >
          <ArrowLeft size={14} /> Back
        </button>
      </div>

      {/* Main Product Grid */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 xl:gap-24 items-start">
          {/* Left — Images */}
          <div className="flex gap-4">
            {/* Thumbnails column */}
            {productImages.length > 1 && (
              <div className="flex flex-col gap-3 shrink-0">
                {productImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={cn(
                      'relative w-16 h-20 overflow-hidden bg-[#f2f2f2] transition-all',
                      activeImageIndex === idx ? 'ring-1 ring-zinc-900' : 'opacity-50 hover:opacity-80'
                    )}
                  >
                    <Image src={img} alt={`thumb-${idx}`} fill className="object-cover" sizes="64px" />
                  </button>
                ))}
              </div>
            )}

            {/* Main image */}
            <div className="flex-1 relative aspect-[4/5] bg-[#f2f2f2] overflow-hidden">
              {displayImage ? (
                <Image src={displayImage} alt={product.name} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" priority />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-zinc-400 text-sm font-medium">
                  {product.name}
                </div>
              )}
            </div>
          </div>

          {/* Right — Details */}
          <div className="flex flex-col gap-8 pt-4 lg:pt-0">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">
              <Link href="/shop" className="hover:text-zinc-900 transition-colors">Shop</Link>
              <span>/</span>
              <span className="hover:text-zinc-900 transition-colors cursor-pointer">{product.category || 'General'}</span>
            </div>

            {/* Name + Rating */}
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-zinc-900 tracking-tight leading-tight mb-4">
                {product.name}
              </h1>
              <div className="flex items-center gap-3">
                <div className="flex gap-0.5 text-amber-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={13} fill={i < Math.floor(product.rating || 5) ? 'currentColor' : 'none'} />
                  ))}
                </div>
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                  {product.rating || '5.0'} ({product.reviews || '12'} reviews)
                </span>
              </div>
            </div>

            {/* Price */}
            <div className="text-3xl font-bold text-zinc-900">
              ${typeof product.price === 'number' ? product.price.toFixed(2) : product.price}
            </div>

            {/* Description */}
            <p className="text-sm text-zinc-500 leading-relaxed border-t border-zinc-100 pt-6">
              {product.description || 'Premium quality product crafted with precision and care. Designed for those who demand the best.'}
            </p>

            {/* Size Selector — only if product has sizes defined */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="flex flex-col gap-3">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">
                  Select Size / Option
                </span>
                <div className="flex gap-3 flex-wrap">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={cn(
                        'w-12 h-12 text-xs font-bold border transition-all',
                        selectedSize === size
                          ? 'bg-zinc-900 text-white border-zinc-900'
                          : 'bg-white text-zinc-500 border-zinc-200 hover:border-zinc-900 hover:text-zinc-900'
                      )}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity + Add to Cart */}
            <div className="flex items-center gap-4">
              {/* Qty */}
              <div className="flex items-center border border-zinc-200">
                <button
                  onClick={() => setQuantity(q => (q > 1 ? q - 1 : 1))}
                  className="w-11 h-11 flex items-center justify-center text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50 transition-colors"
                >
                  <Minus size={14} />
                </button>
                <span className="w-10 text-center text-sm font-bold text-zinc-900">{quantity}</span>
                <button
                  onClick={() => setQuantity(q => q + 1)}
                  className="w-11 h-11 flex items-center justify-center text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50 transition-colors"
                >
                  <Plus size={14} />
                </button>
              </div>

              {/* Add to Cart */}
              <button
                onClick={handleAddToCart}
                disabled={product.inStock === false}
                className={cn(
                  'flex-1 h-11 flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-[0.15em] transition-all',
                  added
                    ? 'bg-zinc-700 text-white'
                    : product.inStock !== false
                    ? 'bg-zinc-900 text-white hover:bg-zinc-800'
                    : 'bg-zinc-100 text-zinc-400 cursor-not-allowed'
                )}
              >
                <ShoppingBag size={14} />
                {added ? 'Added to Bag!' : product.inStock !== false ? 'Add to Bag' : 'Sold Out'}
              </button>

              {/* Wishlist */}
              <button
                onClick={() => toggleWishlist(product.id || product._id)}
                className={cn(
                  'w-11 h-11 flex items-center justify-center border transition-all',
                  isWishlisted ? 'border-red-300 text-red-500 bg-red-50' : 'border-zinc-200 text-zinc-400 hover:border-zinc-900 hover:text-zinc-900'
                )}
                aria-label="Wishlist"
              >
                <Heart size={16} fill={isWishlisted ? 'currentColor' : 'none'} />
              </button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-2 gap-4 pt-6 border-t border-zinc-100">
              <div className="flex items-start gap-3">
                <Truck size={16} strokeWidth={1.5} className="text-zinc-500 mt-0.5 shrink-0" />
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-900">Free Delivery</p>
                  <p className="text-[10px] text-zinc-400 mt-0.5">On orders over $150</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <RefreshCw size={16} strokeWidth={1.5} className="text-zinc-500 mt-0.5 shrink-0" />
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-900">30-Day Returns</p>
                  <p className="text-[10px] text-zinc-400 mt-0.5">Free return labels included</p>
                </div>
              </div>
            </div>

            {/* Specs Tabs */}
            <div className="border-t border-zinc-100 pt-6">
              <div className="flex gap-8 border-b border-zinc-100 mb-5">
                {['details', 'shipping'].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={cn(
                      'pb-3 text-[10px] font-bold uppercase tracking-[0.2em] border-b-2 -mb-px transition-colors',
                      activeTab === tab ? 'border-zinc-900 text-zinc-900' : 'border-transparent text-zinc-400 hover:text-zinc-700'
                    )}
                  >
                    {tab === 'details' ? 'Specifications' : 'Shipping & Returns'}
                  </button>
                ))}
              </div>

              {activeTab === 'details' ? (
                <ul className="flex flex-col gap-2.5">
                  {(product.details?.length > 0 ? product.details : [
                    'Ethically crafted with high-grade sustainable materials',
                    'Tested for maximum reliability & visual precision',
                    'Includes 1-year manufacturer warranty',
                  ]).map((d, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-xs text-zinc-500">
                      <span className="w-1 h-1 rounded-full bg-zinc-400 mt-1.5 shrink-0" />
                      {d}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-zinc-500 leading-relaxed">
                  Orders are processed within 24 business hours. Express 2-day delivery available at checkout. All packages are fully tracked and insured.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* You May Also Like */}
      {recommendations?.length > 0 && (
        <div className="border-t border-zinc-100 py-24 bg-[#fbfbfb]">
          <div className="max-w-[1400px] mx-auto px-6 md:px-12">
            <div className="flex items-end justify-between mb-12">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-zinc-400 block mb-3">Similar Items</span>
                <h2 className="text-4xl font-bold tracking-tight text-zinc-900">You May Also Like</h2>
              </div>
              <Link href="/shop" className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 hover:text-zinc-900 transition-colors hidden sm:block">
                View All
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8">
              {recommendations.map((rec) => (
                <ProductCard key={rec.id || rec._id} product={rec} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
