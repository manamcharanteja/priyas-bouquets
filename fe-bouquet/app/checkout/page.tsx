'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/lib/cart-store';
import { paymentAPI } from '@/lib/api';
import toast from 'react-hot-toast';
import Link from 'next/link';

declare global {
  interface Window { Razorpay: any; }
}

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
        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          amount: rzpOrder.amount,
          currency: 'INR',
          name: "Priya's Bouquets",
          description: 'Saree Purchase',
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
                items: items.map((i) => ({
                  sareeId: i.sareeId, name: i.name, price: i.price, qty: i.qty, imageUrl: i.imageUrl,
                })),
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
            } catch {
              toast.error('Payment verification failed. Contact support.');
            }
          },
          modal: { ondismiss: () => { setLoading(false); toast.error('Payment cancelled'); } },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      };
    } catch (err) {
      toast.error('Could not initiate payment. Please try again.');
      setLoading(false);
    }
  };

  if (items.length === 0) return (
    <div className="max-w-xl mx-auto px-4 py-20 text-center">
      <p className="text-gray-600 mb-4">No items in cart.</p>
      <Link href="/sarees" className="btn-primary inline-block">Shop Now</Link>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="font-serif text-3xl font-bold text-gray-800 mb-8">Checkout</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Form */}
        <form onSubmit={handlePay} className="space-y-5">
          <div className="card p-6">
            <h2 className="font-serif text-xl font-semibold mb-4 text-gray-800">Delivery Details</h2>
            <div className="space-y-4">
              {[
                { label: 'Full Name', name: 'name', type: 'text', required: true },
                { label: 'Email Address', name: 'email', type: 'email', required: true },
                { label: 'Phone Number', name: 'phone', type: 'tel', required: true },
                { label: 'Address Line 1', name: 'line1', type: 'text', required: true },
                { label: 'Address Line 2 (optional)', name: 'line2', type: 'text', required: false },
                { label: 'City', name: 'city', type: 'text', required: true },
                { label: 'State', name: 'state', type: 'text', required: true },
                { label: 'Pincode', name: 'pincode', type: 'text', required: true },
              ].map((field) => (
                <div key={field.name}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
                  <input
                    type={field.type}
                    name={field.name}
                    value={(form as any)[field.name]}
                    onChange={handleChange}
                    required={field.required}
                    className="w-full px-4 py-3 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-maroon-700 bg-white"
                  />
                </div>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-maroon-700 text-white py-4 rounded-xl font-semibold text-lg hover:bg-maroon-800 transition-colors disabled:opacity-60"
          >
            {loading ? 'Processing...' : `Pay ₹${totalAmount().toLocaleString()} via UPI`}
          </button>
        </form>

        {/* Order Summary */}
        <div className="card p-6 h-fit">
          <h2 className="font-serif text-xl font-semibold mb-4 text-gray-800">Order Summary</h2>
          <div className="space-y-3 mb-4">
            {items.map((item) => (
              <div key={item.sareeId} className="flex justify-between text-sm text-gray-600">
                <span className="flex-1 mr-2 line-clamp-1">{item.name} x{item.qty}</span>
                <span>₹{(item.price * item.qty).toLocaleString()}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-amber-100 pt-3">
            <div className="flex justify-between font-bold text-lg text-gray-800">
              <span>Total</span>
              <span className="text-maroon-700">₹{totalAmount().toLocaleString()}</span>
            </div>
            <p className="text-xs text-gray-400 mt-2">Payment via UPI (GPay, PhonePe, Paytm, etc.)</p>
          </div>
        </div>
      </div>
    </div>
  );
}
