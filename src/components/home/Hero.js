'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Search } from 'lucide-react';

// Fallback default categories if backend is empty
const defaultCategories = [
  { id: 1, name: 'Beauty', slug: 'beauty', image: '/images/categories/beauty.png', col: 'left', title: 'Flawless Beauty' },
  { id: 2, name: 'Shoes', slug: 'shoes', image: '/images/categories/shoes.png', col: 'left', title: 'Step in Style' },
  { id: 3, name: 'Fashion', slug: 'fashion', image: '/images/categories/fashion.png', col: 'center', title: 'Modern Touch' },
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
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          priority={true}
          className="object-cover object-center transition-transform duration-[1.5s] ease-out group-hover:scale-[1.05]"
        />
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/60 via-black/20 to-transparent pointer-events-none" />
        <div className="absolute bottom-4 left-4 z-10">
          <span className="text-xs font-semibold tracking-[0.2em] uppercase text-white drop-shadow-md">{item.name}</span>
        </div>
        <div className="absolute bottom-4 right-4 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm hidden md:flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 shadow-xl translate-y-4 group-hover:translate-y-0 z-10">
          <Search size={16} className="text-zinc-900" />
        </div>
      </Link>
    );
  };

  return (
    <section className="relative w-full bg-white overflow-hidden">
      {/* ─── DESKTOP layout (3-column flex grid) ─── */}
      <div className="hidden md:flex w-full h-[100vh] pt-[100px] pb-10 px-8 lg:px-20 max-w-[1600px] mx-auto items-stretch justify-center gap-8 lg:gap-16 overflow-hidden">
        {/* Left Column */}
        <div className="flex flex-col gap-6 lg:gap-10 h-full py-4" style={{ flex: getColFlex('left'), transition: flexTransitionStyle }}>
          {categories?.[0] && renderGridItem(categories[0], 0)}
          {categories?.[1] && renderGridItem(categories[1], 1)}
        </div>
        
        {/* Center Column */}
        <div className="flex flex-col py-0 h-full" style={{ flex: getColFlex('center'), transition: flexTransitionStyle }}>
          {categories?.[2] && renderGridItem(categories[2], 2)}
        </div>
        
        {/* Right Column */}
        <div className="flex flex-col gap-6 lg:gap-10 h-full py-4" style={{ flex: getColFlex('right'), transition: flexTransitionStyle }}>
          {categories?.[3] && renderGridItem(categories[3], 3)}
          {categories?.[4] && renderGridItem(categories[4], 4)}
        </div>
      </div>

      {/* ─── MOBILE layout (stacked grid) ─── */}
      <div className="md:hidden w-full pt-[80px] pb-6 px-4">
        {/* Center hero image — full width, taller */}
        <Link
          href={categories[2]?.slug?.startsWith('/') ? categories[2].slug : `/category/${categories[2]?.slug}`}
          className="relative block w-full overflow-hidden rounded-2xl mb-3"
          style={{ height: '280px' }}
        >
          <Image
            src={categories[2]?.image || '/images/categories/fashion.png'}
            alt={categories[2]?.name || 'Fashion'}
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          <div className="absolute bottom-4 left-4 z-10">
            <span className="text-sm font-bold tracking-[0.2em] uppercase text-white drop-shadow-md">{categories[2]?.name}</span>
          </div>
        </Link>

        {/* 2×2 Grid of the other 4 images */}
        <div className="grid grid-cols-2 gap-3">
          {[categories[0], categories[1], categories[3], categories[4]].filter(Boolean).map((item, idx) => (
            <Link
              key={item.id}
              href={item.slug.startsWith('/') ? item.slug : `/category/${item.slug}`}
              className="relative block overflow-hidden rounded-xl"
              style={{ height: '160px' }}
            >
              <Image
                src={item.image}
                alt={item.name}
                fill
                sizes="50vw"
                className="object-cover object-center"
              />
              <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
              <div className="absolute bottom-3 left-3 z-10">
                <span className="text-[10px] font-bold tracking-[0.15em] uppercase text-white drop-shadow-md">{item.name}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
