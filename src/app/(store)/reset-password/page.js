'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useShop } from '@/context/ShopContext';

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { resetPassword } = useShop();

  const [email, setEmail] = useState(searchParams.get('email') || '');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !otp.trim() || !newPassword.trim()) { setError('All fields are required.'); return; }
    if (newPassword !== confirmPassword) { setError('Passwords do not match.'); return; }
    if (newPassword.length < 6) { setError('Password must be at least 6 characters.'); return; }
    setLoading(true); setError(''); setSuccess('');
    const result = await resetPassword(email, otp, newPassword);
    setLoading(false);
    if (result.success) {
      setSuccess('Password reset successfully! Redirecting to login...');
      setTimeout(() => router.push('/login'), 2000);
    } else {
      setError(result.message || 'Failed to reset password. OTP may be invalid or expired.');
    }
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

        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold text-zinc-900">Reset Password</h1>
          <p className="text-sm text-zinc-400">Enter the 6-digit code from your email and choose a strong new password.</p>
        </div>

        {error && <div className="p-4 bg-red-50 border border-red-100 text-xs text-red-600 font-medium">{error}</div>}
        {success && <div className="p-4 bg-green-50 border border-green-100 text-xs text-green-700 font-medium">{success}</div>}

        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          <div>
            <label className={labelClass}>Email Address</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>6-Digit Reset Code</label>
            <input type="text" value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="123456" maxLength={6} className={`${inputClass} text-center text-xl tracking-widest font-bold`} />
          </div>
          <div>
            <label className={labelClass}>New Password</label>
            <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Minimum 6 characters" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Confirm Password</label>
            <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Re-enter your password" className={inputClass} />
          </div>
          <button type="submit" disabled={loading} className="w-full py-4 bg-zinc-900 text-white text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-zinc-800 transition-colors">
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>

        <p className="text-sm text-zinc-400 text-center">
          Remember your password?{' '}
          <Link href="/login" className="text-zinc-900 font-bold hover:underline underline-offset-4 decoration-1">Sign In</Link>
        </p>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white flex items-center justify-center text-zinc-400 text-sm">Loading...</div>}>
      <ResetPasswordContent />
    </Suspense>
  );
}
