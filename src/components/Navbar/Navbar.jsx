import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { Search, ShoppingBag, Heart, User, Menu, X } from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import Logo from '../Logo/Logo';
import './Navbar.css';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { getCartCount } = useShop();

  const searchParams = new URLSearchParams(location.search);
  const currentCategory = searchParams.get('category');

  // Handle scroll to change nav style
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <header className={`navbar-header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="container navbar-container">
        {/* Mobile menu trigger */}
        <button
          className="mobile-nav-toggle"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle navigation menu"
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        {/* Navigation Links - Desktop */}
        <nav className={`desktop-nav ${isOpen ? 'open' : ''}`}>
          <ul className="nav-links">
            <li>
              <Link to="/shop" className={`nav-link ${location.pathname === '/shop' && !currentCategory ? 'active' : ''}`}>
                Shop All
              </Link>
            </li>
            <li>
              <Link to="/shop?category=Electronics" className={`nav-link ${location.pathname === '/shop' && currentCategory === 'Electronics' ? 'active' : ''}`}>
                Electronics
              </Link>
            </li>
            <li>
              <Link to="/shop?category=Clothing" className={`nav-link ${location.pathname === '/shop' && currentCategory === 'Clothing' ? 'active' : ''}`}>
                Clothing
              </Link>
            </li>
            <li>
              <Link to="/shop?category=Home & Garden" className={`nav-link ${location.pathname === '/shop' && currentCategory === 'Home & Garden' ? 'active' : ''}`}>
                Home & Garden
              </Link>
            </li>
            <li>
              <Link to="/shop?category=Accessories" className={`nav-link ${location.pathname === '/shop' && currentCategory === 'Accessories' ? 'active' : ''}`}>
                Accessories
              </Link>
            </li>
          </ul>
        </nav>

        {/* Brand Logo */}
        <div className="navbar-logo">
          <Link to="/" style={{ display: 'flex', alignItems: 'center' }}>
            <Logo />
          </Link>
        </div>

        {/* Action icons */}
        <div className="navbar-actions">
          <button
            className="action-btn search-btn"
            onClick={() => setSearchOpen(!searchOpen)}
            aria-label="Search"
          >
            <Search size={20} />
          </button>

          <Link to="/wishlist" className="action-btn wishlist-btn" aria-label="Wishlist">
            <Heart size={20} />
          </Link>

          <Link to="/dashboard" className="action-btn account-btn" aria-label="Account">
            <User size={20} />
          </Link>

          <Link to="/cart" className="action-btn bag-btn" aria-label="Shopping Bag">
            <ShoppingBag size={20} />
            {getCartCount() > 0 && <span className="bag-count">{getCartCount()}</span>}
          </Link>
        </div>
      </div>

      {/* Search overlay slider */}
      {searchOpen && (
        <div className="search-overlay">
          <div className="container search-overlay-container">
            <form onSubmit={handleSearchSubmit} className="search-form">
              <input
                type="text"
                placeholder=" collection..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                className="search-input"
              />
              <button type="submit" className="search-submit-btn">
                <Search size={20} />
              </button>
            </form>
            <button
              className="search-close-btn"
              onClick={() => setSearchOpen(false)}
              aria-label="Close search"
            >
              <X size={24} />
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
