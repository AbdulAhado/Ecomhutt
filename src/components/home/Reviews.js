'use client';

import { Star } from 'lucide-react';
import { motion } from 'framer-motion';

const reviews = [
  {
    name: 'Alexander Wright',
    role: 'Verified Buyer',
    rating: 5,
    comment:
      'The build quality and tactile feeling of the products exceeded all expectations. Fast shipping and unbelievable packaging.',
  },
  {
    name: 'Elena Rostova',
    role: 'Architect & Designer',
    rating: 5,
    comment:
      'EcomHutt is my go-to for modern home decor and tech accessories. Clean, functional, and visually striking minimal design.',
  },
  {
    name: 'Marcus Chen',
    role: 'Verified Buyer',
    rating: 5,
    comment:
      'Customer support processed my order query instantly. The audio quality on the headphones is unmatched for this price.',
  },
];

export default function Reviews() {
  return (
    <section className="py-24 bg-white/90 border-t border-zinc-900">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-semibold uppercase tracking-widest text-zinc-500">
            Customer Testimonials
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 tracking-tight">
            Loved by Collectors Worldwide
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((rev, idx) => (
            <motion.div
              key={rev.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.15 }}
              className="rounded-3xl glass-panel p-8 border border-zinc-200/80 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex gap-1 text-amber-400">
                  {Array.from({ length: rev.rating }).map((_, i) => (
                    <Star key={i} size={16} fill="currentColor" />
                  ))}
                </div>
                <p className="text-sm text-zinc-300 italic leading-relaxed">
                  &ldquo;{rev.comment}&rdquo;
                </p>
              </div>

              <div className="mt-6 pt-6 border-t border-zinc-200/60 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-zinc-900">{rev.name}</h4>
                  <span className="text-xs text-zinc-500">{rev.role}</span>
                </div>
                <div className="w-8 h-8 rounded-full bg-zinc-100 text-zinc-600 font-bold text-xs flex items-center justify-center">
                  {rev.name[0]}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
