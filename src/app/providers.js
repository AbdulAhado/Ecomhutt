'use client';

import { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import { ShopProvider } from '@/context/ShopContext';
import axios from 'axios';
import Lenis from 'lenis';
import { usePathname } from 'next/navigation';

export function Providers({ children }) {
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        staleTime: 60 * 1000,
                        refetchOnWindowFocus: false,
                    },
                },
            })
    );

    const [paypalClientId, setPaypalClientId] = useState('');

    useEffect(() => {
        async function fetchPaypalConfig() {
            try {
                const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
                const { data } = await axios.get(`${API_BASE}/config/paypal`);
                setPaypalClientId(data || 'sb');
            } catch (err) {
                setPaypalClientId('sb');
            }
        }
        fetchPaypalConfig();
    }, []);

    const pathname = usePathname();

    useEffect(() => {
        if (pathname && pathname.startsWith('/admin')) {
            return;
        }

        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            smoothWheel: true,
            wheelMultiplier: 1,
        });

        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }

        requestAnimationFrame(raf);

        return () => {
            lenis.destroy();
        };
    }, []);

    return (
        <QueryClientProvider client={queryClient}>
            <ShopProvider>
                {paypalClientId ? (
                    <PayPalScriptProvider options={{ 'client-id': paypalClientId }}>
                        {children}
                    </PayPalScriptProvider>
                ) : (
                    children
                )}
            </ShopProvider>
        </QueryClientProvider>
    );
}
