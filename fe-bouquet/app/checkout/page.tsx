'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/lib/cart-store';
import { paymentAPI } from '@/lib/api';
import toast from 'react-hot-toast';
import Link from 'next/link';
import Image from 'next/image';
import { ShieldCheck, Truck, ArrowRight } from 'lucide-react';

declare global { interface Window { Razorpay: any; } }

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalAmount, clearCart } = useCartStore();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '', email: '', phone: '',
    line1: '', line2: '', city: '', state: '', pincode: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return toast.error('Your cart is empty');
    setLoading(true);
    try {
      const { data: rzpOrder } = await paymentAPI.createOrder(totalAmount());
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      document.body.appendChild(script);
      script.onload = () => {
        const rzp = new window.Razorpay({
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          amount: rzpOrder.amount,
          currency: 'INR',
          name: 'True Spark',
          description: 'Fashion Purchase',
          order_id: rzpOrder.id,
          prefill: { name: form.name, email: form.email, contact: form.phone },
          theme: { color: '#8B1A1A' },
          handler: async (response: any) => {
            try {
              const orderData = {
                customer: {
                  name: form.name, email: form.email, phone: form.phone,
                  address: { line1: form.line1, line2: form.line2, city: form.city, state: form.state, pincode: form.pincode },
                },
                items: items.map((i) => ({ sareeId: i.sareeId, name: i.name, price: i.price, qty: i.qty, imageUrl: i.imageUrl })),
                totalAmount: totalAmount(),
              };
              const { data } = await paymentAPI.verify({
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
                orderData,
              });
              clearCart();
              router.push(`/order/${data._id}`);
            } catch { toast.error('Payment verification failed. Contact support.'); }
          },
          modal: { ondismiss: () => { setLoading(false); toast.error('Payment cancelled'); } },
        });
        rzp.open();
      };
    } catch {
      toast.error('Could not initiate payment. Please try again.');
      setLoading(false);
    }
  };

  if (items.length === 0) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
      <p className="text-gray-500 mb-4">No items in cart.</p>
      <Link href="/sarees" className="btn-primary inline-block">Shop Now</Link>
    </div>
  );

  const subtotal = totalAmount();

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="font-serif text-2xl font-bold text-gray-800 mb-6">Checkout</h1>

        <div className="flex flex-col lg:flex-row gap-6 items-start">
          {/* Left: Delivery form */}
          <form onSubmit={handlePay} className="flex-1 space-y-4">
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
              <h2 className="font-semibold text-gray-800 mb-4">Delivery Details</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { label: 'Full Name', name: 'name', type: 'text', required: true, col: 'sm:col-span-2' },
                  { label: 'Email Address', name: 'email', type: 'email', required: true, col: '' },
                  { label: 'Phone Number', name: 'phone', type: 'tel', required: true, col: '' },
                  { label: 'Address Line 1', name: 'line1', type: 'text', required: true, col: 'sm:col-span-2' },
                  { label: 'Address Line 2 (optional)', name: 'line2', type: 'text', required: false, col: 'sm:col-span-2' },
                  { label: 'City', name: 'city', type: 'text', required: true, col: '' },
                  { label: 'State', name: 'state', type: 'text', required: true, col: '' },
                  { label: 'Pincode', name: 'pincode', type: 'text', required: true, col: '' },
                ].map((f) => (
                  <div key={f.name} className={f.col}>
                    <label className="block text-xs font-medium text-gray-500 mb-1">{f.label}</label>
                    <input
                      type={f.type} name={f.name}
                      value={(form as any)[f.name]}
                      onChange={handleChange} required={f.required}
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-maroon-700 bg-white"
                    />
                  </div>
                ))}
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full bg-maroon-700 text-white py-3.5 rounded-xl font-semibold text-sm hover:bg-maroon-800 transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
              <ShieldCheck size={17} />
              {loading ? 'Processing...' : `Pay ₹${subtotal.toLocaleString()} via UPI`}
            </button>

            <div className="flex items-center justify-center gap-4 text-xs text-gray-400">
              <span className="flex items-center gap-1"><ShieldCheck size={13} /> Secure Payment</span>
              <span className="flex items-center gap-1"><Truck size={13} /> Free Delivery</span>
            </div>
          </form>

          {/* Right: Order Summary */}
          <div className="lg:w-80 xl:w-96 sticky top-20">
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100">
                <h2 className="font-semibold text-gray-800 text-sm">Order Summary ({items.length} item{items.length > 1 ? 's' : ''})</h2>
              </div>

              {/* Items */}
              <div className="divide-y divide-gray-50">
                {items.map((item) => (
                  <div key={item.sareeId} className="px-5 py-3 flex gap-3 items-center">
                    <div className="relative w-12 h-14 flex-shrink-0 rounded-lg overflow-hidden bg-gray-50">
                      {item.imageUrl
                        ? <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
                        : <div className="w-full h-full flex items-center justify-center text-lg">🌸</div>}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-gray-700 line-clamp-2 leading-snug">{item.name}</p>
                      <p className="text-xs text-gray-400 mt-0.5">Qty: {item.qty}</p>
                    </div>
                    <span className="text-sm font-semibold text-gray-800 whitespace-nowrap">
                      ₹{(item.price * item.qty).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="px-5 py-4 border-t border-gray-100 space-y-2">
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Subtotal</span><span>₹{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Shipping</span><span className="text-green-600 font-medium">Free</span>
                </div>
                <div className="flex justify-between font-bold text-gray-800 pt-2 border-t border-gray-100">
                  <span>Total</span>
                  <span className="text-maroon-700 text-base">₹{subtotal.toLocaleString()}</span>
                </div>
              </div>

              <div className="px-5 pb-4">
                <p className="text-xs text-gray-400 text-center">
                  Supports GPay, PhonePe, Paytm & all UPI apps
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
