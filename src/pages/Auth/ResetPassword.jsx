import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useShop } from '../../context/ShopContext';
import './Auth.css';

export default function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const { resetPassword } = useShop();
  
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (location.state?.email) {
      setEmail(location.state.email);
    } else {
      // If no email in state, they might have refreshed. We can ask them to enter it.
    }
  }, [location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !otp.trim() || !newPassword.trim()) {
      setError('All fields are required.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setLoading(true);
    setError('');
    setSuccess('');
    
    const result = await resetPassword(email, otp, newPassword);
    setLoading(false);
    
    if (result.success) {
      setSuccess('Password reset successfully! Redirecting to login...');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } else {
      setError(result.message || 'Failed to reset password. OTP may be invalid or expired.');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-visual-panel">
        <div className="auth-visual-content">
          <Link to="/" className="auth-logo">ECOMHUTT</Link>
          <h2 className="auth-visual-heading">Create New Password</h2>
          <p className="auth-visual-subtext">Enter the 6-digit code sent to your email and choose a strong new password.</p>
        </div>
      </div>

      <div className="auth-form-panel">
        <div className="auth-form-container">
          <h1 className="auth-form-title">Reset Password</h1>
          <p className="auth-form-subtitle text-body-sm text-secondary">
            Set a new password for your account.
          </p>

          {error && <div className="auth-error-box">{error}</div>}
          {success && <div className="auth-error-box" style={{ backgroundColor: 'var(--color-surface-container-high)', color: 'var(--color-primary)' }}>{success}</div>}

          <form onSubmit={handleSubmit} className="auth-form" noValidate>
            <div className="form-field">
              <label htmlFor="reset-email" className="form-label text-label-caps">Email Address</label>
              <input
                id="reset-email"
                type="email"
                className="form-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                readOnly={!!location.state?.email}
              />
            </div>

            <div className="form-field">
              <label htmlFor="reset-otp" className="form-label text-label-caps">6-Digit Code</label>
              <input
                id="reset-otp"
                type="text"
                className="form-input"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="123456"
                maxLength="6"
              />
            </div>

            <div className="form-field">
              <label htmlFor="new-password" className="form-label text-label-caps">New Password</label>
              <input
                id="new-password"
                type="password"
                className="form-input"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Minimum 6 characters"
              />
            </div>

            <div className="form-field">
              <label htmlFor="confirm-password" className="form-label text-label-caps">Confirm Password</label>
              <input
                id="confirm-password"
                type="password"
                className="form-input"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter your password"
              />
            </div>

            <button type="submit" className="btn btn-primary auth-submit-btn" disabled={loading}>
              {loading ? 'Resetting...' : 'Reset Password'}
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
