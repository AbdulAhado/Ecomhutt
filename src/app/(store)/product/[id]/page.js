import Link from 'next/link';
import ProductClient from './ProductClient';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5000/api';

async function getProduct(id) {
  try {
    const res = await fetch(`${API_BASE}/products/${id}`, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    return null;
  }
}

async function getProducts() {
  try {
    const res = await fetch(`${API_BASE}/products`, { next: { revalidate: 60 } });
    if (!res.ok) return [];
    const data = await res.json();
    return data.products || data || [];
  } catch (err) {
    return [];
  }
}

export async function generateMetadata({ params }) {
  const product = await getProduct(params.id);

  if (!product) {
    return { title: 'Product Not Found | EcomHutt' };
  }

  return {
    title: `${product.name} | EcomHutt`,
    description: product.description || `Buy ${product.name} at EcomHutt.`,
    openGraph: {
      title: product.name,
      description: product.description,
      images: [product.image || (product.images && product.images[0]) || ''],
    },
  };
}

export default async function ProductDetailPage({ params }) {
  const product = await getProduct(params.id);

  if (!product) {
    return (
      <div className="min-h-screen bg-white pt-36 pb-24 text-center flex flex-col items-center justify-center space-y-6">
        <h2 className="text-3xl font-bold text-zinc-900">Product Not Found</h2>
        <p className="text-sm text-zinc-500">The product you are looking for does not exist or has been removed.</p>
        <Link href="/shop" className="px-8 py-3.5 bg-zinc-900 text-white text-[10px] font-bold uppercase tracking-[0.15em] hover:bg-zinc-800 transition-colors">
          Back to Shop
        </Link>
      </div>
    );
  }

  // Fetch all products for recommendations (could be optimized with a specific recommendation endpoint in the future)
  const allProducts = await getProducts();
  const recommendations = allProducts
    .filter((p) => String(p._id) !== String(product._id) && p.category === product.category)
    .slice(0, 4);

  // Generate JSON-LD Schema
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: product.image || (product.images && product.images[0]),
    description: product.description || `Buy ${product.name} at EcomHutt.`,
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: 'USD',
      availability: product.inStock !== false ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
    }
  };

  return (
    <>
      {/* Inject JSON-LD directly into the HTML head for crawlers */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProductClient product={product} recommendations={recommendations} />
    </>
  );
}
