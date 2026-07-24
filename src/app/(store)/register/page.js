'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useShop } from '@/context/ShopContext';

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useShop();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password.trim()) { setError('All fields are required.'); return; }
    if (password !== confirmPassword) { setError('Passwords do not match.'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    setLoading(true); setError('');
    const result = await register(name, email, password);
    setLoading(false);
    if (result.success) {
      router.push(`/verify-otp?email=${encodeURIComponent(email)}`);
    } else {
      setError(result.message || 'Registration failed.');
    }
  };

  const inputClass = 'w-full bg-white border border-zinc-200 px-4 py-3.5 text-sm text-zinc-900 placeholder-zinc-300 focus:outline-none focus:border-zinc-900 transition-colors';
  const labelClass = 'text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-400 mb-2 block';

  return (
    <div className="min-h-screen bg-white flex">

      {/* Left Brand Panel */}
      <div className="hidden lg:flex flex-col justify-between w-[45%] bg-[#f8f8f8] border-r border-zinc-100 p-16">
        <Link href="/" className="flex items-center gap-2.5">
          <img src="/favicon.svg" alt="EcomHutt Logo" className="w-8 h-8" />
          <span className="text-xl font-bold tracking-tight text-zinc-900">EcomHutt</span>
        </Link>
        <div className="space-y-6">
          <h1 className="text-5xl font-bold text-zinc-900 leading-tight tracking-tight">
            Join the<br />Community.
          </h1>
          <p className="text-sm text-zinc-500 leading-relaxed max-w-xs">
            Create an account to save favourites, track orders, and enjoy an exclusive personalised experience.
          </p>
        </div>
        <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-zinc-300">Premium · Curated · Effortless</p>
      </div>

      {/* Right Form Panel */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-16">
        <div className="w-full max-w-md space-y-8">
          <Link href="/" className="lg:hidden flex items-center gap-2.5 mb-8">
            <img src="/favicon.svg" alt="EcomHutt Logo" className="w-7 h-7" />
            <span className="text-xl font-bold text-zinc-900">EcomHutt</span>
          </Link>
          <div>
            <h2 className="text-3xl font-bold text-zinc-900">Create Account</h2>
            <p className="text-sm text-zinc-400 mt-2">Fill in your details to get started.</p>
          </div>

          {error && <div className="p-4 bg-red-50 border border-red-100 text-xs text-red-600 font-medium">{error}</div>}

          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            {[
              { label: 'Full Name', type: 'text', value: name, setter: setName, placeholder: 'Alexandra Morrison' },
              { label: 'Email Address', type: 'email', value: email, setter: setEmail, placeholder: 'you@example.com' },
              { label: 'Password', type: 'password', value: password, setter: setPassword, placeholder: 'Min. 6 characters' },
              { label: 'Confirm Password', type: 'password', value: confirmPassword, setter: setConfirmPassword, placeholder: 'Re-enter your password' },
            ].map((field) => (
              <div key={field.label}>
                <label className={labelClass}>{field.label}</label>
                <input type={field.type} value={field.value} onChange={(e) => field.setter(e.target.value)} placeholder={field.placeholder} className={inputClass} />
              </div>
            ))}
            <button type="submit" disabled={loading} className="w-full py-4 bg-zinc-900 text-white text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-zinc-800 transition-colors disabled:opacity-60">
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <p className="text-sm text-zinc-400 text-center">
            Already have an account?{' '}
            <Link href="/login" className="text-zinc-900 font-bold hover:underline underline-offset-4 decoration-1">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
