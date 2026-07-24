'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useShop } from '@/context/ShopContext';

function VerifyOTPContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { verifyOTP, resendOTP } = useShop();

  const [email, setEmail] = useState(searchParams.get('email') || '');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !otp.trim()) { setError('Please provide both email and OTP.'); return; }
    setLoading(true); setError(''); setSuccess('');
    const result = await verifyOTP(email, otp);
    setLoading(false);
    if (result.success) { router.push('/dashboard'); }
    else { setError(result.message || 'Verification failed. Please check your OTP.'); }
  };

  const handleResend = async () => {
    if (!email.trim()) { setError('Email is required to resend OTP.'); return; }
    setResendLoading(true); setError(''); setSuccess('');
    const result = await resendOTP(email);
    setResendLoading(false);
    if (result.success) { setSuccess('A new OTP has been sent to your email.'); }
    else { setError(result.message || 'Failed to resend OTP.'); }
  };

  const inputClass = 'w-full bg-white border border-zinc-200 px-4 py-3.5 text-sm text-zinc-900 placeholder-zinc-300 focus:outline-none focus:border-zinc-900 transition-colors';
  const labelClass = 'text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-400 mb-2 block';

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-md space-y-8">
        
        {/* Brand Link */}
        <Link href="/" className="flex items-center gap-2.5 justify-center mb-8">
          <img src="/favicon.svg" alt="EcomHutt Logo" className="w-8 h-8" />
          <span className="text-xl font-bold tracking-tight text-zinc-900">EcomHutt</span>
        </Link>

        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-zinc-900">Verify Your Email</h1>
          <p className="text-sm text-zinc-400">We sent a 6-digit code to your email. Enter it below to continue.</p>
        </div>

        {error && <div className="p-4 bg-red-50 border border-red-100 text-xs text-red-600 font-medium">{error}</div>}
        {success && <div className="p-4 bg-green-50 border border-green-100 text-xs text-green-700 font-medium">{success}</div>}

        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          <div>
            <label className={labelClass}>Email Address</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className={inputClass} readOnly={!!searchParams.get('email')} />
          </div>
          <div>
            <label className={labelClass}>6-Digit Code</label>
            <input type="text" value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="123456" maxLength={6} className={`${inputClass} text-center text-2xl tracking-[0.5em] font-bold`} />
          </div>
          <button type="submit" disabled={loading} className="w-full py-4 bg-zinc-900 text-white text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-zinc-800 disabled:opacity-60 transition-colors">
            {loading ? 'Verifying...' : 'Verify Email'}
          </button>
        </form>

        <p className="text-sm text-zinc-400 text-center">
          Didn&apos;t receive the code?{' '}
          <button onClick={handleResend} disabled={resendLoading} className="text-zinc-900 font-bold hover:underline underline-offset-4 decoration-1 disabled:opacity-60">
            {resendLoading ? 'Sending...' : 'Resend OTP'}
          </button>
        </p>
        <p className="text-sm text-zinc-400 text-center">
          <Link href="/login" className="text-zinc-400 hover:text-zinc-900 transition-colors font-semibold">← Back to Login</Link>
        </p>
      </div>
    </div>
  );
}

export default function VerifyOTPPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white flex items-center justify-center text-zinc-400 text-sm">Loading...</div>}>
      <VerifyOTPContent />
    </Suspense>
  );
}
