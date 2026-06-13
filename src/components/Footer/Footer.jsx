import { Link } from 'react-router-dom';
import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";
import { ArrowRight } from 'lucide-react';
import Logo from '../Logo/Logo';
import './Footer.css';

export default function Footer() {
  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Thank you for subscribing to our newsletter.');
  };

  return (
    <footer className="footer">
      <div className="container footer-container">
        {/* Brand & Newsletter */}
        <div className="footer-brand-section">
          <Link to="/" className="footer-logo" style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
            <Logo style={{ height: '36px' }} />
          </Link>
          <p className="footer-description">
            A brand built on the philosophy of visual clarity, premium craftsmanship, and effortless luxury. Less, but better.
          </p>
          <form onSubmit={handleSubmit} className="newsletter-form">
            <label htmlFor="email-input" className="sr-only">Email Address</label>
            <input
              id="email-input"
              type="email"
              placeholder="Join our newsletter"
              required
              className="newsletter-input"
            />
            <button type="submit" className="newsletter-submit" aria-label="Subscribe">
              <ArrowRight size={16} />
            </button>
          </form>
          <div className="footer-social">
            <a href="#" className="social-link"><FaFacebook size={20} /></a>
            <a href="#" className="social-link"><FaTwitter size={20} /></a>
            <a href="#" className="social-link"><FaInstagram size={20} /></a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="footer-links-group">
          <h4 className="footer-heading">Shop</h4>
          <Link to="/shop" className="footer-link">All Products</Link>
          <Link to="/shop?category=Electronics" className="footer-link">Electronics</Link>
          <Link to="/shop?category=Clothing" className="footer-link">Clothing</Link>
          <Link to="/shop?category=Home & Garden" className="footer-link">Home & Garden</Link>
          <Link to="/shop?category=Accessories" className="footer-link">Accessories</Link>
        </div>

        <div className="footer-links-group">
          <h4 className="footer-heading">Support</h4>
          <Link to="/faq" className="footer-link">FAQs</Link>
          <Link to="/shipping-returns" className="footer-link">Shipping & Returns</Link>
          <Link to="/order/track" className="footer-link">Track Order</Link>
          <Link to="/contact" className="footer-link">Contact Us</Link>
          <Link to="/stores" className="footer-link">Store Locator</Link>
        </div>

        <div className="footer-links-group">
          <h4 className="footer-heading">About</h4>
          <Link to="/about" className="footer-link">About Us</Link>
        </div>
      </div>

      <div className="footer-bottom container">
        <div className="footer-copyright">
          &copy; {new Date().getFullYear()} EcomHutt. All rights reserved.
        </div>
        <div className="social-links">
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="social-link text-body-sm text-secondary">
            Instagram
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="social-link text-body-sm text-secondary">
            Twitter
          </a>
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="social-link text-body-sm text-secondary">
            Facebook
          </a>
        </div>
      </div>
    </footer>
  );
}
