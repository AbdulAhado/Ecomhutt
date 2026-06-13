import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LayoutDashboard, ShoppingBag, Users, Settings, TrendingUp, Search, PackageSearch, Plus, Trash2, Edit3, X, LogOut, CheckCircle, AlertCircle, Info } from 'lucide-react';
import axios from 'axios';
import { useShop } from '../../context/ShopContext';
import './AdminDashboard.css';

export default function AdminDashboard() {
  const { user, orders, products, createProduct, updateProduct, deleteProduct, createAdminUser, logout, refreshProducts, updateOrderStatus } = useShop();
  const navigate = useNavigate();

  // Toast notification system
  const [toasts, setToasts] = useState([]);
  const showToast = useCallback((message, type = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
  }, []);
  const dismissToast = (id) => setToasts(prev => prev.filter(t => t.id !== id));

  // Route protection
  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else if (user.role === 'customer') {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const isAdmin = user?.role === 'admin';
  const isLister = user?.role === 'lister';

  const [activeTab, setActiveTab] = useState(isAdmin ? 'overview' : 'products');
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  
  // Product Form State
  const [productForm, setProductForm] = useState({
    name: '',
    price: '',
    category: '',
    images: [],
    imageColor: '#cccccc',
    imageText: '',
    description: '',
    inStock: true,
  });
  const [uploadingImage, setUploadingImage] = useState(false);

  // User Form State (Admin only)
  const [userForm, setUserForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'lister'
  });
  const [userFormStatus, setUserFormStatus] = useState({ type: '', message: '' });

  // Hero Banner State (Admin only)
  const { getHeroBanners, createHeroBanner, deleteHeroBanner } = useShop();
  const [heroBanners, setHeroBanners] = useState([]);
  const [bannerForm, setBannerForm] = useState({
    title: '', subtitle: '', buttonText: 'Shop Now', buttonLink: '/shop', image: '', isActive: true
  });
  const [bannerFormStatus, setBannerFormStatus] = useState({ type: '', message: '' });

  useEffect(() => {
    if (isAdmin && activeTab === 'settings') {
      loadBanners();
    }
  }, [activeTab, isAdmin]);

  const loadBanners = async () => {
    const data = await getHeroBanners();
    setHeroBanners(data);
  };

  const uploadFileHandler = async (e, isProduct = true) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    if (isProduct && files.length > 3) {
      showToast('You can only upload up to 3 images.', 'error');
      return;
    }

    const formData = new FormData();
    files.forEach(file => {
      formData.append('images', file);
    });
    setUploadingImage(true);

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      };
      const { data } = await axios.post('/api/upload', formData, config);
      
      if (isProduct) {
        setProductForm(prev => {
          const newImages = [...(prev.images || []), ...data].slice(0, 3);
          return { ...prev, images: newImages };
        });
      } else {
        setBannerForm(prev => ({ ...prev, image: data[0] }));
      }
      setUploadingImage(false);
      showToast('Image(s) uploaded successfully!', 'success');
    } catch (error) {
      console.error(error);
      setUploadingImage(false);
      showToast('Image upload failed. Check file type (jpg, png, webp).', 'error');
    }
  };

  const totalRevenue = orders.reduce((sum, order) => sum + (order.totalPrice || order.total || 0), 0);

  if (!user || user.role === 'customer') return null;

  // --- Handlers ---

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const openAddProduct = () => {
    setEditingProduct(null);
    setProductForm({
      name: '', price: '', category: '', images: [], imageColor: '#cccccc', imageText: '', description: '', inStock: true
    });
    setIsProductModalOpen(true);
  };

  const openEditProduct = (product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      price: product.price,
      category: product.category,
      images: product.images && product.images.length > 0 ? product.images : (product.image ? [product.image] : []),
      imageColor: product.imageColor || '#cccccc',
      imageText: product.imageText || '',
      description: product.description || '',
      inStock: product.inStock,
    });
    setIsProductModalOpen(true);
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...productForm,
      price: Number(productForm.price),
    };

    try {
      if (editingProduct) {
        const productId = String(editingProduct._id || editingProduct.id);
        await updateProduct(productId, payload);
        showToast('Product updated successfully!', 'success');
      } else {
        await createProduct(payload);
        showToast('Product created successfully!', 'success');
      }
      // Refresh products from DB to ensure state is in sync
      await refreshProducts();
      setIsProductModalOpen(false);
    } catch (err) {
      console.error('Product save failed:', err);
      const msg = err.response?.data?.message || 'Failed to save product.';
      showToast(msg, 'error');
    }
  };

  const handleDeleteProduct = async (product) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const productId = String(product._id || product.id);
        await deleteProduct(productId);
        await refreshProducts();
        showToast('Product deleted.', 'info');
      } catch (err) {
        showToast('Failed to delete product.', 'error');
      }
    }
  };

  const handleUserSubmit = async (e) => {
    e.preventDefault();
    setUserFormStatus({ type: 'loading', message: 'Creating user...' });
    const result = await createAdminUser(userForm);
    if (result.success) {
      setUserFormStatus({ type: 'success', message: `User ${result.data.name} created successfully!` });
      showToast(`User "${result.data.name}" created!`, 'success');
      setUserForm({ name: '', email: '', password: '', role: 'lister' });
    } else {
      setUserFormStatus({ type: 'error', message: result.message });
      showToast(result.message, 'error');
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    const res = await updateOrderStatus(orderId, newStatus);
    if (res.success) {
      showToast(`Order status updated to ${newStatus}`, 'success');
    } else {
      showToast(res.message, 'error');
    }
  };

  return (
    <div className="admin-dashboard-page page-enter page-enter-active">
      {/* Toast Notifications */}
      <div className="admin-toast-container">
        {toasts.map(toast => (
          <div key={toast.id} className={`admin-toast admin-toast--${toast.type}`}>
            <span className="admin-toast-icon">
              {toast.type === 'success' && <CheckCircle size={18} />}
              {toast.type === 'error' && <AlertCircle size={18} />}
              {toast.type === 'info' && <Info size={18} />}
            </span>
            <span className="admin-toast-message">{toast.message}</span>
            <button className="admin-toast-close" onClick={() => dismissToast(toast.id)}>
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar-header">
          <Link to="/" className="admin-logo">ECOMHUTT ADMIN</Link>
          <span className="admin-role-badge">{user.role}</span>
        </div>
        <nav className="admin-nav">
          {isAdmin && (
            <>
              <button className={`admin-nav-item ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>
                <LayoutDashboard size={18} /> Overview
              </button>
              <button className={`admin-nav-item ${activeTab === 'orders' ? 'active' : ''}`} onClick={() => setActiveTab('orders')}>
                <ShoppingBag size={18} /> Orders
              </button>
            </>
          )}
          <button className={`admin-nav-item ${activeTab === 'products' ? 'active' : ''}`} onClick={() => setActiveTab('products')}>
            <PackageSearch size={18} /> Products
          </button>
          {isAdmin && (
            <>
              <button className={`admin-nav-item ${activeTab === 'users' ? 'active' : ''}`} onClick={() => setActiveTab('users')}>
                <Users size={18} /> Users
              </button>
              <button className={`admin-nav-item ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => setActiveTab('settings')}>
                <Settings size={18} /> Store Settings
              </button>
            </>
          )}
        </nav>
        <div className="admin-sidebar-footer">
          <button className="admin-nav-item text-error" onClick={handleLogout}>
            <LogOut size={18} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="admin-main-content">
        <header className="admin-header">
          <h1 className="admin-page-title">
            {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
          </h1>
          <div className="admin-header-actions">
            <div className="admin-search">
              <Search size={16} />
              <input type="text" placeholder="Search..." />
            </div>
            <div className="admin-profile-circle">
              {user.name.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        {/* --- OVERVIEW TAB --- */}
        {activeTab === 'overview' && isAdmin && (
          <div className="admin-overview">
            <div className="admin-kpi-grid">
              <div className="admin-kpi-card">
                <span className="kpi-label">Total Revenue</span>
                <span className="kpi-value">${totalRevenue.toFixed(2)}</span>
                <span className="kpi-trend positive"><TrendingUp size={14} /> +12.5%</span>
              </div>
              <div className="admin-kpi-card">
                <span className="kpi-label">Total Orders</span>
                <span className="kpi-value">{orders.length}</span>
                <span className="kpi-trend positive"><TrendingUp size={14} /> +5.2%</span>
              </div>
              <div className="admin-kpi-card">
                <span className="kpi-label">Products</span>
                <span className="kpi-value">{products.length}</span>
                <span className="kpi-trend"><PackageSearch size={14} /> Active</span>
              </div>
            </div>

            <section className="admin-section">
              <div className="admin-section-header">
                <h2>Recent Orders</h2>
                <button className="btn btn-secondary btn-sm" onClick={() => setActiveTab('orders')}>View All</button>
              </div>
              <div className="admin-table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Date</th>
                      <th>Customer</th>
                      <th>Status</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.slice(0, 5).map(order => (
                      <tr key={order.id}>
                        <td className="font-medium">{order.trackingNumber || order.id}</td>
                        <td>{new Date(order.createdAt || order.date).toLocaleDateString()}</td>
                        <td>{order.shippingAddress?.firstName || order.billingDetails?.firstName} {order.shippingAddress?.lastName || order.billingDetails?.lastName}</td>
                        <td><span className={`status-badge status-${(order.isPaid ? 'paid' : order.status || 'processing').toLowerCase()}`}>{order.isPaid ? 'Paid' : (order.status || 'Processing')}</span></td>
                        <td className="font-medium">${(order.totalPrice || order.total || 0).toFixed(2)}</td>
                      </tr>
                    ))}
                    {orders.length === 0 && (
                      <tr><td colSpan="5" className="text-center py-4 text-secondary">No recent orders found.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        )}

        {/* --- ORDERS TAB --- */}
        {activeTab === 'orders' && isAdmin && (
          <div className="admin-orders">
             <section className="admin-section">
              <div className="admin-table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Date</th>
                      <th>Customer</th>
                      <th>Items</th>
                      <th>Status</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map(order => (
                      <tr key={order.id}>
                        <td className="font-medium">{order.trackingNumber || order.id}</td>
                        <td>{new Date(order.createdAt || order.date).toLocaleDateString()}</td>
                        <td>{order.shippingAddress?.firstName || order.billingDetails?.firstName} {order.shippingAddress?.lastName || order.billingDetails?.lastName}</td>
                        <td>{(order.orderItems || order.items || []).length}</td>
                        <td>
                          <select 
                            value={order.status || 'Processing'} 
                            onChange={(e) => handleStatusChange(order.id, e.target.value)}
                            className={`status-badge status-${(order.status || 'processing').toLowerCase()}`}
                            style={{ padding: '4px 8px', border: '1px solid #ddd', borderRadius: '4px', cursor: 'pointer', background: 'transparent' }}
                          >
                            <option value="Processing">Processing</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                          </select>
                        </td>
                        <td className="font-medium">${(order.totalPrice || order.total || 0).toFixed(2)}</td>
                      </tr>
                    ))}
                    {orders.length === 0 && (
                      <tr><td colSpan="6" className="text-center py-4 text-secondary">No orders found.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        )}

        {/* --- PRODUCTS TAB --- */}
        {activeTab === 'products' && (
          <div className="admin-products">
            <section className="admin-section">
              <div className="admin-section-header">
                <h2>Product Catalog</h2>
                <button className="btn btn-primary btn-sm" onClick={openAddProduct}>
                  <Plus size={16} /> Add Product
                </button>
              </div>
              <div className="admin-table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Image</th>
                      <th>Name</th>
                      <th>Category</th>
                      <th>Price</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map(product => (
                      <tr key={product.id}>
                        <td>
                          {product.images && product.images.length > 0 ? (
                            <img src={product.images[0]} alt={product.name} style={{ width: '48px', height: '60px', objectFit: 'cover', borderRadius: '4px' }} />
                          ) : product.image ? (
                            <img src={product.image} alt={product.name} style={{ width: '48px', height: '60px', objectFit: 'cover', borderRadius: '4px' }} />
                          ) : (
                            <div className="admin-product-img" style={{ backgroundColor: product.imageColor }}>
                              <span className="text-caption" style={{ color: 'rgba(255,255,255,0.7)', fontSize: '10px' }}>{product.imageText}</span>
                            </div>
                          )}
                        </td>
                        <td className="font-medium">{product.name}</td>
                        <td className="text-capitalize">{product.category}</td>
                        <td className="font-medium">${product.price.toFixed(2)}</td>
                        <td>
                          <span className={`status-badge ${product.inStock ? 'status-delivered' : 'status-processing'}`}>
                            {product.inStock ? 'In Stock' : 'Out of Stock'}
                          </span>
                        </td>
                        <td>
                          <div className="admin-row-actions">
                            <button className="action-icon-btn edit" onClick={() => openEditProduct(product)} title="Edit Product">
                              <Edit3 size={16} />
                            </button>
                            <button className="action-icon-btn delete" onClick={() => handleDeleteProduct(product)} title="Delete Product">
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {products.length === 0 && (
                      <tr><td colSpan="6" className="text-center py-4 text-secondary">No products found.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        )}

        {/* --- USERS TAB (Admin Only) --- */}
        {activeTab === 'users' && isAdmin && (
          <div className="admin-users">
            <section className="admin-section">
              <div className="admin-section-header">
                <h2>Create System User</h2>
                <p className="text-body-sm text-secondary">Add child users (Listers) who can only manage products.</p>
              </div>

              <div className="admin-form-card">
                {userFormStatus.message && (
                  <div className={`admin-alert ${userFormStatus.type}`}>
                    {userFormStatus.message}
                  </div>
                )}
                <form onSubmit={handleUserSubmit} className="admin-form">
                  <div className="form-row-2">
                    <div className="form-field">
                      <label>Full Name</label>
                      <input type="text" className="form-input" required value={userForm.name} onChange={e => setUserForm({...userForm, name: e.target.value})} placeholder="Jane Doe" />
                    </div>
                    <div className="form-field">
                      <label>Email Address</label>
                      <input type="email" className="form-input" required value={userForm.email} onChange={e => setUserForm({...userForm, email: e.target.value})} placeholder="jane@ecomhutt.com" />
                    </div>
                  </div>
                  <div className="form-row-2">
                    <div className="form-field">
                      <label>Temporary Password</label>
                      <input type="password" className="form-input" required value={userForm.password} onChange={e => setUserForm({...userForm, password: e.target.value})} placeholder="••••••••" />
                    </div>
                    <div className="form-field">
                      <label>Role</label>
                      <select className="form-input" value={userForm.role} onChange={e => setUserForm({...userForm, role: e.target.value})}>
                        <option value="lister">Lister (Products Only)</option>
                        <option value="admin">Administrator (Full Access)</option>
                      </select>
                    </div>
                  </div>
                  <button type="submit" className="btn btn-primary" disabled={userFormStatus.type === 'loading'}>
                    {userFormStatus.type === 'loading' ? 'Creating...' : 'Create User'}
                  </button>
                </form>
              </div>
            </section>
          </div>
        )}

        {/* --- STORE SETTINGS TAB (Admin Only) --- */}
        {activeTab === 'settings' && isAdmin && (
          <div className="admin-settings">
            <section className="admin-section">
              <div className="admin-section-header">
                <h2>Hero Banners</h2>
                <p className="text-body-sm text-secondary">Manage dynamic homepage sliders.</p>
              </div>

              <div className="admin-form-card" style={{ marginBottom: '24px' }}>
                <h3 style={{ marginBottom: '16px', fontSize: '16px' }}>Add New Banner</h3>
                {bannerFormStatus.message && (
                  <div className={`admin-alert ${bannerFormStatus.type}`}>
                    {bannerFormStatus.message}
                  </div>
                )}
                <form onSubmit={async (e) => {
                  e.preventDefault();
                  if (!bannerForm.image) return alert('Please upload an image first');
                  setBannerFormStatus({ type: 'loading', message: 'Saving...' });
                  const res = await createHeroBanner(bannerForm);
                  if (res.success) {
                    setBannerFormStatus({ type: 'success', message: 'Banner created!' });
                    setBannerForm({ title: '', subtitle: '', buttonText: 'Shop Now', buttonLink: '/shop', image: '', isActive: true });
                    loadBanners();
                  } else {
                    setBannerFormStatus({ type: 'error', message: res.message });
                  }
                }} className="admin-form">
                  <div className="form-field">
                    <label>Banner Image</label>
                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                      {bannerForm.image && (
                        <img src={bannerForm.image} alt="Banner Preview" style={{ width: '80px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />
                      )}
                      <input type="file" onChange={(e) => uploadFileHandler(e, false)} required={!bannerForm.image} />
                      {uploadingImage && <span className="text-caption">Uploading...</span>}
                    </div>
                  </div>
                  <div className="form-row-2">
                    <div className="form-field">
                      <label>Main Title</label>
                      <input type="text" className="form-input" required value={bannerForm.title} onChange={e => setBannerForm({...bannerForm, title: e.target.value})} placeholder="e.g. Summer Collection" />
                    </div>
                    <div className="form-field">
                      <label>Subtitle / Description</label>
                      <input type="text" className="form-input" value={bannerForm.subtitle} onChange={e => setBannerForm({...bannerForm, subtitle: e.target.value})} placeholder="e.g. Discover the latest arrivals" />
                    </div>
                  </div>
                  <div className="form-row-2">
                    <div className="form-field">
                      <label>Button Text</label>
                      <input type="text" className="form-input" value={bannerForm.buttonText} onChange={e => setBannerForm({...bannerForm, buttonText: e.target.value})} />
                    </div>
                    <div className="form-field">
                      <label>Button Link</label>
                      <input type="text" className="form-input" value={bannerForm.buttonLink} onChange={e => setBannerForm({...bannerForm, buttonLink: e.target.value})} />
                    </div>
                  </div>
                  <button type="submit" className="btn btn-primary" disabled={bannerFormStatus.type === 'loading' || uploadingImage}>
                    Add Banner
                  </button>
                </form>
              </div>

              <div className="admin-table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Image</th>
                      <th>Title</th>
                      <th>Link</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {heroBanners.map(banner => (
                      <tr key={banner._id}>
                        <td><img src={banner.image} alt="Banner" style={{ width: '60px', height: '30px', objectFit: 'cover', borderRadius: '4px' }} /></td>
                        <td className="font-medium">{banner.title}</td>
                        <td>{banner.buttonLink}</td>
                        <td>
                          <button className="action-icon-btn delete" onClick={async () => {
                            if(window.confirm('Delete banner?')) {
                              await deleteHeroBanner(banner._id);
                              loadBanners();
                            }
                          }}>
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {heroBanners.length === 0 && (
                      <tr><td colSpan="4" className="text-center py-4 text-secondary">No banners configured.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        )}

      </main>

      {/* --- PRODUCT MODAL --- */}
      {isProductModalOpen && (
        <div className="admin-modal-overlay">
          <div className="admin-modal">
            <header className="admin-modal-header">
              <h2>{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
              <button className="admin-modal-close" onClick={() => setIsProductModalOpen(false)}>
                <X size={20} />
              </button>
            </header>
            <div className="admin-modal-body">
              <form id="product-form" onSubmit={handleProductSubmit} className="admin-form">
                <div className="form-field">
                  <label>Product Name</label>
                  <input type="text" className="form-input" required value={productForm.name} onChange={e => setProductForm({...productForm, name: e.target.value})} />
                </div>
                <div className="form-row-2">
                  <div className="form-field">
                    <label>Price ($)</label>
                    <input type="number" step="0.01" min="0" className="form-input" required value={productForm.price} onChange={e => setProductForm({...productForm, price: e.target.value})} />
                  </div>
                  <div className="form-field">
                    <label>Category</label>
                    <input type="text" className="form-input" required value={productForm.category} onChange={e => setProductForm({...productForm, category: e.target.value})} placeholder="e.g. Electronics, Clothing..." list="category-suggestions" />
                    <datalist id="category-suggestions">
                      <option value="Electronics" />
                      <option value="Clothing" />
                      <option value="Home & Garden" />
                      <option value="Accessories" />
                    </datalist>
                  </div>
                </div>
                
                <div className="form-field">
                  <label>Product Images (Max 3)</label>
                  <div className="admin-image-upload-wrapper">
                    <div className="admin-image-preview-grid">
                      {productForm.images && productForm.images.length > 0 ? (
                        productForm.images.map((img, idx) => (
                          <div key={idx} className="admin-image-preview-item">
                            <img src={img} alt={`Preview ${idx + 1}`} />
                            <button type="button" className="admin-image-remove-btn" onClick={() => {
                              const newImages = [...productForm.images];
                              newImages.splice(idx, 1);
                              setProductForm({...productForm, images: newImages});
                            }}><X size={14} /></button>
                          </div>
                        ))
                      ) : (
                        <div className="admin-image-placeholder" style={{ backgroundColor: productForm.imageColor || '#eee' }}>
                          No Img
                        </div>
                      )}
                    </div>
                    <div className="admin-image-input-container">
                      {(!productForm.images || productForm.images.length < 3) && (
                        <input type="file" multiple accept="image/*" onChange={(e) => uploadFileHandler(e, true)} />
                      )}
                      {uploadingImage && <span className="text-caption text-secondary">Uploading...</span>}
                    </div>
                  </div>
                </div>

                <div className="form-row-2">
                  <div className="form-field">
                    <label>Fallback Color (Hex)</label>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <input type="color" value={productForm.imageColor} onChange={e => setProductForm({...productForm, imageColor: e.target.value})} style={{ width: '40px', height: '40px', padding: '0', border: 'none', cursor: 'pointer', borderRadius: '4px' }} />
                      <input type="text" className="form-input" required value={productForm.imageColor} onChange={e => setProductForm({...productForm, imageColor: e.target.value})} style={{ flex: 1 }} />
                    </div>
                  </div>
                  <div className="form-field">
                    <label>Fallback Text</label>
                    <input type="text" className="form-input" value={productForm.imageText} onChange={e => setProductForm({...productForm, imageText: e.target.value})} placeholder="e.g. IMG_01" />
                  </div>
                </div>
                <div className="form-field">
                  <label>Description</label>
                  <textarea className="form-input" rows="3" value={productForm.description} onChange={e => setProductForm({...productForm, description: e.target.value})}></textarea>
                </div>
                <div className="form-field" style={{ flexDirection: 'row', alignItems: 'center', gap: '12px' }}>
                  <input type="checkbox" id="inStock" checked={productForm.inStock} onChange={e => setProductForm({...productForm, inStock: e.target.checked})} style={{ width: '18px', height: '18px', accentColor: 'var(--color-primary)' }} />
                  <label htmlFor="inStock" style={{ margin: 0, cursor: 'pointer' }}>Item is currently in stock</label>
                </div>
              </form>
            </div>
            <footer className="admin-modal-footer">
              <button className="btn btn-secondary" onClick={() => setIsProductModalOpen(false)}>Cancel</button>
              <button type="submit" form="product-form" className="btn btn-primary">
                {editingProduct ? 'Save Changes' : 'Create Product'}
              </button>
            </footer>
          </div>
        </div>
      )}
    </div>
  );
}
