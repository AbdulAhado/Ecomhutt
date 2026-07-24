import './globals.css';
import { Inter } from 'next/font/google';
import { Providers } from './providers';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata = {
  title: 'EcomHutt — Premium Modern E-Commerce',
  description:
    'A curated collection of modern luxury items designed with visual clarity, premium craftsmanship, and an effortless aesthetic.',
  keywords: ['EcomHutt', 'Ecommerce', 'Luxury Tech', 'Electronics', 'Clothing', 'Home Decor'],
  openGraph: {
    title: 'EcomHutt — Premium Modern E-Commerce',
    description:
      'A curated collection of modern luxury items designed with visual clarity and premium craftsmanship.',
    url: 'https://ecomhutt.com',
    siteName: 'EcomHutt',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'EcomHutt — Premium Modern E-Commerce',
    description: 'A curated collection of modern luxury items.',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#09090b',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans bg-white text-zinc-900 antialiased selection:bg-zinc-900 selection:text-white">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
