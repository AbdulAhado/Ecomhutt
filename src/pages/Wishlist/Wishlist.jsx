import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import './Wishlist.css';

export default function Wishlist() {
  const { wishlist, toggleWishlist, addToCart, products } = useShop();

  const wishlistProducts = products.filter(p => wishlist.includes(p.id));

  const handleAddToCart = (product) => {
    if (product.inStock) {
      addToCart(product.id, 1, 'Standard');
      toggleWishlist(product.id);
    }
  };

  if (wishlistProducts.length === 0) {
    return (
      <div className="container wishlist-empty page-enter page-enter-active">
        <div className="empty-state-box">
          <Heart size={48} className="empty-state-icon" />
          <h2>Your Wishlist is Empty</h2>
          <p className="text-body-md text-secondary">
            Save your favorite pieces here to revisit later.
          </p>
          <Link to="/shop" className="btn btn-primary">Explore Collection</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="wishlist-page container page-enter page-enter-active">
      <header className="wishlist-header">
        <h1 className="wishlist-title">Wishlist</h1>
        <span className="wishlist-count text-body-sm text-secondary">({wishlistProducts.length} saved)</span>
      </header>

      <div className="wishlist-grid">
        {wishlistProducts.map(product => (
          <div key={product.id} className="wishlist-card">
            <Link to={`/product/${product.id}`} className="wishlist-card-image" style={{ backgroundColor: product.imageColor }}>
              <span className="wishlist-card-img-text">{product.imageText}</span>
            </Link>
            <div className="wishlist-card-body">
              <div className="wishlist-card-meta">
                <span className="wishlist-card-category text-caption">{product.category}</span>
                <h3 className="wishlist-card-name">
                  <Link to={`/product/${product.id}`}>{product.name}</Link>
                </h3>
                <span className="wishlist-card-price">${product.price.toFixed(2)}</span>
              </div>
              <div className="wishlist-card-actions">
                <button
                  className="btn btn-primary wishlist-add-btn"
                  onClick={() => handleAddToCart(product)}
                  disabled={!product.inStock}
                >
                  <ShoppingBag size={14} />
                  {product.inStock ? 'Add to Bag' : 'Sold Out'}
                </button>
                <button
                  className="wishlist-remove-btn"
                  onClick={() => toggleWishlist(product.id)}
                  aria-label="Remove from wishlist"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
