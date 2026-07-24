'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="flex flex-col items-center gap-6 max-w-md text-center p-8">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h2 className="text-2xl font-semibold text-zinc-900">Something went wrong!</h2>
        <p className="text-zinc-500">We apologize for the inconvenience. Please try refreshing the page.</p>
        <div className="flex gap-4 w-full mt-4">
          <button
            onClick={() => reset()}
            className="flex-1 bg-zinc-900 text-white px-6 py-3 rounded-full hover:bg-zinc-800 transition-colors"
          >
            Try again
          </button>
          <Link href="/" className="flex-1 border border-zinc-200 text-zinc-900 px-6 py-3 rounded-full hover:bg-zinc-50 transition-colors">
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}
