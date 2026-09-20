'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Truck, CreditCard, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react';
import { useShop } from '@/context/ShopContext';
import { cn } from '@/lib/utils';

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, user, getCartSubtotal, placeOrder, createStripeCheckout } = useShop();

  const [step, setStep] = useState(1);
  const [createdOrder, setCreatedOrder] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [checkoutError, setCheckoutError] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Stripe');
  const [shippingMethod, setShippingMethod] = useState('standard');
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: user?.email || '',
    phone: '', address: '', city: '', state: '', zip: '', country: 'United States',
  });
  const [errors, setErrors] = useState({});
  const [authError, setAuthError] = useState('');

  const subtotal = getCartSubtotal();
  const shipping = 0;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const isStep2 = step === 2 && Boolean(createdOrder);
  const summaryItems = isStep2 && createdOrder?.orderItems?.length ? createdOrder.orderItems : cart;
  const summarySubtotal = isStep2 && typeof createdOrder?.itemsPrice === 'number' ? createdOrder.itemsPrice : subtotal;
  const summaryShipping = isStep2 && typeof createdOrder?.shippingPrice === 'number' ? createdOrder.shippingPrice : shipping;
  const summaryTax = isStep2 && typeof createdOrder?.taxPrice === 'number' ? createdOrder.taxPrice : tax;
  const summaryTotal = isStep2 && typeof createdOrder?.totalPrice === 'number' ? createdOrder.totalPrice : total;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
    if (authError) setAuthError('');
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = 'Required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Required';
    if (!formData.email.trim()) newErrors.email = 'Required';
    if (!formData.address.trim()) newErrors.address = 'Required';
    if (!formData.city.trim()) newErrors.city = 'Required';
    if (!formData.zip.trim()) newErrors.zip = 'Required';
    return newErrors;
  };

  const handleShippingSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }

    if (!user) {
      setAuthError('Please sign in or create an account to proceed with your order.');
      return;
    }

    setIsProcessing(true);
    setAuthError('');
    try {
      const order = await placeOrder({ ...formData, shippingMethod }, shippingMethod, paymentMethod);
      if (order && !order.error && order._id) {
        setCreatedOrder(order);
        setStep(2);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        const errMsg = order?.error || 'Failed to create order. Please check your details and try again.';
        setCheckoutError(errMsg);
      }
    } catch (err) {
      console.error(err);
      setCheckoutError('An unexpected error occurred.');
    }
    setIsProcessing(false);
  };

  const handleStripeCheckout = async () => {
    if (!createdOrder) return;
    setIsProcessing(true);
    setCheckoutError('');
    try {
      const result = await createStripeCheckout(createdOrder._id);
      if (result && result.url) {
        window.location.href = result.url;
      } else {
        setCheckoutError('Failed to create Stripe checkout session. Please try again.');
      }
    } catch (err) {
      console.error(err);
      setCheckoutError('An error occurred. Please try again.');
    }
    setIsProcessing(false);
  };

  const inputClass = 'w-full bg-white border border-zinc-200 px-4 py-3 text-sm text-zinc-900 placeholder-zinc-300 focus:outline-none focus:border-zinc-900 transition-colors';
  const labelClass = 'text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-400 mb-2 block';
  const errorClass = 'text-[9px] text-red-500 font-bold mt-1';

  if (cart.length === 0 && !createdOrder) {
    return (
      <div className="min-h-screen bg-white pt-[90px] flex flex-col items-center justify-center gap-6 text-center px-6">
        <h2 className="text-3xl font-bold text-zinc-900">Your bag is empty</h2>
        <Link href="/shop" className="px-10 py-4 bg-zinc-900 text-white text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-zinc-800 transition-colors">Shop Now</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-[90px]">
      <div className="max-w-[1300px] mx-auto px-6 md:px-12 py-16">

        {/* Header + Steps */}
        <div className="mb-12 border-b border-zinc-100 pb-8">
          <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-zinc-400 block mb-3">EcomHutt</span>
          <h1 className="text-5xl font-bold text-zinc-900 tracking-tight mb-8">Checkout</h1>
          <div className="flex items-center gap-4">
            {[{ n: 1, label: 'Shipping' }, { n: 2, label: 'Payment' }].map(({ n, label }) => (
              <div key={n} className="flex items-center gap-2">
                <div className={cn('w-7 h-7 flex items-center justify-center text-[10px] font-bold transition-colors',
                  step >= n ? 'bg-zinc-900 text-white' : 'bg-zinc-100 text-zinc-400'
                )}>{step > n ? <CheckCircle2 size={14} /> : n}</div>
                <span className={cn('text-[10px] font-bold uppercase tracking-widest', step >= n ? 'text-zinc-900' : 'text-zinc-400')}>{label}</span>
                {n < 2 && <div className="w-12 h-px bg-zinc-200 mx-2" />}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 items-start">

          {/* Left — Form */}
          <div className="lg:col-span-2">

            {/* Step 1 — Shipping */}
            {step === 1 && (
              <form onSubmit={handleShippingSubmit} className="flex flex-col gap-8">
                {!user && (
                  <div className="p-4 bg-zinc-50 border border-zinc-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-bold text-zinc-900">Have an account?</p>
                      <p className="text-[11px] text-zinc-500">Sign in to complete your purchase and save order tracking.</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link
                        href="/login?redirect=/checkout"
                        className="px-4 py-2 bg-zinc-900 text-white text-[10px] font-bold uppercase tracking-widest hover:bg-zinc-800 transition-colors whitespace-nowrap"
                      >
                        Sign In
                      </Link>
                      <Link
                        href="/register?redirect=/checkout"
                        className="px-4 py-2 border border-zinc-300 text-zinc-900 text-[10px] font-bold uppercase tracking-widest hover:border-zinc-900 transition-colors whitespace-nowrap"
                      >
                        Register
                      </Link>
                    </div>
                  </div>
                )}

                <div>
                  <h2 className="text-lg font-bold text-zinc-900 mb-6 pb-4 border-b border-zinc-100">Shipping Information</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {[
                      { name: 'firstName', label: 'First Name', type: 'text', placeholder: 'Alexandra', colSpan: '' },
                      { name: 'lastName', label: 'Last Name', type: 'text', placeholder: 'Morrison', colSpan: '' },
                      { name: 'email', label: 'Email', type: 'email', placeholder: 'you@example.com', colSpan: 'sm:col-span-2' },
                      { name: 'phone', label: 'Phone', type: 'tel', placeholder: '+1 (555) 000-0000', colSpan: 'sm:col-span-2' },
                      { name: 'address', label: 'Address', type: 'text', placeholder: '123 Main Street', colSpan: 'sm:col-span-2' },
                      { name: 'city', label: 'City', type: 'text', placeholder: 'New York', colSpan: '' },
                      { name: 'zip', label: 'ZIP Code', type: 'text', placeholder: '10001', colSpan: '' },
                      { name: 'state', label: 'State', type: 'text', placeholder: 'NY', colSpan: '' },
                      { name: 'country', label: 'Country', type: 'text', placeholder: 'United States', colSpan: '' },
                    ].map((f) => (
                      <div key={f.name} className={f.colSpan}>
                        <label className={labelClass}>{f.label}</label>
                        <input name={f.name} type={f.type} value={formData[f.name]} onChange={handleChange} placeholder={f.placeholder} className={inputClass} />
                        {errors[f.name] && <p className={errorClass}>{errors[f.name]}</p>}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Shipping method — Free delivery */}
                <div>
                  <h3 className="text-sm font-bold text-zinc-900 mb-4 pb-3 border-b border-zinc-100">Shipping Method</h3>
                  <div className="flex items-center justify-between p-4 border border-zinc-900 bg-[#f8f8f8]">
                    <div className="flex items-center gap-4">
                      <Truck size={16} className="text-zinc-600" />
                      <div>
                        <p className="text-xs font-bold text-zinc-900">Standard Delivery</p>
                        <p className="text-[10px] text-zinc-400 font-medium">3–5 business days</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-emerald-600">Free</span>
                  </div>
                </div>

                {/* Payment method selection — Stripe */}
                <div>
                  <h3 className="text-sm font-bold text-zinc-900 mb-4 pb-3 border-b border-zinc-100">Payment Method</h3>
                  <div className="flex flex-col gap-3">
                    <label className="flex items-center justify-between p-4 cursor-pointer border border-zinc-900 bg-[#f8f8f8]">
                      <div className="flex items-center gap-4">
                        <input type="radio" name="paymentMethod" value="Stripe" checked readOnly className="w-4 h-4 accent-zinc-900" />
                        <div>
                          <p className="text-xs font-bold text-zinc-900">💳 Credit / Debit Card</p>
                          <p className="text-[10px] text-zinc-400 font-medium">Powered by Stripe — secure, fast, encrypted</p>
                        </div>
                      </div>
                    </label>
                  </div>
                </div>

                {authError && (
                  <div className="p-4 bg-red-50 border border-red-200 text-xs text-red-700 font-medium flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <span>{authError}</span>
                    <Link href="/login?redirect=/checkout" className="px-4 py-2 bg-red-600 text-white text-[10px] font-bold uppercase tracking-widest hover:bg-red-700 transition-colors whitespace-nowrap text-center">
                      Sign In Now →
                    </Link>
                  </div>
                )}

                <button type="submit" disabled={isProcessing} className="flex items-center justify-center gap-3 py-4 bg-zinc-900 text-white text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-zinc-800 transition-colors disabled:opacity-60">
                  {isProcessing ? <><Loader2 size={14} className="animate-spin" /> Processing...</> : <>Continue to Payment <ArrowRight size={14} /></>}
                </button>
              </form>
            )}

            {/* Step 2 — Payment */}
            {step === 2 && createdOrder && (
              <div className="flex flex-col gap-6">
                <h2 className="text-lg font-bold text-zinc-900 pb-4 border-b border-zinc-100">Payment</h2>
                {checkoutError && <div className="p-4 bg-red-50 border border-red-100 text-xs text-red-600 font-medium">{checkoutError}</div>}

                {/* Stripe Payment */}
                {paymentMethod === 'Stripe' && (
                  <div className="p-6 border border-zinc-100 bg-[#f8f8f8]">
                    <div className="text-center">
                      <p className="text-sm font-bold text-zinc-900 mb-2">💳 Secure Card Payment</p>
                      <p className="text-xs text-zinc-500 mb-6">You will be redirected to Stripe&apos;s secure checkout page</p>
                      <button
                        onClick={handleStripeCheckout}
                        disabled={isProcessing}
                        className="w-full flex items-center justify-center gap-3 py-4 bg-zinc-900 text-white text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-zinc-800 transition-colors disabled:opacity-60"
                      >
                        {isProcessing ? <><Loader2 size={14} className="animate-spin" /> Redirecting to Stripe...</> : <>Pay ${summaryTotal.toFixed(2)} with Stripe <ArrowRight size={14} /></>}
                      </button>
                    </div>
                  </div>
                )}

                <button onClick={() => setStep(1)} className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 hover:text-zinc-900 transition-colors text-left">
                  ← Back to Shipping
                </button>
              </div>
            )}
          </div>

          {/* Right — Order Summary */}
          <div className="bg-[#f8f8f8] p-8 flex flex-col gap-5 sticky top-[110px]">
            <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-zinc-900 pb-5 border-b border-zinc-200">Order Summary</h2>
            <div className="flex flex-col gap-4 max-h-60 overflow-y-auto">
              {summaryItems.map((item, idx) => (
                <div key={`${item.id || item._id || item.product || idx}-${item.size || 'std'}`} className="flex items-center gap-4">
                  <div className="relative w-14 h-16 bg-zinc-200 overflow-hidden shrink-0">
                    {(item.image || item.images?.[0]) && <Image src={item.image || item.images[0]} alt={item.name || 'Product'} fill className="object-cover" sizes="56px" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-[11px] font-bold text-zinc-900 line-clamp-1">{item.name}</p>
                    <p className="text-[10px] text-zinc-400">Qty: {item.quantity || item.qty || 1}</p>
                  </div>
                  <span className="text-xs font-bold text-zinc-900">${((Number(item.price) || 0) * (Number(item.quantity || item.qty) || 1)).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="flex flex-col gap-3 text-xs font-medium text-zinc-600 border-t border-zinc-200 pt-5">
              <div className="flex justify-between"><span>Subtotal</span><span className="font-bold text-zinc-900">${summarySubtotal.toFixed(2)}</span></div>
              <div className="flex justify-between"><span>Shipping</span><span className="font-bold text-emerald-600">Free</span></div>
              <div className="flex justify-between"><span>Tax (8%)</span><span className="font-bold text-zinc-900">${summaryTax.toFixed(2)}</span></div>
            </div>
            <div className="border-t border-zinc-200 pt-4 flex justify-between">
              <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-900">Total</span>
              <span className="text-xl font-bold text-zinc-900">${summaryTotal.toFixed(2)}</span>
            </div>
            <div className="flex flex-col gap-2 pt-2">
              {[{ icon: ShieldCheck, text: 'SSL Encrypted Checkout' }, { icon: Truck, text: 'Free returns within 30 days' }, { icon: CreditCard, text: 'Secure payment processing' }].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-2 text-[10px] text-zinc-400 font-medium">
                  <Icon size={12} /> {text}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
