'use client';

import { Sparkles, ShieldCheck, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

const values = [
  {
    icon: Sparkles,
    title: 'Premium Craftsmanship',
    text: 'Each piece is ethically sourced, hand-crafted, or detailed by master artisans using premium, sustainable materials.',
  },
  {
    icon: ShieldCheck,
    title: 'Secure Authenticity',
    text: 'All items are certified authentic with direct tracking from production to your doorstep.',
  },
  {
    icon: RefreshCw,
    title: 'Effortless Returns',
    text: 'Enjoy 30-day complimentary shipping and returns on all domestic orders, processed instantly.',
  },
];

export default function Philosophy() {
  return (
    <section className="py-24 bg-white border-t border-zinc-900">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-semibold uppercase tracking-widest text-zinc-500">
            Why Choose EcomHutt
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 tracking-tight">
            Built on Uncompromising Quality
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {values.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.15 }}
                className="rounded-3xl glass-panel p-8 border border-zinc-200/80 hover:border-zinc-700/80 transition-all duration-300 space-y-4 group"
              >
                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-zinc-900 group-hover:scale-110 group-hover:bg-white group-hover:text-zinc-950 transition-all duration-300">
                  <Icon size={24} />
                </div>
                <h3 className="text-xl font-bold text-zinc-900 tracking-tight">
                  {item.title}
                </h3>
                <p className="text-xs text-zinc-600 leading-relaxed font-normal">
                  {item.text}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
