import Link from 'next/link';
import { Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center text-center gap-8 px-6">
      <Link href="/" className="flex items-center gap-2.5">
        <img src="/favicon.svg" alt="EcomHutt Logo" className="w-8 h-8" />
        <span className="text-xl font-bold tracking-tight text-zinc-900">EcomHutt</span>
      </Link>

      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-400 mb-4">404 Error</p>
        <h1 className="text-6xl md:text-8xl font-bold text-zinc-900 tracking-tight leading-none mb-4">Not Found.</h1>
        <p className="text-sm text-zinc-500 max-w-sm mx-auto leading-relaxed">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
      </div>

      <div className="flex items-center gap-4 flex-wrap justify-center">
        <Link href="/" className="px-8 py-3.5 bg-zinc-900 text-white text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-zinc-800 transition-colors">
          Go Home
        </Link>
        <Link href="/shop" className="px-8 py-3.5 border border-zinc-200 text-zinc-900 text-[10px] font-bold uppercase tracking-[0.2em] hover:border-zinc-900 transition-colors">
          Browse Shop
        </Link>
      </div>
    </div>
  );
}
