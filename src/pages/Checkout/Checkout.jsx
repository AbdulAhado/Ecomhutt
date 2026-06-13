import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, Truck, CreditCard, ArrowRight, Loader } from 'lucide-react';
import { PayPalButtons } from '@paypal/react-paypal-js';
import { useShop } from '../../context/ShopContext';
import './Checkout.css';

export default function Checkout() {
  const navigate = useNavigate();
  const { cart, user, getCartSubtotal, placeOrder, payOrder } = useShop();

  const [step, setStep] = useState(1); // 1 = shipping, 2 = payment
  const [createdOrder, setCreatedOrder] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paypalError, setPaypalError] = useState('');

  const [shippingMethod, setShippingMethod] = useState('standard');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    country: 'United States',
  });
  const [errors, setErrors] = useState({});

  const subtotal = getCartSubtotal();
  const shipping = shippingMethod === 'express' ? 25.00 : (subtotal > 150 ? 0.00 : 15.00);
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = 'Required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Required';
    if (!formData.email.trim()) newErrors.email = 'Required';
    if (!formData.address.trim()) newErrors.address = 'Required';
    if (!formData.city.trim()) newErrors.city = 'Required';
    if (!formData.zip.trim()) newErrors.zip = 'Required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Step 1 → Step 2: Create order on backend, then show PayPal buttons
  const handleContinueToPayment = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    if (!user) {
      navigate('/login', { state: { from: '/checkout' } });
      return;
    }

    setIsProcessing(true);
    try {
      const order = await placeOrder(formData, shippingMethod);
      setCreatedOrder(order);
      setStep(2);
    } catch (err) {
      console.error('Failed to create order:', err);
      setErrors({ form: err.response?.data?.message || 'Failed to create order. Please try again.' });
    } finally {
      setIsProcessing(false);
    }
  };

  // PayPal: createOrder callback — tells PayPal the amount
  const handlePayPalCreateOrder = (data, actions) => {
    return actions.order.create({
      purchase_units: [
        {
          amount: {
            value: total.toFixed(2),
            currency_code: 'USD',
          },
          description: `EcomHutt Order #${createdOrder?.trackingNumber || ''}`,
        },
      ],
      application_context: {
        shipping_preference: 'NO_SHIPPING', // We already collected shipping
      },
    });
  };

  // PayPal: onApprove callback — capture payment and mark order as paid
  const handlePayPalApprove = async (data, actions) => {
    setIsProcessing(true);
    setPaypalError('');
    try {
      const details = await actions.order.capture();

      // Send payment confirmation to our backend
      const paidOrder = await payOrder(createdOrder.id, {
        id: details.id,
        status: details.status,
        update_time: details.update_time,
        payer: {
          email_address: details.payer.email_address,
        },
      });

      navigate('/payment/success', {
        state: {
          order: {
            id: paidOrder.id || paidOrder._id,
            trackingNumber: paidOrder.trackingNumber,
            totalPrice: paidOrder.totalPrice,
          },
        },
      });
    } catch (err) {
      console.error('PayPal capture error:', err);
      setPaypalError('Payment was approved but we had trouble confirming it. Please contact support.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePayPalError = (err) => {
    console.error('PayPal error:', err);
    setPaypalError('Something went wrong with PayPal. Please try again.');
  };

  if (cart.length === 0 && !createdOrder) {
    return (
      <div className="container checkout-empty page-enter page-enter-active">
        <h2>Nothing to Check Out</h2>
        <p className="text-body-md text-secondary">Your bag is empty. Add items before proceeding.</p>
        <Link to="/shop" className="btn btn-primary">Shop Collection</Link>
      </div>
    );
  }

  return (
    <div className="checkout-page container page-enter page-enter-active">
      <header className="checkout-header">
        <h1 className="checkout-title">Checkout</h1>
        {/* Step indicator */}
        <div className="checkout-steps">
          <span className={`checkout-step ${step >= 1 ? 'active' : ''}`}>
            <span className="step-number">1</span> Shipping
          </span>
          <span className="step-divider"><ArrowRight size={14} /></span>
          <span className={`checkout-step ${step >= 2 ? 'active' : ''}`}>
            <span className="step-number">2</span> Payment
          </span>
        </div>
      </header>

      <div className="checkout-layout">
        {/* Left: Forms */}
        <div className="checkout-forms">
          {step === 1 && (
            <form onSubmit={handleContinueToPayment} noValidate>
              {/* Shipping Information */}
              <section className="checkout-section">
                <h2 className="checkout-section-title text-headline-sm">
                  <Truck size={20} /> Shipping Information
                </h2>
                <div className="form-row-2">
                  <div className="form-field">
                    <label htmlFor="firstName" className="form-label text-label-caps">First Name</label>
                    <input id="firstName" name="firstName" type="text" className={`form-input ${errors.firstName ? 'error' : ''}`} value={formData.firstName} onChange={handleChange} placeholder="Alexandra" />
                    {errors.firstName && <span className="field-error">{errors.firstName}</span>}
                  </div>
                  <div className="form-field">
                    <label htmlFor="lastName" className="form-label text-label-caps">Last Name</label>
                    <input id="lastName" name="lastName" type="text" className={`form-input ${errors.lastName ? 'error' : ''}`} value={formData.lastName} onChange={handleChange} placeholder="Morrison" />
                    {errors.lastName && <span className="field-error">{errors.lastName}</span>}
                  </div>
                </div>
                <div className="form-row-2">
                  <div className="form-field">
                    <label htmlFor="email" className="form-label text-label-caps">Email</label>
                    <input id="email" name="email" type="email" className={`form-input ${errors.email ? 'error' : ''}`} value={formData.email} onChange={handleChange} placeholder="alex@example.com" />
                    {errors.email && <span className="field-error">{errors.email}</span>}
                  </div>
                  <div className="form-field">
                    <label htmlFor="phone" className="form-label text-label-caps">Phone (optional)</label>
                    <input id="phone" name="phone" type="tel" className="form-input" value={formData.phone} onChange={handleChange} placeholder="+1 (555) 000-0000" />
                  </div>
                </div>
                <div className="form-field">
                  <label htmlFor="address" className="form-label text-label-caps">Address</label>
                  <input id="address" name="address" type="text" className={`form-input ${errors.address ? 'error' : ''}`} value={formData.address} onChange={handleChange} placeholder="120 Mercer Street" />
                  {errors.address && <span className="field-error">{errors.address}</span>}
                </div>
                <div className="form-row-3">
                  <div className="form-field">
                    <label htmlFor="city" className="form-label text-label-caps">City</label>
                    <input id="city" name="city" type="text" className={`form-input ${errors.city ? 'error' : ''}`} value={formData.city} onChange={handleChange} placeholder="New York" />
                    {errors.city && <span className="field-error">{errors.city}</span>}
                  </div>
                  <div className="form-field">
                    <label htmlFor="state" className="form-label text-label-caps">State</label>
                    <input id="state" name="state" type="text" className="form-input" value={formData.state} onChange={handleChange} placeholder="NY" />
                  </div>
                  <div className="form-field">
                    <label htmlFor="zip" className="form-label text-label-caps">ZIP Code</label>
                    <input id="zip" name="zip" type="text" className={`form-input ${errors.zip ? 'error' : ''}`} value={formData.zip} onChange={handleChange} placeholder="10012" />
                    {errors.zip && <span className="field-error">{errors.zip}</span>}
                  </div>
                </div>
              </section>

              {/* Shipping Method */}
              <section className="checkout-section">
                <h2 className="checkout-section-title text-headline-sm">Shipping Method</h2>
                <div className="shipping-methods">
                  <label className={`shipping-option ${shippingMethod === 'standard' ? 'active' : ''}`}>
                    <input type="radio" name="shippingMethod" value="standard" checked={shippingMethod === 'standard'} onChange={(e) => setShippingMethod(e.target.value)} />
                    <div className="shipping-option-body">
                      <span className="shipping-option-name">Standard Delivery</span>
                      <span className="shipping-option-desc text-caption">3–5 business days</span>
                    </div>
                    <span className="shipping-option-price">{subtotal > 150 ? 'Free' : '$15.00'}</span>
                  </label>
                  <label className={`shipping-option ${shippingMethod === 'express' ? 'active' : ''}`}>
                    <input type="radio" name="shippingMethod" value="express" checked={shippingMethod === 'express'} onChange={(e) => setShippingMethod(e.target.value)} />
                    <div className="shipping-option-body">
                      <span className="shipping-option-name">Express Delivery</span>
                      <span className="shipping-option-desc text-caption">1–2 business days</span>
                    </div>
                    <span className="shipping-option-price">$25.00</span>
                  </label>
                </div>
              </section>

              {errors.form && (
                <div className="checkout-form-error">
                  <p>{errors.form}</p>
                </div>
              )}

              <button type="submit" className="btn btn-primary checkout-continue-btn" disabled={isProcessing}>
                {isProcessing ? (
                  <><Loader size={18} className="spinner" /> Creating Order...</>
                ) : (
                  <>Continue to Payment <ArrowRight size={18} /></>
                )}
              </button>
            </form>
          )}

          {step === 2 && (
            <section className="checkout-section payment-section">
              <h2 className="checkout-section-title text-headline-sm">
                <CreditCard size={20} /> Pay with PayPal
              </h2>
              <p className="text-body-md text-secondary" style={{ marginBottom: '8px' }}>
                Complete your purchase securely through PayPal. You can pay with your PayPal balance, linked bank account, or credit/debit card.
              </p>

              {paypalError && (
                <div className="checkout-form-error">
                  <p>{paypalError}</p>
                </div>
              )}

              {isProcessing && (
                <div className="paypal-processing">
                  <Loader size={24} className="spinner" />
                  <span>Processing your payment...</span>
                </div>
              )}

              <div className="paypal-button-container">
                <PayPalButtons
                  style={{
                    layout: 'vertical',
                    color: 'gold',
                    shape: 'rect',
                    label: 'pay',
                    height: 50,
                  }}
                  createOrder={handlePayPalCreateOrder}
                  onApprove={handlePayPalApprove}
                  onError={handlePayPalError}
                  onCancel={() => setPaypalError('Payment was cancelled. You can try again.')}
                  disabled={isProcessing}
                />
              </div>

              <button
                type="button"
                className="btn btn-secondary checkout-back-btn"
                onClick={() => setStep(1)}
                disabled={isProcessing}
              >
                ← Back to Shipping
              </button>
            </section>
          )}
        </div>

        {/* Right: Order Summary */}
        <aside className="checkout-summary">
          <div className="summary-card">
            <h2 className="summary-title text-headline-sm">Order Summary</h2>
            
            <div className="summary-items-list">
              {cart.map((item) => (
                <div key={`${item.id}-${item.size}`} className="summary-item-row">
                  <div className="summary-item-img" style={{ backgroundColor: item.imageColor }}></div>
                  <div className="summary-item-info">
                    <span className="summary-item-name">{item.name}</span>
                    <span className="summary-item-qty text-caption">Qty: {item.quantity}{item.size ? ` · ${item.size}` : ''}</span>
                  </div>
                  <span className="summary-item-price">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="summary-divider"></div>

            <div className="summary-row"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
            <div className="summary-row"><span>Shipping</span><span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span></div>
            <div className="summary-row"><span>Tax (estimated)</span><span>${tax.toFixed(2)}</span></div>
            
            <div className="summary-divider"></div>
            <div className="summary-total-row">
              <span className="total-label">Total</span>
              <span className="total-val">${total.toFixed(2)}</span>
            </div>

            <p className="secure-badge text-caption">
              🔒 Secured with PayPal Buyer Protection
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
