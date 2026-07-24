import Link from 'next/link';
import { CheckCircle2 } from 'lucide-react';

export default function PaymentSuccessPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center text-center gap-8 px-6">
      <div className="w-20 h-20 flex items-center justify-center bg-zinc-900">
        <CheckCircle2 size={36} className="text-white" />
      </div>
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-400 mb-3">Payment Successful</p>
        <h1 className="text-4xl font-bold text-zinc-900 tracking-tight mb-4">Thank You!</h1>
        <p className="text-sm text-zinc-500 max-w-sm mx-auto leading-relaxed">
          Your order has been confirmed. You will receive a confirmation email shortly with tracking details.
        </p>
      </div>
      <div className="flex items-center gap-4 flex-wrap justify-center">
        <Link href="/dashboard" className="px-8 py-4 bg-zinc-900 text-white text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-zinc-800 transition-colors">
          View Orders
        </Link>
        <Link href="/shop" className="px-8 py-4 border border-zinc-200 text-zinc-900 text-[10px] font-bold uppercase tracking-[0.2em] hover:border-zinc-900 transition-colors">
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
