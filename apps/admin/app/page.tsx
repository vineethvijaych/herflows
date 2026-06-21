'use client';

import { useState, useEffect, useCallback } from 'react';
import { Users, ShoppingCart, RefreshCw, TrendingUp, Package } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { adminApi } from '@/lib/api';
import StatusBadge from '@/components/StatusBadge';

interface DashboardStats {
  activeUsers: number;
  activeOrders: number;
  activeSubscriptions: number;
  lowStockItems: number;
  totalRevenue: number;
}

interface RevenueEntry {
  month: string;
  revenue: number;
}

interface RecentOrder {
  id: string;
  user: { email: string };
  items: number;
  totalAmount: number;
  status: string;
  placedAt: string;
  payment: { status: string };
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [revenueData, setRevenueData] = useState<RevenueEntry[]>([]);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [statsRes, revenueRes, ordersRes] = await Promise.all([
        adminApi.get<DashboardStats>('/admin/dashboard/stats'),
        adminApi.get<RevenueEntry[]>('/admin/dashboard/revenue'),
        adminApi.get<RecentOrder[]>('/admin/dashboard/recent-orders'),
      ]);
      setStats(statsRes);
      setRevenueData(revenueRes);
      setRecentOrders(ordersRes);
    } catch (err: any) {
      setError(err.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-admin-accent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="card p-6 text-red-600">{error}</div>
      </div>
    );
  }

  const statCards = [
    { label: 'Active Users', value: stats?.activeUsers ?? 0, icon: Users, color: 'bg-blue-500' },
    { label: 'Active Orders', value: stats?.activeOrders ?? 0, icon: ShoppingCart, color: 'bg-green-500' },
    { label: 'Active Subscriptions', value: stats?.activeSubscriptions ?? 0, icon: RefreshCw, color: 'bg-purple-500' },
    { label: 'Low Stock Items', value: stats?.lowStockItems ?? 0, icon: Package, color: 'bg-red-500' },
    { label: 'Total Revenue', value: `₹${(stats?.totalRevenue ?? 0).toLocaleString()}`, icon: TrendingUp, color: 'bg-amber-500' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-admin-text mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        {statCards.map(stat => (
          <div key={stat.label} className="stat-card">
            <div className="flex items-center justify-between mb-3">
              <div className={`p-2 rounded-lg ${stat.color} bg-opacity-10`}>
                <stat.icon className={`w-5 h-5 ${stat.color.replace('bg-', 'text-')}`} />
              </div>
            </div>
            <p className="text-2xl font-bold text-admin-text">{stat.value}</p>
            <p className="text-xs text-admin-text-muted mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="card p-6">
          <h2 className="text-lg font-semibold mb-4">Revenue (Last 6 Months)</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#888" fontSize={12} />
                <YAxis stroke="#888" fontSize={12} />
                <Tooltip />
                <Bar dataKey="revenue" fill="#5867dd" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card p-6">
          <h2 className="text-lg font-semibold mb-4">Recent Orders</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-2 font-medium text-admin-text-secondary">ID</th>
                  <th className="text-left py-2 font-medium text-admin-text-secondary">Customer</th>
                  <th className="text-right py-2 font-medium text-admin-text-secondary">Amount</th>
                  <th className="text-left py-2 font-medium text-admin-text-secondary">Status</th>
                  <th className="text-left py-2 font-medium text-admin-text-secondary">Payment</th>
                  <th className="text-left py-2 font-medium text-admin-text-secondary">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map(order => (
                  <tr key={order.id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="py-2 pr-2 font-medium">{order.id}</td>
                    <td className="py-2 pr-2">{order.user.email}</td>
                    <td className="py-2 pr-2 text-right font-medium">₹{order.totalAmount}</td>
                    <td className="py-2 pr-2"><StatusBadge status={order.status} type="order" /></td>
                    <td className="py-2 pr-2"><StatusBadge status={order.payment.status} type="payment" /></td>
                    <td className="py-2 text-admin-text-secondary">{new Date(order.placedAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
