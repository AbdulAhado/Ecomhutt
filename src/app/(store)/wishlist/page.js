'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Heart, ShoppingBag, X } from 'lucide-react';
import { useShop } from '@/context/ShopContext';
import { useQuery } from '@tanstack/react-query';
import { fetchProducts } from '@/lib/api';

export default function WishlistPage() {
  const { wishlist, toggleWishlist, addToCart } = useShop();
  const { data: products = [] } = useQuery({ queryKey: ['products'], queryFn: fetchProducts });
  const [addedIds, setAddedIds] = useState([]);

  const wishlistProducts = products.filter((p) =>
    wishlist?.some((wId) => String(wId) === String(p.id) || String(wId) === String(p._id))
  );

  const handleAddToCart = (product) => {
    const prodId = String(product.id || product._id);
    if (product.inStock !== false) {
      addToCart(product, 1, 'Standard');
      setAddedIds((prev) => [...prev, prodId]);
      setTimeout(() => setAddedIds((prev) => prev.filter((id) => id !== prodId)), 2000);
    }
  };

  if (wishlistProducts.length === 0) {
    return (
      <div className="min-h-screen bg-white pt-[90px] flex flex-col items-center justify-center text-center gap-6 px-6">
        <div className="w-20 h-20 flex items-center justify-center border border-zinc-100 bg-[#f8f8f8]">
          <Heart size={28} className="text-zinc-300" />
        </div>
        <h2 className="text-3xl font-bold text-zinc-900">Your Wishlist is Empty</h2>
        <p className="text-sm text-zinc-500 max-w-sm leading-relaxed">Save your favourite pieces here to revisit and purchase later.</p>
        <Link href="/shop" className="mt-2 px-10 py-4 bg-zinc-900 text-white text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-zinc-800 transition-colors">
          Explore Collection
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-[90px]">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-16">

        {/* Header */}
        <div className="mb-12 border-b border-zinc-100 pb-8">
          <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-zinc-400 block mb-3">Saved Items</span>
          <h1 className="text-5xl font-bold text-zinc-900 tracking-tight">Wishlist</h1>
          <p className="text-sm text-zinc-400 mt-2 font-medium">{wishlistProducts.length} saved item{wishlistProducts.length !== 1 ? 's' : ''}</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-14">
          {wishlistProducts.map((product) => {
            const prodId = String(product.id || product._id);
            const displayImg = product.image || (product.images && product.images[0]);
            const isAdded = addedIds.includes(prodId);
            return (
              <div key={prodId} className="group flex flex-col">

                {/* Image */}
                <div className="relative w-full aspect-[3/4] bg-[#f2f2f2] overflow-hidden">
                  <Link href={`/product/${prodId}`}>
                    {displayImg ? (
                      <img src={displayImg} alt={product.name} className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-105" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-zinc-400 text-sm font-bold">{product.name?.charAt(0)}</div>
                    )}
                  </Link>

                  {/* Remove from Wishlist */}
                  <button
                    onClick={() => toggleWishlist(prodId)}
                    className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center bg-white/80 backdrop-blur-sm text-zinc-400 hover:text-red-500 transition-colors z-10"
                    aria-label="Remove from wishlist"
                  >
                    <X size={14} />
                  </button>

                  {/* Quick Add on hover */}
                  <div className="absolute bottom-0 left-0 w-full translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out z-10 p-3">
                    <button
                      onClick={() => handleAddToCart(product)}
                      disabled={product.inStock === false}
                      className={`w-full py-3 text-[9px] font-bold uppercase tracking-[0.15em] flex items-center justify-center gap-2 transition-colors ${isAdded ? 'bg-zinc-900 text-white' : 'bg-white/95 backdrop-blur-md text-zinc-900 hover:bg-zinc-900 hover:text-white'
                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      <ShoppingBag size={12} />
                      {isAdded ? 'Added!' : product.inStock !== false ? 'Add to Bag' : 'Sold Out'}
                    </button>
                  </div>
                </div>

                {/* Info */}
                <div className="mt-4 px-0.5 flex flex-col gap-1.5">
                  <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-400">{product.category}</span>
                  <Link href={`/product/${prodId}`}>
                    <h3 className="text-[11px] font-semibold uppercase tracking-[0.08em] text-zinc-900 line-clamp-1 hover:underline underline-offset-4 decoration-1">{product.name}</h3>
                  </Link>
                  <p className="text-xs font-bold text-zinc-900">${typeof product.price === 'number' ? product.price.toFixed(2) : product.price}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
