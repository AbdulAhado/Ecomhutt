'use client';

import { useState } from 'react';
import { Plus, Minus } from 'lucide-react';

const FAQ_DATA = [
  {
    category: 'Orders & Shipping',
    questions: [
      { q: 'How long will it take to receive my order?', a: 'Standard shipping takes 3–5 business days. Express shipping takes 1–2 business days. International orders may take 7–14 business days.' },
      { q: 'How can I track my order?', a: 'Once your order ships, you will receive a confirmation email with a tracking number. You can also track your order via the "Track Order" link in our footer.' },
      { q: 'Do you ship internationally?', a: 'Yes, we ship to most countries worldwide. International shipping costs will be calculated at checkout.' },
    ],
  },
  {
    category: 'Returns & Exchanges',
    questions: [
      { q: 'What is your return policy?', a: 'We accept returns within 30 days of delivery. Items must be in their original condition with all tags attached.' },
      { q: 'How do I process a return?', a: 'Please contact our customer service team to initiate a return. We will provide you with a return shipping label.' },
      { q: 'When will I receive my refund?', a: 'Refunds are processed within 5–7 business days after we receive and inspect your returned item.' },
    ],
  },
  {
    category: 'Products & Sizing',
    questions: [
      { q: 'How do I know what size to order?', a: 'Please refer to our size guide available on each product page for detailed measurements.' },
      { q: 'Are your products sustainable?', a: 'Yes, we are committed to sustainability. We use organic and recycled materials wherever possible.' },
    ],
  },
];

export default function FAQPage() {
  const [openItems, setOpenItems] = useState({});

  const toggle = (catIdx, qIdx) => {
    const key = `${catIdx}-${qIdx}`;
    setOpenItems((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="min-h-screen bg-white pt-[90px] animate-in fade-in duration-500">
      <div className="max-w-3xl mx-auto px-6 md:px-12 py-16">
        
        {/* Header */}
        <div className="text-center space-y-4 mb-16">
          <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-zinc-400">Questions &amp; Answers</span>
          <h1 className="text-5xl font-bold text-zinc-900 tracking-tight leading-none">Frequently Asked Questions</h1>
          <p className="text-sm text-zinc-500 max-w-md mx-auto leading-relaxed">Everything you need to know about shopping with EcomHutt.</p>
        </div>

        <div className="space-y-16">
          {FAQ_DATA.map((cat, catIdx) => (
            <div key={catIdx} className="space-y-2">
              <h2 className="text-[10px] font-bold uppercase tracking-[0.25em] text-zinc-400 pb-3 border-b border-zinc-100">{cat.category}</h2>
              <div className="divide-y divide-zinc-100">
                {cat.questions.map((item, qIdx) => {
                  const key = `${catIdx}-${qIdx}`;
                  const isOpen = !!openItems[key];
                  return (
                    <div key={qIdx} className="py-6 transition-all duration-200">
                      <button
                        className="w-full flex items-center justify-between text-left group"
                        onClick={() => toggle(catIdx, qIdx)}
                        aria-expanded={isOpen}
                      >
                        <span className="text-base font-bold text-zinc-900 pr-4 group-hover:text-zinc-600 transition-colors">{item.q}</span>
                        <span className="shrink-0 text-zinc-400 group-hover:text-zinc-900 transition-colors">
                          {isOpen ? <Minus size={15} /> : <Plus size={15} />}
                        </span>
                      </button>
                      {isOpen && (
                        <div className="mt-4 pr-12 animate-in fade-in duration-300">
                          <p className="text-sm text-zinc-500 leading-relaxed font-medium">{item.a}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
