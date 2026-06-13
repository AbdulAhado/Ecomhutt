import { Link, useLocation } from 'react-router-dom';
import { CheckCircle, Package, ArrowRight } from 'lucide-react';
import './PaymentResult.css';

export default function PaymentSuccess() {
  const location = useLocation();
  const order = location.state?.order;

  return (
    <div className="payment-result-page container page-enter page-enter-active">
      <div className="result-card success">
        <div className="result-icon-wrapper success">
          <CheckCircle size={48} />
        </div>
        <h1 className="result-title">Payment Successful</h1>
        <p className="result-description text-body-md text-secondary">
          Thank you for your order. Your pieces are being carefully prepared for shipment.
        </p>

        {order && (
          <div className="result-order-info">
            <div className="result-info-row">
              <span className="text-body-sm text-secondary">Order ID</span>
              <span className="text-body-sm" style={{ fontWeight: 600 }}>{order.id}</span>
            </div>
            <div className="result-info-row">
              <span className="text-body-sm text-secondary">Tracking</span>
              <span className="text-body-sm" style={{ fontWeight: 600 }}>{order.trackingNumber}</span>
            </div>
            <div className="result-info-row">
              <span className="text-body-sm text-secondary">Total</span>
              <span className="text-body-sm" style={{ fontWeight: 600 }}>${(order.totalPrice || order.total || 0).toFixed(2)}</span>
            </div>
          </div>
        )}

        <div className="result-actions">
          {order && (
            <Link to={`/order/${order.id}`} className="btn btn-primary">
              <Package size={16} /> Track Order
            </Link>
          )}
          <Link to="/shop" className="btn btn-secondary">
            Continue Shopping <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}
