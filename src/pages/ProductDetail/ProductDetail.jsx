import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Heart, ShoppingBag, ArrowLeft, Plus, Minus, Star, ShieldCheck, Truck, RefreshCw } from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import ProductCard from '../../components/ProductCard/ProductCard';
import './ProductDetail.css';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { cart, addToCart, wishlist, toggleWishlist, products } = useShop();

  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState('Standard');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('details');
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    const found = products.find(p => p.id === id || p._id === id);
    if (found) {
      setProduct(found);
      setQuantity(1); // Reset quantity on product change
      setActiveImageIndex(0);
    } else {
      setProduct(null);
    }
  }, [id, products]);

  if (!product) {
    return (
      <div className="container product-not-found page-enter page-enter-active">
        <h2>Product Not Found</h2>
        <p>The product you are looking for does not exist or has been removed from our collection.</p>
        <Link to="/shop" className="btn btn-primary">Back to Shop</Link>
      </div>
    );
  }

  const isWishlisted = wishlist.includes(product.id);

  const incrementQty = () => setQuantity(prev => prev + 1);
  const decrementQty = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));

  const handleAddToCart = () => {
    if (product.inStock) {
      addToCart(product.id, quantity, selectedSize);
      alert(`${quantity}x ${product.name} (${selectedSize}) added to your bag.`);
    }
  };

  // Recommendations: Other products from the same category or collection
  const recommendations = products
    .filter(p => p.id !== product.id && (p.category === product.category || p.collection === product.collection))
    .slice(0, 3);

  return (
    <div className="product-detail-page container page-enter page-enter-active">
      {/* Back link */}
      <button onClick={() => navigate(-1)} className="back-link-btn">
        <ArrowLeft size={16} /> Back
      </button>

      {/* Main product display grid */}
      <div className="product-main-grid">
        {/* Product Images */}
        <div className="product-images-column">
          {(() => {
            const productImages = product.images && product.images.length > 0 ? product.images : (product.image ? [product.image] : []);
            const displayImage = productImages.length > 0 ? productImages[activeImageIndex] : null;
            return (
              <>
                <div className="product-large-image-box" style={{ backgroundColor: displayImage ? 'transparent' : product.imageColor, overflow: 'hidden' }}>
                  {displayImage ? (
                    <img src={displayImage} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <span className="product-large-image-text">{product.imageText}</span>
                  )}
                </div>
                {/* Subtle thumbnails below */}
                <div className="product-thumbnails">
                  {productImages.length > 0 ? (
                    productImages.map((img, idx) => (
                      <div key={idx} className={`thumbnail-box ${activeImageIndex === idx ? 'active' : ''}`} onClick={() => setActiveImageIndex(idx)} style={{ cursor: 'pointer' }}>
                        <img src={img} alt={`thumb${idx+1}`} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: activeImageIndex === idx ? 1 : 0.6 }} />
                      </div>
                    ))
                  ) : (
                    <>
                      <div className="thumbnail-box active" style={{ backgroundColor: product.imageColor }}></div>
                      <div className="thumbnail-box" style={{ backgroundColor: `${product.imageColor}dd` }}></div>
                      <div className="thumbnail-box" style={{ backgroundColor: `${product.imageColor}bb` }}></div>
                    </>
                  )}
                </div>
              </>
            );
          })()}
        </div>

        {/* Product Purchase / Details info */}
        <div className="product-info-column">
          <span className="product-info-category text-label-caps">{product.category}</span>
          <h1 className="product-info-title">{product.name}</h1>
          
          <div className="product-info-rating">
            <div className="stars-row">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={14} fill={i < Math.floor(product.rating) ? "var(--color-primary)" : "none"} color="var(--color-primary)" />
              ))}
            </div>
            <span className="rating-text text-caption">{product.rating} ({product.reviews} reviews)</span>
          </div>

          <div className="product-info-price">
            ${product.price.toFixed(2)}
          </div>

          <p className="product-info-description text-body-md">
            {product.description}
          </p>

          {/* Size Selector */}
          <div className="selection-group">
            <span className="selection-label text-label-caps">Select Size</span>
            <div className="size-options">
              {['Standard', 'Large'].map(size => (
                <button
                  key={size}
                  className={`size-option-btn ${selectedSize === size ? 'active' : ''}`}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity and Actions */}
          <div className="actions-group">
            <div className="quantity-selector">
              <button onClick={decrementQty} aria-label="Decrease quantity" className="qty-btn">
                <Minus size={16} />
              </button>
              <span className="qty-value">{quantity}</span>
              <button onClick={incrementQty} aria-label="Increase quantity" className="qty-btn">
                <Plus size={16} />
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              className={`btn btn-primary add-to-cart-btn ${!product.inStock ? 'btn-disabled' : ''}`}
              disabled={!product.inStock}
            >
              <ShoppingBag size={18} />
              {product.inStock ? 'Add to Bag' : 'Sold Out'}
            </button>

            <button
              onClick={() => toggleWishlist(product.id)}
              className={`wishlist-btn-action ${isWishlisted ? 'active' : ''}`}
              aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
            >
              <Heart size={20} fill={isWishlisted ? "var(--color-primary)" : "none"} />
            </button>
          </div>

          {/* Shipping & trust details */}
          <div className="trust-points">
            <div className="trust-point">
              <Truck size={18} />
              <div>
                <h4 className="trust-title">Free Standard Delivery</h4>
                <p className="trust-desc">Complimentary shipping on all orders over $150.</p>
              </div>
            </div>
            <div className="trust-point">
              <RefreshCw size={18} />
              <div>
                <h4 className="trust-title">Easy Returns</h4>
                <p className="trust-desc">30-day return policy. Free return shipping labels provided.</p>
              </div>
            </div>
          </div>

          {/* Tabs Accordion */}
          <div className="info-tabs">
            <div className="tabs-header">
              <button 
                className={`tab-title-btn ${activeTab === 'details' ? 'active' : ''}`}
                onClick={() => setActiveTab('details')}
              >
                Specifications
              </button>
              <button 
                className={`tab-title-btn ${activeTab === 'shipping' ? 'active' : ''}`}
                onClick={() => setActiveTab('shipping')}
              >
                Shipping info
              </button>
            </div>
            
            <div className="tab-content">
              {activeTab === 'details' && (
                <ul className="specs-list">
                  {(product.details || []).map((detail, index) => (
                    <li key={index}>{detail}</li>
                  ))}
                </ul>
              )}
              {activeTab === 'shipping' && (
                <p className="shipping-text-tab text-body-sm">
                  We process and ship orders daily Monday through Friday. Standard delivery typically arrives within 3-5 business days. Express shipping options are available at checkout. All shipments are fully insured and require a signature upon delivery to ensure maximum security.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Recommended Products */}
      {recommendations.length > 0 && (
        <section className="recommendations-section">
          <h2 className="recommendations-title text-headline-md">You May Also Like</h2>
          <div className="recommendations-grid">
            {recommendations.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
