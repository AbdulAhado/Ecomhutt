export default function InfoPageTemplate({ slug }) {
  const content = PAGE_CONTENT[slug] || { title: 'Not Found', subtitle: '', sections: [] };

  return (
    <div className="min-h-screen bg-white pt-28 pb-24 text-zinc-900 animate-in fade-in duration-500">
      <div className="max-w-3xl mx-auto px-6">
        
        {/* Header */}
        <div className="py-16 border-b border-zinc-100 space-y-4 mb-16">
          <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-zinc-400 block">EcomHutt Brand</span>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-zinc-900">{content.title}</h1>
          {content.subtitle && <p className="text-sm text-zinc-500 font-medium">{content.subtitle}</p>}
        </div>

        {/* Clean Typographic Sections (No blocky cards) */}
        <div className="space-y-16">
          {content.sections.map((section, idx) => (
            <div key={idx} className="space-y-4 max-w-2xl">
              <h2 className="text-xl font-bold text-zinc-900 tracking-tight">{section.heading}</h2>
              {section.text.split('\n').map((para, pIdx) => (
                <p key={pIdx} className="text-sm text-zinc-500 leading-relaxed font-medium">{para}</p>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const PAGE_CONTENT = {
  about: {
    title: 'Our Story',
    subtitle: 'Less, but better.',
    sections: [
      { heading: 'The Genesis', text: 'EcomHutt was born out of a desire for simplicity in an overly complicated world. We believe that true luxury lies in the absence of excess. Our journey began with a single perfectly tailored garment, and has since evolved into a complete lifestyle brand.' },
      { heading: 'Our Philosophy', text: 'We focus on premium materials, meticulous craftsmanship, and timeless silhouettes. Every piece we create is designed to transcend seasonal trends and become a permanent fixture in your wardrobe.' },
    ],
  },
  'shipping-returns': {
    title: 'Shipping & Returns',
    subtitle: 'Free shipping on orders over $150.',
    sections: [
      { heading: 'Shipping Policy', text: 'We offer complimentary standard shipping on all orders over $150. Orders are processed within 1–2 business days. Express shipping options are available at checkout. You will receive a tracking number once your order has been dispatched.' },
      { heading: 'International Shipping', text: 'EcomHutt ships globally. International orders may be subject to customs duties and taxes upon arrival. These charges are the responsibility of the recipient.' },
      { heading: 'Returns & Exchanges', text: 'We accept returns within 30 days of delivery. Items must be unworn, unwashed, and in their original packaging with all tags attached. To initiate a return, please contact customer service.' },
      { heading: 'Refund Process', text: 'Once we receive and inspect your returned item, we will process your refund to the original payment method within 5–7 business days.' },
    ],
  },
  sustainability: {
    title: 'Sustainability',
    subtitle: 'Responsible fashion, responsibly made.',
    sections: [
      { heading: 'Our Commitment', text: 'We recognize our responsibility to the planet. Sustainability is integrated into every step of our supply chain. We prioritize organic fibers, recycled materials, and zero-waste production methods.' },
      { heading: 'Ethical Manufacturing', text: 'We partner exclusively with factories that adhere to the highest labor standards, ensuring fair wages, safe working conditions, and reasonable hours for all garment workers.' },
    ],
  },
  careers: {
    title: 'Careers at EcomHutt',
    subtitle: 'Join the team building the future of fashion.',
    sections: [
      { heading: 'Join Our Team', text: 'We are always looking for passionate, innovative individuals to join the EcomHutt family. If you value design, craftsmanship, and a collaborative work environment, we would love to hear from you.' },
      { heading: 'Open Positions', text: 'Currently, we have openings in Design, Marketing, and Customer Experience. Please email your resume and portfolio to careers@ecomhutt.com.' },
    ],
  },
  stores: {
    title: 'Store Locator',
    subtitle: 'Experience the collection in person.',
    sections: [
      { heading: 'Flagship Store — New York', text: '123 Mercer Street, New York, NY 10012\nMonday – Saturday: 11 AM – 7 PM\nSunday: 12 PM – 6 PM' },
      { heading: 'Flagship Store — London', text: '45 Redchurch Street, London, E2 7DJ\nMonday – Saturday: 10 AM – 6 PM\nSunday: 11 AM – 5 PM' },
    ],
  },
};

export { PAGE_CONTENT };
