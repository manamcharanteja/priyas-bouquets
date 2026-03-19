'use client';

import { useEffect, useState } from 'react';
import { orderAPI } from '@/lib/api';
import { Package, TrendingUp, IndianRupee, Clock } from 'lucide-react';
import Link from 'next/link';

export default function Dashboard() {
  const [stats, setStats] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    orderAPI.getStats().then((r) => setStats(r.data)).catch(() => {});
    orderAPI.getAll({ limit: 8 }).then((r) => setOrders(r.data.orders || [])).catch(() => {});
  }, []);

  const cards = stats ? [
    { label: 'Total Orders', value: stats.totalOrders, icon: Package, color: 'bg-blue-50 text-blue-600' },
    { label: "Today's Orders", value: stats.todayOrders, icon: TrendingUp, color: 'bg-green-50 text-green-600' },
    { label: 'Month Revenue', value: `₹${(stats.monthRevenue || 0).toLocaleString()}`, icon: IndianRupee, color: 'bg-amber-50 text-amber-600' },
    { label: 'Pending Orders', value: stats.pendingOrders, icon: Clock, color: 'bg-red-50 text-red-500' },
  ] : [];

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-serif text-2xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-400 text-sm mt-1">Welcome back, Priya 🌸</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats ? cards.map((c) => (
          <div key={c.label} className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${c.color}`}>
              <c.icon size={20} />
            </div>
            <p className="text-2xl font-bold text-gray-800">{c.value}</p>
            <p className="text-xs text-gray-400 mt-1">{c.label}</p>
          </div>
        )) : [...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl p-5 animate-pulse border border-gray-100">
            <div className="w-10 h-10 bg-gray-100 rounded-lg mb-3" />
            <div className="h-6 bg-gray-100 rounded w-16 mb-1" />
            <div className="h-3 bg-gray-50 rounded w-24" />
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
        <div className="flex justify-between items-center p-5 border-b border-gray-100">
          <h2 className="font-semibold text-gray-800">Recent Orders</h2>
          <Link href="/orders" className="text-maroon-700 text-sm hover:underline">View all</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-gray-400 text-xs border-b border-gray-50">
                <th className="px-5 py-3 text-left font-medium">Order ID</th>
                <th className="px-5 py-3 text-left font-medium">Customer</th>
                <th className="px-5 py-3 text-left font-medium">Total</th>
                <th className="px-5 py-3 text-left font-medium">Payment</th>
                <th className="px-5 py-3 text-left font-medium">Status</th>
                <th className="px-5 py-3 text-left font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr><td colSpan={6} className="px-5 py-10 text-center text-gray-400">No orders yet</td></tr>
              ) : orders.map((o) => (
                <tr key={o._id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3 font-medium text-maroon-700">
                    <Link href={`/orders/${o._id}`}>#{o.orderId}</Link>
                  </td>
                  <td className="px-5 py-3 text-gray-700">{o.customer?.name}</td>
                  <td className="px-5 py-3 font-semibold">₹{o.totalAmount?.toLocaleString()}</td>
                  <td className="px-5 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      o.payment?.status === 'paid' ? 'bg-green-100 text-green-700' :
                      o.payment?.status === 'failed' ? 'bg-red-100 text-red-600' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>{o.payment?.status}</span>
                  </td>
                  <td className="px-5 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${
                      o.orderStatus === 'delivered' ? 'bg-green-100 text-green-700' :
                      o.orderStatus === 'cancelled' ? 'bg-red-100 text-red-600' :
                      o.orderStatus === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>{o.orderStatus}</span>
                  </td>
                  <td className="px-5 py-3 text-gray-400 text-xs">{new Date(o.createdAt).toLocaleDateString('en-IN')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
