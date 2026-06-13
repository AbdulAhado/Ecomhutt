import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Package, Heart, LogOut, MapPin, Settings } from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import './Dashboard.css';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, orders, wishlist, logout } = useShop();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    password: '',
  });
  const [profileStatus, setProfileStatus] = useState({ type: '', message: '' });
  const { updateUserProfile } = useShop();

  if (!user) {
    return (
      <div className="container dashboard-empty page-enter page-enter-active">
        <div className="empty-state-box">
          <User size={48} className="empty-state-icon" />
          <h2>Sign In Required</h2>
          <p className="text-body-md text-secondary">
            Access your dashboard by signing in to your account.
          </p>
          <Link to="/login" className="btn btn-primary">Sign In</Link>
        </div>
      </div>
    );
  }

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileStatus({ type: 'loading', message: 'Updating...' });
    const res = await updateUserProfile(profileForm);
    if (res.success) {
      setProfileStatus({ type: 'success', message: 'Profile updated successfully!' });
      setIsEditingProfile(false);
      // Clear password field
      setProfileForm({ ...profileForm, password: '' });
    } else {
      setProfileStatus({ type: 'error', message: res.message });
    }
  };

  return (
    <div className="dashboard-page container page-enter page-enter-active">
      <header className="dashboard-header">
        <div>
          <h1 className="dashboard-title">My Account</h1>
          <p className="text-body-sm text-secondary">Welcome back, {user.name}.</p>
        </div>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          {(user.role === 'admin' || user.role === 'lister') && (
            <Link to="/admin" className="btn btn-secondary btn-sm" style={{ padding: '8px 16px' }}>
              Admin Dashboard
            </Link>
          )}
          <button className="logout-btn" onClick={handleLogout}>
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </header>

      {/* Dashboard Grid */}
      <div className="dashboard-grid">
        {/* Profile Card */}
        <div className="dash-card profile-card" style={{ gridColumn: isEditingProfile ? '1 / -1' : 'auto' }}>
          {isEditingProfile ? (
            <div className="profile-edit-form-container">
              <h3 style={{ marginBottom: '16px' }}>Edit Profile</h3>
              {profileStatus.message && (
                <div style={{ padding: '10px', marginBottom: '16px', borderRadius: '4px', backgroundColor: profileStatus.type === 'error' ? '#f8d7da' : '#d4edda', color: profileStatus.type === 'error' ? '#721c24' : '#155724' }}>
                  {profileStatus.message}
                </div>
              )}
              <form onSubmit={handleProfileSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px' }}>Name</label>
                  <input type="text" value={profileForm.name} onChange={e => setProfileForm({...profileForm, name: e.target.value})} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px' }}>Email</label>
                  <input type="email" value={profileForm.email} onChange={e => setProfileForm({...profileForm, email: e.target.value})} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px' }}>New Password (leave blank to keep current)</label>
                  <input type="password" value={profileForm.password} onChange={e => setProfileForm({...profileForm, password: e.target.value})} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }} />
                </div>
                <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                  <button type="submit" className="btn btn-primary" disabled={profileStatus.type === 'loading'}>Save Changes</button>
                  <button type="button" className="btn btn-secondary" onClick={() => setIsEditingProfile(false)}>Cancel</button>
                </div>
              </form>
            </div>
          ) : (
            <>
              <div className="profile-avatar">
                <User size={32} />
              </div>
              <h3 className="profile-name">{user.name}</h3>
              <p className="profile-email text-body-sm text-secondary">{user.email}</p>
              {user.address && (
                <div className="profile-address text-caption text-tertiary">
                  <MapPin size={12} />
                  {user.address.street}, {user.address.city}, {user.address.state} {user.address.zip}
                </div>
              )}
              <button className="btn btn-secondary edit-profile-btn" onClick={() => setIsEditingProfile(true)}>
                <Settings size={14} /> Edit Profile
              </button>
            </>
          )}
        </div>

        {/* Quick Stats */}
        <div className="dash-card stat-card">
          <Package size={24} className="stat-icon" />
          <span className="stat-value">{orders.length}</span>
          <span className="stat-label text-caption">Total Orders</span>
        </div>

        <div className="dash-card stat-card">
          <Heart size={24} className="stat-icon" />
          <span className="stat-value">{wishlist.length}</span>
          <span className="stat-label text-caption">Saved Items</span>
        </div>
      </div>

      {/* Recent Orders */}
      <section className="orders-section">
        <h2 className="orders-section-title text-headline-sm">Order History</h2>

        {orders.length === 0 ? (
          <div className="orders-empty-state">
            <Package size={32} className="empty-state-icon" />
            <p className="text-body-sm text-secondary">You haven&apos;t placed any orders yet.</p>
            <Link to="/shop" className="btn btn-secondary">Start Shopping</Link>
          </div>
        ) : (
          <div className="orders-table">
            <div className="orders-table-header">
              <span className="text-label-caps">Order</span>
              <span className="text-label-caps">Date</span>
              <span className="text-label-caps">Items</span>
              <span className="text-label-caps">Total</span>
              <span className="text-label-caps">Status</span>
              <span className="text-label-caps"></span>
            </div>
            {orders.map((order) => (
              <div key={order.id} className="orders-table-row">
                <span className="order-id">{order.trackingNumber || order.id}</span>
                <span className="order-date text-body-sm">{new Date(order.createdAt || order.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                <span className="order-items-count text-body-sm">{(order.orderItems || order.items || []).length} items</span>
                <span className="order-total">${(order.totalPrice || order.total || 0).toFixed(2)}</span>
                <span className={`order-status status-${(order.isPaid ? 'paid' : order.status || 'processing').toLowerCase()}`}>{order.isPaid ? 'Paid' : (order.status || 'Processing')}</span>
                <Link to={`/order/${order.id}`} className="order-track-link text-label-caps">Track</Link>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
