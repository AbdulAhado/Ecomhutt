import './globals.css';
import { Inter } from 'next/font/google';
import { Providers } from './providers';
import Script from 'next/script';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const BASE_URL = 'https://ecomhutt.com';

export const metadata = {
  metadataBase: new URL(BASE_URL),

  // ── Primary ──────────────────────────────────────────────────────────────
  title: {
    default: 'EcomHutt — Premium Modern E-Commerce | Fashion, Tech & More',
    template: '%s | EcomHutt',
  },
  description:
    'Shop premium fashion, shoes, electronics, beauty & home décor at EcomHutt. Luxury quality at honest prices — curated with visual clarity and premium craftsmanship. Free shipping on orders over $50.',
  keywords: [
    'EcomHutt', 'ecomhutt.com', 'online shopping Pakistan', 'premium ecommerce',
    'luxury fashion online', 'buy shoes online', 'electronics store', 'beauty products',
    'home décor online', 'furniture online', 'modern clothing', 'tech accessories',
    'premium sneakers', 'designer bags', 'online store Pakistan', 'shop online',
    'best online store', 'premium products', 'affordable luxury',
  ],

  // ── Canonical / alternates ────────────────────────────────────────────────
  alternates: {
    canonical: BASE_URL,
    languages: {
      'en-US': BASE_URL,
      'en-PK': BASE_URL,
    },
  },

  // ── Authors / publisher ───────────────────────────────────────────────────
  authors: [{ name: 'EcomHutt', url: BASE_URL }],
  creator: 'EcomHutt',
  publisher: 'EcomHutt',

  // ── Open Graph (Facebook, WhatsApp, LinkedIn previews) ───────────────────
  openGraph: {
    title: 'EcomHutt — Premium Modern E-Commerce',
    description:
      'A curated collection of modern luxury items — fashion, shoes, electronics, beauty & home décor. Free shipping. Premium quality.',
    url: BASE_URL,
    siteName: 'EcomHutt',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: `${BASE_URL}/images/categories/electronics.png`,
        width: 1200,
        height: 630,
        alt: 'EcomHutt — Premium Modern E-Commerce Store',
        type: 'image/png',
      },
      {
        url: `${BASE_URL}/images/categories/fashion.png`,
        width: 1200,
        height: 630,
        alt: 'EcomHutt — Modern Fashion Collection',
        type: 'image/png',
      },
    ],
  },

  // ── Twitter / X Card ─────────────────────────────────────────────────────
  twitter: {
    card: 'summary_large_image',
    site: '@ecomhutt',
    creator: '@ecomhutt',
    title: 'EcomHutt — Premium Modern E-Commerce',
    description:
      'Shop premium fashion, shoes, electronics, beauty & home décor at EcomHutt. Luxury quality, honest prices.',
    images: [`${BASE_URL}/images/categories/electronics.png`],
  },

  // ── Robots ────────────────────────────────────────────────────────────────
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  // ── Verification tags ─────────────────────────────────────────────────────
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || '',
    // yandex: 'your-yandex-token',
    // bing: 'your-bing-token',
  },

  // ── App-specific ──────────────────────────────────────────────────────────
  applicationName: 'EcomHutt',
  category: 'shopping',
  classification: 'E-Commerce',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)',  color: '#09090b' },
  ],
};

// ── JSON-LD Structured Data (helps Google understand your business) ─────────
const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': `${BASE_URL}/#website`,
      url: BASE_URL,
      name: 'EcomHutt',
      description: 'Premium Modern E-Commerce — Fashion, Tech, Beauty & More',
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: `${BASE_URL}/shop?q={search_term_string}`,
        },
        'query-input': 'required name=search_term_string',
      },
    },
    {
      '@type': 'Organization',
      '@id': `${BASE_URL}/#organization`,
      name: 'EcomHutt',
      url: BASE_URL,
      logo: {
        '@type': 'ImageObject',
        url: `${BASE_URL}/favicon.svg`,
        width: 512,
        height: 512,
      },
      sameAs: [
        'https://www.instagram.com/ecomhutt',
        'https://www.facebook.com/ecomhutt',
        'https://twitter.com/ecomhutt',
      ],
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'customer service',
        availableLanguage: ['English', 'Urdu'],
      },
    },
    {
      '@type': 'Store',
      '@id': `${BASE_URL}/#store`,
      name: 'EcomHutt',
      url: BASE_URL,
      image: `${BASE_URL}/images/categories/electronics.png`,
      description:
        'Premium modern e-commerce store offering fashion, shoes, electronics, beauty and home décor.',
      priceRange: '$$',
      servesCuisine: undefined,
      hasMap: undefined,
      openingHours: 'Mo-Su 00:00-23:59',
    },
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        {/* JSON-LD Structured Data */}
        <Script
          id="json-ld-website"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          strategy="beforeInteractive"
        />
        {/* Preconnect for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="font-sans bg-white text-zinc-900 antialiased selection:bg-zinc-900 selection:text-white">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
