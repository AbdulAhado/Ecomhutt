'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Heart, ShoppingBag } from 'lucide-react';

export default function ProductCard({ product }) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [added, setAdded] = useState(false);

  const handleWishlistToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
    try {
      const saved = localStorage.getItem('ether_wishlist');
      let wishlist = saved ? JSON.parse(saved) : [];
      if (wishlist.includes(product.id)) {
        wishlist = wishlist.filter(id => id !== product.id);
      } else {
        wishlist.push(product.id);
      }
      localStorage.setItem('ether_wishlist', JSON.stringify(wishlist));
    } catch (err) { console.error(err); }
  };

  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.inStock !== false) {
      try {
        const saved = localStorage.getItem('ether_cart');
        let cart = saved ? JSON.parse(saved) : [];
        const index = cart.findIndex(item => item.id === product.id);
        if (index > -1) {
          cart[index].quantity += 1;
        } else {
          cart.push({ ...product, quantity: 1 });
        }
        localStorage.setItem('ether_cart', JSON.stringify(cart));
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
      } catch (err) { console.error(err); }
    }
  };

  const displayImage = product.image || (product.images && product.images[0]);

  return (
    <div className="group flex flex-col cursor-pointer">
      <Link href={`/product/${product.id}`} className="flex flex-col flex-1">
        {/* Image */}
        <div className="relative w-full aspect-[3/4] bg-[#f2f2f2] overflow-hidden">
          {displayImage ? (
            <img
              src={displayImage}
              alt={product.name || 'Product'}
              className="w-full h-full object-cover object-center transition-transform duration-[2s] group-hover:scale-[1.03]"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-zinc-400 text-xs font-medium tracking-wide">
              {product.name || 'EcomHutt'}
            </div>
          )}

          {/* Wishlist */}
          <button
            onClick={handleWishlistToggle}
            className="absolute top-4 right-4 text-zinc-400 hover:text-red-500 transition-colors z-10"
            aria-label="Toggle Wishlist"
          >
            <Heart
              size={18}
              strokeWidth={1.5}
              fill={isWishlisted ? 'currentColor' : 'none'}
              className={isWishlisted ? 'text-red-500' : ''}
            />
          </button>

          {/* Quick Add overlay — slides up from bottom on hover */}
          <div className="absolute bottom-0 left-0 w-full translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out z-10 p-3">
            {product.inStock !== false ? (
              <button
                onClick={handleQuickAdd}
                className={`w-full py-3 text-[9px] font-bold uppercase tracking-[0.15em] flex items-center justify-center gap-2 transition-colors shadow-sm ${
                  added
                    ? 'bg-zinc-900 text-white'
                    : 'bg-white/95 backdrop-blur-md text-zinc-900 hover:bg-zinc-900 hover:text-white'
                }`}
              >
                <ShoppingBag size={12} />
                {added ? 'Added!' : 'Quick Add'}
              </button>
            ) : (
              <span className="block w-full py-3 text-center text-[9px] font-bold uppercase tracking-widest text-zinc-400 bg-white/80 backdrop-blur-md">
                Out of Stock
              </span>
            )}
          </div>
        </div>

        {/* Product Info — minimal typography below image */}
        <div className="mt-4 px-1 flex flex-col gap-1.5">
          <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-400">
            {product.category || 'General'}
          </span>
          <h3 className="text-[11px] font-semibold uppercase tracking-[0.1em] text-zinc-900 line-clamp-1 group-hover:underline underline-offset-4 decoration-1">
            {product.name}
          </h3>
          <div className="flex items-center gap-3 mt-0.5">
            <span className="text-xs font-bold text-zinc-900">
              ${typeof product.price === 'number' ? product.price.toFixed(2) : product.price}
            </span>
            {product.rating && (
              <span className="text-[10px] text-zinc-400 font-medium">★ {product.rating}</span>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
}
