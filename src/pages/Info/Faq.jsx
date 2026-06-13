import { useState, useEffect } from 'react';
import { Plus, Minus } from 'lucide-react';
import './Faq.css';

const FAQ_DATA = [
  {
    category: 'Orders & Shipping',
    questions: [
      { q: 'How long will it take to receive my order?', a: 'Standard shipping takes 3-5 business days. Express shipping takes 1-2 business days. International orders may take 7-14 business days.' },
      { q: 'How can I track my order?', a: 'Once your order ships, you will receive a confirmation email with a tracking number. You can also track your order via the "Track Order" link in our footer.' },
      { q: 'Do you ship internationally?', a: 'Yes, we ship to most countries worldwide. International shipping costs will be calculated at checkout.' }
    ]
  },
  {
    category: 'Returns & Exchanges',
    questions: [
      { q: 'What is your return policy?', a: 'We accept returns within 30 days of delivery. Items must be in their original condition with all tags attached.' },
      { q: 'How do I process a return?', a: 'Please contact our customer service team to initiate a return. We will provide you with a return shipping label.' },
      { q: 'When will I receive my refund?', a: 'Refunds are processed within 5-7 business days after we receive and inspect your returned item.' }
    ]
  },
  {
    category: 'Products & Sizing',
    questions: [
      { q: 'How do I know what size to order?', a: 'Please refer to our size guide available on each product page for detailed measurements.' },
      { q: 'Are your products sustainable?', a: 'Yes, we are committed to sustainability. We use organic and recycled materials wherever possible.' }
    ]
  }
];

export default function Faq() {
  const [openItems, setOpenItems] = useState({});

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const toggleItem = (catIdx, qIdx) => {
    const key = `${catIdx}-${qIdx}`;
    setOpenItems(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <div className="faq-page page-enter page-enter-active">
      <div className="info-hero">
        <div className="container">
          <h1 className="text-display-md">Frequently Asked Questions</h1>
        </div>
      </div>
      
      <div className="container faq-container">
        {FAQ_DATA.map((category, catIdx) => (
          <div key={catIdx} className="faq-category">
            <h2 className="text-headline-sm faq-category-title">{category.category}</h2>
            <div className="faq-list">
              {category.questions.map((item, qIdx) => {
                const isOpen = openItems[`${catIdx}-${qIdx}`];
                return (
                  <div key={qIdx} className={`faq-item ${isOpen ? 'open' : ''}`}>
                    <button 
                      className="faq-question" 
                      onClick={() => toggleItem(catIdx, qIdx)}
                      aria-expanded={isOpen}
                    >
                      <span className="text-body-lg font-medium">{item.q}</span>
                      <span className="faq-icon">
                        {isOpen ? <Minus size={20} /> : <Plus size={20} />}
                      </span>
                    </button>
                    <div className="faq-answer-wrapper" style={{ maxHeight: isOpen ? '200px' : '0' }}>
                      <p className="faq-answer text-body-md text-secondary">
                        {item.a}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
