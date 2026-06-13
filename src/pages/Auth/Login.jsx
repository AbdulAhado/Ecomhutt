import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useShop } from '../../context/ShopContext';
import './Auth.css';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useShop();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError('Please enter your email and password.');
      return;
    }
    setLoading(true);
    setError('');
    const result = await login(email, password);
    setLoading(false);
    
    if (result.success) {
      if (result.user && (result.user.role === 'admin' || result.user.role === 'lister')) {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } else {
      if (result.notVerified) {
        navigate('/verify-otp', { state: { email: result.email || email } });
      } else {
        setError(result.message || 'Invalid credentials. Please try again.');
      }
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-visual-panel">
        <div className="auth-brand">
          <Link to="/" className="auth-logo">ECOMHUTT</Link>
          <h1 className="text-display-sm">Welcome Back</h1>
          <p className="text-body-md text-secondary">Sign in to access your account.</p>
        </div>
      </div>

      <div className="auth-form-panel">
        <div className="auth-form-container">
          <h1 className="auth-form-title">Sign In</h1>
          <p className="auth-form-subtitle text-body-sm text-secondary">
            Enter your credentials to continue.
          </p>

          {error && <div className="auth-error-box">{error}</div>}

          <form onSubmit={handleSubmit} className="auth-form" noValidate>
            <div className="form-field">
              <label htmlFor="login-email" className="form-label text-label-caps">Email</label>
              <input
                id="login-email"
                type="email"
                className="form-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
              />
            </div>

            <div className="form-field">
              <label htmlFor="login-password" className="form-label text-label-caps">Password</label>
              <input
                id="login-password"
                type="password"
                className="form-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>

            <div className="form-extras">
              <label className="remember-me-label">
                <input type="checkbox" /> <span className="text-body-sm">Remember me</span>
              </label>
              <Link to="/forgot-password" className="forgot-link text-body-sm">Forgot password?</Link>
            </div>

            <button type="submit" className="btn btn-primary auth-submit-btn" disabled={loading}>
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <p className="auth-switch-text text-body-sm">
            Don&apos;t have an account? <Link to="/register" className="auth-switch-link">Create one</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
