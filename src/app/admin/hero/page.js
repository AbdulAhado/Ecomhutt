'use client';

import { useState, useEffect } from 'react';
import { useShop } from '@/context/ShopContext';
import { Upload, Loader2, Info, Save } from 'lucide-react';
import axios from 'axios';
import { cn } from '@/lib/utils';
import Image from 'next/image';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5000/api';

const FIXED_SLOTS = [
  { order: 0, title: 'Flawless Beauty', buttonLink: '/category/beauty', col: 'left', defaultImage: '/images/categories/beauty.png' },
  { order: 1, title: 'Step in Style', buttonLink: '/category/shoes', col: 'left', defaultImage: '/images/categories/shoes.png' },
  { order: 2, title: 'Modern touch', buttonLink: '/category/fashion', col: 'center', defaultImage: '/images/categories/fashion.png' },
  { order: 3, title: 'Sleek Tech', buttonLink: '/category/electronics', col: 'right', defaultImage: '/images/categories/electronics.png' },
  { order: 4, title: 'Living Space', buttonLink: '/category/furniture', col: 'right', defaultImage: '/images/categories/furniture.png' }
];

export default function HeroPage() {
  const { user, getHeroBanners, createHeroBanner } = useShop();
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploadingFor, setUploadingFor] = useState(null); // stores the order index being uploaded
  const [savingFor, setSavingFor] = useState(null);

  // Local state for edits
  const [edits, setEdits] = useState({});

  useEffect(() => {
    fetchAndSeedSlides();
  }, []);

  const fetchAndSeedSlides = async () => {
    try {
      const data = await getHeroBanners();
      let activeSlides = data.sort((a, b) => (a.order || 0) - (b.order || 0));
      
      // Seed missing slots if they don't exist yet
      if (activeSlides.length < 5) {
        const existingOrders = activeSlides.map(s => s.order);
        for (const slot of FIXED_SLOTS) {
          if (!existingOrders.includes(slot.order)) {
            const newBanner = {
              image: slot.defaultImage,
              title: slot.title,
              buttonLink: slot.buttonLink,
              buttonText: 'Shop Now',
              isActive: true,
              order: slot.order
            };
            const created = await createHeroBanner(newBanner);
            activeSlides.push(created);
          }
        }
        activeSlides = activeSlides.sort((a, b) => (a.order || 0) - (b.order || 0));
      }
      
      const finalSlides = activeSlides.slice(0, 5);
      setSlides(finalSlides);

      // Initialize edit state
      const initialEdits = {};
      finalSlides.forEach(s => {
        initialEdits[s.order] = { title: s.title, buttonLink: s.buttonLink };
      });
      setEdits(initialEdits);

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e, slotOrder) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setUploadingFor(slotOrder);
    
    const fd = new FormData();
    fd.append('images', file);
    
    try {
      const { data } = await axios.post(`${API}/upload`, fd, {
        headers: { Authorization: `Bearer ${user?.token}` },
      });
      const newImageUrl = data[0];

      const slideToUpdate = slides.find(s => s.order === slotOrder);
      if (slideToUpdate) {
        await axios.put(`${API}/herobanners/${slideToUpdate._id}`, { ...slideToUpdate, image: newImageUrl }, {
          headers: { Authorization: `Bearer ${user?.token}` }
        });
      }
      await fetchAndSeedSlides();
    } catch (err) {
      alert('Upload failed. Please check your connection and try again.');
    } finally {
      setUploadingFor(null);
    }
  };

  const handleSaveDetails = async (slotOrder) => {
    setSavingFor(slotOrder);
    try {
      const slideToUpdate = slides.find(s => s.order === slotOrder);
      const updatedDetails = edits[slotOrder];
      if (slideToUpdate && updatedDetails) {
        await axios.put(`${API}/herobanners/${slideToUpdate._id}`, { ...slideToUpdate, title: updatedDetails.title, buttonLink: updatedDetails.buttonLink }, {
          headers: { Authorization: `Bearer ${user?.token}` }
        });
        alert('Details saved successfully!');
        await fetchAndSeedSlides();
      }
    } catch (err) {
      alert('Save failed. Please try again.');
    } finally {
      setSavingFor(null);
    }
  };

  const handleEditChange = (slotOrder, field, value) => {
    setEdits(prev => ({
      ...prev,
      [slotOrder]: { ...prev[slotOrder], [field]: value }
    }));
  };

  if (loading) {
    return <div className="p-8 text-zinc-500 flex items-center gap-2"><Loader2 className="animate-spin" /> Loading hero slots...</div>;
  }

  const getSlotByOrder = (order) => slides.find(s => s.order === order) || FIXED_SLOTS[order];

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-zinc-900">Hero Section</h2>
          <p className="text-sm text-zinc-500 mt-1">Update the images, category names (titles), and links for the 5 grid slots.</p>
        </div>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-zinc-200 shadow-[0_2px_20px_-4px_rgba(0,0,0,0.05)]">
        <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 bg-blue-50 px-4 py-3 rounded-xl mb-8">
          <Info size={16} /> Click 'Update Image' to instantly change the picture. Click 'Save' to apply text/link changes!
        </div>

        {/* List of 5 editable slots */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {[0, 1, 2, 3, 4].map((order) => {
            const slide = getSlotByOrder(order);
            const isUploading = uploadingFor === order;
            const isSaving = savingFor === order;
            const slotEdits = edits[order] || { title: slide.title, buttonLink: slide.buttonLink };

            let label = '';
            if (order === 0) label = "Left Top Slot";
            if (order === 1) label = "Left Bottom Slot";
            if (order === 2) label = "Center Large Slot";
            if (order === 3) label = "Right Top Slot";
            if (order === 4) label = "Right Bottom Slot";

            return (
              <div key={order} className={cn("p-5 border border-zinc-200 rounded-2xl flex flex-col sm:flex-row gap-6 hover:shadow-md transition-shadow bg-zinc-50/30", order === 2 && "lg:col-span-2")}>
                
                {/* Image Preview & Upload */}
                <div className="w-full sm:w-48 h-48 relative rounded-xl border border-zinc-200 overflow-hidden shrink-0 group">
                  <Image 
                    src={slide.image || slide.defaultImage} 
                    alt={slide.title} 
                    fill 
                    sizes="(max-width: 768px) 100vw, 33vw"
                    priority={order === 2}
                    className="object-cover" 
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <label className="px-4 py-2 bg-white text-zinc-900 text-xs font-bold rounded-lg cursor-pointer shadow-lg transition-transform hover:scale-105 flex items-center gap-2">
                      {isUploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
                      {isUploading ? 'Uploading...' : 'Upload Image'}
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, order)} disabled={isUploading} />
                    </label>
                  </div>
                </div>

                {/* Form Details */}
                <div className="flex-1 flex flex-col gap-4">
                  <div className="text-xs font-bold uppercase tracking-widest text-zinc-400 border-b border-zinc-200 pb-2">{label}</div>
                  
                  <div>
                    <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider mb-1.5 block">Category Name / Title</label>
                    <input 
                      type="text" 
                      value={slotEdits.title} 
                      onChange={(e) => handleEditChange(order, 'title', e.target.value)} 
                      className="w-full bg-white border border-zinc-300 rounded-lg px-3 py-2 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900" 
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider mb-1.5 block">Link (e.g. /category/toys)</label>
                    <input 
                      type="text" 
                      value={slotEdits.buttonLink} 
                      onChange={(e) => handleEditChange(order, 'buttonLink', e.target.value)} 
                      className="w-full bg-white border border-zinc-300 rounded-lg px-3 py-2 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900" 
                    />
                  </div>

                  <div className="mt-auto pt-2">
                    <button 
                      onClick={() => handleSaveDetails(order)}
                      disabled={isSaving}
                      className="flex items-center gap-2 px-4 py-2 bg-zinc-900 text-white rounded-lg text-xs font-bold hover:bg-zinc-800 transition-colors w-max"
                    >
                      {isSaving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                      {isSaving ? 'Saving...' : 'Save Text Changes'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
