'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Truck, CreditCard, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react';
import { PayPalButtons } from '@paypal/react-paypal-js';
import { useShop } from '@/context/ShopContext';
import { cn } from '@/lib/utils';

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, user, getCartSubtotal, placeOrder, payOrder } = useShop();

  const [step, setStep] = useState(1);
  const [createdOrder, setCreatedOrder] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paypalError, setPaypalError] = useState('');
  const [shippingMethod, setShippingMethod] = useState('standard');
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: user?.email || '',
    phone: '', address: '', city: '', state: '', zip: '', country: 'United States',
  });
  const [errors, setErrors] = useState({});

  const subtotal = getCartSubtotal();
  const shipping = shippingMethod === 'express' ? 25 : subtotal > 150 ? 0 : 15;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
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
    setIsProcessing(true);
    try {
      const order = await placeOrder({ ...formData, shippingMethod });
      if (order) { setCreatedOrder(order); setStep(2); }
    } catch (err) { console.error(err); }
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

                {/* Shipping method */}
                <div>
                  <h3 className="text-sm font-bold text-zinc-900 mb-4 pb-3 border-b border-zinc-100">Shipping Method</h3>
                  <div className="flex flex-col gap-3">
                    {[
                      { value: 'standard', label: 'Standard Delivery', sub: '3–5 business days', price: subtotal > 150 ? 'Free' : '$15.00' },
                      { value: 'express', label: 'Express Delivery', sub: '1–2 business days', price: '$25.00' },
                    ].map((opt) => (
                      <label key={opt.value} className={cn('flex items-center justify-between p-4 cursor-pointer border transition-colors', shippingMethod === opt.value ? 'border-zinc-900 bg-[#f8f8f8]' : 'border-zinc-200 hover:border-zinc-400')}>
                        <div className="flex items-center gap-4">
                          <input type="radio" name="shippingMethod" value={opt.value} checked={shippingMethod === opt.value} onChange={() => setShippingMethod(opt.value)} className="w-4 h-4 accent-zinc-900" />
                          <div>
                            <p className="text-xs font-bold text-zinc-900">{opt.label}</p>
                            <p className="text-[10px] text-zinc-400 font-medium">{opt.sub}</p>
                          </div>
                        </div>
                        <span className="text-xs font-bold text-zinc-900">{opt.price}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <button type="submit" disabled={isProcessing} className="flex items-center justify-center gap-3 py-4 bg-zinc-900 text-white text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-zinc-800 transition-colors disabled:opacity-60">
                  {isProcessing ? <><Loader2 size={14} className="animate-spin" /> Processing...</> : <>Continue to Payment <ArrowRight size={14} /></>}
                </button>
              </form>
            )}

            {/* Step 2 — Payment */}
            {step === 2 && createdOrder && (
              <div className="flex flex-col gap-6">
                <h2 className="text-lg font-bold text-zinc-900 pb-4 border-b border-zinc-100">Payment</h2>
                {paypalError && <div className="p-4 bg-red-50 border border-red-100 text-xs text-red-600 font-medium">{paypalError}</div>}
                <div className="p-6 border border-zinc-100 bg-[#f8f8f8]">
                  <PayPalButtons
                    style={{ layout: 'vertical', color: 'black', shape: 'rect', label: 'pay' }}
                    createOrder={() => ({ id: createdOrder.paypalOrderId || createdOrder._id })}
                    onApprove={async (data) => {
                      setIsProcessing(true);
                      try {
                        const result = await payOrder(createdOrder._id, { id: data.orderID });
                        if (result.success) router.push(`/payment/success?orderId=${createdOrder._id}`);
                      } catch (err) { setPaypalError('Payment failed. Please try again.'); }
                      setIsProcessing(false);
                    }}
                    onError={() => setPaypalError('PayPal encountered an error.')}
                  />
                </div>
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
              {cart.map((item) => (
                <div key={`${item.id}-${item.size}`} className="flex items-center gap-4">
                  <div className="relative w-14 h-16 bg-zinc-200 overflow-hidden shrink-0">
                    {(item.image || item.images?.[0]) && <Image src={item.image || item.images[0]} alt={item.name} fill className="object-cover" sizes="56px" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-[11px] font-bold text-zinc-900 line-clamp-1">{item.name}</p>
                    <p className="text-[10px] text-zinc-400">Qty: {item.quantity}</p>
                  </div>
                  <span className="text-xs font-bold text-zinc-900">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="flex flex-col gap-3 text-xs font-medium text-zinc-600 border-t border-zinc-200 pt-5">
              <div className="flex justify-between"><span>Subtotal</span><span className="font-bold text-zinc-900">${subtotal.toFixed(2)}</span></div>
              <div className="flex justify-between"><span>Shipping</span><span className="font-bold text-zinc-900">{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span></div>
              <div className="flex justify-between"><span>Tax (8%)</span><span className="font-bold text-zinc-900">${tax.toFixed(2)}</span></div>
            </div>
            <div className="border-t border-zinc-200 pt-4 flex justify-between">
              <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-900">Total</span>
              <span className="text-xl font-bold text-zinc-900">${total.toFixed(2)}</span>
            </div>
            <div className="flex flex-col gap-2 pt-2">
              {[{ icon: ShieldCheck, text: 'SSL Encrypted Checkout' }, { icon: Truck, text: 'Free returns within 30 days' }, { icon: CreditCard, text: 'Secure PayPal payment' }].map(({ icon: Icon, text }) => (
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
