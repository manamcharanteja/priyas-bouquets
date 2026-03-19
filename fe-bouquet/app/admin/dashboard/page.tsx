'use client';

import { useEffect, useState } from 'react';
import { orderAPI } from '@/lib/api';
import { Package, TrendingUp, IndianRupee, Clock } from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    orderAPI.getStats().then((r) => setStats(r.data));
    orderAPI.getAll({ limit: 5 }).then((r) => setOrders(r.data.orders));
  }, []);

  const statCards = stats
    ? [
        { label: 'Total Orders', value: stats.totalOrders, icon: Package, color: 'bg-blue-50 text-blue-600' },
        { label: "Today's Orders", value: stats.todayOrders, icon: TrendingUp, color: 'bg-green-50 text-green-600' },
        { label: 'This Month Revenue', value: `₹${stats.monthRevenue?.toLocaleString()}`, icon: IndianRupee, color: 'bg-gold-50 text-gold-600' },
        { label: 'Pending Orders', value: stats.pendingOrders, icon: Clock, color: 'bg-red-50 text-red-600' },
      ]
    : [];

  return (
    <div>
      <h1 className="font-serif text-2xl font-bold text-gray-800 mb-8">Dashboard</h1>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats ? statCards.map((s) => (
          <div key={s.label} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${s.color}`}>
              <s.icon size={20} />
            </div>
            <p className="text-2xl font-bold text-gray-800">{s.value}</p>
            <p className="text-sm text-gray-500 mt-1">{s.label}</p>
          </div>
        )) : (
          [...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl p-5 animate-pulse">
              <div className="w-10 h-10 bg-gray-100 rounded-lg mb-3" />
              <div className="h-6 bg-gray-100 rounded w-16 mb-1" />
              <div className="h-4 bg-gray-50 rounded w-24" />
            </div>
          ))
        )}
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-serif text-lg font-semibold text-gray-800">Recent Orders</h2>
          <Link href="/admin/orders" className="text-maroon-700 text-sm hover:underline">View All</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-gray-500 text-left">
                <th className="pb-3 font-medium">Order ID</th>
                <th className="pb-3 font-medium">Customer</th>
                <th className="pb-3 font-medium">Amount</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o._id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="py-3 font-medium text-maroon-700">
                    <Link href={`/admin/orders/${o._id}`}>#{o.orderId}</Link>
                  </td>
                  <td className="py-3 text-gray-700">{o.customer?.name}</td>
                  <td className="py-3 font-medium">₹{o.totalAmount?.toLocaleString()}</td>
                  <td className="py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      o.orderStatus === 'delivered' ? 'bg-green-100 text-green-700' :
                      o.orderStatus === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                      o.orderStatus === 'cancelled' ? 'bg-red-100 text-red-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {o.orderStatus}
                    </span>
                  </td>
                  <td className="py-3 text-gray-500">{new Date(o.createdAt).toLocaleDateString('en-IN')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
