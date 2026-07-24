'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Trash2, Plus, Minus, ArrowRight, ArrowLeft, ShoppingBag } from 'lucide-react';
import { useShop } from '@/context/ShopContext';

export default function CartPage() {
  const { cart, updateCartQuantity, removeFromCart, getCartSubtotal } = useShop();

  const subtotal = getCartSubtotal();
  const shipping = subtotal > 150 ? 0 : 15;
  const total = subtotal + shipping;

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-white pt-[90px] flex flex-col items-center justify-center text-center gap-6 px-6">
        <div className="w-20 h-20 flex items-center justify-center border border-zinc-100 bg-[#f8f8f8]">
          <ShoppingBag size={30} className="text-zinc-300" />
        </div>
        <h2 className="text-3xl font-bold text-zinc-900">Your Bag is Empty</h2>
        <p className="text-sm text-zinc-500 max-w-sm leading-relaxed">
          You haven&apos;t added any pieces yet. Explore our catalog and find something you love.
        </p>
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
          <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-zinc-400 block mb-3">EcomHutt</span>
          <h1 className="text-5xl font-bold text-zinc-900 tracking-tight">Your Bag</h1>
          <p className="text-sm text-zinc-400 mt-2 font-medium">{cart.length} item{cart.length !== 1 ? 's' : ''}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 items-start">

          {/* Cart Items */}
          <div className="lg:col-span-2">
            {/* Column headers */}
            <div className="hidden sm:grid grid-cols-12 text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-400 pb-4 border-b border-zinc-100">
              <span className="col-span-6">Product</span>
              <span className="col-span-3 text-center">Quantity</span>
              <span className="col-span-3 text-right">Total</span>
            </div>

            {cart.map((item) => (
              <div key={`${item.id}-${item.size}`} className="grid grid-cols-12 gap-4 items-center py-7 border-b border-zinc-100">

                {/* Product Info */}
                <div className="col-span-12 sm:col-span-6 flex items-center gap-5">
                  <div className="relative w-20 h-24 bg-[#f2f2f2] overflow-hidden shrink-0">
                    {(item.image || item.images?.[0]) ? (
                      <Image src={item.image || item.images[0]} alt={item.name} fill className="object-cover" sizes="80px" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-zinc-400 text-xs font-bold">{item.name?.charAt(0)}</div>
                    )}
                  </div>
                  <div className="flex flex-col gap-1">
                    <Link href={`/product/${item.id}`} className="text-sm font-semibold text-zinc-900 hover:underline underline-offset-4 decoration-1">
                      {item.name}
                    </Link>
                    {item.size && <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Size: {item.size}</span>}
                    <p className="text-xs font-bold text-zinc-500 mt-1">${item.price?.toFixed(2)}</p>
                    <button onClick={() => removeFromCart(item.id, item.size)} className="mt-1 flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-widest text-zinc-300 hover:text-red-500 transition-colors w-fit">
                      <Trash2 size={11} /> Remove
                    </button>
                  </div>
                </div>

                {/* Quantity */}
                <div className="col-span-6 sm:col-span-3 flex items-center justify-start sm:justify-center">
                  <div className="flex items-center border border-zinc-200">
                    <button onClick={() => updateCartQuantity(item.id, item.size, item.quantity - 1)} className="w-9 h-9 flex items-center justify-center text-zinc-400 hover:text-zinc-900 hover:bg-zinc-50 transition-colors">
                      <Minus size={13} />
                    </button>
                    <span className="w-8 text-center text-sm font-bold text-zinc-900">{item.quantity}</span>
                    <button onClick={() => updateCartQuantity(item.id, item.size, item.quantity + 1)} className="w-9 h-9 flex items-center justify-center text-zinc-400 hover:text-zinc-900 hover:bg-zinc-50 transition-colors">
                      <Plus size={13} />
                    </button>
                  </div>
                </div>

                {/* Line Total */}
                <div className="col-span-6 sm:col-span-3 text-right">
                  <span className="text-sm font-bold text-zinc-900">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              </div>
            ))}

            <Link href="/shop" className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 hover:text-zinc-900 transition-colors mt-8">
              <ArrowLeft size={13} /> Continue Shopping
            </Link>
          </div>

          {/* Order Summary */}
          <div className="bg-[#f8f8f8] p-8 flex flex-col gap-5 sticky top-[110px]">
            <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-zinc-900 pb-5 border-b border-zinc-200">Order Summary</h2>

            <div className="flex flex-col gap-4 text-xs font-medium text-zinc-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-bold text-zinc-900">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="font-bold text-zinc-900">{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
              </div>
              {shipping > 0 && (
                <p className="text-[10px] text-zinc-400">Spend ${(150 - subtotal).toFixed(2)} more for free shipping.</p>
              )}
            </div>

            <div className="pt-5 border-t border-zinc-200 flex justify-between items-center">
              <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-900">Total</span>
              <span className="text-2xl font-bold text-zinc-900">${total.toFixed(2)}</span>
            </div>

            <Link href="/checkout" className="flex items-center justify-center gap-3 w-full py-4 bg-zinc-900 text-white text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-zinc-800 transition-colors">
              Proceed to Checkout <ArrowRight size={14} />
            </Link>

            <p className="text-[9px] text-zinc-400 text-center tracking-widest uppercase">🔒 SSL Encrypted · Free 30-day Returns</p>
          </div>
        </div>
      </div>
    </div>
  );
}
