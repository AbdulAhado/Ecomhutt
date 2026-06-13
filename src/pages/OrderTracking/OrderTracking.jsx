import { useParams, Link, useNavigate } from 'react-router-dom';
import { Package, Truck, CheckCircle, Clock, ArrowLeft } from 'lucide-react';
import { PayPalButtons } from '@paypal/react-paypal-js';
import { useShop } from '../../context/ShopContext';
import './OrderTracking.css';

const TRACKING_STEPS = [
  { key: 'confirmed', label: 'Order Confirmed', icon: CheckCircle },
  { key: 'processing', label: 'Processing', icon: Package },
  { key: 'shipped', label: 'Shipped', icon: Truck },
  { key: 'delivered', label: 'Delivered', icon: CheckCircle },
];

function getStepIndex(status) {
  const map = { 'Processing': 1, 'Shipped': 2, 'Delivered': 3 };
  return map[status] ?? 0;
}

export default function OrderTracking() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { orders, payOrder } = useShop();

  const order = orders.find(o => o.id === id);

  if (!order) {
    return (
      <div className="container order-not-found page-enter page-enter-active">
        <div className="empty-state-box">
          <Package size={48} className="empty-state-icon" />
          <h2>Order Not Found</h2>
          <p className="text-body-md text-secondary">
            We couldn&apos;t find an order with ID <strong>{id}</strong>.
          </p>
          <Link to="/dashboard" className="btn btn-primary">Back to Dashboard</Link>
        </div>
      </div>
    );
  }

  const currentStep = getStepIndex(order.status);
  const items = order.orderItems || order.items || [];
  const orderDate = order.createdAt || order.date;
  const orderTotal = order.totalPrice || order.total || 0;

  return (
    <div className="order-tracking-page container page-enter page-enter-active">
      <Link to="/dashboard" className="back-link-btn">
        <ArrowLeft size={16} /> Back to Dashboard
      </Link>

      <header className="tracking-header">
        <div>
          <span className="tracking-order-id text-label-caps">Order {order.trackingNumber || order.id}</span>
          <h1 className="tracking-title">Order Tracking</h1>
        </div>
        <span className={`order-status status-${(order.status || 'processing').toLowerCase()}`}>{order.status || 'Processing'}</span>
      </header>

      {/* Tracking Timeline */}
      <div className="tracking-timeline">
        {TRACKING_STEPS.map((step, index) => {
          const StepIcon = step.icon;
          const isCompleted = index <= currentStep;
          const isCurrent = index === currentStep;
          return (
            <div key={step.key} className={`timeline-step ${isCompleted ? 'completed' : ''} ${isCurrent ? 'current' : ''}`}>
              <div className="timeline-icon-wrapper">
                <StepIcon size={20} />
              </div>
              <span className="timeline-label">{step.label}</span>
              {index < TRACKING_STEPS.length - 1 && <div className={`timeline-connector ${isCompleted ? 'completed' : ''}`}></div>}
            </div>
          );
        })}
      </div>

      {/* Order Details */}
      <div className="tracking-details-grid">
        <div className="tracking-card">
          <h3 className="tracking-card-title text-headline-sm">Order Details</h3>
          <div className="tracking-info-row">
            <span className="text-body-sm text-secondary">Order ID</span>
            <span className="text-body-sm">{order.trackingNumber || order.id}</span>
          </div>
          <div className="tracking-info-row">
            <span className="text-body-sm text-secondary">Date Placed</span>
            <span className="text-body-sm">{new Date(orderDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
          </div>
          <div className="tracking-info-row">
            <span className="text-body-sm text-secondary">Tracking Number</span>
            <span className="text-body-sm">{order.trackingNumber}</span>
          </div>
          <div className="tracking-info-row">
            <span className="text-body-sm text-secondary">Shipping</span>
            <span className="text-body-sm">{order.shippingMethod === 'express' ? 'Express (1–2 days)' : 'Standard (3–5 days)'}</span>
          </div>
          <div className="tracking-info-row">
            <span className="text-body-sm text-secondary">Payment</span>
            <span className="text-body-sm">{order.isPaid ? '✅ Paid' : '⏳ Pending'}</span>
          </div>
        </div>

        <div className="tracking-card">
          <h3 className="tracking-card-title text-headline-sm">Items ({items.length})</h3>
          <div className="tracking-items-list">
            {items.map((item, index) => (
              <div key={`${item.product || item.id}-${item.size}-${index}`} className="tracking-item-row">
                <div className="tracking-item-img" style={{ backgroundColor: item.imageColor || '#ccc' }}></div>
                <div className="tracking-item-info">
                  <span className="tracking-item-name text-body-sm">{item.name}</span>
                  <span className="text-caption text-tertiary">Qty: {item.quantity}{item.size ? ` · ${item.size}` : ''}</span>
                </div>
                <span className="tracking-item-price text-body-sm">${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="tracking-total-row">
            <span className="text-body-md">Total</span>
            <span className="text-headline-sm" style={{ fontWeight: 700 }}>${orderTotal.toFixed(2)}</span>
          </div>

          {!order.isPaid && (
            <div className="payment-container" style={{ marginTop: '24px' }}>
              <h4 className="text-headline-sm" style={{ marginBottom: '16px' }}>Complete Payment</h4>
              <PayPalButtons
                style={{ layout: 'vertical', color: 'gold', shape: 'rect', label: 'pay', height: 45 }}
                createOrder={(data, actions) => {
                  return actions.order.create({
                    purchase_units: [
                      {
                        amount: {
                          value: orderTotal.toFixed(2),
                        },
                      },
                    ],
                  });
                }}
                onApprove={async (data, actions) => {
                  try {
                    const details = await actions.order.capture();
                    await payOrder(order.id, {
                      id: details.id,
                      status: details.status,
                      update_time: details.update_time,
                      payer: { email_address: details.payer.email_address },
                    });
                    navigate('/payment/success', {
                      state: {
                        order: {
                          id: order.id,
                          trackingNumber: order.trackingNumber,
                          totalPrice: orderTotal,
                        },
                      },
                    });
                  } catch (err) {
                    console.error('PayPal Capture Error', err);
                    navigate('/payment/failure');
                  }
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
