import Link from 'next/link';
import { XCircle } from 'lucide-react';

export default function PaymentFailurePage() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center text-center gap-8 px-6">
      <div className="w-20 h-20 flex items-center justify-center bg-red-50 border border-red-100">
        <XCircle size={36} className="text-red-500" />
      </div>
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-400 mb-3">Payment Failed</p>
        <h1 className="text-4xl font-bold text-zinc-900 tracking-tight mb-4">Something went wrong.</h1>
        <p className="text-sm text-zinc-500 max-w-sm mx-auto leading-relaxed">
          Your payment could not be processed. No charges were made. Please try again or use a different payment method.
        </p>
      </div>
      <div className="flex items-center gap-4 flex-wrap justify-center">
        <Link href="/checkout" className="px-8 py-4 bg-zinc-900 text-white text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-zinc-800 transition-colors">
          Try Again
        </Link>
        <Link href="/cart" className="px-8 py-4 border border-zinc-200 text-zinc-900 text-[10px] font-bold uppercase tracking-[0.2em] hover:border-zinc-900 transition-colors">
          Back to Cart
        </Link>
      </div>
    </div>
  );
}
