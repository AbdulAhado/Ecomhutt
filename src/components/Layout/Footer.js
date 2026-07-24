'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { FaFacebook, FaInstagram, FaTwitter } from 'react-icons/fa';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="bg-white border-t border-zinc-100">

      {/* Top Statement Row */}
      <div className="border-b border-zinc-100 py-20 px-6 md:px-12 max-w-[1600px] mx-auto flex flex-col lg:flex-row items-start lg:items-end justify-between gap-10">
        <div className="max-w-xl">
          <Link href="/" className="flex items-center gap-2.5 mb-8">
            <Image src="/favicon.svg" alt="EcomHutt Logo" width={32} height={32} />
            <span className="text-lg font-bold tracking-tight text-zinc-900">EcomHutt</span>
          </Link>
          <h2 className="text-5xl md:text-7xl font-bold tracking-tight text-zinc-900 leading-[1.05]">
            Less,<br /> but better.
          </h2>
          <p className="mt-6 text-sm text-zinc-500 font-medium leading-relaxed max-w-md">
            A brand built on the philosophy of visual clarity, premium craftsmanship, and effortless luxury.
          </p>
        </div>

        {/* Newsletter */}
        <div className="w-full lg:w-auto flex flex-col gap-4 lg:min-w-[380px] pb-2">
          <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-zinc-400">Subscribe to our newsletter</span>
          {subscribed ? (
            <p className="text-sm font-semibold text-zinc-900">
              Thank you for joining us. ✦
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="relative flex items-center border-b-2 border-zinc-900 pb-3 group">
              <input
                type="email"
                placeholder="Your email address"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent text-sm text-zinc-900 placeholder-zinc-300 focus:outline-none font-medium"
              />
              <button
                type="submit"
                className="shrink-0 text-zinc-900 hover:text-zinc-600 transition-colors"
                aria-label="Subscribe"
              >
                <ArrowRight size={20} />
              </button>
            </form>
          )}
          <div className="flex items-center gap-5 pt-2">
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-zinc-900 transition-colors"><FaInstagram size={18} /></a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-zinc-900 transition-colors"><FaTwitter size={18} /></a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-zinc-900 transition-colors"><FaFacebook size={18} /></a>
          </div>
        </div>
      </div>

      {/* Links Grid */}
      <div className="max-w-[1600px] mx-auto px-6 md:px-12 py-16 grid grid-cols-2 md:grid-cols-4 gap-10">

        {/* Shop */}
        <div className="space-y-5">
          <h4 className="text-[9px] font-bold uppercase tracking-[0.3em] text-zinc-900">Shop</h4>
          <ul className="space-y-3.5">
            {[
              { href: '/shop', label: 'All Products' },
              { href: '/shop?sort=new', label: 'New Arrivals' },
              { href: '/shop?sort=trending', label: 'Best Sellers' },
              { href: '/shop?sale=true', label: 'Sale' },
            ].map(({ href, label }) => (
              <li key={href}><Link href={href} className="text-sm text-zinc-500 hover:text-zinc-900 transition-colors font-medium">{label}</Link></li>
            ))}
          </ul>
        </div>

        {/* Support */}
        <div className="space-y-5">
          <h4 className="text-[9px] font-bold uppercase tracking-[0.3em] text-zinc-900">Support</h4>
          <ul className="space-y-3.5">
            {[
              { href: '/faq', label: 'FAQs' },
              { href: '/shipping-returns', label: 'Shipping & Returns' },
              { href: '/track-order', label: 'Track Order' },
              { href: '/contact', label: 'Contact Us' },
            ].map(({ href, label }) => (
              <li key={href}><Link href={href} className="text-sm text-zinc-500 hover:text-zinc-900 transition-colors font-medium">{label}</Link></li>
            ))}
          </ul>
        </div>

        {/* Company */}
        <div className="space-y-5">
          <h4 className="text-[9px] font-bold uppercase tracking-[0.3em] text-zinc-900">Company</h4>
          <ul className="space-y-3.5">
            {[
              { href: '/about', label: 'About Us' },
              { href: '/careers', label: 'Careers' },
              { href: '/stores', label: 'Store Locator' },
              { href: '/sustainability', label: 'Sustainability' },
            ].map(({ href, label }) => (
              <li key={href}><Link href={href} className="text-sm text-zinc-500 hover:text-zinc-900 transition-colors font-medium">{label}</Link></li>
            ))}
          </ul>
        </div>

        {/* Legal */}
        <div className="space-y-5">
          <h4 className="text-[9px] font-bold uppercase tracking-[0.3em] text-zinc-900">Legal</h4>
          <ul className="space-y-3.5">
            {[
              { href: '/privacy', label: 'Privacy Policy' },
              { href: '/terms', label: 'Terms of Service' },
              { href: '/sitemap', label: 'Sitemap' },
            ].map(({ href, label }) => (
              <li key={href}><Link href={href} className="text-sm text-zinc-500 hover:text-zinc-900 transition-colors font-medium">{label}</Link></li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-[1600px] mx-auto px-6 md:px-12 py-6 border-t border-zinc-100 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-[9px] font-bold tracking-[0.2em] uppercase text-zinc-400">
          © {new Date().getFullYear()} EcomHutt. All rights reserved.
        </p>
        <p className="text-[9px] font-bold tracking-[0.2em] uppercase text-zinc-300">
          Designed with care · Built for excellence
        </p>
      </div>

    </footer>
  );
}
