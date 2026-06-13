import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const ShopContext = createContext();

export function ShopProvider({ children }) {
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('ether_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [wishlist, setWishlist] = useState(() => {
    const saved = localStorage.getItem('ether_wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('ether_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);

  // Global axios interceptor: auto-logout on 401 (expired/invalid token)
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Token is invalid or user no longer exists — clear session
          const msg = error.response?.data?.message || '';
          if (
            msg.includes('no longer exists') ||
            msg.includes('token invalid') ||
            msg.includes('token failed') ||
            msg.includes('Please log in again')
          ) {
            setUser(null);
            localStorage.removeItem('ether_user');
            // Redirect to login
            window.location.href = '/login';
          }
        }
        return Promise.reject(error);
      }
    );
    return () => axios.interceptors.response.eject(interceptor);
  }, []);

  // Fetch products
  useEffect(() => {
    fetchProductsFromAPI();
  }, []);

  const fetchProductsFromAPI = async () => {
    try {
      const { data } = await axios.get('/api/products');
      setProducts(data.map(p => ({ ...p, id: String(p._id) })));
    } catch (error) {
      console.error('Error fetching products', error);
    }
  };

  const refreshProducts = async () => {
    await fetchProductsFromAPI();
  };

  // Fetch orders when user changes
  useEffect(() => {
    const fetchOrders = async () => {
      if (user && user.token) {
        try {
          const config = { headers: { Authorization: `Bearer ${user.token}` } };
          const { data } = await axios.get('/api/orders/myorders', config);
          setOrders(data.map(o => ({ ...o, id: o._id })));
        } catch (error) {
          console.error('Error fetching orders', error);
        }
      } else {
        setOrders([]);
      }
    };
    fetchOrders();
  }, [user]);

  useEffect(() => {
    localStorage.setItem('ether_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('ether_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('ether_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('ether_user');
    }
  }, [user]);

  const addToCart = (productId, quantity = 1, selectedSize = null) => {
    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex(
        (item) => item.id === productId && item.size === selectedSize
      );

      if (existingIndex > -1) {
        const newCart = [...prevCart];
        newCart[existingIndex].quantity += quantity;
        return newCart;
      }

      const product = products.find((p) => p.id === productId);
      if (!product) return prevCart; // Safety check
      
      return [...prevCart, { ...product, quantity, size: selectedSize }];
    });
  };

  const removeFromCart = (productId, selectedSize = null) => {
    setCart((prevCart) =>
      prevCart.filter((item) => !(item.id === productId && item.size === selectedSize))
    );
  };

  const updateCartQuantity = (productId, selectedSize = null, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId, selectedSize);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === productId && item.size === selectedSize
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => setCart([]);

  const toggleWishlist = (productId) => {
    setWishlist((prevWishlist) => {
      if (prevWishlist.includes(productId)) {
        return prevWishlist.filter((id) => id !== productId);
      } else {
        return [...prevWishlist, productId];
      }
    });
  };

  const login = async (email, password) => {
    try {
      const config = { headers: { 'Content-Type': 'application/json' } };
      const { data } = await axios.post('/api/users/login', { email, password }, config);
      setUser(data);
      localStorage.setItem('ether_user', JSON.stringify(data));
      return { success: true, user: data };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Login failed',
        notVerified: error.response?.data?.notVerified || false,
        email: error.response?.data?.email || email
      };
    }
  };

  const updateUserProfile = async (userData) => {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`
        }
      };
      const { data } = await axios.put('/api/users/profile', userData, config);
      setUser(data);
      localStorage.setItem('ether_user', JSON.stringify(data));
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Update failed' };
    }
  };

  const register = async (name, email, password) => {
    try {
      const config = { headers: { 'Content-Type': 'application/json' } };
      await axios.post('/api/users', { name, email, password }, config);
      // Do not set user here, they must verify OTP first
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Registration failed' };
    }
  };

  const verifyOTP = async (email, otp) => {
    try {
      const config = { headers: { 'Content-Type': 'application/json' } };
      const { data } = await axios.post('/api/users/verify-otp', { email, otp }, config);
      setUser(data);
      localStorage.setItem('ether_user', JSON.stringify(data));
      return { success: true, user: data };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Verification failed' };
    }
  };

  const resendOTP = async (email) => {
    try {
      const config = { headers: { 'Content-Type': 'application/json' } };
      await axios.post('/api/users/resend-otp', { email }, config);
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Failed to resend OTP' };
    }
  };

  const forgotPassword = async (email) => {
    try {
      const config = { headers: { 'Content-Type': 'application/json' } };
      await axios.post('/api/users/forgot-password', { email }, config);
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Failed to send OTP' };
    }
  };

  const resetPassword = async (email, otp, newPassword) => {
    try {
      const config = { headers: { 'Content-Type': 'application/json' } };
      await axios.post('/api/users/reset-password', { email, otp, newPassword }, config);
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Reset password failed' };
    }
  };

  const logout = () => {
    setUser(null);
  };

  const placeOrder = async (billingDetails, shippingMethod) => {
    if (!user) return null;
    
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`
        }
      };

      const orderItems = cart.map(item => ({
        name: item.name,
        quantity: item.quantity,
        size: item.size,
        imageColor: item.imageColor,
        price: item.price,
        product: item.id
      }));

      const subtotal = getCartSubtotal();
      const shipping = shippingMethod === 'express' ? 25.00 : (subtotal > 150 ? 0.00 : 15.00);
      const tax = subtotal * 0.08;

      const orderData = {
        orderItems,
        shippingAddress: {
          firstName: billingDetails.firstName,
          lastName: billingDetails.lastName,
          address: billingDetails.address,
          city: billingDetails.city,
          postalCode: billingDetails.zip,
          country: billingDetails.country || 'United States'
        },
        shippingMethod,
        paymentMethod: 'PayPal',
        itemsPrice: subtotal,
        taxPrice: tax,
        shippingPrice: shipping,
        totalPrice: subtotal + tax + shipping
      };

      const { data } = await axios.post('/api/orders', orderData, config);
      
      const newOrder = { ...data, id: data._id };
      setOrders([newOrder, ...orders]);
      clearCart();
      return newOrder;
    } catch (error) {
      console.error('Error placing order', error);
      throw error;
    }
  };

  const payOrder = async (orderId, paymentResult) => {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`
        }
      };
      const { data } = await axios.put(`/api/orders/${orderId}/pay`, paymentResult, config);
      const updatedOrder = { ...data, id: data._id };
      setOrders(orders.map(o => o.id === orderId ? updatedOrder : o));
      return updatedOrder;
    } catch (error) {
      console.error('Error paying order', error);
      throw error;
    }
  };

  const createProduct = async (productData) => {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`
        }
      };
      const { data } = await axios.post(`/api/products`, productData, config);
      const newProduct = { ...data, id: data._id };
      setProducts([...products, newProduct]);
      return newProduct;
    } catch (error) {
      console.error('Error creating product', error);
      throw error;
    }
  };

  const updateProduct = async (productId, productData) => {
    try {
      const id = String(productId);
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`
        }
      };
      const { data } = await axios.put(`/api/products/${id}`, productData, config);
      const updatedProduct = { ...data, id: data._id };
      setProducts(products.map(p => p.id === id || String(p._id) === id ? updatedProduct : p));
      return updatedProduct;
    } catch (error) {
      console.error('Error updating product', error);
      throw error;
    }
  };

  const deleteProduct = async (productId) => {
    try {
      const id = String(productId);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      };
      await axios.delete(`/api/products/${id}`, config);
      setProducts(products.filter(p => String(p._id) !== id && p.id !== id));
    } catch (error) {
      console.error('Error deleting product', error);
      throw error;
    }
  };

  const createAdminUser = async (userData) => {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`
        }
      };
      const { data } = await axios.post(`/api/users/create`, userData, config);
      return { success: true, data };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Failed to create user' };
    }
  };

  const getHeroBanners = async () => {
    try {
      const { data } = await axios.get('/api/herobanners');
      return data;
    } catch (error) {
      console.error('Error fetching hero banners', error);
      return [];
    }
  };

  const createHeroBanner = async (bannerData) => {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`
        }
      };
      const { data } = await axios.post(`/api/herobanners`, bannerData, config);
      return { success: true, data };
    } catch (error) {
      console.error('Error creating hero banner', error);
      return { success: false, message: error.response?.data?.message || 'Failed to create banner' };
    }
  };

  const deleteHeroBanner = async (id) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      };
      await axios.delete(`/api/herobanners/${id}`, config);
      return { success: true };
    } catch (error) {
      console.error('Error deleting hero banner', error);
      return { success: false, message: error.response?.data?.message || 'Failed to delete banner' };
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`
        }
      };
      const { data } = await axios.put(`/api/orders/${orderId}/status`, { status }, config);
      setOrders(orders.map(o => o.id === orderId ? { ...data, id: data._id } : o));
      return { success: true, data };
    } catch (error) {
      console.error('Error updating order status', error);
      return { success: false, message: error.response?.data?.message || 'Failed to update status' };
    }
  };

  const getOrderByTracking = async (trackingNumber) => {
    try {
      const { data } = await axios.get(`/api/orders/track/${trackingNumber}`);
      return { success: true, data };
    } catch (error) {
      console.error('Error fetching order by tracking', error);
      return { success: false, message: error.response?.data?.message || 'Order not found' };
    }
  };

  const getCartSubtotal = () => {
    return cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  };

  const getCartCount = () => {
    return cart.reduce((acc, item) => acc + item.quantity, 0);
  };

  return (
    <ShopContext.Provider
      value={{
        products,
        cart,
        wishlist,
        user,
        orders,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        toggleWishlist,
        login,
        register,
        logout,
        updateUserProfile,
        placeOrder,
        payOrder,
        getCartSubtotal,
        getCartCount,
        createProduct,
        updateProduct,
        deleteProduct,
        createAdminUser,
        refreshProducts,
        getHeroBanners,
        createHeroBanner,
        deleteHeroBanner,
        updateOrderStatus,
        getOrderByTracking,
        verifyOTP,
        resendOTP,
        forgotPassword,
        resetPassword,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
}

export function useShop() {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
}
