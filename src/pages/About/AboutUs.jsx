import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, Package, Headphones, Truck } from 'lucide-react';
import './AboutUs.css';

export default function AboutUs() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const values = [
    {
      icon: <CheckCircle size={28} />,
      title: 'Curated Selection',
      text: 'No clutter, no compromise. Every item meets our high standards.',
    },
    {
      icon: <Package size={28} />,
      title: 'Quality Guaranteed',
      text: 'We test what we sell so you can shop with confidence.',
    },
    {
      icon: <Truck size={28} />,
      title: 'Fast & Reliable Shipping',
      text: 'Across the US, quickly and dependably.',
    },
    {
      icon: <Headphones size={28} />,
      title: 'Customer-First Service',
      text: 'Your satisfaction is our priority.',
    },
  ];

  return (
    <div className="about-page">
      {/* Hero Section */}
      <section className="about-hero">
        <div className="about-hero-overlay"></div>
        <div className="container about-hero-content animate-slide-up">
          <span className="about-hero-tag text-label-caps">Our Story</span>
          <h1 className="about-hero-title">About EcomHutt</h1>
          <p className="about-hero-subtitle">
            Quality shouldn&apos;t be complicated. We deliver the finest products at prices that actually make sense.
          </p>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="about-mission">
        <div className="container about-mission-inner animate-slide-up-delayed">
          <div className="about-mission-text">
            <h2 className="text-headline-lg">We believe in quality without complication</h2>
            <p className="text-body-lg text-secondary">
              Since day one, we&apos;ve been committed to sourcing and delivering the finest products that our customers deserve—all at prices that actually make sense.
            </p>
            <p className="text-body-lg text-secondary">
              We&apos;ve carefully curated every item in our collection with one goal in mind: to bring you quality, reliability, and exceptional value. Whether you&apos;re looking for everyday essentials or something special, we stand behind every product we sell.
            </p>
          </div>
          <div className="about-mission-visual">
            <div className="mission-accent-block"></div>
            <div className="mission-stat-card">
              <span className="stat-number">100%</span>
              <span className="stat-label text-body-sm text-secondary">Quality Tested</span>
            </div>
            <div className="mission-stat-card">
              <span className="stat-number">24/7</span>
              <span className="stat-label text-body-sm text-secondary">Customer Support</span>
            </div>
          </div>
        </div>
      </section>

      {/* Values Grid */}
      <section className="about-values">
        <div className="container">
          <div className="about-values-header animate-slide-up-delayed">
            <span className="text-label-caps">Why Choose Us</span>
            <h2 className="text-headline-lg">The EcomHutt Difference</h2>
          </div>
          <div className="about-values-grid animate-slide-up-delayed-2">
            {values.map((item, idx) => (
              <div key={idx} className="about-value-card">
                <div className="about-value-icon">{item.icon}</div>
                <h3 className="about-value-title">{item.title}</h3>
                <p className="about-value-text text-body-sm text-secondary">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Promise Banner */}
      <section className="about-promise">
        <div className="container about-promise-inner animate-fade-in">
          <h2 className="about-promise-title text-headline-lg">More Than Just Products</h2>
          <p className="about-promise-text text-body-lg">
            We&apos;re not just selling products. We&apos;re building relationships with customers who value quality and trust us to deliver. When you shop EcomHutt, you&apos;re getting more than an item—you&apos;re getting peace of mind.
          </p>
          <Link to="/shop" className="btn btn-primary about-cta">
            Experience the Difference
          </Link>
        </div>
      </section>
    </div>
  );
}
