import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useShop } from '../../context/ShopContext';
import './Auth.css';

export default function VerifyOTP() {
  const navigate = useNavigate();
  const location = useLocation();
  const { verifyOTP, resendOTP } = useShop();
  
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  useEffect(() => {
    if (location.state?.email) {
      setEmail(location.state.email);
    } else {
      // If accessed directly without an email in state, might want to ask for it
      // or redirect to login. For now, we leave it empty.
    }
  }, [location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !otp.trim()) {
      setError('Please provide both email and OTP.');
      return;
    }
    setLoading(true);
    setError('');
    setSuccess('');
    
    const result = await verifyOTP(email, otp);
    setLoading(false);
    
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.message || 'Verification failed. Please check your OTP.');
    }
  };

  const handleResend = async () => {
    if (!email.trim()) {
      setError('Email is required to resend OTP.');
      return;
    }
    setResendLoading(true);
    setError('');
    setSuccess('');
    
    const result = await resendOTP(email);
    setResendLoading(false);
    
    if (result.success) {
      setSuccess('A new OTP has been sent to your email.');
    } else {
      setError(result.message || 'Failed to resend OTP.');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-visual-panel">
        <div className="auth-visual-content">
          <Link to="/" className="auth-logo">ECOMHUTT</Link>
          <h2 className="auth-visual-heading">Verify Your Identity</h2>
          <p className="auth-visual-subtext">We have sent a 6-digit code to your email. Please enter it to continue.</p>
        </div>
      </div>

      <div className="auth-form-panel">
        <div className="auth-form-container">
          <h1 className="auth-form-title">Enter OTP</h1>
          <p className="auth-form-subtitle text-body-sm text-secondary">
            Check your inbox for the verification code.
          </p>

          {error && <div className="auth-error-box">{error}</div>}
          {success && <div className="auth-error-box" style={{ backgroundColor: 'var(--color-surface-container-high)', color: 'var(--color-primary)' }}>{success}</div>}

          <form onSubmit={handleSubmit} className="auth-form" noValidate>
            <div className="form-field">
              <label htmlFor="verify-email" className="form-label text-label-caps">Email</label>
              <input
                id="verify-email"
                type="email"
                className="form-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                readOnly={!!location.state?.email}
              />
            </div>

            <div className="form-field">
              <label htmlFor="verify-otp" className="form-label text-label-caps">6-Digit Code</label>
              <input
                id="verify-otp"
                type="text"
                className="form-input"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="123456"
                maxLength="6"
              />
            </div>

            <button type="submit" className="btn btn-primary auth-submit-btn" disabled={loading}>
              {loading ? 'Verifying...' : 'Verify Email'}
            </button>
          </form>

          <p className="auth-switch-text text-body-sm">
            Didn&apos;t receive the code?{' '}
            <button 
              onClick={handleResend} 
              className="auth-switch-link" 
              style={{ background: 'none', border: 'none', cursor: 'pointer', font: 'inherit', padding: 0 }}
              disabled={resendLoading}
            >
              {resendLoading ? 'Sending...' : 'Resend OTP'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
