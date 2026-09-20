'use client';

import { Suspense, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useShop } from '@/context/ShopContext';
import { Eye, EyeOff, Loader2 } from 'lucide-react';

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectParam = searchParams.get('redirect');

  const { login } = useShop();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) { setError('Please enter your email and password.'); return; }
    setLoading(true); setError('');
    const result = await login(email, password);
    setLoading(false);
    if (result.success) {
      if (redirectParam) {
        router.push(redirectParam);
      } else {
        router.push(result.user?.role === 'admin' || result.user?.role === 'lister' ? '/admin' : '/dashboard');
      }
    } else {
      result.notVerified ? router.push(`/verify-otp?email=${encodeURIComponent(result.email || email)}`) : setError(result.message || 'Invalid credentials.');
    }
  };

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left Brand Panel */}
      <div className="hidden lg:flex flex-col justify-between w-[45%] bg-[#f8f8f8] border-r border-zinc-100 p-16">
        <Link href="/" className="text-xl font-bold tracking-tight text-zinc-900">EcomHutt</Link>
        <div className="space-y-6">
          <h1 className="text-5xl font-bold text-zinc-900 leading-tight tracking-tight">
            Welcome<br />Back.
          </h1>
          <p className="text-sm text-zinc-500 leading-relaxed max-w-xs">
            Sign in to access your dashboard, order history, wishlist, and manage your account.
          </p>
        </div>
      </div>

      {/* Right — Form Panel */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-16">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile logo */}
          <Link href="/" className="lg:hidden block text-xl font-bold text-zinc-900 mb-8">EcomHutt</Link>

          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-zinc-900">Sign In</h2>
            <p className="text-sm text-zinc-400">
              {redirectParam === '/checkout'
                ? 'Sign in to complete your checkout'
                : 'Enter your credentials to continue.'}
            </p>
          </div>

          {error && (
            <div className="p-4 bg-red-50 border border-red-100 text-xs text-red-600 font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            <div>
              <label className="text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-400 mb-2 block">Email Address</label>
              <input
                type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-white border border-zinc-200 px-4 py-3.5 text-sm text-zinc-900 placeholder-zinc-300 focus:outline-none focus:border-zinc-900 transition-colors"
              />
            </div>
            <div>
              <label className="text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-400 mb-2 block">Password</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white border border-zinc-200 px-4 py-3.5 pr-12 text-sm text-zinc-900 placeholder-zinc-300 focus:outline-none focus:border-zinc-900 transition-colors"
                />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-900 transition-colors">
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="flex justify-end">
              <Link href="/forgot-password" className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 hover:text-zinc-900 transition-colors">
                Forgot Password?
              </Link>
            </div>

            <button type="submit" disabled={loading} className="w-full py-4 bg-zinc-900 text-white text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-zinc-800 transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
              {loading ? <><Loader2 size={14} className="animate-spin" /> Signing In...</> : 'Sign In'}
            </button>
          </form>

          <p className="text-sm text-zinc-400 text-center">
            Don&apos;t have an account?{' '}
            <Link
              href={redirectParam ? `/register?redirect=${encodeURIComponent(redirectParam)}` : '/register'}
              className="text-zinc-900 font-bold hover:underline underline-offset-4 decoration-1"
            >
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white flex items-center justify-center">
          <Loader2 size={28} className="animate-spin text-zinc-900" />
        </div>
      }
    >
      <LoginFormContent />
    </Suspense>
  );
}
