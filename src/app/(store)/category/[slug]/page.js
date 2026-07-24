'use client';

import Image from 'next/image';
import Link from 'next/link';
import { 
  ArrowLeft, 
  ChevronDown, 
  Heart,
  ChevronLeft,
  ChevronRight,
  ShoppingBag
} from 'lucide-react';

const categories = [
  { id: 1, name: 'Beauty', slug: 'beauty', image: '/images/categories/beauty.png', title: 'Flawless Beauty', desc: 'Discover our premium range of skincare and cosmetics designed for the modern lifestyle.' },
  { id: 2, name: 'Shoes', slug: 'shoes', image: '/images/categories/shoes.png', title: 'Step in Style', desc: 'Handcrafted leather shoes offering both luxury and unparalleled comfort for everyday wear.' },
  { id: 3, name: 'Fashion', slug: 'fashion', image: '/images/categories/fashion.png', title: 'Modern touch', desc: 'In this season we encounter natural fabrics. Long dresses highlighting the feminine figure evoke romantic moments and autumn walks.' },
  { id: 4, name: 'Electronics', slug: 'electronics', image: '/images/categories/electronics.png', title: 'Sleek Tech', desc: 'State-of-the-art gadgets blending seamlessly into your minimalist workspace.' },
  { id: 5, name: 'Furniture', slug: 'furniture', image: '/images/categories/furniture.png', title: 'Living Space', desc: 'Curated home interiors that bring elegance and tranquility to your living environment.' },
];

export default function CategoryPage({ params }) {
  const { slug } = params;
  const selectedCategory = categories.find(c => c.slug === slug) || categories[0];

  // Strictly limiting to exactly 3 products on the screen at all times.
  const mockProducts = [1, 2, 3];

  return (
    <div className="w-full bg-white min-h-screen pt-[90px] flex flex-col">
      
      {/* Expanded Hero Section */}
      <div className="relative w-full min-h-[calc(100vh-90px)] flex flex-col lg:flex-row items-center justify-between px-6 md:px-12 lg:px-20 pb-12 gap-12 lg:gap-24 bg-white">
         
         <Link 
            href="/"
            className="absolute top-8 left-6 md:left-12 z-30 w-12 h-12 flex items-center justify-center rounded-full border border-zinc-200 bg-white/50 backdrop-blur-md text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 transition-colors shadow-sm"
            aria-label="Go back to home"
         >
           <ArrowLeft size={20} />
         </Link>

         {/* Left Image (Large) */}
         <div className="w-full lg:w-[45%] h-[60vh] lg:h-[85vh] relative mt-20 lg:mt-0 animate-in fade-in slide-in-from-left-8 duration-700">
            <Image 
              src={selectedCategory.image} 
              alt={selectedCategory.title} 
              fill 
              priority 
              sizes="(max-width: 1024px) 100vw, 50vw" 
              className="object-cover object-center" 
            />
         </div>

         {/* Right Content Area */}
         <div className="w-full lg:w-[55%] flex flex-col pt-8 lg:pt-0 animate-in fade-in slide-in-from-right-8 duration-700 delay-150">
           
           {/* Original Upper Filters - Now set to just Price and Time */}
           <div className="flex items-center justify-between w-full max-w-xl mb-16 border-b border-zinc-100 pb-6">
              <div className="flex items-center gap-4 flex-1">
                <div className="w-48 h-[2px] bg-zinc-200 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1/3 h-full bg-zinc-900" />
                </div>
                <div className="w-3 h-3 bg-zinc-900 rounded-full shadow-sm" />
              </div>
              <div className="flex items-center gap-8 text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-500">
                 <span className="flex items-center gap-2 cursor-pointer hover:text-zinc-900 transition-colors">Price <ChevronDown size={14}/></span>
                 <span className="flex items-center gap-2 cursor-pointer hover:text-zinc-900 transition-colors">Time <ChevronDown size={14}/></span>
              </div>
           </div>

           <article>
             <h1 className="text-5xl md:text-7xl lg:text-[7rem] font-bold tracking-tight text-zinc-900 leading-[1.05] mb-10">
               {selectedCategory.title.split(' ').map((word, i) => (
                 <span key={i} className={i === 1 ? "relative z-10 inline-block text-zinc-900 after:content-[''] after:absolute after:bottom-3 md:after:bottom-5 after:left-0 after:w-full after:h-4 md:after:h-6 after:bg-[#d6ff00]/60 after:-z-10" : ""}>
                   {word}{' '}
                   {i === 0 && <br className="hidden md:block" />}
                 </span>
               ))}
             </h1>
             <p className="text-zinc-600 text-base md:text-lg font-medium leading-relaxed max-w-lg">
               {selectedCategory.desc}
             </p>
           </article>
         </div>

         <div className="absolute bottom-6 md:bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-zinc-400">
           <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Scroll to Discover</span>
           <ChevronDown size={20} className="animate-bounce mt-1" />
         </div>
      </div>

      {/* Full Category Products Listing */}
      <div className="w-full min-h-screen py-24 bg-white">
         <div className="max-w-[1100px] mx-auto px-6 md:px-12">
           
           <div className="flex justify-between items-end mb-16 pb-6">
             <div className="flex flex-col gap-2">
               <h2 className="text-3xl font-medium tracking-tight text-zinc-900">All {selectedCategory.name}</h2>
               <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Showing 3 of 128 Products</span>
             </div>
           </div>
           
           {/* Grid layout locked to exactly 3 columns and exactly 3 products */}
           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 lg:gap-10 px-0">
             {mockProducts.map((item, i) => (
               <div key={item} className="w-full flex flex-col group cursor-pointer animate-in fade-in zoom-in-95 duration-500">
                  
                  {/* Image Area */}
                  <div className="relative w-full aspect-[3/4] overflow-hidden bg-[#f4f4f4]">
                    <Image 
                      src={selectedCategory.image} 
                      alt={`Premium ${selectedCategory.name} Item ${item}`} 
                      fill 
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover object-center transition-transform duration-[2s] group-hover:scale-105"
                    />

                    {/* Subtle Badges */}
                    {i === 0 && <span className="absolute top-4 left-4 text-zinc-900 text-[9px] font-bold px-2 py-1 uppercase tracking-widest z-10">New</span>}
                    {i === 2 && <span className="absolute top-4 left-4 text-[#d80000] text-[9px] font-bold px-2 py-1 uppercase tracking-widest z-10">-20%</span>}

                    {/* Heart Icon */}
                    <button className="absolute top-4 right-4 text-zinc-400 hover:text-red-500 transition-colors z-10">
                      <Heart size={18} strokeWidth={1.5} />
                    </button>
                  </div>
                  
                  {/* Details Below Image */}
                  <div className="flex flex-col mt-5 gap-1.5 px-1">
                     <h4 className="text-[11px] font-semibold tracking-[0.15em] text-zinc-900 uppercase truncate group-hover:underline underline-offset-4 decoration-1">
                       Premium Selection 0{item}
                     </h4>
                     <div className="flex items-center gap-3 text-xs font-bold mt-1">
                        <span className={i === 2 ? 'text-[#d80000]' : 'text-zinc-900'}>450,00 PLN</span>
                        {i === 2 && <span className="text-zinc-400 line-through text-[10px]">599,00 PLN</span>}
                     </div>
                     
                     {/* Beautiful, permanently visible luxury buttons */}
                     <div className="flex items-center gap-3 w-full mt-5">
                        <button className="flex-1 py-3 border border-zinc-200 text-zinc-900 text-[9px] font-bold uppercase tracking-[0.15em] hover:border-zinc-900 hover:bg-zinc-50 transition-all flex items-center justify-center gap-2 shadow-sm rounded-sm">
                          <ShoppingBag size={12} /> Cart
                        </button>
                        <button className="flex-1 py-3 bg-zinc-900 text-white text-[9px] font-bold uppercase tracking-[0.15em] hover:bg-zinc-800 transition-all shadow-sm rounded-sm">
                          Buy Now
                        </button>
                     </div>
                  </div>
               </div>
             ))}
           </div>

           {/* Pagination Area */}
           <div className="w-full flex flex-col items-center justify-center mt-20 mb-10 min-h-[100px]">
              <div className="flex flex-col items-center gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                 <div className="flex items-center gap-3 md:gap-4 text-xs font-bold text-zinc-500">
                    <button className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center hover:text-zinc-900 transition-colors opacity-50 cursor-not-allowed">
                      <ChevronLeft size={16} />
                    </button>
                    <button className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center bg-zinc-900 text-white rounded-full shadow-md">1</button>
                    <button className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center hover:text-zinc-900 hover:bg-zinc-100 rounded-full transition-colors">2</button>
                    <button className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center hover:text-zinc-900 hover:bg-zinc-100 rounded-full transition-colors">3</button>
                    <span className="px-1 md:px-2 tracking-widest">...</span>
                    <button className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center hover:text-zinc-900 hover:bg-zinc-100 rounded-full transition-colors">22</button>
                    <button className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center hover:text-zinc-900 transition-colors hover:bg-zinc-100 rounded-full">
                      <ChevronRight size={16} />
                    </button>
                 </div>
                 <span className="text-[10px] font-bold text-zinc-400 tracking-widest uppercase">Page 1 of 22</span>
              </div>
           </div>
           
         </div>
      </div>
      
    </div>
  );
}
