const BASE_URL =
  process.env.NEXT_PUBLIC_FRONTEND_URL ||
  process.env.NEXT_PUBLIC_SITE_URL ||
  'https://ecomhutt.com';

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ||
  'https://ecomhutt-backend.onrender.com/api';

// ─── Static public routes ────────────────────────────────────────────────────
const STATIC_ROUTES = [
  { path: '',            changeFrequency: 'daily',   priority: 1.0 },
  { path: '/shop',       changeFrequency: 'daily',   priority: 0.95 },
  { path: '/about',      changeFrequency: 'monthly', priority: 0.7  },
  { path: '/contact',    changeFrequency: 'monthly', priority: 0.65 },
  { path: '/careers',    changeFrequency: 'weekly',  priority: 0.6  },
  { path: '/faq',        changeFrequency: 'monthly', priority: 0.6  },
  { path: '/stores',     changeFrequency: 'monthly', priority: 0.6  },
  { path: '/track-order',changeFrequency: 'monthly', priority: 0.5  },
  { path: '/shipping-returns', changeFrequency: 'monthly', priority: 0.55 },
  { path: '/sustainability',   changeFrequency: 'monthly', priority: 0.5  },
];

// ─── Fetch helpers ────────────────────────────────────────────────────────────
async function fetchJSON(endpoint) {
  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      next: { revalidate: 3600 }, // ISR: re-fetch every hour
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

async function getProducts() {
  const data = await fetchJSON('/products?limit=1000');
  return Array.isArray(data) ? data : (data?.products ?? []);
}

async function getCategories() {
  const data = await fetchJSON('/categories');
  return Array.isArray(data) ? data : (data?.categories ?? []);
}

// ─── Sitemap export ───────────────────────────────────────────────────────────
export default async function sitemap() {
  const now = new Date();

  // 1. Static routes
  const staticUrls = STATIC_ROUTES.map(({ path, changeFrequency, priority }) => ({
    url: `${BASE_URL}${path}`,
    lastModified: now,
    changeFrequency,
    priority,
  }));

  // 2. Dynamic product pages
  const [products, categories] = await Promise.all([getProducts(), getCategories()]);

  const productUrls = products.map((product) => ({
    url: `${BASE_URL}/product/${product._id ?? product.id}`,
    lastModified: product.updatedAt ? new Date(product.updatedAt) : now,
    changeFrequency: 'weekly',
    priority: 0.85,
  }));

  // 3. Dynamic category pages
  const categoryUrls = categories.map((cat) => ({
    url: `${BASE_URL}/category/${cat.slug ?? cat._id ?? cat.id}`,
    lastModified: cat.updatedAt ? new Date(cat.updatedAt) : now,
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  return [...staticUrls, ...categoryUrls, ...productUrls];
}
