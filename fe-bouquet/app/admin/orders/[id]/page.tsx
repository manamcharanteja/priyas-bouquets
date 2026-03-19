'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { orderAPI } from '@/lib/api';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function AdminOrderDetailPage() {
  const { id } = useParams();
  const [order, setOrder] = useState<any>(null);

  useEffect(() => {
    orderAPI.getById(id as string).then((r) => setOrder(r.data));
  }, [id]);

  const handleStatusChange = async (newStatus: string) => {
    try {
      const res = await orderAPI.updateStatus(id as string, newStatus);
      setOrder(res.data);
      toast.success('Status updated & email sent to customer');
    } catch {
      toast.error('Update failed');
    }
  };

  if (!order) return <div className="animate-pulse text-gray-400 py-10">Loading...</div>;

  return (
    <div className="max-w-3xl">
      <Link href="/admin/orders" className="flex items-center gap-2 text-maroon-700 mb-6 hover:underline text-sm">
        <ArrowLeft size={16} /> Back to Orders
      </Link>
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="font-serif text-2xl font-bold text-gray-800">Order #{order.orderId}</h1>
          <p className="text-gray-500 text-sm mt-1">{new Date(order.createdAt).toLocaleString('en-IN')}</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={order.orderStatus}
            onChange={(e) => handleStatusChange(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-maroon-700"
          >
            {['pending','confirmed','packed','shipped','delivered','cancelled'].map((s) => (
              <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-xl p-5 border border-gray-100">
          <h2 className="font-semibold text-gray-700 mb-3">Customer Details</h2>
          <p className="font-bold text-gray-800">{order.customer?.name}</p>
          <p className="text-gray-600 text-sm">{order.customer?.email}</p>
          <p className="text-gray-600 text-sm">{order.customer?.phone}</p>
          <div className="mt-3 pt-3 border-t border-gray-100 text-sm text-gray-600">
            <p>{order.customer?.address?.line1}</p>
            {order.customer?.address?.line2 && <p>{order.customer?.address?.line2}</p>}
            <p>{order.customer?.address?.city}, {order.customer?.address?.state} - {order.customer?.address?.pincode}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-gray-100">
          <h2 className="font-semibold text-gray-700 mb-3">Payment Details</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Status</span>
              <span className={`font-medium ${order.payment?.status === 'paid' ? 'text-green-600' : 'text-yellow-600'}`}>
                {order.payment?.status?.toUpperCase()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Method</span>
              <span className="font-medium">UPI</span>
            </div>
            {order.payment?.razorpayPaymentId && (
              <div className="flex justify-between">
                <span className="text-gray-500">Payment ID</span>
                <span className="font-mono text-xs text-gray-600 truncate max-w-[150px]">{order.payment.razorpayPaymentId}</span>
              </div>
            )}
            <div className="flex justify-between border-t border-gray-100 pt-2 mt-2">
              <span className="font-semibold text-gray-800">Total Paid</span>
              <span className="font-bold text-maroon-700 text-lg">₹{order.totalAmount?.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-5 border border-gray-100">
        <h2 className="font-semibold text-gray-700 mb-4">Items Ordered</h2>
        <div className="space-y-3">
          {order.items?.map((item: any, i: number) => (
            <div key={i} className="flex justify-between py-2 border-b border-gray-50 last:border-0">
              <div>
                <p className="font-medium text-gray-800">{item.name}</p>
                <p className="text-sm text-gray-500">Qty: {item.qty} × ₹{item.price?.toLocaleString()}</p>
              </div>
              <p className="font-bold text-gray-800">₹{(item.price * item.qty)?.toLocaleString()}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
