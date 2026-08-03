'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, ShoppingBag, Heart, User, Menu, X, ArrowRight, Shield } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { useShop } from '@/context/ShopContext';

export default function Navbar() {
  const { cart, wishlist, user } = useShop();
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const cartCount = cart.reduce((acc, item) => acc + (item.quantity || 1), 0);
  const wishlistCount = wishlist.length;

  // All hooks must be called unconditionally — no early returns before this line
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Hide navbar on auth pages — done AFTER all hooks
  const isAuthPage = pathname === '/login' || pathname === '/register' || pathname === '/forgot-password' || pathname === '/verify-otp' || pathname === '/reset-password';
  if (isAuthPage) return null;

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/shop?search=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  const navLinks = [
    { href: '/shop', label: 'Shop' },
    { href: '/about', label: 'About Us' },
    { href: '/contact', label: 'Contact' },
    { href: '/track-order', label: 'Track Order' },
  ];

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
          isScrolled
            ? 'bg-white/90 backdrop-blur-md py-3.5 shadow-sm border-b border-zinc-100'
            : 'bg-transparent py-5'
        )}
      >
        <div className="max-w-[1600px] mx-auto px-6 flex items-center justify-between">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-zinc-700 hover:text-zinc-900 p-2 transition-colors"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

          {/* Navigation Links - Left Desktop */}
          <nav className="hidden md:flex items-center gap-10 text-[11px] font-bold uppercase tracking-[0.15em] text-zinc-500">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="hover:text-zinc-900 transition-colors duration-200 relative after:content-[''] after:absolute after:bottom-[-3px] after:left-0 after:w-0 after:h-[1.5px] after:bg-zinc-900 hover:after:w-full after:transition-all after:duration-300"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Brand Logo - Centered */}
          <Link href="/" className="flex items-center gap-2.5 group cursor-pointer absolute left-1/2 -translate-x-1/2">
            <Image src="/favicon.svg" alt="EcomHutt Logo" width={32} height={32} className="group-hover:scale-105 transition-transform" priority />
            <span className="text-xl font-bold tracking-tight text-zinc-900 group-hover:text-zinc-700 transition-colors">
              EcomHutt
            </span>
          </Link>

          {/* Action Icons */}
          <div className="flex items-center gap-1 sm:gap-3 ml-auto">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="text-zinc-600 hover:text-zinc-900 p-2.5 transition-colors"
              aria-label="Search"
            >
              <Search size={19} strokeWidth={2} />
            </button>

            <Link
              href="/wishlist"
              className="relative text-zinc-600 hover:text-zinc-900 p-2.5 transition-colors hidden sm:flex"
              aria-label="Wishlist"
            >
              <Heart size={19} strokeWidth={2} />
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-zinc-900 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>

            <Link
              href={user ? '/dashboard' : '/login'}
              className="text-zinc-600 hover:text-zinc-900 p-2.5 transition-colors"
              aria-label="Account"
            >
              <User size={19} strokeWidth={2} />
            </Link>

            <Link
              href="/cart"
              className="relative text-zinc-600 hover:text-zinc-900 p-2.5 transition-colors"
              aria-label="Cart"
            >
              <ShoppingBag size={19} strokeWidth={2} />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-zinc-900 text-white text-[9px] font-bold rounded-full flex items-center justify-center shadow-sm">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-white pt-24 px-8 md:hidden flex flex-col justify-between pb-12 animate-in fade-in duration-200">
          <div className="space-y-8">
            <div className="flex items-center gap-2.5 mb-4">
              <Image src="/favicon.svg" alt="EcomHutt Logo" width={32} height={32} />
              <span className="text-xl font-bold tracking-tight text-zinc-900">EcomHutt</span>
            </div>
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block text-3xl font-bold text-zinc-800 hover:text-black tracking-tight"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="pt-8 border-t border-zinc-100 space-y-4">
            <Link href="/wishlist" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 text-sm font-medium text-zinc-600 hover:text-zinc-900">
              <Heart size={18} />
              <span>Wishlist</span>
            </Link>
            <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 text-sm font-medium text-zinc-600 hover:text-zinc-900">
              <User size={18} />
              <span>My Account</span>
            </Link>
            {(user?.role === 'admin' || user?.role === 'lister') && (
              <Link href="/admin" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 text-sm font-bold text-amber-600 hover:text-amber-700">
                <Shield size={18} />
                <span>Go to {user.role === 'admin' ? 'Admin' : 'Lister'} Dashboard</span>
              </Link>
            )}
          </div>
        </div>
      )}

      {/* Search Overlay Modal */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 bg-white/80 backdrop-blur-md flex items-start justify-center pt-28 px-6 animate-in fade-in duration-200">
          <div className="w-full max-w-xl relative">
            <button
              onClick={() => setSearchOpen(false)}
              className="absolute -top-10 right-0 text-zinc-400 hover:text-zinc-900 transition-colors"
            >
              <X size={22} />
            </button>
            <form onSubmit={handleSearchSubmit} className="relative flex items-center border-b-2 border-zinc-900 pb-2">
              <Search className="absolute left-0 text-zinc-400" size={22} />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                className="w-full bg-transparent pl-10 pr-12 py-3 text-zinc-900 placeholder-zinc-400 focus:outline-none text-xl font-light"
              />
              <button
                type="submit"
                className="absolute right-0 text-zinc-900 hover:text-zinc-600 transition-colors"
                aria-label="Submit Search"
              >
                <ArrowRight size={22} />
              </button>
            </form>
            <p className="mt-4 text-xs font-bold text-zinc-400 uppercase tracking-widest">Popular: Beauty, Fashion, Electronics</p>
          </div>
        </div>
      )}
    </>
  );
}
