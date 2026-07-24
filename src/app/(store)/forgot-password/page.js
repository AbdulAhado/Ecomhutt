'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useShop } from '@/context/ShopContext';

export default function ForgotPasswordPage() {
  const { forgotPassword } = useShop();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) { setError('Please enter your email.'); return; }
    setLoading(true); setError('');
    try {
      const result = await forgotPassword(email);
      if (result?.success) { setSent(true); }
      else { setError(result?.message || 'Could not send reset link. Try again.'); }
    } catch { setError('Something went wrong.'); }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6 py-16">
      <div className="w-full max-w-md space-y-8">
        <Link href="/" className="flex items-center gap-2.5 mb-8">
          <img src="/favicon.svg" alt="EcomHutt Logo" className="w-7 h-7" />
          <span className="text-xl font-bold tracking-tight text-zinc-900">EcomHutt</span>
        </Link>

        {sent ? (
          <div className="space-y-4 text-center">
            <div className="w-16 h-16 mx-auto bg-zinc-900 flex items-center justify-center text-white text-2xl">✓</div>
            <h2 className="text-2xl font-bold text-zinc-900">Check Your Email</h2>
            <p className="text-sm text-zinc-500">We sent a password reset link to <strong>{email}</strong>. Check your inbox and follow the instructions.</p>
            <Link href="/login" className="inline-block mt-4 px-8 py-3.5 bg-zinc-900 text-white text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-zinc-800 transition-colors">
              Back to Sign In
            </Link>
          </div>
        ) : (
          <>
            <div>
              <h2 className="text-3xl font-bold text-zinc-900">Forgot Password?</h2>
              <p className="text-sm text-zinc-400 mt-2">Enter your email and we will send you a reset link.</p>
            </div>

            {error && <div className="p-4 bg-red-50 border border-red-100 text-xs text-red-600 font-medium">{error}</div>}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-400 mb-2 block">Email Address</label>
                <input
                  type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com"
                  className="w-full bg-white border border-zinc-200 px-4 py-3.5 text-sm text-zinc-900 placeholder-zinc-300 focus:outline-none focus:border-zinc-900 transition-colors"
                />
              </div>
              <button type="submit" disabled={loading} className="w-full py-4 bg-zinc-900 text-white text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-zinc-800 transition-colors disabled:opacity-60">
                {loading ? 'Sending...' : 'Send Reset Link'}
              </button>
            </form>

            <p className="text-sm text-zinc-400 text-center">
              Remember your password?{' '}
              <Link href="/login" className="text-zinc-900 font-bold hover:underline underline-offset-4 decoration-1">Sign In</Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
