'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Package, Truck, CheckCircle, Clock, ArrowLeft } from 'lucide-react';
import { PayPalButtons } from '@paypal/react-paypal-js';
import { useShop } from '@/context/ShopContext';
import { cn } from '@/lib/utils';

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
  const { id } = params;
  const router = useRouter();
  const { orders, payOrder } = useShop();

  const order = orders.find((o) => (o.id === id || o._id === id));

  if (!order) {
    return (
      <div className="min-h-screen bg-zinc-950 pt-36 pb-24 flex flex-col items-center justify-center text-center space-y-5">
        <Package size={36} className="text-zinc-600" />
        <h2 className="text-2xl font-bold text-white">Order Not Found</h2>
        <p className="text-sm text-zinc-400">We couldn&apos;t find an order with ID <strong>{id}</strong>.</p>
        <Link href="/dashboard" className="px-6 py-3 bg-white text-zinc-950 rounded-xl font-bold text-sm hover:bg-zinc-200">Back to Dashboard</Link>
      </div>
    );
  }

  const currentStep = getStepIndex(order.status);
  const items = order.orderItems || order.items || [];
  const orderDate = order.createdAt || order.date;
  const orderTotal = order.totalPrice || order.total || 0;

  return (
    <div className="min-h-screen bg-zinc-950 pt-28 pb-24 text-zinc-100">
      <div className="max-w-6xl mx-auto px-6 space-y-10">
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-400 hover:text-white transition-colors">
          <ArrowLeft size={14} /> Back to Dashboard
        </Link>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-zinc-500 mb-1">Order {order.trackingNumber || String(order.id || id).slice(-8).toUpperCase()}</p>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">Order Tracking</h1>
          </div>
          <span className={cn('px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest border self-start', order.isPaid ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20')}>
            {order.isPaid ? 'Paid' : (order.status || 'Processing')}
          </span>
        </div>

        {/* Timeline */}
        <div className="glass-panel rounded-3xl border border-zinc-800/80 p-8">
          <div className="flex items-start justify-between relative">
            {/* Connector line */}
            <div className="absolute top-6 left-[calc(12.5%)] right-[calc(12.5%)] h-px bg-zinc-800 z-0" />
            <div
              className="absolute top-6 left-[calc(12.5%)] h-px bg-white z-0 transition-all duration-500"
              style={{ width: `${(currentStep / (TRACKING_STEPS.length - 1)) * 75}%` }}
            />

            {TRACKING_STEPS.map((step, index) => {
              const Icon = step.icon;
              const isCompleted = index <= currentStep;
              const isCurrent = index === currentStep;
              return (
                <div key={step.key} className="flex flex-col items-center gap-3 z-10 flex-1">
                  <div className={cn('w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all', isCompleted ? 'bg-white border-white text-zinc-950' : 'bg-zinc-900 border-zinc-700 text-zinc-500', isCurrent && 'ring-4 ring-white/20')}>
                    <Icon size={18} />
                  </div>
                  <span className={cn('text-xs font-semibold text-center hidden sm:block', isCompleted ? 'text-white' : 'text-zinc-600')}>{step.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Order Details */}
          <div className="glass-panel rounded-3xl border border-zinc-800/80 p-8 space-y-5">
            <h3 className="text-lg font-bold text-white">Order Details</h3>
            {[
              ['Order ID', order.trackingNumber || String(order.id || id).slice(-8).toUpperCase()],
              ['Date Placed', new Date(orderDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })],
              ['Tracking Number', order.trackingNumber || '—'],
              ['Shipping', order.shippingMethod === 'express' ? 'Express (1–2 days)' : 'Standard (3–5 days)'],
              ['Payment', order.isPaid ? '✅ Paid' : '⏳ Pending'],
            ].map(([label, value]) => (
              <div key={label} className="flex justify-between items-center text-sm border-b border-zinc-900/80 pb-4 last:border-0 last:pb-0">
                <span className="text-zinc-500">{label}</span>
                <span className="font-semibold text-white">{value}</span>
              </div>
            ))}
          </div>

          {/* Order Items */}
          <div className="glass-panel rounded-3xl border border-zinc-800/80 p-8 space-y-5">
            <h3 className="text-lg font-bold text-white">Items ({items.length})</h3>
            <div className="space-y-4 max-h-64 overflow-y-auto pr-1">
              {items.map((item, idx) => (
                <div key={`${item.product || item.id}-${idx}`} className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-zinc-800 overflow-hidden flex items-center justify-center shrink-0">
                    {item.image ? <img src={item.image} alt={item.name} className="w-full h-full object-cover" /> : <span className="text-xs text-zinc-500 font-bold">{item.name?.charAt(0)}</span>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white truncate">{item.name}</p>
                    <p className="text-xs text-zinc-500">Qty: {item.quantity}{item.size ? ` · ${item.size}` : ''}</p>
                  </div>
                  <span className="text-sm font-bold text-white">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="pt-4 border-t border-zinc-900 flex justify-between items-center">
              <span className="font-bold text-white">Total</span>
              <span className="text-xl font-extrabold text-white">${orderTotal.toFixed(2)}</span>
            </div>

            {/* Retry PayPal if not paid */}
            {!order.isPaid && (
              <div className="pt-4">
                <p className="text-sm font-bold text-white mb-4">Complete Payment</p>
                <PayPalButtons
                  style={{ layout: 'vertical', color: 'gold', shape: 'rect', label: 'pay', height: 45 }}
                  createOrder={(data, actions) =>
                    actions.order.create({ purchase_units: [{ amount: { value: orderTotal.toFixed(2) } }] })
                  }
                  onApprove={async (data, actions) => {
                    try {
                      const details = await actions.order.capture();
                      await payOrder(order.id || order._id, {
                        id: details.id, status: details.status, update_time: details.update_time,
                        payer: { email_address: details.payer.email_address },
                      });
                      router.push(`/payment/success?orderId=${order.id || order._id}&tracking=${order.trackingNumber}&total=${orderTotal}`);
                    } catch {
                      router.push('/payment/failure');
                    }
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
