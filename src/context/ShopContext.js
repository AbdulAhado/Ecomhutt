'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const ShopContext = createContext();

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Send cookies with every request
axios.defaults.withCredentials = true;

export function ShopProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load local storage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('ether_cart');
      if (savedCart) setCart(JSON.parse(savedCart));

      const savedWishlist = localStorage.getItem('ether_wishlist');
      if (savedWishlist) setWishlist(JSON.parse(savedWishlist));

      const savedUser = localStorage.getItem('ether_user');
      if (savedUser) setUser(JSON.parse(savedUser));
    } catch (e) {
      console.error('Error loading stored state:', e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Sync to local storage and backend if user is logged in
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem('ether_cart', JSON.stringify(cart));
      if (user && user.token) {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        axios.post(`${API_BASE}/users/cart`, { cart }, config).catch(e => console.error('Cart sync failed', e));
      }
    } catch (e) { }
  }, [cart, isLoaded, user]);

  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem('ether_wishlist', JSON.stringify(wishlist));
    } catch (e) { }
  }, [wishlist, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    try {
      if (user) {
        localStorage.setItem('ether_user', JSON.stringify(user));
      } else {
        localStorage.removeItem('ether_user');
      }
    } catch (e) { }
  }, [user, isLoaded]);

  // Fetch orders when user changes
  useEffect(() => {
    const fetchOrders = async () => {
      if (user && user.token) {
        try {
          const config = { headers: { Authorization: `Bearer ${user.token}` } };
          const { data } = await axios.get(`${API_BASE}/orders/myorders`, config);
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

  const addToCart = (productId, quantity = 1, selectedSize = null, productData = null) => {
    if (!user) {
      if (typeof window !== 'undefined') window.location.href = '/login?redirect=cart';
      return;
    }
    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex(
        (item) => (item.id === productId || item._id === productId) && item.size === selectedSize
      );

      if (existingIndex > -1) {
        const newCart = [...prevCart];
        newCart[existingIndex].quantity += quantity;
        return newCart;
      }

      if (!productData) return prevCart;

      return [...prevCart, { ...productData, id: productId, _id: productId, quantity, size: selectedSize }];
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
    if (!user) {
      if (typeof window !== 'undefined') window.location.href = '/login?redirect=wishlist';
      return;
    }
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
      const { data } = await axios.post(`${API_BASE}/users/login`, { email, password }, config);
      setUser(data);
      if (data.cart && data.cart.length > 0) {
        setCart(data.cart);
      }
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
      const { data } = await axios.put(`${API_BASE}/users/profile`, userData, config);
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
      await axios.post(`${API_BASE}/users`, { name, email, password }, config);
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Registration failed' };
    }
  };

  const verifyOTP = async (email, otp) => {
    try {
      const config = { headers: { 'Content-Type': 'application/json' } };
      const { data } = await axios.post(`${API_BASE}/users/verify-otp`, { email, otp }, config);
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
      await axios.post(`${API_BASE}/users/resend-otp`, { email }, config);
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Failed to resend OTP' };
    }
  };

  const forgotPassword = async (email) => {
    try {
      const config = { headers: { 'Content-Type': 'application/json' } };
      await axios.post(`${API_BASE}/users/forgot-password`, { email }, config);
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Failed to send OTP' };
    }
  };

  const resetPassword = async (email, otp, newPassword) => {
    try {
      const config = { headers: { 'Content-Type': 'application/json' } };
      await axios.post(`${API_BASE}/users/reset-password`, { email, otp, newPassword }, config);
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Reset password failed' };
    }
  };

  const logout = async () => {
    try {
      await axios.post(`${API_BASE}/users/logout`);
    } catch (e) {
      console.error('Logout failed', e);
    }
    setUser(null);
    localStorage.removeItem('ether_user');
    window.location.href = '/login';
  };

  // Add axios interceptor to automatically logout on 401
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          logout();
        }
        return Promise.reject(error);
      }
    );
    return () => axios.interceptors.response.eject(interceptor);
  }, []);

  const placeOrder = async (billingDetails, shippingMethod) => {
    if (!user) return null;
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`
        }
      };
      const orderData = {
        orderItems: cart.map(item => ({
          name: item.name,
          qty: item.quantity,
          image: item.image || (item.images && item.images[0]),
          price: item.price,
          product: item.id
        })),
        shippingAddress: billingDetails,
        paymentMethod: 'PayPal',
        itemsPrice: getCartSubtotal(),
        shippingPrice: shippingMethod === 'express' ? 15 : 0,
        taxPrice: 0,
        totalPrice: getCartSubtotal() + (shippingMethod === 'express' ? 15 : 0)
      };
      const { data } = await axios.post(`${API_BASE}/orders`, orderData, config);
      clearCart();
      return data;
    } catch (error) {
      console.error('Error placing order', error);
      return null;
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
      const { data } = await axios.put(`${API_BASE}/orders/${orderId}/pay`, paymentResult, config);
      return data;
    } catch (error) {
      console.error('Error paying order', error);
      return null;
    }
  };

  const getCartSubtotal = () => {
    return cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  };

  const getCartCount = () => {
    return cart.reduce((acc, item) => acc + item.quantity, 0);
  };

  const createProduct = async (productData) => {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`
        }
      };
      const { data } = await axios.post(`${API_BASE}/products`, productData, config);
      return { success: true, data };
    } catch (error) {
      console.error('Error creating product', error);
      return { success: false, message: error.response?.data?.message || 'Failed to create product' };
    }
  };

  const updateProduct = async (id, productData) => {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`
        }
      };
      const { data } = await axios.put(`${API_BASE}/products/${id}`, productData, config);
      return { success: true, data };
    } catch (error) {
      console.error('Error updating product', error);
      return { success: false, message: error.response?.data?.message || 'Failed to update product' };
    }
  };

  const deleteProduct = async (id) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      };
      await axios.delete(`${API_BASE}/products/${id}`, config);
      return { success: true };
    } catch (error) {
      console.error('Error deleting product', error);
      return { success: false, message: error.response?.data?.message || 'Failed to delete product' };
    }
  };

  const createAdminUser = async (adminData) => {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`
        }
      };
      const { data } = await axios.post(`${API_BASE}/users/admin`, adminData, config);
      return { success: true, data };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Failed to create admin user' };
    }
  };

  const getHeroBanners = async () => {
    try {
      const { data } = await axios.get(`${API_BASE}/herobanners`);
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
      const { data } = await axios.post(`${API_BASE}/herobanners`, bannerData, config);
      return { success: true, data };
    } catch (error) {
      console.error('Error creating hero banner', error);
      return { success: false, message: error.response?.data?.message || 'Failed to create banner' };
    }
  };

  const updateHeroBanner = async (id, bannerData) => {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`
        }
      };
      const { data } = await axios.put(`${API_BASE}/herobanners/${id}`, bannerData, config);
      return { success: true, data };
    } catch (error) {
      console.error('Error updating hero banner', error);
      return { success: false, message: error.response?.data?.message || 'Failed to update banner' };
    }
  };

  const deleteHeroBanner = async (id) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      };
      await axios.delete(`${API_BASE}/herobanners/${id}`, config);
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
      const { data } = await axios.put(`${API_BASE}/orders/${orderId}/status`, { status }, config);
      setOrders(orders.map(o => o.id === orderId ? { ...data, id: data._id } : o));
      return { success: true, data };
    } catch (error) {
      console.error('Error updating order status', error);
      return { success: false, message: error.response?.data?.message || 'Failed to update status' };
    }
  };

  const getOrderByTracking = async (trackingNumber) => {
    try {
      const { data } = await axios.get(`${API_BASE}/orders/track/${trackingNumber}`);
      return { success: true, data };
    } catch (error) {
      console.error('Error fetching order by tracking', error);
      return { success: false, message: error.response?.data?.message || 'Order not found' };
    }
  };

  const getCategories = async () => {
    try {
      const { data } = await axios.get(`${API_BASE}/categories`);
      return data;
    } catch (error) {
      console.error('Error fetching categories', error);
      return [];
    }
  };

  const createCategory = async (categoryData) => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.post(`${API_BASE}/categories`, categoryData, config);
      return { success: true, data };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Failed to create category' };
    }
  };

  const updateCategory = async (id, categoryData) => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.put(`${API_BASE}/categories/${id}`, categoryData, config);
      return { success: true, data };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Failed to update category' };
    }
  };

  const deleteCategory = async (id) => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.delete(`${API_BASE}/categories/${id}`, config);
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Failed to delete category' };
    }
  };

  return (
    <ShopContext.Provider
      value={{
        cart,
        wishlist,
        user,
        orders,
        isLoaded,
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
        getHeroBanners,
        createHeroBanner,
        updateHeroBanner,
        deleteHeroBanner,
        updateOrderStatus,
        getOrderByTracking,
        verifyOTP,
        resendOTP,
        forgotPassword,
        resetPassword,
        getCategories,
        createCategory,
        updateCategory,
        deleteCategory,
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