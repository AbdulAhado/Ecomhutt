import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';

import ScrollToTop from './components/ScrollToTop';
import Layout from './components/Layout/Layout';
import Home from './pages/Home/Home';
import Shop from './pages/Shop/Shop';
import ProductDetail from './pages/ProductDetail/ProductDetail';
import Cart from './pages/Cart/Cart';
import Checkout from './pages/Checkout/Checkout';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import VerifyOTP from './pages/Auth/VerifyOTP';
import ForgotPassword from './pages/Auth/ForgotPassword';
import ResetPassword from './pages/Auth/ResetPassword';
import Wishlist from './pages/Wishlist/Wishlist';
import Dashboard from './pages/Dashboard/Dashboard';
import OrderTracking from './pages/OrderTracking/OrderTracking';
import PaymentSuccess from './pages/PaymentResult/PaymentSuccess';
import PaymentFailure from './pages/PaymentResult/PaymentFailure';
import AdminDashboard from './pages/Admin/AdminDashboard';
import NotFound from './pages/NotFound/NotFound';
import TrackOrderLookup from './pages/OrderTracking/TrackOrderLookup';
import InfoPage from './pages/Info/InfoPage';
import AboutUs from './pages/About/AboutUs';
import Faq from './pages/Info/Faq';
import Contact from './pages/Info/Contact';
import Logo from './components/Logo/Logo';

import './App.css';

function App() {
  const [clientId, setClientId] = useState('');

  useEffect(() => {
    const getClientId = async () => {
      try {
        const { data } = await axios.get('/api/config/paypal');
        setClientId(data);
      } catch (err) {
        console.error('Error fetching paypal client id', err);
      }
    };
    getClientId();
  }, []);

  return (
    <Router>
      <ScrollToTop />
      {clientId ? (
        <PayPalScriptProvider options={{ "client-id": clientId }}>
          <Routes>
            {/* Auth routes — no layout wrapper */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/verify-otp" element={<VerifyOTP />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            {/* Admin routes */}
            <Route path="/admin" element={<AdminDashboard />} />

            {/* Main routes with shared layout */}
            <Route element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/wishlist" element={<Wishlist />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/order/track" element={<TrackOrderLookup />} />
              <Route path="/order/:id" element={<OrderTracking />} />
              <Route path="/shipping-returns" element={<InfoPage />} />
              <Route path="/about" element={<AboutUs />} />
              <Route path="/sustainability" element={<InfoPage />} />
              <Route path="/careers" element={<InfoPage />} />
              <Route path="/stores" element={<InfoPage />} />
              <Route path="/faq" element={<Faq />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/payment/success" element={<PaymentSuccess />} />
              <Route path="/payment/failure" element={<PaymentFailure />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </PayPalScriptProvider>
      ) : (
        <div className="global-loading-screen" style={{
          height: '100vh',
          width: '100vw',
          backgroundColor: '#0f1011',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#ffffff',
          position: 'fixed',
          top: 0,
          left: 0,
          zIndex: 9999
        }}>
          <div className="loader-logo" style={{ marginBottom: '20px' }}>
            <Logo lightMode={true} style={{ height: '48px' }} />
          </div>
          <div className="spinner" style={{
            width: '40px',
            height: '40px',
            border: '3px solid rgba(255,255,255,0.1)',
            borderTop: '3px solid #ffffff',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}></div>
          <style>{`
            @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
          `}</style>
        </div>
      )}
    </Router>
  );
}

export default App;
