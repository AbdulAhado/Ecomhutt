import dynamic from 'next/dynamic';
import Hero from '@/components/home/Hero';

// Lazy-load below-the-fold components
const ProductSliders = dynamic(() => import('@/components/home/ProductSliders'), {
  loading: () => <div className="h-96 bg-zinc-50 animate-pulse" />,
});

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5000/api';

async function getHeroBanners() {
  try {
    const res = await fetch(`${API_BASE}/herobanners`, { 
      next: { revalidate: 1800 } // Revalidate every 30 minutes (ISR)
    });
    if (!res.ok) return [];
    return res.json();
  } catch (error) {
    console.error("Failed to fetch hero banners:", error);
    return [];
  }
}

async function getProducts() {
  try {
    const res = await fetch(`${API_BASE}/products`, { 
      next: { revalidate: 60 } 
    });
    if (!res.ok) return [];
    // If the API returns pagination (our updated backend), return products array
    const data = await res.json();
    return data.products || data || [];
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return [];
  }
}

export default async function HomePage() {
  const [heroBanners, products] = await Promise.all([
    getHeroBanners(),
    getProducts()
  ]);

  return (
    <div className="min-h-screen bg-white">
      <Hero initialBanners={heroBanners} />
      <ProductSliders initialProducts={products} />
    </div>
  );
}
