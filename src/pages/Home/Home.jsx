import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, ShieldCheck, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';
import ProductCard from '../../components/ProductCard/ProductCard';
import { useShop } from '../../context/ShopContext';
import './Home.css';
import tech from '../../assets/tech-col.png'

export default function Home() {
  const { products, getHeroBanners } = useShop();
  const [banners, setBanners] = useState([]);
  const [currentBanner, setCurrentBanner] = useState(0);

  useEffect(() => {
    const fetchBanners = async () => {
      if (getHeroBanners) {
        const data = await getHeroBanners();
        setBanners(data.filter(b => b.isActive));
      }
    };
    fetchBanners();
  }, [getHeroBanners]);

  useEffect(() => {
    if (banners.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentBanner(prev => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [banners.length]);

  const featuredProducts = products.filter(p => p.tags && (p.tags.includes('featured') || p.tags.includes('new-arrivals'))).slice(0, 3);
  const homeGardenProducts = products.filter(p => p.category === 'Home & Garden').slice(0, 3);

  const nextBanner = () => setCurrentBanner(prev => (prev + 1) % banners.length);
  const prevBanner = () => setCurrentBanner(prev => (prev - 1 + banners.length) % banners.length);

  return (
    <div className="home-page page-enter page-enter-active">
      {/* Hero Section */}
      <section className="hero-section">
        {banners.length > 0 ? (
          <>
            {banners.map((banner, index) => (
              <div key={banner._id} className={`hero-slide ${index === currentBanner ? 'active' : ''}`} style={{ opacity: index === currentBanner ? 1 : 0, transition: 'opacity 0.8s ease-in-out', position: index === currentBanner ? 'relative' : 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', alignItems: 'center' }}>
                <div className="hero-ambient-bg"></div>
                <div className="container" style={{ position: 'relative', zIndex: 2, display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '40px', width: '100%' }}>
                  <div className="hero-content" style={{ flex: '1 1 400px' }}>
                    <span className="hero-subtitle text-label-caps">Introducing EcomHutt</span>
                    <h1 className="hero-title">{banner.title}</h1>
                    {banner.subtitle && (
                      <p className="hero-description text-body-lg">{banner.subtitle}</p>
                    )}
                    <div className="hero-ctas">
                      <Link to={banner.buttonLink || '/shop'} className="btn btn-primary">
                        {banner.buttonText || 'Explore Collection'}
                      </Link>
                      <Link to="/shop?category=Electronics" className="btn btn-secondary">
                        Shop Electronics
                      </Link>
                    </div>
                  </div>
                  <div className="hero-image-container" style={{ flex: '1 1 400px', display: 'flex', justifyContent: 'center' }}>
                    <img src={banner.image} alt={banner.title} style={{ maxWidth: '100%', maxHeight: '60vh', objectFit: 'contain', borderRadius: '8px' }} />
                  </div>
                </div>
              </div>
            ))}
            {banners.length > 1 && (
              <div className="hero-controls" style={{ position: 'absolute', bottom: '30px', right: '30px', zIndex: 3, display: 'flex', gap: '10px' }}>
                <button onClick={prevBanner} style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.5)', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><ChevronLeft size={20} /></button>
                <button onClick={nextBanner} style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.5)', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><ChevronRight size={20} /></button>
              </div>
            )}
          </>
        ) : (
          <>
            <div className="hero-content container animate-slide-up">
              <span className="hero-subtitle text-label-caps">Introducing EcomHutt</span>
              <h1 className="hero-title">The Art of Essentialism</h1>
              <p className="hero-description text-body-lg">
                A curated collection of modern luxury items designed with visual clarity, premium craftsmanship, and an effortless aesthetic.
              </p>
              <div className="hero-ctas">
                <Link to="/shop" className="btn btn-primary">
                  Explore Collection
                </Link>
                <Link to="/shop?category=Electronics" className="btn btn-secondary">
                  Shop Electronics
                </Link>
              </div>
            </div>
            <div className="hero-ambient-bg"></div>
          </>
        )}
      </section>

      {/* Featured Products Grid */}
      <section className="featured-section container animate-slide-up-delayed">
        <div className="section-header">
          <div>
            <span className="section-subtitle text-label-caps">Curated Selection</span>
            <h2 className="section-title text-headline-lg">Featured Pieces</h2>
          </div>
          <Link to="/shop" className="view-all-link">
            View All <ArrowRight size={16} />
          </Link>
        </div>
        <div className="products-grid">
          {featuredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Editorial Banner Section */}
      <section className="editorial-section animate-slide-up-delayed-2">
        <div className="container editorial-container">
          <div className="editorial-image-block">
            <div className="editorial-visual-text"><img src={tech} alt="" /></div>
          </div>
          <div className="editorial-content">
            <span className="editorial-subtitle text-label-caps">Modern Innovation</span>
            <h2 className="editorial-title text-headline-lg">The Smart Tech Collection</h2>
            <p className="editorial-text text-body-md">
              A carefully curated selection of premium audio devices, smartwear, and high-performance electronics designed to seamlessly integrate into your daily lifestyle with visual clarity and premium craftsmanship.
            </p>
            <Link to="/shop?category=Electronics" className="btn btn-primary">
              Discover the Drop
            </Link>
          </div>
        </div>
      </section>

      {/* Additional Collection Products */}
      {homeGardenProducts.length > 0 && (
        <section className="featured-section container animate-fade-in">
          <div className="section-header">
            <div>
              <span className="section-subtitle text-label-caps">Minimalist Essentials</span>
              <h2 className="section-title text-headline-lg">Home & Garden Decor</h2>
            </div>
            <Link to="/shop?category=Home & Garden" className="view-all-link">
              View Collection <ArrowRight size={16} />
            </Link>
          </div>
          <div className="products-grid">
            {homeGardenProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* Brand Values / Philosophy */}
      <section className="philosophy-section animate-fade-in">
        <div className="container philosophy-container">
          <div className="philosophy-card">
            <Sparkles size={24} className="philosophy-icon" />
            <h3 className="philosophy-title">Premium Craftsmanship</h3>
            <p className="philosophy-text text-body-sm">
              Each piece is ethically sourced, hand-crafted, or detailed by master artisans using premium, sustainable materials.
            </p>
          </div>
          <div className="philosophy-card">
            <ShieldCheck size={24} className="philosophy-icon" />
            <h3 className="philosophy-title">Secure Authenticity</h3>
            <p className="philosophy-text text-body-sm">
              All items are certified authentic with direct tracking from production to your doorstep.
            </p>
          </div>
          <div className="philosophy-card">
            <RefreshCw size={24} className="philosophy-icon" />
            <h3 className="philosophy-title">Effortless Returns</h3>
            <p className="philosophy-text text-body-sm">
              Enjoy 30-day complimentary shipping and returns on all domestic orders, processed instantly.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
