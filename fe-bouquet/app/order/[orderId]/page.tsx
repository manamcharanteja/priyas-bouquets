'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { orderAPI } from '@/lib/api';
import Link from 'next/link';
import { CheckCircle, Package, Mail } from 'lucide-react';

export default function OrderConfirmationPage() {
  const { orderId } = useParams();
  const [order, setOrder] = useState<any>(null);

  useEffect(() => {
    orderAPI.getById(orderId as string).then((res) => setOrder(res.data)).catch(() => {});
  }, [orderId]);

  return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center">
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <CheckCircle size={48} className="text-green-500" />
      </div>
      <h1 className="font-serif text-3xl font-bold text-gray-800 mb-3">Order Confirmed!</h1>
      <p className="text-gray-600 mb-2">Thank you for shopping with Priya's Bouquets 🌸</p>
      {order && (
        <p className="text-maroon-700 font-semibold text-lg mb-8">Order ID: #{order.orderId}</p>
      )}

      <div className="card p-6 text-left mb-6">
        <div className="flex items-start gap-3 mb-4">
          <Mail size={20} className="text-maroon-700 mt-1" />
          <div>
            <p className="font-medium text-gray-800">Confirmation email sent</p>
            <p className="text-sm text-gray-500">Check your inbox for order details and receipt.</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <Package size={20} className="text-maroon-700 mt-1" />
          <div>
            <p className="font-medium text-gray-800">We're preparing your order</p>
            <p className="text-sm text-gray-500">You'll receive updates at every stage of your order.</p>
          </div>
        </div>
      </div>

      {order && (
        <div className="card p-6 text-left mb-6">
          <h2 className="font-serif text-lg font-semibold mb-3 text-gray-800">Items Ordered</h2>
          {order.items?.map((item: any, i: number) => (
            <div key={i} className="flex justify-between py-2 border-b border-amber-50 last:border-0 text-sm text-gray-600">
              <span>{item.name} x{item.qty}</span>
              <span>₹{(item.price * item.qty).toLocaleString()}</span>
            </div>
          ))}
          <div className="flex justify-between font-bold text-gray-800 mt-3">
            <span>Total Paid</span>
            <span className="text-maroon-700">₹{order.totalAmount?.toLocaleString()}</span>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link href="/track" className="btn-primary inline-block">Track Your Order</Link>
        <Link href="/sarees" className="btn-outline inline-block">Shop More</Link>
      </div>
    </div>
  );
}
