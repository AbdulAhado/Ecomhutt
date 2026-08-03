import dynamic from 'next/dynamic';
import Hero from '@/components/home/Hero';

// Lazy-load below-the-fold components
const ProductSliders = dynamic(() => import('@/components/home/ProductSliders'), {
  loading: () => <div className="h-96 bg-zinc-50 animate-pulse" />,
});

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

async function getHeroCategories() {
  try {
    const res = await fetch(`${API_BASE}/categories/hero`, {
      next: { revalidate: 60 }
    });
    if (!res.ok) return [];
    return await res.json();
  } catch (error) {
    console.error("Failed to fetch hero categories:", error);
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
  const [heroCategories, products] = await Promise.all([
    getHeroCategories(),
    getProducts()
  ]);

  return (
    <div className="min-h-screen bg-white">
      <Hero initialCategories={heroCategories} />
      <ProductSliders initialProducts={products} />
    </div>
  );
}