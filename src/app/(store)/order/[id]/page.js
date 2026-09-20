'use client';

import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Package, Truck, CheckCircle, Clock, ArrowLeft, CreditCard, Loader2, AlertCircle } from 'lucide-react';

import { useShop } from '@/context/ShopContext';
import { cn } from '@/lib/utils';
import axios from 'axios';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const TRACKING_STEPS = [
  { key: 'confirmed', label: 'Order Confirmed', icon: CheckCircle },
  { key: 'processing', label: 'Processing', icon: Package },
  { key: 'shipped', label: 'Shipped', icon: Truck },
  { key: 'delivered', label: 'Delivered', icon: CheckCircle },
];

function getStepIndex(status) {
  const map = { Processing: 1, Shipped: 2, Delivered: 3 };
  return map[status] ?? 0;
}

export default function OrderTrackingPage({ params }) {
  const resolvedParams = params && typeof params.then === 'function' ? use(params) : params;
  const id = resolvedParams?.id;
  const router = useRouter();
  const { user, isLoaded, createStripeCheckout, refreshOrders } = useShop();

  const [fetchedOrder, setFetchedOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stripeLoading, setStripeLoading] = useState(false);
  const [paymentError, setPaymentError] = useState('');

  // Always fetch fresh order data from the server to avoid stale isPaid status
  useEffect(() => {
    if (!isLoaded || !id) return;

    if (!user) {
      setLoading(false);
      return;
    }

    const fetchSingleOrder = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };
        const { data } = await axios.get(`${API_BASE}/orders/${id}`, config);
        setFetchedOrder(data);
        // If the fresh data shows paid, refresh context orders so dashboard stays in sync
        if (data.isPaid) {
          refreshOrders();
        }
      } catch (err) {
        console.error('Error fetching order by ID:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSingleOrder();
  }, [id, isLoaded, user]);

  const order = fetchedOrder;

  const handleStripePay = async () => {
    if (!order) return;
    setStripeLoading(true);
    setPaymentError('');
    try {
      const result = await createStripeCheckout(order._id || order.id);
      if (result && result.url) {
        window.location.href = result.url;
      } else {
        // If createStripeCheckout returns null, the order may already be paid
        // Re-fetch the order to get the latest status
        try {
          const config = { headers: { Authorization: `Bearer ${user.token}` } };
          const { data } = await axios.get(`${API_BASE}/orders/${id}`, config);
          if (data.isPaid) {
            setFetchedOrder(data);
            refreshOrders();
            setPaymentError('');
          } else {
            setPaymentError('Could not initialize Stripe checkout. Please try again.');
          }
        } catch {
          setPaymentError('Could not initialize Stripe checkout. Please try again.');
        }
        setStripeLoading(false);
      }
    } catch (err) {
      console.error('Stripe retry error:', err);
      setPaymentError(err.response?.data?.message || 'Payment initiation failed. Please try again.');
      setStripeLoading(false);
    }
  };

  if (loading && !order) {
    return (
      <div className="min-h-screen bg-white pt-36 pb-24 flex flex-col items-center justify-center text-center space-y-4">
        <Loader2 size={36} className="animate-spin text-zinc-400" />
        <p className="text-xs uppercase tracking-widest text-zinc-400 font-bold">Loading Order Details...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-white pt-36 pb-24 flex flex-col items-center justify-center text-center space-y-4 px-6">
        <AlertCircle size={44} className="text-zinc-300" />
        <h2 className="text-xl font-bold text-zinc-900">Order Not Found</h2>
        <p className="text-xs text-zinc-500 max-w-sm">We could not locate this order. Please verify the URL or check your dashboard.</p>
        <Link href="/dashboard" className="mt-4 px-6 py-3 bg-zinc-900 text-white text-[10px] font-bold uppercase tracking-widest hover:bg-zinc-800 transition-colors">
          Return to Dashboard
        </Link>
      </div>
    );
  }

  const currentStep = getStepIndex(order.status);
  const items = order.orderItems || order.items || [];
  const orderDate = order.createdAt || order.date;
  const orderTotal = order.totalPrice || order.total || 0;

  return (
    <div className="min-h-screen bg-white pt-28 pb-24 text-zinc-900">
      <div className="max-w-6xl mx-auto px-6 space-y-10">
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-500 hover:text-zinc-900 transition-colors">
          <ArrowLeft size={14} /> Back to Dashboard
        </Link>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-zinc-400 mb-1">Order {order.trackingNumber || String(order.id || id).slice(-8).toUpperCase()}</p>
            <h1 className="text-3xl font-extrabold text-zinc-900 tracking-tight">Order Tracking</h1>
          </div>
          <div className="flex items-center gap-3">
            <span className={cn('px-4 py-1.5 text-xs font-bold uppercase tracking-widest border self-start', order.isPaid ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200')}>
              {order.isPaid ? 'Paid' : (order.status || 'Pending Payment')}
            </span>
          </div>
        </div>

        {/* Timeline */}
        <div className="bg-[#f8f8f8] border border-zinc-200 p-8">
          <div className="flex items-start justify-between relative">
            {/* Connector line */}
            <div className="absolute top-6 left-[calc(12.5%)] right-[calc(12.5%)] h-[2px] bg-zinc-200 z-0" />
            <div
              className="absolute top-6 left-[calc(12.5%)] h-[2px] bg-zinc-900 z-0 transition-all duration-500"
              style={{ width: `${(currentStep / (TRACKING_STEPS.length - 1)) * 75}%` }}
            />

            {TRACKING_STEPS.map((step, index) => {
              const Icon = step.icon;
              const isCompleted = index <= currentStep;
              const isCurrent = index === currentStep;
              return (
                <div key={step.key} className="flex flex-col items-center gap-3 z-10 flex-1">
                  <div className={cn('w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all', isCompleted ? 'bg-zinc-900 border-zinc-900 text-white' : 'bg-white border-zinc-300 text-zinc-400', isCurrent && 'ring-4 ring-zinc-200')}>
                    <Icon size={18} />
                  </div>
                  <span className={cn('text-xs font-semibold text-center hidden sm:block', isCompleted ? 'text-zinc-900 font-bold' : 'text-zinc-400')}>{step.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Order Details */}
          <div className="bg-[#f8f8f8] border border-zinc-200 p-8 space-y-5">
            <h3 className="text-base font-bold uppercase tracking-wider text-zinc-900">Order Details</h3>
            {[
              ['Order ID', order.trackingNumber || String(order.id || id).slice(-8).toUpperCase()],
              ['Date Placed', new Date(orderDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })],
              ['Tracking Number', order.trackingNumber || '—'],
              ['Shipping', order.shippingMethod === 'express' ? 'Express (1–2 days)' : 'Standard (3–5 days)'],
              ['Payment Method', order.paymentMethod || 'Stripe'],
              ['Payment Status', order.isPaid ? '✅ Paid' : '⏳ Pending Payment'],
            ].map(([label, value]) => (
              <div key={label} className="flex justify-between items-center text-sm border-b border-zinc-200/80 pb-4 last:border-0 last:pb-0">
                <span className="text-zinc-500">{label}</span>
                <span className="font-semibold text-zinc-900">{value}</span>
              </div>
            ))}
          </div>

          {/* Order Items */}
          <div className="bg-[#f8f8f8] border border-zinc-200 p-8 space-y-5">
            <h3 className="text-base font-bold uppercase tracking-wider text-zinc-900">Items ({items.length})</h3>
            <div className="space-y-4 max-h-64 overflow-y-auto pr-1">
              {items.map((item, idx) => (
                <div key={`${item.product || item.id}-${idx}`} className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white border border-zinc-200 overflow-hidden flex items-center justify-center shrink-0">
                    {item.image ? <img src={item.image} alt={item.name} className="w-full h-full object-cover" /> : <span className="text-xs text-zinc-400 font-bold">{item.name?.charAt(0)}</span>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-zinc-900 truncate">{item.name}</p>
                    <p className="text-xs text-zinc-400">Qty: {item.quantity}{item.size ? ` · ${item.size}` : ''}</p>
                  </div>
                  <span className="text-sm font-bold text-zinc-900">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="pt-4 border-t border-zinc-200 flex justify-between items-center">
              <span className="font-bold text-zinc-900">Total</span>
              <span className="text-xl font-extrabold text-zinc-900">${orderTotal.toFixed(2)}</span>
            </div>

            {/* Payment Section if not paid */}
            {!order.isPaid && (
              <div className="pt-4 space-y-4">
                <div className="p-6 bg-white border border-zinc-200 space-y-3">
                  <p className="text-sm font-bold text-zinc-900">Complete Your Payment</p>
                  <p className="text-xs text-zinc-500">Choose your preferred payment method to finalize this order.</p>

                  {paymentError && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-600 flex items-center gap-2">
                      <AlertCircle size={14} />
                      {paymentError}
                    </div>
                  )}

                  {/* Option 1: Stripe */}
                  <button
                    onClick={handleStripePay}
                    disabled={stripeLoading}
                    className="w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-zinc-900 text-white font-bold text-xs uppercase tracking-widest hover:bg-zinc-800 transition-colors disabled:opacity-60"
                  >
                    {stripeLoading ? (
                      <>
                        <Loader2 size={16} className="animate-spin" /> Redirecting to Stripe...
                      </>
                    ) : (
                      <>
                        <CreditCard size={16} /> Pay ${orderTotal.toFixed(2)} with Stripe
                      </>
                    )}
                  </button>

                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
