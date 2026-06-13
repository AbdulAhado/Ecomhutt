import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './InfoPage.css';

const PAGE_CONTENT = {
  '/shipping-returns': {
    title: 'Shipping & Returns',
    sections: [
      {
        heading: 'Shipping Policy',
        text: 'We offer complimentary standard shipping on all orders over $150. Orders are processed within 1-2 business days. Express shipping options are available at checkout. You will receive a tracking number once your order has been dispatched.',
      },
      {
        heading: 'International Shipping',
        text: 'EcomHutt ships globally. International orders may be subject to customs duties and taxes upon arrival. These charges are the responsibility of the recipient.',
      },
      {
        heading: 'Returns & Exchanges',
        text: 'We accept returns within 30 days of delivery. Items must be unworn, unwashed, and in their original packaging with all tags attached. To initiate a return, please visit our return portal or contact customer service.',
      },
      {
        heading: 'Refund Process',
        text: 'Once we receive and inspect your returned item, we will process your refund to the original payment method within 5-7 business days.',
      }
    ]
  },
  '/about': {
    title: 'Our Story',
    sections: [
      {
        heading: 'The Genesis',
        text: 'EcomHutt was born out of a desire for simplicity in an overly complicated world. We believe that true luxury lies in the absence of excess. Our journey began with a single perfectly tailored garment, and has since evolved into a complete lifestyle brand.',
      },
      {
        heading: 'Our Philosophy',
        text: 'Less, but better. We focus on premium materials, meticulous craftsmanship, and timeless silhouettes. Every piece we create is designed to transcend seasonal trends and become a permanent fixture in your wardrobe.',
      }
    ]
  },
  '/sustainability': {
    title: 'Sustainability',
    sections: [
      {
        heading: 'Our Commitment',
        text: 'We recognize our responsibility to the planet. Sustainability is not just a buzzword for us; it is integrated into every step of our supply chain. We prioritize organic fibers, recycled materials, and zero-waste production methods.',
      },
      {
        heading: 'Ethical Manufacturing',
        text: 'We partner exclusively with factories that adhere to the highest labor standards, ensuring fair wages, safe working conditions, and reasonable hours for all garment workers.',
      }
    ]
  },
  '/careers': {
    title: 'Careers at EcomHutt',
    sections: [
      {
        heading: 'Join Our Team',
        text: 'We are always looking for passionate, innovative individuals to join the EcomHutt family. If you value design, craftsmanship, and a collaborative work environment, we would love to hear from you.',
      },
      {
        heading: 'Open Positions',
        text: 'Currently, we have openings in Design, Marketing, and Customer Experience. Please email your resume and portfolio to careers@ecomhutt.com.',
      }
    ]
  },
  '/stores': {
    title: 'Store Locator',
    sections: [
      {
        heading: 'Flagship Store - New York',
        text: '123 Mercer Street, New York, NY 10012\nMonday - Saturday: 11 AM - 7 PM\nSunday: 12 PM - 6 PM',
      },
      {
        heading: 'Flagship Store - London',
        text: '45 Redchurch Street, London, E2 7DJ\nMonday - Saturday: 10 AM - 6 PM\nSunday: 11 AM - 5 PM',
      }
    ]
  }
};

export default function InfoPage() {
  const location = useLocation();
  const content = PAGE_CONTENT[location.pathname] || { title: 'Page Not Found', sections: [] };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="info-page page-enter page-enter-active">
      <div className="info-hero">
        <div className="container">
          <h1 className="text-display-md">{content.title}</h1>
        </div>
      </div>
      
      <div className="container info-content-container">
        <div className="info-content">
          {content.sections.map((section, idx) => (
            <div key={idx} className="info-section">
              <h2 className="text-headline-md">{section.heading}</h2>
              {section.text.split('\n').map((paragraph, pIdx) => (
                <p key={pIdx} className="text-body-lg text-secondary">
                  {paragraph}
                </p>
              ))}
            </div>
          ))}
          {content.sections.length === 0 && (
            <p className="text-body-lg text-secondary text-center" style={{ padding: '60px 0' }}>
              The content you are looking for is currently unavailable.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
