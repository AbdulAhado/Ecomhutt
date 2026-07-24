'use client';

import { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus('sending');
    setTimeout(() => {
      setStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setStatus(''), 5000);
    }, 1500);
  };

  const inputClass = 'w-full bg-white border border-zinc-200 px-4 py-3.5 text-sm text-zinc-900 placeholder-zinc-300 focus:outline-none focus:border-zinc-900 transition-colors';
  const labelClass = 'text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-400 mb-2 block';

  return (
    <div className="min-h-screen bg-white pt-[90px] animate-in fade-in duration-500">
      
      {/* Hero */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 border-b border-zinc-100 mb-12">
        <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-zinc-400 block mb-4">EcomHutt Care</span>
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-zinc-900 leading-none">Contact Us</h1>
        <p className="text-sm text-zinc-500 mt-4 max-w-md">We&apos;re here to help. Reach out to our customer care team.</p>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 md:px-12 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-16 xl:gap-24 items-start">
          
          {/* Contact Info (Clean, borderless lists) */}
          <div className="lg:col-span-2 space-y-12">
            <div>
              <h2 className="text-xl font-bold text-zinc-900 pb-4 border-b border-zinc-100 mb-8">Get in Touch</h2>
              <div className="space-y-8">
                {[
                  { icon: Mail, label: 'Email', value: 'support@ecomhutt.com', sub: 'We aim to reply within 24 hours.' },
                  { icon: Phone, label: 'Phone', value: '+1 (555) 123-4567', sub: 'Mon–Fri: 9am – 6pm EST' },
                  { icon: MapPin, label: 'Headquarters', value: '123 Mercer Street, New York, NY 10012', sub: null },
                ].map(({ icon: Icon, label, value, sub }) => (
                  <div key={label} className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-[#f8f8f8] border border-zinc-100 flex items-center justify-center shrink-0">
                      <Icon size={18} className="text-zinc-500" />
                    </div>
                    <div>
                      <p className="text-[9px] font-bold uppercase tracking-widest text-zinc-400 mb-1">{label}</p>
                      <p className="text-sm font-semibold text-zinc-900">{value}</p>
                      {sub && <p className="text-xs text-zinc-400 mt-1 font-medium">{sub}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Form (Clean, flat layout) */}
          <div className="lg:col-span-3 space-y-6">
            <h2 className="text-xl font-bold text-zinc-900 pb-4 border-b border-zinc-100 mb-6">Send a Message</h2>

            {status === 'success' && (
              <div className="p-4 bg-green-50 border border-green-100 text-xs text-green-700 font-semibold">
                ✓ Thank you for your message. We will get back to you shortly.
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className={labelClass}>Full Name</label>
                  <input type="text" name="name" required value={formData.name} onChange={handleChange} className={inputClass} placeholder="Alexandra Morrison" />
                </div>
                <div>
                  <label className={labelClass}>Email Address</label>
                  <input type="email" name="email" required value={formData.email} onChange={handleChange} className={inputClass} placeholder="you@example.com" />
                </div>
              </div>
              <div>
                <label className={labelClass}>Subject</label>
                <div className="relative">
                  <select name="subject" required value={formData.subject} onChange={handleChange} className={`${inputClass} appearance-none cursor-pointer pr-10`}>
                    <option value="" disabled>Select a subject</option>
                    <option value="Order Inquiry">Order Inquiry</option>
                    <option value="Returns">Returns &amp; Exchanges</option>
                    <option value="Product Question">Product Question</option>
                    <option value="Other">Other</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-zinc-400">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                  </div>
                </div>
              </div>
              <div>
                <label className={labelClass}>Message</label>
                <textarea name="message" rows={5} required value={formData.message} onChange={handleChange} className={`${inputClass} resize-none`} placeholder="How can we help you?" />
              </div>
              <button type="submit" disabled={status === 'sending'} className="w-full py-4 bg-zinc-900 text-white text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-zinc-800 disabled:opacity-60 transition-colors flex items-center justify-center gap-2">
                {status === 'sending' ? 'Sending...' : <><Send size={14} /> Send Message</>}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
