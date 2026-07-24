'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Search } from 'lucide-react';

// Fallback default categories if backend is empty
const defaultCategories = [
  { id: 1, name: 'Beauty', slug: 'beauty', image: '/images/categories/beauty.png', col: 'left', title: 'Flawless Beauty' },
  { id: 2, name: 'Shoes', slug: 'shoes', image: '/images/categories/shoes.png', col: 'left', title: 'Step in Style' },
  { id: 3, name: 'Fashion', slug: 'fashion', image: '/images/categories/fashion.png', col: 'center', title: 'Modern touch' },
  { id: 4, name: 'Electronics', slug: 'electronics', image: '/images/categories/electronics.png', col: 'right', title: 'Sleek Tech' },
  { id: 5, name: 'Furniture', slug: 'furniture', image: '/images/categories/furniture.png', col: 'right', title: 'Living Space' },
];

export default function Hero({ initialBanners = [] }) {
  const activeBanners = initialBanners.filter(b => b.isActive).sort((a, b) => (a.order || 0) - (b.order || 0));
  
  let initialCategories = defaultCategories;
  let initialHoveredId = 3;

  if (activeBanners.length >= 5) {
    initialCategories = [
      { id: activeBanners[0]._id, name: activeBanners[0].title, slug: activeBanners[0].buttonLink.replace('/category/', ''), image: activeBanners[0].image, col: 'left' },
      { id: activeBanners[1]._id, name: activeBanners[1].title, slug: activeBanners[1].buttonLink.replace('/category/', ''), image: activeBanners[1].image, col: 'left' },
      { id: activeBanners[2]._id, name: activeBanners[2].title, slug: activeBanners[2].buttonLink.replace('/category/', ''), image: activeBanners[2].image, col: 'center' },
      { id: activeBanners[3]._id, name: activeBanners[3].title, slug: activeBanners[3].buttonLink.replace('/category/', ''), image: activeBanners[3].image, col: 'right' },
      { id: activeBanners[4]._id, name: activeBanners[4].title, slug: activeBanners[4].buttonLink.replace('/category/', ''), image: activeBanners[4].image, col: 'right' },
    ];
    initialHoveredId = activeBanners[2]._id;
  }

  const [categories, setCategories] = useState(initialCategories);
  const [hoveredId, setHoveredId] = useState(initialHoveredId);

  // Smooth flex transition without floating conflict
  const flexTransitionStyle = 'flex 0.8s cubic-bezier(0.25, 1, 0.5, 1)';

  const getColFlex = (colName) => {
    const hoveredItem = categories.find(c => c.id === hoveredId);
    if (!hoveredItem) return colName === 'center' ? 0.70 : 1.0; 
    
    if (hoveredItem.col === colName) {
      return colName === 'center' ? 0.74 : 1.4; 
    }
    return colName === 'center' ? 0.46 : 0.55; 
  };

  const getItemFlex = (item) => {
    const hoveredItem = categories.find(c => c.id === hoveredId);
    if (!hoveredItem) return 1.0;
    
    if (item.col === 'center') return 1.0;

    if (hoveredItem.col === item.col) {
       return item.id === hoveredId ? 2.5 : 0.45; 
    }
    
    const fallbackFlex = { left: 1.2, right: 1.2 };
    return fallbackFlex[item.col] || 1.0;
  };


  const renderGridItem = (item, index) => {
    // Dynamic slide-in directions for a beautiful staggered assembly
    let animationClass = '';
    if (index === 0) animationClass = 'animate-in fade-in slide-in-from-left-12 slide-in-from-top-12 duration-[1.2s] fill-mode-both ease-out';
    if (index === 1) animationClass = 'animate-in fade-in slide-in-from-left-12 slide-in-from-bottom-12 duration-[1.2s] fill-mode-both ease-out';
    if (index === 2) animationClass = 'animate-in fade-in zoom-in-95 slide-in-from-bottom-16 duration-[1.5s] fill-mode-both ease-out';
    if (index === 3) animationClass = 'animate-in fade-in slide-in-from-right-12 slide-in-from-top-12 duration-[1.2s] fill-mode-both ease-out';
    if (index === 4) animationClass = 'animate-in fade-in slide-in-from-right-12 slide-in-from-bottom-12 duration-[1.2s] fill-mode-both ease-out';

    return (
      <Link
        href={item.slug.startsWith('/') ? item.slug : `/category/${item.slug}`}
        key={item.id}
        style={{ flex: getItemFlex(item), transition: flexTransitionStyle, animationDelay: `${index * 0.1}s` }}
        onMouseEnter={() => setHoveredId(item.id)}
        className={`relative block w-full overflow-hidden cursor-pointer group bg-zinc-50 shadow-sm hover:shadow-2xl rounded-2xl ${animationClass}`}
      >
        <Image 
        src={item.image} 
        alt={item.name} 
        fill 
        sizes="(max-width: 768px) 100vw, 33vw"
        priority={true}
        className="object-cover object-center transition-transform duration-[1.5s] ease-out group-hover:scale-[1.05]"
      />
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/50 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      <div className="absolute bottom-6 left-6 z-10 opacity-70 group-hover:opacity-100 transition-opacity duration-500">
        <span className="text-xs font-semibold tracking-[0.2em] uppercase text-white drop-shadow-md">{item.name}</span>
      </div>
      <div className="absolute bottom-6 right-6 w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 shadow-xl translate-y-4 group-hover:translate-y-0 z-10">
        <Search size={18} className="text-zinc-900" />
      </div>
    </Link>
  );
  };

  return (
    <section className="relative w-full min-h-screen bg-white overflow-hidden">
      <div className="w-full h-[100vh] pt-[120px] pb-12 px-8 md:px-20 max-w-[1600px] mx-auto flex items-stretch justify-center gap-12 md:gap-24 overflow-hidden">
        
        {/* Left Column */}
        <div className="flex flex-col gap-8 md:gap-12 h-full py-6 md:py-8" style={{ flex: getColFlex('left'), transition: flexTransitionStyle }}>
           {categories?.[0] && renderGridItem(categories[0], 0)}
           {categories?.[1] && renderGridItem(categories[1], 1)}
        </div>
        
        {/* Center Column */}
        <div className="flex flex-col py-0 h-full" style={{ flex: getColFlex('center'), transition: flexTransitionStyle }}>
           {categories?.[2] && renderGridItem(categories[2], 2)}
        </div>
        
        {/* Right Column */}
        <div className="flex flex-col gap-8 md:gap-12 h-full py-6 md:py-8" style={{ flex: getColFlex('right'), transition: flexTransitionStyle }}>
           {categories?.[3] && renderGridItem(categories[3], 3)}
           {categories?.[4] && renderGridItem(categories[4], 4)}
        </div>
      </div>
    </section>
  );
}
