import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useShop } from '../../context/ShopContext';
import './Auth.css';

export default function Register() {
  const navigate = useNavigate();
  const { register } = useShop();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password.trim()) {
      setError('All fields are required.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setLoading(true);
    setError('');
    const result = await register(name, email, password);
    setLoading(false);
    if (result.success) {
      navigate('/verify-otp', { state: { email } });
    } else {
      setError(result.message || 'Registration failed.');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-visual-panel">
        <div className="auth-visual-content">
          <Link to="/" className="auth-logo">ECOMHUTT</Link>
          <h2 className="auth-visual-heading">Join the Collection</h2>
          <p className="auth-visual-subtext">Create an account to save your favorites, track orders, and enjoy a personalized experience.</p>
        </div>
      </div>

      <div className="auth-form-panel">
        <div className="auth-form-container">
          <h1 className="auth-form-title">Create Account</h1>
          <p className="auth-form-subtitle text-body-sm text-secondary">
            Fill in your details to get started.
          </p>

          {error && <div className="auth-error-box">{error}</div>}

          <form onSubmit={handleSubmit} className="auth-form" noValidate>
            <div className="form-field">
              <label htmlFor="reg-name" className="form-label text-label-caps">Full Name</label>
              <input
                id="reg-name"
                type="text"
                className="form-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Alexandra Morrison"
              />
            </div>

            <div className="form-field">
              <label htmlFor="reg-email" className="form-label text-label-caps">Email</label>
              <input
                id="reg-email"
                type="email"
                className="form-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alex@example.com"
              />
            </div>

            <div className="form-field">
              <label htmlFor="reg-password" className="form-label text-label-caps">Password</label>
              <input
                id="reg-password"
                type="password"
                className="form-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 6 characters"
              />
            </div>

            <div className="form-field">
              <label htmlFor="reg-confirm" className="form-label text-label-caps">Confirm Password</label>
              <input
                id="reg-confirm"
                type="password"
                className="form-input"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter your password"
              />
            </div>

            <button type="submit" className="btn btn-primary auth-submit-btn" disabled={loading}>
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <p className="auth-switch-text text-body-sm">
            Already have an account? <Link to="/login" className="auth-switch-link">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
