import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Package, ArrowRight } from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import './TrackOrderLookup.css';

export default function TrackOrderLookup() {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { getOrderByTracking } = useShop();

  const handleTrack = async (e) => {
    e.preventDefault();
    if (!trackingNumber.trim()) return;

    setLoading(true);
    setError('');

    const res = await getOrderByTracking(trackingNumber.trim());
    if (res.success) {
      navigate(`/order/${res.data._id}`);
    } else {
      setError(res.message || 'We could not find an order with that tracking number.');
    }
    setLoading(false);
  };

  return (
    <div className="track-order-page page-enter page-enter-active">
      <div className="track-order-hero">
        <div className="container">
          <h1 className="text-display-sm">Track Your Order</h1>
          <p className="text-body-lg text-secondary" style={{ maxWidth: '600px', margin: '0 auto', marginTop: '16px' }}>
            Enter your tracking number below to see the current status of your shipment and estimated delivery date.
          </p>
        </div>
      </div>

      <div className="container" style={{ maxWidth: '600px', padding: '60px 24px' }}>
        <div className="track-order-card">
          <div className="track-order-icon-wrapper">
            <Package size={32} />
          </div>
          
          <form className="track-order-form" onSubmit={handleTrack}>
            <div className="track-input-group">
              <Search className="track-search-icon" size={20} />
              <input
                type="text"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                placeholder="e.g. ETH-1A2B3C4D5"
                required
              />
              <button 
                type="submit" 
                className="btn btn-primary track-btn"
                disabled={loading}
              >
                {loading ? 'Searching...' : <><ArrowRight size={18} /> Track</>}
              </button>
            </div>
            {error && <p className="track-error-message text-body-sm text-error">{error}</p>}
          </form>

          <div className="track-order-help">
            <h4 className="text-headline-sm">Where do I find my tracking number?</h4>
            <p className="text-body-sm text-secondary" style={{ marginTop: '8px' }}>
              Your tracking number was sent to you in your shipping confirmation email. It usually starts with <strong>ETH-</strong> followed by 9 characters.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
