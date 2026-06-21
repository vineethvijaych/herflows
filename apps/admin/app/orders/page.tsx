'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Search, Eye } from 'lucide-react';
import { adminApi } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import StatusBadge from '@/components/StatusBadge';

interface Order {
  id: string;
  user: { email: string };
  items: number;
  totalAmount: number;
  status: string;
  placedAt: string;
  payment: { status: string };
  shipment?: any;
}

interface PaginatedResponse {
  data: Order[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

const orderStatuses = ['', 'pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({ page: String(page), limit: '20' });
      if (search) params.set('search', search);
      if (statusFilter) params.set('status', statusFilter);
      const res = await adminApi.get<PaginatedResponse>(`/admin/orders?${params}`);
      setOrders(res.data);
      setTotal(res.total);
      setTotalPages(res.totalPages);
    } catch (err: any) {
      setError(err.message || 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  }, [page, search, statusFilter]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleSearch = (val: string) => {
    setSearch(val);
    setPage(1);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-admin-text mb-6">Orders</h1>

      {error && <div className="card p-4 text-red-600 text-sm mb-4">{error}</div>}

      <div className="flex items-center space-x-4 mb-6">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search orders..."
            value={search}
            onChange={e => handleSearch(e.target.value)}
            className="input-field pl-10"
          />
        </div>
        <select
          value={statusFilter}
          onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
          className="input-field max-w-[160px]"
        >
          <option value="">All Statuses</option>
          {orderStatuses.filter(Boolean).map(s => (
            <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
          ))}
        </select>
      </div>

      <div className="card overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center p-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-admin-accent"></div>
          </div>
        ) : (
          <>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left p-3 font-medium text-gray-500">Order ID</th>
                  <th className="text-left p-3 font-medium text-gray-500">Customer</th>
                  <th className="text-left p-3 font-medium text-gray-500">Items</th>
                  <th className="text-left p-3 font-medium text-gray-500">Amount</th>
                  <th className="text-left p-3 font-medium text-gray-500">Status</th>
                  <th className="text-left p-3 font-medium text-gray-500">Payment</th>
                  <th className="text-left p-3 font-medium text-gray-500">Date</th>
                  <th className="text-left p-3 font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-6 text-center text-gray-500">No orders found.</td>
                  </tr>
                ) : (
                  orders.map(order => (
                    <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="p-3 font-medium">{order.id}</td>
                      <td className="p-3">{order.user.email}</td>
                      <td className="p-3">{order.items}</td>
                      <td className="p-3 font-medium">₹{order.totalAmount}</td>
                      <td className="p-3"><StatusBadge status={order.status} type="order" /></td>
                      <td className="p-3"><StatusBadge status={order.payment.status} type="payment" /></td>
                      <td className="p-3 text-gray-500">{new Date(order.placedAt).toLocaleDateString()}</td>
                      <td className="p-3">
                        <Link href={`/orders/${order.id}`}>
                          <Button variant="ghost" size="sm"><Eye className="w-3 h-3 mr-1" /> View</Button>
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            {totalPages > 1 && (
              <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
                <p className="text-sm text-admin-text-secondary">Page {page} of {totalPages} ({total} total)</p>
                <div className="flex gap-2">
                  <Button size="sm" variant="secondary" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>Prev</Button>
                  <Button size="sm" variant="secondary" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}>Next</Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
