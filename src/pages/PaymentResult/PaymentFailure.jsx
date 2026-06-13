import { Link } from 'react-router-dom';
import { XCircle, ArrowRight, RefreshCw } from 'lucide-react';
import './PaymentResult.css';

export default function PaymentFailure() {
  return (
    <div className="payment-result-page container page-enter page-enter-active">
      <div className="result-card failure">
        <div className="result-icon-wrapper failure">
          <XCircle size={48} />
        </div>
        <h1 className="result-title">Payment Failed</h1>
        <p className="result-description text-body-md text-secondary">
          We were unable to process your payment. Please verify your payment details and try again, or contact support.
        </p>

        <div className="result-actions">
          <Link to="/checkout" className="btn btn-primary">
            <RefreshCw size={16} /> Retry Checkout
          </Link>
          <Link to="/shop" className="btn btn-secondary">
            Continue Shopping <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}
