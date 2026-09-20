'use client';

import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { CheckCircle2, Clock, AlertCircle, Package, ArrowRight, Loader2, RefreshCw } from 'lucide-react';
import { useShop } from '@/context/ShopContext';
import axios from 'axios';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const orderId = searchParams.get('orderId');

  const { user, isLoaded, getOrderByStripeSession, clearCart, refreshOrders } = useShop();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const fetchOrderDetails = async () => {
    if (!isLoaded) return;

    // If user is not yet logged in or state is loading, wait
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError('');

      if (sessionId) {
        // Fetch order details via Stripe Checkout Session
        const data = await getOrderByStripeSession(sessionId);
        if (data) {
          setOrder(data);
          clearCart();
          refreshOrders();
        } else {
          setError('Could not locate order details for this payment session.');
        }
      } else if (orderId) {
        // Fetch order directly by Order ID
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };
        const { data } = await axios.get(`${API_BASE}/orders/${orderId}`, config);
        if (data) {
          setOrder(data);
          clearCart();
          refreshOrders();
        } else {
          setError('Order details could not be found.');
        }
      } else {
        // Neither parameter provided
        setLoading(false);
      }
    } catch (err) {
      console.error('Error fetching order in success page:', err);
      setError(err.response?.data?.message || 'Failed to verify payment status.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (isLoaded) {
      fetchOrderDetails();
    }
  }, [isLoaded, user, sessionId, orderId]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchOrderDetails();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white pt-24 flex flex-col items-center justify-center text-center gap-6 px-6">
        <div className="w-16 h-16 rounded-full bg-zinc-100 flex items-center justify-center">
          <Loader2 size={32} className="animate-spin text-zinc-900" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-zinc-900 mb-2">Verifying Payment Status</h2>
          <p className="text-xs text-zinc-500 max-w-sm mx-auto">
            Please wait while we confirm your transaction with Stripe...
          </p>
        </div>
      </div>
    );
  }

  // If order was retrieved and status is pending
  const isPending = order && !order.isPaid && order.paymentStatus !== 'succeeded';
  const isFailed = order && order.paymentStatus === 'failed';
  const isSuccess = order ? (order.isPaid || order.paymentStatus === 'succeeded') : true;

  return (
    <div className="min-h-screen bg-white pt-[90px] pb-20">
      <div className="max-w-3xl mx-auto px-6 py-12">
        {/* Status Header */}
        <div className="flex flex-col items-center text-center mb-12">
          {isSuccess && (
            <div className="w-20 h-20 bg-zinc-900 text-white flex items-center justify-center mb-6 shadow-sm">
              <CheckCircle2 size={40} className="stroke-[1.5]" />
            </div>
          )}

          {isPending && (
            <div className="w-20 h-20 bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mb-6">
              <Clock size={40} className="stroke-[1.5]" />
            </div>
          )}

          {isFailed && (
            <div className="w-20 h-20 bg-red-50 border border-red-200 text-red-600 flex items-center justify-center mb-6">
              <AlertCircle size={40} className="stroke-[1.5]" />
            </div>
          )}

          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-400 mb-2">
            {isSuccess ? 'Payment Confirmed' : isPending ? 'Payment Processing' : 'Payment Failed'}
          </p>

          <h1 className="text-4xl md:text-5xl font-bold text-zinc-900 tracking-tight mb-4">
            {isSuccess ? 'Thank you for your order!' : isPending ? 'Awaiting Payment Confirmation' : 'Payment Not Completed'}
          </h1>

          <p className="text-sm text-zinc-500 max-w-md mx-auto leading-relaxed">
            {isSuccess && 'Your payment was processed successfully. A confirmation email with your order summary has been sent to your email address.'}
            {isPending && 'Your payment is currently being processed. This may take a few moments. Use the button below to check again.'}
            {isFailed && 'We were unable to complete your payment. Please try again with a different card or contact your bank.'}
          </p>

          {isPending && (
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 border border-zinc-300 text-xs font-semibold text-zinc-800 hover:bg-zinc-50 transition-colors disabled:opacity-50"
            >
              <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />
              {refreshing ? 'Checking status...' : 'Check Status Again'}
            </button>
          )}
        </div>

        {/* Order Details Card */}
        {order && (
          <div className="border border-zinc-200 bg-[#fbfbfb] p-6 md:p-8 mb-10">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-zinc-200">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-zinc-400 block mb-1">
                  Tracking Number
                </span>
                <span className="text-base font-bold text-zinc-900 tracking-wide font-mono">
                  {order.trackingNumber || String(order._id).slice(-8).toUpperCase()}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase font-bold tracking-widest text-zinc-400 block mb-1">
                  Payment Status
                </span>
                <span
                  className={`inline-flex items-center px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${
                    isSuccess
                      ? 'bg-emerald-100 text-emerald-800'
                      : isPending
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {isSuccess ? 'Paid' : order.paymentStatus || 'Pending'}
                </span>
              </div>
            </div>

            {/* Items Summary */}
            {order.orderItems && order.orderItems.length > 0 && (
              <div className="py-6 border-b border-zinc-200">
                <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-4">
                  Purchased Items ({order.orderItems.length})
                </h3>
                <div className="flex flex-col gap-4">
                  {order.orderItems.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-14 bg-zinc-200 shrink-0 overflow-hidden">
                          {(item.image || (item.product && item.product.image)) && (
                            <Image
                              src={item.image || item.product.image}
                              alt={item.name}
                              fill
                              className="object-cover"
                              sizes="48px"
                            />
                          )}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-zinc-900 line-clamp-1">{item.name}</p>
                          <p className="text-[11px] text-zinc-500">
                            Qty: {item.quantity} {item.size ? `· Size ${item.size}` : ''}
                          </p>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-zinc-900">
                        ${((item.price || 0) * (item.quantity || 1)).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Pricing Summary */}
            <div className="pt-6 flex flex-col gap-2 text-xs">
              {order.itemsPrice !== undefined && (
                <div className="flex justify-between text-zinc-500">
                  <span>Items Subtotal</span>
                  <span className="font-semibold text-zinc-900">${Number(order.itemsPrice).toFixed(2)}</span>
                </div>
              )}
              {order.shippingPrice !== undefined && (
                <div className="flex justify-between text-zinc-500">
                  <span>Shipping</span>
                  <span className="font-semibold text-zinc-900">
                    {order.shippingPrice === 0 ? 'Free' : `$${Number(order.shippingPrice).toFixed(2)}`}
                  </span>
                </div>
              )}
              <div className="flex justify-between text-sm font-bold text-zinc-900 pt-3 border-t border-zinc-200">
                <span>Total Paid</span>
                <span className="text-base">${Number(order.totalPrice || 0).toFixed(2)}</span>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="p-4 mb-8 bg-zinc-50 border border-zinc-200 text-xs text-zinc-600 text-center">
            {error}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          {order && (
            <Link
              href={`/order/${order._id}`}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-zinc-900 text-white text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-zinc-800 transition-colors text-center"
            >
              <Package size={14} /> View Order Tracking
            </Link>
          )}

          <Link
            href="/shop"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 border border-zinc-300 text-zinc-900 text-[10px] font-bold uppercase tracking-[0.2em] hover:border-zinc-900 transition-colors text-center"
          >
            Continue Shopping <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white pt-24 flex flex-col items-center justify-center text-center gap-4">
          <Loader2 size={32} className="animate-spin text-zinc-900" />
          <p className="text-xs text-zinc-400 uppercase tracking-widest">Loading Order Information...</p>
        </div>
      }
    >
      <PaymentSuccessContent />
    </Suspense>
  );
}
