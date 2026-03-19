'use client';

import { useEffect, useState } from 'react';
import { orderAPI } from '@/lib/api';
import Link from 'next/link';
import { CreditCard } from 'lucide-react';

export default function TransactionsPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    orderAPI.getAll({ limit: 50 }).then((r) => {
      setOrders(r.data.orders);
      setLoading(false);
    });
  }, []);

  const paid = orders.filter((o) => o.payment?.status === 'paid');
  const pending = orders.filter((o) => o.payment?.status === 'pending');
  const failed = orders.filter((o) => o.payment?.status === 'failed');

  const totalRevenue = paid.reduce((sum, o) => sum + o.totalAmount, 0);

  return (
    <div>
      <h1 className="font-serif text-2xl font-bold text-gray-800 mb-6">Transactions</h1>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Total Revenue', value: `₹${totalRevenue.toLocaleString()}`, color: 'text-green-600 bg-green-50' },
          { label: 'Pending Payments', value: pending.length, color: 'text-yellow-600 bg-yellow-50' },
          { label: 'Failed Payments', value: failed.length, color: 'text-red-600 bg-red-50' },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl p-5 border border-gray-100">
            <div className={`inline-flex items-center justify-center w-10 h-10 rounded-lg mb-3 ${s.color}`}>
              <CreditCard size={20} />
            </div>
            <p className="text-2xl font-bold text-gray-800">{s.value}</p>
            <p className="text-sm text-gray-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {['Order ID', 'Customer', 'Amount', 'Payment ID', 'Status', 'Date'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left font-medium text-gray-500">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [...Array(6)].map((_, i) => (
                  <tr key={i} className="border-b border-gray-50">
                    {[...Array(6)].map((_, j) => <td key={j} className="px-4 py-3"><div className="h-4 bg-gray-100 rounded animate-pulse" /></td>)}
                  </tr>
                ))
              ) : orders.map((o) => (
                <tr key={o._id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-maroon-700">
                    <Link href={`/admin/orders/${o._id}`}>#{o.orderId}</Link>
                  </td>
                  <td className="px-4 py-3 text-gray-700">{o.customer?.name}</td>
                  <td className="px-4 py-3 font-bold text-gray-800">₹{o.totalAmount?.toLocaleString()}</td>
                  <td className="px-4 py-3 font-mono text-xs text-gray-500 max-w-[150px] truncate">
                    {o.payment?.razorpayPaymentId || '—'}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      o.payment?.status === 'paid' ? 'bg-green-100 text-green-700' :
                      o.payment?.status === 'failed' ? 'bg-red-100 text-red-600' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {o.payment?.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs">
                    {new Date(o.createdAt).toLocaleDateString('en-IN')}
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
