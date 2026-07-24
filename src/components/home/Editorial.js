'use client';

import Link from 'next/link';
import { ArrowRight, Cpu, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Editorial() {
  return (
    <section className="py-28 bg-white border-t border-zinc-900 relative overflow-hidden">
      {/* Background Lighting */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[500px] h-[500px] glow-ambient glow-purple opacity-20 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="rounded-3xl glass-panel p-8 sm:p-14 border border-zinc-200/80 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-6 space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100/60 border border-zinc-700/50 text-xs font-semibold text-zinc-300">
              <Zap size={14} className="text-amber-400" />
              <span>Limited Drop Release</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-extrabold text-zinc-900 tracking-tight leading-tight">
              The Smart Tech Collection
            </h2>

            <p className="text-sm sm:text-base text-zinc-600 leading-relaxed font-normal">
              A carefully curated selection of premium audio devices, smartwear, and high-performance electronics designed to seamlessly integrate into your daily lifestyle with visual clarity and premium craftsmanship.
            </p>

            <div className="pt-4 flex flex-wrap gap-4">
              <Link
                href="/shop?category=Electronics"
                className="px-7 py-3.5 rounded-xl bg-white text-zinc-950 font-bold text-sm hover:bg-zinc-200 transition-all duration-200 flex items-center gap-2 group shadow-xl shadow-white/10"
              >
                <span>Discover the Drop</span>
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>

          {/* Right Visual Box */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-6 flex justify-center"
          >
            <div className="relative w-full max-w-lg aspect-[4/3] rounded-2xl bg-gradient-to-tr from-zinc-900 via-zinc-800 to-zinc-950 border border-zinc-700/60 p-8 flex flex-col items-center justify-center text-center shadow-2xl overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/10 via-blue-500/10 to-transparent opacity-60 group-hover:opacity-100 transition-opacity" />
              
              <div className="w-20 h-20 rounded-2xl bg-zinc-50/80 border border-zinc-700 flex items-center justify-center text-purple-400 mb-6 group-hover:scale-110 transition-transform duration-300">
                <Cpu size={40} />
              </div>

              <h3 className="text-2xl font-bold text-zinc-900 mb-2">High-Performance Electronics</h3>
              <p className="text-xs text-zinc-600 max-w-xs">
                Precision engineering meets modern minimalist aesthetic.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
