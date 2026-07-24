'use client';

import { useState } from 'react';
import { ArrowRight, Mail } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Newsletter() {
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
    <section className="py-24 bg-white border-t border-zinc-900 relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-6 text-center relative z-10 space-y-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="rounded-3xl glass-panel p-10 sm:p-16 border border-zinc-200/80 space-y-6"
        >
          <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-zinc-900 mx-auto">
            <Mail size={28} />
          </div>

          <div className="space-y-3">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 tracking-tight">
              Stay Ahead of the Curve
            </h2>
            <p className="text-sm sm:text-base text-zinc-600 max-w-lg mx-auto leading-relaxed">
              Subscribe to receive private invitations to seasonal drops, secret collections, and exclusive brand editorial content.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="max-w-md mx-auto relative flex items-center">
            <input
              type="email"
              placeholder="Enter your email address"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-zinc-50/80 border border-zinc-700/60 rounded-2xl pl-5 pr-14 py-4 text-sm text-zinc-900 placeholder-zinc-500 focus:outline-none focus:border-zinc-400"
            />
            <button
              type="submit"
              className="absolute right-2 p-2.5 bg-white text-zinc-950 rounded-xl hover:bg-zinc-200 transition-colors"
              aria-label="Subscribe"
            >
              <ArrowRight size={18} />
            </button>
          </form>

          {subscribed && (
            <p className="text-xs text-emerald-400 font-semibold animate-in fade-in">
              Welcome to the EcomHutt Inner Circle. Check your inbox soon!
            </p>
          )}
        </motion.div>
      </div>
    </section>
  );
}
