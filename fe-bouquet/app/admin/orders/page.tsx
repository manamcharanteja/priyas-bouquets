'use client';

import { useEffect, useState } from 'react';
import { orderAPI } from '@/lib/api';
import Link from 'next/link';
import toast from 'react-hot-toast';

const STATUSES = ['all', 'pending', 'confirmed', 'packed', 'shipped', 'delivered', 'cancelled'];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  const load = (status: string) => {
    setLoading(true);
    const params: any = {};
    if (status !== 'all') params.status = status;
    orderAPI.getAll(params).then((r) => { setOrders(r.data.orders); setLoading(false); });
  };

  useEffect(() => load(filter), [filter]);

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await orderAPI.updateStatus(id, newStatus);
      toast.success('Status updated & email sent');
      load(filter);
    } catch {
      toast.error('Failed to update');
    }
  };

  return (
    <div>
      <h1 className="font-serif text-2xl font-bold text-gray-800 mb-6">Orders</h1>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {STATUSES.map((s) => (
          <button key={s} onClick={() => setFilter(s)} className={`px-4 py-2 rounded-full text-sm font-medium capitalize transition-colors ${filter === s ? 'bg-maroon-700 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-maroon-700'}`}>
            {s}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {['Order ID', 'Customer', 'Items', 'Total', 'Payment', 'Status', 'Date', 'Actions'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left font-medium text-gray-500">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="border-b border-gray-50">
                    {[...Array(8)].map((_, j) => <td key={j} className="px-4 py-3"><div className="h-4 bg-gray-100 rounded animate-pulse" /></td>)}
                  </tr>
                ))
              ) : orders.map((o) => (
                <tr key={o._id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-maroon-700">
                    <Link href={`/admin/orders/${o._id}`}>#{o.orderId}</Link>
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-800">{o.customer?.name}</p>
                    <p className="text-xs text-gray-400">{o.customer?.phone}</p>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{o.items?.length} item(s)</td>
                  <td className="px-4 py-3 font-bold text-gray-800">₹{o.totalAmount?.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${o.payment?.status === 'paid' ? 'bg-green-100 text-green-700' : o.payment?.status === 'failed' ? 'bg-red-100 text-red-600' : 'bg-yellow-100 text-yellow-700'}`}>
                      {o.payment?.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={o.orderStatus}
                      onChange={(e) => handleStatusChange(o._id, e.target.value)}
                      className="border border-gray-200 rounded-lg px-2 py-1 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-maroon-700"
                    >
                      {['pending','confirmed','packed','shipped','delivered','cancelled'].map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{new Date(o.createdAt).toLocaleDateString('en-IN')}</td>
                  <td className="px-4 py-3">
                    <Link href={`/admin/orders/${o._id}`} className="text-maroon-700 text-xs hover:underline">View</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
