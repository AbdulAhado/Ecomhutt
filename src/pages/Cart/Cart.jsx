import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowRight, ArrowLeft } from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import './Cart.css';

export default function Cart() {
  const { cart, updateCartQuantity, removeFromCart, getCartSubtotal } = useShop();

  const subtotal = getCartSubtotal();
  const shipping = subtotal > 150 ? 0.00 : 15.00;
  const total = subtotal + shipping;

  if (cart.length === 0) {
    return (
      <div className="container empty-cart-container page-enter page-enter-active">
        <div className="empty-cart-message">
          <span className="empty-cart-icon">∅</span>
          <h2>Your bag is empty</h2>
          <p className="text-body-md text-secondary">
            You have not added any pieces to your collection yet.
          </p>
          <Link to="/shop" className="btn btn-primary">
            Explore Collection
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page container page-enter page-enter-active">
      <header className="cart-header">
        <h1 className="cart-title">Your Bag</h1>
        <span className="cart-items-count text-body-sm text-secondary">({cart.length} items)</span>
      </header>

      <div className="cart-layout">
        {/* Cart items list */}
        <div className="cart-items-section">
          <div className="cart-table-headers">
            <span className="hdr-product text-label-caps">Product</span>
            <span className="hdr-quantity text-label-caps">Quantity</span>
            <span className="hdr-total text-label-caps">Total</span>
          </div>

          <div className="cart-items-list">
            {cart.map((item) => (
              <div key={`${item.id}-${item.size}`} className="cart-item-row">
                {/* Product details */}
                <div className="cart-item-product">
                  <div className="cart-item-img" style={{ backgroundColor: item.imageColor }}>
                    <span className="cart-item-img-text">{item.imageText.split(' ')[0]}</span>
                  </div>
                  <div className="cart-item-info">
                    <h3 className="cart-item-name">
                      <Link to={`/product/${item.id}`}>{item.name}</Link>
                    </h3>
                    <p className="cart-item-size text-caption">Size: {item.size}</p>
                    <p className="cart-item-price-mobile text-body-sm">${item.price.toFixed(2)}</p>
                    <button 
                      className="cart-item-remove-btn"
                      onClick={() => removeFromCart(item.id, item.size)}
                      aria-label="Remove item"
                    >
                      <Trash2 size={14} /> Remove
                    </button>
                  </div>
                </div>

                {/* Quantity adjuster */}
                <div className="cart-item-quantity">
                  <div className="quantity-selector-sm">
                    <button 
                      onClick={() => updateCartQuantity(item.id, item.size, item.quantity - 1)}
                      className="qty-btn-sm"
                      aria-label="Decrease quantity"
                    >
                      <Minus size={12} />
                    </button>
                    <span className="qty-value-sm">{item.quantity}</span>
                    <button 
                      onClick={() => updateCartQuantity(item.id, item.size, item.quantity + 1)}
                      className="qty-btn-sm"
                      aria-label="Increase quantity"
                    >
                      <Plus size={12} />
                    </button>
                  </div>
                </div>

                {/* Total price */}
                <div className="cart-item-total">
                  <span className="total-price">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Continue shopping link */}
          <Link to="/shop" className="continue-shopping-link text-label-caps">
            <ArrowLeft size={14} /> Continue Shopping
          </Link>
        </div>

        {/* Order summary */}
        <div className="cart-summary-section">
          <div className="summary-card">
            <h2 className="summary-title text-headline-sm">Order Summary</h2>

            <div className="summary-row">
              <span className="text-secondary text-body-sm">Subtotal</span>
              <span className="summary-val">${subtotal.toFixed(2)}</span>
            </div>

            <div className="summary-row">
              <span className="text-secondary text-body-sm">Shipping</span>
              <span className="summary-val">{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
            </div>

            {shipping > 0 && (
              <p className="shipping-notice text-caption text-tertiary">
                Spend another ${(150 - subtotal).toFixed(2)} to qualify for free shipping.
              </p>
            )}

            <div className="summary-total-row">
              <span className="total-label">Total</span>
              <span className="total-val">${total.toFixed(2)}</span>
            </div>

            <Link to="/checkout" className="btn btn-primary checkout-btn">
              Proceed to Checkout <ArrowRight size={16} />
            </Link>

            {/* Payment methods badge */}
            <div className="secure-badge text-caption">
              🔒 SSL Encrypted Checkout. Free 30-day returns.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
