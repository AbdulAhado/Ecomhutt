'use client';

import Link from 'next/link';
import { Laptop, Shirt, Home as HomeIcon, Watch, ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';

const categories = [
  {
    name: 'Electronics',
    slug: 'Electronics',
    icon: Laptop,
    description: 'Smart tech, audio devices & wearable gear',
    gradient: 'from-blue-500/20 via-purple-500/10 to-transparent',
    border: 'hover:border-blue-500/40',
  },
  {
    name: 'Clothing',
    slug: 'Clothing',
    icon: Shirt,
    description: 'Minimalist streetwear & luxury apparel',
    gradient: 'from-emerald-500/20 via-teal-500/10 to-transparent',
    border: 'hover:border-emerald-500/40',
  },
  {
    name: 'Home & Garden',
    slug: 'Home & Garden',
    icon: HomeIcon,
    description: 'Essential interior decor & modern ceramics',
    gradient: 'from-amber-500/20 via-orange-500/10 to-transparent',
    border: 'hover:border-amber-500/40',
  },
  {
    name: 'Accessories',
    slug: 'Accessories',
    icon: Watch,
    description: 'Premium timepieces, bags & daily carry',
    gradient: 'from-pink-500/20 via-rose-500/10 to-transparent',
    border: 'hover:border-pink-500/40',
  },
];

export default function Categories() {
  return (
    <section className="py-24 bg-white border-t border-zinc-900">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-zinc-500 block mb-2">
              Curated Collections
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 tracking-tight">
              Featured Categories
            </h2>
          </div>
          <Link
            href="/shop"
            className="text-sm font-semibold text-zinc-600 hover:text-zinc-900 flex items-center gap-1.5 transition-colors group"
          >
            <span>Explore All Categories</span>
            <ArrowUpRight size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat, idx) => {
            const Icon = cat.icon;
            return (
              <motion.div
                key={cat.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
              >
                <Link
                  href={`/shop?category=${encodeURIComponent(cat.slug)}`}
                  className={`group relative block rounded-3xl p-8 bg-zinc-50/50 border border-zinc-200/80 ${cat.border} transition-all duration-300 hover:shadow-2xl overflow-hidden`}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${cat.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                  
                  <div className="relative z-10 flex flex-col justify-between h-52">
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-2xl bg-zinc-100/80 border border-zinc-700/50 flex items-center justify-center text-zinc-900 group-hover:scale-110 transition-transform duration-300">
                        <Icon size={24} />
                      </div>
                      <div className="w-8 h-8 rounded-full bg-zinc-100/40 flex items-center justify-center text-zinc-600 group-hover:bg-white group-hover:text-zinc-950 transition-colors">
                        <ArrowUpRight size={16} />
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xl font-bold text-zinc-900 mb-2 group-hover:text-zinc-100 transition-colors">
                        {cat.name}
                      </h3>
                      <p className="text-xs text-zinc-600 leading-relaxed">
                        {cat.description}
                      </p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
