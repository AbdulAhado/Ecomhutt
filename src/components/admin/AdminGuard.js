'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useShop } from '@/context/ShopContext';

export default function AdminGuard({ children }) {
  const { user, isLoaded } = useShop();
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const hasRedirected = useRef(false);

  useEffect(() => {
    // Don't do anything until ShopContext has loaded from localStorage
    if (!isLoaded) return;

    if (!user) {
      if (!hasRedirected.current) {
        hasRedirected.current = true;
        router.replace('/login');
      }
    } else if (user.role === 'customer') {
      if (!hasRedirected.current) {
        hasRedirected.current = true;
        router.replace('/');
      }
    } else {
      // User is admin or lister — allow access immediately
      setAuthorized(true);
    }
  }, [user, isLoaded, router]);

  if (!authorized) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-zinc-800 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  return children;
}
