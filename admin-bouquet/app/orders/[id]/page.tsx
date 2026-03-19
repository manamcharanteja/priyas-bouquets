'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { orderAPI } from '@/lib/api';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function OrderDetailPage() {
  const { id } = useParams();
  const [order, setOrder] = useState<any>(null);

  useEffect(() => { orderAPI.getById(id as string).then(r => setOrder(r.data)).catch(() => {}); }, [id]);

  const handleStatusChange = async (newStatus: string) => {
    try {
      const res = await orderAPI.updateStatus(id as string, newStatus);
      setOrder(res.data);
      toast.success('Status updated & email sent');
    } catch { toast.error('Update failed'); }
  };

  if (!order) return <div className="animate-pulse text-gray-400 py-10">Loading...</div>;

  return (
    <div className="max-w-3xl">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/orders" className="text-gray-400 hover:text-gray-600"><ArrowLeft size={20} /></Link>
        <div>
          <h1 className="font-serif text-2xl font-bold text-gray-800">Order #{order.orderId}</h1>
          <p className="text-gray-400 text-xs">{new Date(order.createdAt).toLocaleString('en-IN')}</p>
        </div>
        <div className="ml-auto">
          <select value={order.orderStatus} onChange={e => handleStatusChange(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-maroon-700">
            {['pending','confirmed','packed','shipped','delivered','cancelled'].map(s => (
              <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-5">
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <h2 className="font-semibold text-gray-700 text-sm mb-3">Customer</h2>
          <p className="font-bold text-gray-800">{order.customer?.name}</p>
          <p className="text-sm text-gray-500">{order.customer?.email}</p>
          <p className="text-sm text-gray-500">{order.customer?.phone}</p>
          <div className="mt-3 pt-3 border-t border-gray-100 text-xs text-gray-500 space-y-0.5">
            <p>{order.customer?.address?.line1}</p>
            {order.customer?.address?.line2 && <p>{order.customer?.address?.line2}</p>}
            <p>{order.customer?.address?.city}, {order.customer?.address?.state} - {order.customer?.address?.pincode}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <h2 className="font-semibold text-gray-700 text-sm mb-3">Payment</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Status</span>
              <span className={`font-medium ${order.payment?.status === 'paid' ? 'text-green-600' : 'text-yellow-600'}`}>{order.payment?.status?.toUpperCase()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Method</span>
              <span className="font-medium">UPI</span>
            </div>
            {order.payment?.razorpayPaymentId && (
              <div className="flex justify-between">
                <span className="text-gray-400">Payment ID</span>
                <span className="font-mono text-xs truncate max-w-[130px]">{order.payment.razorpayPaymentId}</span>
              </div>
            )}
            <div className="flex justify-between border-t border-gray-100 pt-2 mt-2">
              <span className="font-semibold text-gray-800">Total</span>
              <span className="font-bold text-maroon-700 text-base">₹{order.totalAmount?.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
        <h2 className="font-semibold text-gray-700 text-sm mb-4">Items</h2>
        {order.items?.map((item: any, i: number) => (
          <div key={i} className="flex justify-between py-2.5 border-b border-gray-50 last:border-0">
            <div>
              <p className="font-medium text-gray-800 text-sm">{item.name}</p>
              <p className="text-xs text-gray-400">Qty: {item.qty} × ₹{item.price?.toLocaleString()}</p>
            </div>
            <p className="font-bold text-gray-800">₹{(item.price * item.qty)?.toLocaleString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
