const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5000/api';
const FRONTEND_URL = process.env.NEXT_PUBLIC_FRONTEND_URL || 'http://localhost:3000';

async function getProducts() {
  try {
    const res = await fetch(`${API_BASE}/products`);
    if (!res.ok) return [];
    const data = await res.json();
    return data.products || data || [];
  } catch (err) {
    return [];
  }
}

export default async function sitemap() {
  const products = await getProducts();

  const productUrls = products.map((product) => ({
    url: `${FRONTEND_URL}/product/${product._id || product.id}`,
    lastModified: new Date(product.updatedAt || new Date()),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  return [
    {
      url: `${FRONTEND_URL}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${FRONTEND_URL}/shop`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    ...productUrls,
  ];
}
