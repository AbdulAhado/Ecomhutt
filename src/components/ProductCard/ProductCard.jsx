import { Link } from 'react-router-dom';
import { Heart, ShoppingBag } from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import './ProductCard.css';

export default function ProductCard({ product }) {
  const { wishlist, toggleWishlist, addToCart } = useShop();
  const isWishlisted = wishlist.includes(product.id);

  const handleWishlistToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.inStock) {
      addToCart(product.id, 1, 'Standard');
      alert(`${product.name} added to your bag.`);
    }
  };

  return (
    <div className="product-card">
      <Link to={`/product/${product.id}`} className="product-card-link">
        {/* Image Container */}
        <div className="product-image-container" style={{ backgroundColor: (product.images && product.images.length > 0) || product.image ? 'transparent' : product.imageColor }}>
          {product.images && product.images.length > 0 ? (
            <img src={product.images[0]} alt={product.name} className="product-real-image" />
          ) : product.image ? (
            <img src={product.image} alt={product.name} className="product-real-image" />
          ) : (
            <span className="product-image-text">{product.imageText}</span>
          )}
          
          {/* Wishlist Button */}
          <button 
            className={`wishlist-toggle-btn ${isWishlisted ? 'active' : ''}`}
            onClick={handleWishlistToggle}
            aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Heart size={18} fill={isWishlisted ? "var(--color-primary)" : "none"} />
          </button>

          {/* Quick Actions Overlay */}
          <div className="quick-actions-overlay">
            {product.inStock ? (
              <button 
                className="quick-add-btn" 
                onClick={handleQuickAdd}
              >
                <ShoppingBag size={14} />
                Quick Add
              </button>
            ) : (
              <span className="out-of-stock-badge">Sold Out</span>
            )}
          </div>
        </div>

        {/* Product Details */}
        <div className="product-card-details">
          <span className="product-card-category">{product.category}</span>
          <div className="product-card-meta">
            <h3 className="product-card-name">{product.name}</h3>
            <span className="product-card-price">${product.price.toFixed(2)}</span>
          </div>
        </div>
      </Link>
    </div>
  );
}
