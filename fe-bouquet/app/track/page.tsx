'use client';

import { useState } from 'react';
import { orderAPI } from '@/lib/api';
import { Search, Package, CheckCircle, Truck, Box, XCircle } from 'lucide-react';

const STATUS_STEPS = ['confirmed', 'packed', 'shipped', 'delivered'];

const STATUS_ICON: Record<string, any> = {
  pending: Package,
  confirmed: CheckCircle,
  packed: Box,
  shipped: Truck,
  delivered: CheckCircle,
  cancelled: XCircle,
};

export default function TrackOrderPage() {
  const [email, setEmail] = useState('');
  const [orderId, setOrderId] = useState('');
  const [order, setOrder] = useState<any>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setOrder(null);
    try {
      const res = await orderAPI.track(email, orderId);
      setOrder(res.data);
    } catch {
      setError('Order not found. Please check your Order ID and email.');
    } finally {
      setLoading(false);
    }
  };

  const currentStep = order ? STATUS_STEPS.indexOf(order.orderStatus) : -1;

  return (
    <div className="max-w-2xl mx-auto px-4 py-14">
      <div className="text-center mb-10">
        <h1 className="font-serif text-3xl font-bold text-gray-800 mb-2">Track Your Order</h1>
        <p className="text-gray-500">Enter your Order ID and email to check the status</p>
      </div>

      <form onSubmit={handleTrack} className="card p-6 mb-8 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Order ID</label>
          <input
            type="text"
            placeholder="e.g. PB-123456"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            required
            className="w-full px-4 py-3 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-maroon-700 bg-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
          <input
            type="email"
            placeholder="Your email used during checkout"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-maroon-700 bg-white"
          />
        </div>
        <button type="submit" disabled={loading} className="w-full btn-primary flex items-center justify-center gap-2">
          <Search size={18} />
          {loading ? 'Searching...' : 'Track Order'}
        </button>
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
      </form>

      {order && (
        <div className="card p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <p className="text-sm text-gray-500">Order ID</p>
              <p className="font-bold text-maroon-700 text-lg">#{order.orderId}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Total</p>
              <p className="font-bold text-gray-800">₹{order.totalAmount?.toLocaleString()}</p>
            </div>
          </div>

          {order.orderStatus !== 'cancelled' ? (
            <div className="relative mb-8">
              <div className="flex justify-between relative z-10">
                {STATUS_STEPS.map((step, i) => {
                  const done = i <= currentStep;
                  const Icon = STATUS_ICON[step] || Package;
                  return (
                    <div key={step} className="flex flex-col items-center gap-2 flex-1">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${done ? 'bg-maroon-700 text-white' : 'bg-amber-100 text-amber-300'}`}>
                        <Icon size={20} />
                      </div>
                      <p className={`text-xs capitalize font-medium ${done ? 'text-maroon-700' : 'text-gray-400'}`}>{step}</p>
                    </div>
                  );
                })}
              </div>
              <div className="absolute top-5 left-5 right-5 h-0.5 bg-amber-100 -z-0">
                <div
                  className="h-full bg-maroon-700 transition-all"
                  style={{ width: `${currentStep >= 0 ? (currentStep / (STATUS_STEPS.length - 1)) * 100 : 0}%` }}
                />
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3 text-red-500 bg-red-50 p-4 rounded-lg mb-6">
              <XCircle size={20} />
              <p className="font-medium">This order has been cancelled.</p>
            </div>
          )}

          <div className="border-t border-amber-100 pt-4">
            <h3 className="font-semibold text-gray-800 mb-3">Items</h3>
            {order.items?.map((item: any, i: number) => (
              <div key={i} className="flex justify-between text-sm text-gray-600 py-1">
                <span>{item.name} x{item.qty}</span>
                <span>₹{(item.price * item.qty).toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
