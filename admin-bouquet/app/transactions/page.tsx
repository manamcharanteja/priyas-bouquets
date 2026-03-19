'use client';

import { useEffect, useState } from 'react';
import { orderAPI } from '@/lib/api';
import Link from 'next/link';
import { IndianRupee } from 'lucide-react';

export default function TransactionsPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    orderAPI.getAll({ limit: 100 }).then(r => { setOrders(r.data.orders || []); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const paid = orders.filter(o => o.payment?.status === 'paid');
  const pending = orders.filter(o => o.payment?.status === 'pending');
  const revenue = paid.reduce((s, o) => s + o.totalAmount, 0);

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-serif text-2xl font-bold text-gray-800">Transactions</h1>
        <p className="text-gray-400 text-sm mt-1">All payment records</p>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Total Revenue', value: `₹${revenue.toLocaleString()}`, color: 'text-green-600 bg-green-50' },
          { label: 'Paid Orders', value: paid.length, color: 'text-blue-600 bg-blue-50' },
          { label: 'Pending Payments', value: pending.length, color: 'text-yellow-600 bg-yellow-50' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${s.color}`}><IndianRupee size={18} /></div>
            <p className="text-2xl font-bold text-gray-800">{s.value}</p>
            <p className="text-xs text-gray-400 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>{['Order ID', 'Customer', 'Amount', 'Razorpay ID', 'Status', 'Date'].map(h => (
                <th key={h} className="px-5 py-3 text-left text-xs font-medium text-gray-400">{h}</th>
              ))}</tr>
            </thead>
            <tbody>
              {loading ? [...Array(5)].map((_, i) => (
                <tr key={i} className="border-b border-gray-50">
                  {[...Array(6)].map((_, j) => <td key={j} className="px-5 py-4"><div className="h-4 bg-gray-100 rounded animate-pulse" /></td>)}
                </tr>
              )) : orders.map(o => (
                <tr key={o._id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="px-5 py-4 font-medium text-maroon-700"><Link href={`/orders/${o._id}`}>#{o.orderId}</Link></td>
                  <td className="px-5 py-4 text-gray-700">{o.customer?.name}</td>
                  <td className="px-5 py-4 font-bold">₹{o.totalAmount?.toLocaleString()}</td>
                  <td className="px-5 py-4 font-mono text-xs text-gray-400 truncate max-w-[140px]">{o.payment?.razorpayPaymentId || '—'}</td>
                  <td className="px-5 py-4">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${o.payment?.status === 'paid' ? 'bg-green-100 text-green-700' : o.payment?.status === 'failed' ? 'bg-red-100 text-red-600' : 'bg-yellow-100 text-yellow-700'}`}>
                      {o.payment?.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-xs text-gray-400">{new Date(o.createdAt).toLocaleDateString('en-IN')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
