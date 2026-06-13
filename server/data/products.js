const products = [
  {
    name: 'ANC Wireless Headphones',
    category: 'Electronics',
    price: 299.00,
    imageColor: '#1a1a1a',
    imageText: 'TECH-HP01',
    inStock: true,
    isNew: true,
    tags: ['featured', 'electronics', 'new-arrivals'],
    description: 'Sleek wireless over-ear headphones with hybrid active noise cancellation, high-fidelity sound, and 30 hours of battery life.',
    specs: {
      material: 'Aluminum, Premium Leather',
      origin: 'Assembled in USA',
      care: 'Wipe clean with a soft cloth'
    },
    sizes: ['OS']
  },
  {
    name: 'Minimalist Smartwatch',
    category: 'Electronics',
    price: 199.00,
    imageColor: '#2b2d42',
    imageText: 'TECH-SW02',
    inStock: true,
    isNew: false,
    tags: ['featured', 'electronics'],
    description: 'A clean, understated smartwatch featuring health tracking, customizable watch faces, and 7-day battery life.',
    specs: {
      material: 'Titanium Case, Fluoroelastomer Strap',
      origin: 'Imported',
      care: 'Water resistant up to 50m'
    },
    sizes: ['OS']
  },
  {
    name: 'Heavyweight French Terry Hoodie',
    category: 'Clothing',
    price: 120.00,
    imageColor: '#3d3d3d',
    imageText: 'AP-HD04',
    inStock: true,
    isNew: false,
    tags: ['clothing', 'featured', 'essentials'],
    description: 'An oversized, structural hoodie cut from 500gsm brushed French terry cotton. Designed with a double-lined hood and dropped armholes.',
    specs: {
      material: '100% Organic Cotton',
      origin: 'Made in Portugal',
      care: 'Machine wash cold, lay flat to dry'
    },
    sizes: ['XS', 'S', 'M', 'L', 'XL']
  },
  {
    name: 'Tailored Pleated Trousers',
    category: 'Clothing',
    price: 180.00,
    imageColor: '#2b2a28',
    imageText: 'AP-TR02',
    inStock: true,
    isNew: true,
    tags: ['clothing', 'new-arrivals', 'featured'],
    description: 'High-waisted trousers featuring a sharp double pleat and a fluid, wide-leg drape. Constructed from a breathable, lightweight wool twill.',
    specs: {
      material: '100% Wool Twill',
      origin: 'Made in Japan',
      care: 'Dry clean only'
    },
    sizes: ['28', '30', '32', '34']
  },
  {
    name: 'Hand-Thrown Stoneware Vase',
    category: 'Home & Garden',
    price: 65.00,
    imageColor: '#d4d0c9',
    imageText: 'HG-VS01',
    inStock: true,
    isNew: true,
    tags: ['home-garden', 'new-arrivals'],
    description: 'Hand-thrown stoneware vase with a matte basalt glaze and clean, architectural lines. Ideal for dried or fresh flora.',
    specs: {
      material: 'Stoneware Clay',
      origin: 'Crafted in Denmark',
      care: 'Hand wash suggested'
    },
    sizes: ['S', 'M', 'L']
  },
  {
    name: 'Sandalwood Soy Candle',
    category: 'Home & Garden',
    price: 45.00,
    imageColor: '#e8e6e1',
    imageText: 'HG-CD03',
    inStock: true,
    isNew: false,
    tags: ['home-garden', 'featured'],
    description: 'Hand-poured soy wax candle infused with notes of sandalwood, amber, and cedar wood in a reusable stone vessel.',
    specs: {
      material: '100% Soy Wax, Stone Vessel',
      origin: 'Made in USA',
      care: 'Burn for max 4 hours per session'
    },
    sizes: ['OS']
  },
  {
    name: 'Vegetable-Tanned Leather Wallet',
    category: 'Accessories',
    price: 85.00,
    imageColor: '#5c4033',
    imageText: 'AC-WL01',
    inStock: true,
    isNew: false,
    tags: ['accessories', 'essentials', 'featured'],
    description: 'Slim, vegetable-tanned leather wallet with six card slots and a central cash compartment. Develops a unique patina over time.',
    specs: {
      material: '100% Full-Grain Leather',
      origin: 'Made in Spain',
      care: 'Use specialized leather conditioner'
    },
    sizes: ['OS']
  },
  {
    name: 'Heavy Cotton Canvas Tote',
    category: 'Accessories',
    price: 95.00,
    imageColor: '#f5f5f7',
    imageText: 'AC-TT02',
    inStock: true,
    isNew: true,
    tags: ['accessories', 'new-arrivals'],
    description: 'A durable everyday tote bag cut from heavy-duty 24oz cotton canvas. Features reinforced leather handles and an interior zip pocket.',
    specs: {
      material: '100% Cotton Canvas, Leather Trims',
      origin: 'Made in USA',
      care: 'Spot clean only'
    },
    sizes: ['OS']
  }
];

export default products;
