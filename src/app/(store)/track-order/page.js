'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Package, Clock, CheckCircle, Truck, MapPin, Search, AlertCircle, Loader2, ArrowRight, ShieldCheck } from 'lucide-react';
import { useShop } from '@/context/ShopContext';

const STATUS_ORDER = ['Processing', 'Shipped', 'In Transit', 'Delivered'];

function getStatusIndex(status) {
  const idx = STATUS_ORDER.findIndex(s => s.toLowerCase() === status?.toLowerCase());
  return idx >= 0 ? idx : 0;
}

const STATUS_ICONS = {
  'processing': Package,
  'shipped': Truck,
  'in transit': MapPin,
  'delivered': CheckCircle,
  'cancelled': AlertCircle,
};

export default function TrackOrderPage() {
  const { getOrderByTracking } = useShop();
  const [orderQuery, setOrderQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [orderResult, setOrderResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!orderQuery.trim()) return;

    setLoading(true);
    setErrorMessage('');
    setOrderResult(null);

    const res = await getOrderByTracking(orderQuery.trim());
    if (res.success) {
      setOrderResult(res.data);
    } else {
      setErrorMessage(res.message || 'No order found with that tracking number or ID.');
    }
    setLoading(false);
  };

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'shipped':
      case 'in transit':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'cancelled':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-amber-50 text-amber-700 border-amber-200';
    }
  };

  const currentStatusIdx = orderResult ? getStatusIndex(orderResult.status) : 0;
  const hasTrackingHistory = orderResult?.trackingHistory?.length > 0;

  return (
    <div className="min-h-screen bg-white pt-[90px]">
      <div className="max-w-[800px] mx-auto px-6 md:px-12 py-20">

        {/* Header */}
        <div className="mb-16 border-b border-zinc-100 pb-10">
          <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-zinc-400 block mb-4">EcomHutt</span>
          <h1 className="text-5xl font-bold text-zinc-900 tracking-tight">Track Your Order</h1>
          <p className="text-sm text-zinc-500 mt-4 max-w-md">
            Enter your Order ID or Tracking Code (e.g. ETH-XXXXX) below to get live status updates.
          </p>
        </div>

        {/* Search */}
        <form onSubmit={handleSubmit} className="flex items-center gap-4 mb-12 border-b-2 border-zinc-900 pb-3">
          <input
            type="text"
            value={orderQuery}
            onChange={(e) => setOrderQuery(e.target.value)}
            placeholder="Enter Order ID or Tracking Code..."
            required
            className="flex-1 bg-transparent text-base text-zinc-900 placeholder-zinc-300 focus:outline-none font-medium"
          />
          <button
            type="submit"
            disabled={loading}
            className="shrink-0 py-2.5 px-7 bg-zinc-900 text-white text-[9px] font-bold uppercase tracking-[0.2em] hover:bg-zinc-800 transition-colors flex items-center gap-2"
          >
            {loading ? <Loader2 size={13} className="animate-spin" /> : <Search size={13} />}
            Track
          </button>
        </form>

        {/* Error State */}
        {errorMessage && (
          <div className="p-4 bg-red-50 border border-red-100 text-xs font-semibold text-red-600 flex items-center gap-3 mb-10">
            <AlertCircle size={16} />
            {errorMessage}
          </div>
        )}

        {/* Order Result */}
        {orderResult && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Order Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-zinc-100">
              <div>
                <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-400 mb-1">Tracking Code</p>
                <p className="text-base font-bold text-zinc-900">{orderResult.trackingNumber || orderResult._id}</p>
                <p className="text-[10px] text-zinc-400 font-medium mt-1">Placed on {new Date(orderResult.createdAt).toLocaleDateString()}</p>
              </div>
              <span className={`self-start sm:self-auto px-4 py-2 text-[9px] font-bold uppercase tracking-widest border ${getStatusBadge(orderResult.status)}`}>
                {orderResult.status || (orderResult.isDelivered ? 'Delivered' : 'Processing')}
              </span>
            </div>

            {/* Progress Bar */}
            <div className="mb-10">
              <div className="flex items-center justify-between relative">
                {/* Background line */}
                <div className="absolute top-[18px] left-0 right-0 h-[2px] bg-zinc-100 z-0" />
                {/* Progress line */}
                <div 
                  className="absolute top-[18px] left-0 h-[2px] bg-zinc-900 z-[1] transition-all duration-700" 
                  style={{ width: `${(currentStatusIdx / (STATUS_ORDER.length - 1)) * 100}%` }} 
                />
                
                {STATUS_ORDER.map((s, i) => {
                  const done = i <= currentStatusIdx;
                  const Icon = STATUS_ICONS[s.toLowerCase()] || Package;
                  return (
                    <div key={s} className="flex flex-col items-center z-[2]">
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${done ? 'bg-zinc-900 border-zinc-900 text-white scale-110' : 'bg-white border-zinc-200 text-zinc-300'}`}>
                        <Icon size={15} />
                      </div>
                      <span className={`text-[10px] font-bold mt-2 ${done ? 'text-zinc-900' : 'text-zinc-300'}`}>{s}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Order Items Summary */}
            {orderResult.orderItems && orderResult.orderItems.length > 0 && (
              <div className="mb-10 bg-[#f8f8f8] p-6">
                <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 mb-4">Items in Package</h4>
                <div className="space-y-3">
                  {orderResult.orderItems.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs font-medium">
                      <span className="text-zinc-900 font-bold">{item.name} <span className="text-zinc-400 font-normal">x{item.quantity || item.qty}</span></span>
                      <span className="text-zinc-600">${(item.price * (item.quantity || item.qty)).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-zinc-200 mt-4 pt-3 flex justify-between text-xs font-bold text-zinc-900">
                  <span>Total Amount</span>
                  <span>${orderResult.totalPrice?.toFixed(2)}</span>
                </div>
              </div>
            )}

            {/* Shipping Details */}
            {orderResult.shippingAddress && (
              <div className="mb-10 grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="bg-[#f8f8f8] p-6">
                  <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 mb-3">Shipping To</h4>
                  <p className="text-sm font-bold text-zinc-900">{orderResult.shippingAddress.firstName} {orderResult.shippingAddress.lastName}</p>
                  <p className="text-xs text-zinc-500 mt-1">{orderResult.shippingAddress.address}</p>
                  <p className="text-xs text-zinc-500">{orderResult.shippingAddress.city}, {orderResult.shippingAddress.postalCode}</p>
                  <p className="text-xs text-zinc-500">{orderResult.shippingAddress.country}</p>
                </div>
                <div className="bg-[#f8f8f8] p-6">
                  <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 mb-3">Payment</h4>
                  <p className="text-sm font-bold text-zinc-900 flex items-center gap-2">
                    <ShieldCheck size={14} className={orderResult.isPaid ? 'text-emerald-600' : 'text-amber-500'} />
                    {orderResult.isPaid ? 'Payment Confirmed' : 'Payment Pending'}
                  </p>
                  <p className="text-xs text-zinc-500 mt-1">{orderResult.paymentMethod}</p>
                  {orderResult.isPaid && orderResult.paidAt && (
                    <p className="text-xs text-zinc-400 mt-1">Paid on {new Date(orderResult.paidAt).toLocaleDateString()}</p>
                  )}
                </div>
              </div>
            )}

            {/* Live Tracking Timeline from trackingHistory */}
            {hasTrackingHistory && (
              <div className="mb-10">
                <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 mb-6">Live Tracking Updates</h4>
                <div className="flex flex-col gap-0">
                  {[...orderResult.trackingHistory].reverse().map((event, i, arr) => {
                    const Icon = STATUS_ICONS[event.status?.toLowerCase()] || Clock;
                    const isFirst = i === 0;
                    return (
                      <div key={i} className="flex gap-5 items-start">
                        <div className="flex flex-col items-center">
                          <div className={`w-9 h-9 flex items-center justify-center border-2 rounded-full shrink-0 ${isFirst ? 'bg-zinc-900 border-zinc-900 text-white' : 'bg-white border-zinc-200 text-zinc-400'}`}>
                            <Icon size={15} />
                          </div>
                          {i < arr.length - 1 && <div className={`w-0.5 h-14 ${isFirst ? 'bg-zinc-900' : 'bg-zinc-100'}`} />}
                        </div>
                        <div className="pt-1.5 pb-10">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className={`text-sm font-bold ${isFirst ? 'text-zinc-900' : 'text-zinc-500'}`}>{event.message}</p>
                            {event.location && (
                              <span className="text-[10px] font-semibold px-2 py-0.5 bg-zinc-100 text-zinc-500 rounded-full">
                                {event.location}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-3 mt-1.5">
                            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 border rounded ${getStatusBadge(event.status)}`}>
                              {event.status}
                            </span>
                            <span className="text-[10px] text-zinc-400 font-medium">
                              {new Date(event.timestamp).toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Default Static Timeline (when no trackingHistory exists yet) */}
            {!hasTrackingHistory && (
              <div className="flex flex-col gap-0">
                {[
                  { icon: CheckCircle, label: 'Order Placed', date: new Date(orderResult.createdAt).toLocaleString(), done: true },
                  { icon: Package, label: 'Processing', date: orderResult.isPaid ? `Paid on ${new Date(orderResult.paidAt || orderResult.createdAt).toLocaleDateString()}` : 'Awaiting Payment', done: !!orderResult.isPaid || orderResult.status !== 'Cancelled' },
                  { icon: Truck, label: 'In Transit', date: orderResult.status === 'Shipped' || orderResult.status === 'In Transit' || orderResult.status === 'Delivered' ? 'Shipped via Express carrier' : 'Pending dispatch', done: ['Shipped', 'In Transit', 'Delivered'].includes(orderResult.status) },
                  { icon: MapPin, label: 'Delivered', date: orderResult.isDelivered ? `Delivered on ${new Date(orderResult.deliveredAt).toLocaleDateString()}` : 'Estimated delivery within 3-5 days', done: !!orderResult.isDelivered },
                ].map(({ icon: Icon, label, date, done }, i, arr) => (
                  <div key={label} className="flex gap-5 items-start">
                    <div className="flex flex-col items-center">
                      <div className={`w-9 h-9 flex items-center justify-center border-2 ${done ? 'bg-zinc-900 border-zinc-900 text-white' : 'bg-white border-zinc-200 text-zinc-300'}`}>
                        <Icon size={15} />
                      </div>
                      {i < arr.length - 1 && <div className={`w-0.5 h-12 ${done ? 'bg-zinc-900' : 'bg-zinc-100'}`} />}
                    </div>
                    <div className="pt-2 pb-12">
                      <p className={`text-sm font-bold ${done ? 'text-zinc-900' : 'text-zinc-300'}`}>{label}</p>
                      <p className={`text-[10px] font-medium mt-1 ${done ? 'text-zinc-500' : 'text-zinc-300'}`}>{date}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {!orderResult && !errorMessage && (
          <div className="text-center py-16 text-zinc-200">
            <Package size={48} className="mx-auto mb-4 text-zinc-300" />
            <p className="text-sm font-medium text-zinc-400">Enter your order ID or tracking code above to trace your shipment</p>
          </div>
        )}
      </div>
    </div>
  );
}
