const BASE_URL =
  process.env.NEXT_PUBLIC_FRONTEND_URL ||
  process.env.NEXT_PUBLIC_SITE_URL ||
  'https://ecomhutt.com';

export default function robots() {
  return {
    rules: [
      // ── Main crawlers: allow everything public ──────────────────────────────
      {
        userAgent: [
          'Googlebot',
          'Googlebot-Image',
          'Googlebot-Video',
          'AdsBot-Google',
          'Bingbot',
          'Slurp',          // Yahoo
          'DuckDuckBot',
          'Baiduspider',
          'YandexBot',
          'facebot',
          'Twitterbot',
          'LinkedInBot',
          'WhatsApp',
          'Applebot',
        ],
        allow: '/',
        disallow: [
          '/admin',
          '/api/',
          '/dashboard',
          '/checkout',
          '/cart',
          '/order/',
          '/payment',
          '/wishlist',
          '/login',
          '/register',
          '/forgot-password',
          '/reset-password',
          '/verify-otp',
          '/_next/static/',
          '/_next/image',
          '/static/',
        ],
      },
      // ── Aggressive / scraper bots: block entirely ───────────────────────────
      {
        userAgent: [
          'GPTBot',
          'ChatGPT-User',
          'CCBot',
          'anthropic-ai',
          'ClaudeBot',
          'Google-Extended',
          'Amazonbot',
          'SemrushBot',
          'AhrefsBot',
          'MJ12bot',
          'DotBot',
          'BLEXBot',
          'DataForSeoBot',
        ],
        disallow: '/',
      },
    ],

    // Sitemap location (Google picks this up automatically)
    sitemap: `${BASE_URL}/sitemap.xml`,

    // Crawl-delay hint (not honoured by Google, but Bing/Yandex respect it)
    // host: BASE_URL,  // uncomment if Yandex is a priority
  };
}
