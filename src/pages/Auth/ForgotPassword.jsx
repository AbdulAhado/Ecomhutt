import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useShop } from '../../context/ShopContext';
import './Auth.css';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const { forgotPassword } = useShop();
  
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Please enter your registered email address.');
      return;
    }
    setLoading(true);
    setError('');
    setSuccess('');
    
    const result = await forgotPassword(email);
    setLoading(false);
    
    if (result.success) {
      setSuccess('If an account exists with this email, a reset code has been sent.');
      // Wait a moment then redirect to reset password
      setTimeout(() => {
        navigate('/reset-password', { state: { email } });
      }, 2000);
    } else {
      setError(result.message || 'Failed to process request.');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-visual-panel">
        <div className="auth-visual-content">
          <Link to="/" className="auth-logo">ECOMHUTT</Link>
          <h2 className="auth-visual-heading">Reset Password</h2>
          <p className="auth-visual-subtext">Don't worry, it happens to the best of us. We'll help you get back into your account securely.</p>
        </div>
      </div>

      <div className="auth-form-panel">
        <div className="auth-form-container">
          <h1 className="auth-form-title">Forgot Password</h1>
          <p className="auth-form-subtitle text-body-sm text-secondary">
            Enter your email to receive a password reset code.
          </p>

          {error && <div className="auth-error-box">{error}</div>}
          {success && <div className="auth-error-box" style={{ backgroundColor: 'var(--color-surface-container-high)', color: 'var(--color-primary)' }}>{success}</div>}

          <form onSubmit={handleSubmit} className="auth-form" noValidate>
            <div className="form-field">
              <label htmlFor="forgot-email" className="form-label text-label-caps">Email Address</label>
              <input
                id="forgot-email"
                type="email"
                className="form-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
              />
            </div>

            <button type="submit" className="btn btn-primary auth-submit-btn" disabled={loading}>
              {loading ? 'Sending Code...' : 'Send Reset Code'}
            </button>
          </form>

          <p className="auth-switch-text text-body-sm">
            Remember your password? <Link to="/login" className="auth-switch-link">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
