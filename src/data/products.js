// EcomHutt — Curated Luxury Minimalist Products

export const products = [
  {
    id: "ether-01",
    name: "EcomHutt No. 1 Perfume",
    price: 185.00,
    category: "Fragrance",
    description: "An olfactory exploration of silence and shadow. Notes of black tea, cedarwood, and cold metal blend seamlessly to create a quiet, grounding aura. Housed in a hand-polished, matte black glass bottle.",
    details: [
      "Top Notes: Bergamot, Black Tea, Fig",
      "Heart Notes: Cedarwood, Vetiver, Incense",
      "Base Notes: Tobacco Leaves, Metal Accord, Sandalwood",
      "Volume: 100ml / 3.4 FL. OZ.",
      "Made in France"
    ],
    collection: "featured",
    rating: 4.9,
    reviews: 24,
    inStock: true,
    imageColor: "#1a1a1a",
    imageText: "ECOMHUTT NO. 1"
  },
  {
    id: "cashmere-coat",
    name: "Classic Cashmere Coat",
    price: 850.00,
    category: "Apparel",
    description: "An unstructured, double-breasted overcoat tailored from an exceptionally soft cashmere-wool blend. Features dropped shoulders, deep welt pockets, and a clean, buttonless wrap closure.",
    details: [
      "Composition: 80% Cashmere, 20% Virgin Wool",
      "Lining: 100% Viscose",
      "Relaxed silhouette, runs true to size",
      "Dry clean only",
      "Ethically tailored in Italy"
    ],
    collection: "new-arrivals",
    rating: 4.8,
    reviews: 12,
    inStock: true,
    imageColor: "#2A2825",
    imageText: "CASHMERE COAT"
  },
  {
    id: "glacier-vase",
    name: "Glacier Ceramic Vase",
    price: 145.00,
    category: "Home",
    description: "An organic ceramic form inspired by melting glacial surfaces. Each piece is hand-thrown and finished with a unique textured crackle glaze, making every vase slightly distinct.",
    details: [
      "Material: Textured stoneware",
      "Finish: Crackle glaze, matte exterior",
      "Dimensions: H 28cm x W 16cm",
      "Handmade in Copenhagen",
      "Watertight interior"
    ],
    collection: "glacier",
    rating: 5.0,
    reviews: 8,
    inStock: true,
    imageColor: "#EAE6E1",
    imageText: "GLACIER VASE"
  },
  {
    id: "ocular-01",
    name: "Ocular Frame 01",
    price: 290.00,
    category: "Accessories",
    description: "A refined geometric silhouette sculpted from premium Japanese acetate. Equipped with 100% UVA/UVB protective dark grey lenses and reinforced seven-barrel hinges.",
    details: [
      "Frame Material: Premium Japanese bio-acetate",
      "Lens Material: CR-39 scratch-resistant",
      "Measurement: 48mm lens / 22mm bridge / 145mm temple",
      "Includes handmade leather case and cleaning cloth",
      "Handcrafted in Japan"
    ],
    collection: "featured",
    rating: 4.7,
    reviews: 18,
    inStock: true,
    imageColor: "#121213",
    imageText: "OCULAR 01"
  },
  {
    id: "monolith-watch",
    name: "Monolith Chronograph",
    price: 1250.00,
    category: "Accessories",
    description: "A striking, brushed steel watch featuring a clean, unadorned black dial and a Swiss quartz movement. Completed with a structured black Italian leather strap.",
    details: [
      "Case: 38mm Satin-finish 316L Stainless Steel",
      "Movement: Swiss quartz 3-hand movement",
      "Water Resistance: 5 ATM (50 meters)",
      "Strap: 20mm premium Italian calf leather",
      "Protected by sapphire crystal glass"
    ],
    collection: "featured",
    rating: 4.9,
    reviews: 31,
    inStock: true,
    imageColor: "#222222",
    imageText: "MONOLITH WATCH"
  },
  {
    id: "leather-slide",
    name: "Minimalist Leather Slide",
    price: 220.00,
    category: "Footwear",
    description: "An understated summer slide constructed from a single wide band of vegetable-tanned vachetta leather. Features a contoured leather footbed that shapes to your foot over time.",
    details: [
      "Upper: 100% Vachetta Leather",
      "Sole: Durable rubber-injected leather outsole",
      "Contoured, cushioned footbed",
      "Fits slightly narrow; size up if in between sizes",
      "Handmade in Portugal"
    ],
    collection: "new-arrivals",
    rating: 4.6,
    reviews: 9,
    inStock: false,
    imageColor: "#3D342E",
    imageText: "LEATHER SLIDE"
  }
];

export const getProductById = (id) => products.find(p => p.id === id);
export const getProductsByCollection = (col) => products.filter(p => p.collection === col);
export const getProductsByCategory = (cat) => products.filter(p => p.category === cat);
export const getCategories = () => Array.from(new Set(products.map(p => p.category)));
export const getCollections = () => Array.from(new Set(products.map(p => p.collection)));
