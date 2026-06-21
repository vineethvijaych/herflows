'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { adminApi } from '@/lib/api';

interface Coupon {
  id: string;
  code: string;
  discountPercent: number | null;
  discountAmount: number | null;
  maxUses: number | null;
  usedCount: number;
  expiresAt: string | null;
  active: boolean;
  createdAt: string;
}

interface PaginatedResponse {
  data: Coupon[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export default function CouponsPage() {
  const [data, setData] = useState<PaginatedResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await adminApi.get<PaginatedResponse>(`/admin/coupons?page=${page}&limit=10${search ? `&search=${search}` : ''}`);
      setData(res);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [page]);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this coupon?')) return;
    try {
      await adminApi.delete(`/admin/coupons/${id}`);
      fetchData();
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-admin-text">Coupons</h1>
          <p className="text-sm text-admin-text-muted mt-1">Manage discount coupons</p>
        </div>
        <Link href="/coupons/new">
          <Button><Plus className="w-4 h-4 mr-1" /> Add Coupon</Button>
        </Link>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by code..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && fetchData()}
            className="input-field pl-10"
          />
        </div>
        <Button variant="secondary" size="sm" onClick={fetchData}>Search</Button>
      </div>

      {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">{error}</div>}

      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="text-left p-3 font-medium text-gray-500">Code</th>
              <th className="text-left p-3 font-medium text-gray-500">Discount</th>
              <th className="text-left p-3 font-medium text-gray-500">Uses</th>
              <th className="text-left p-3 font-medium text-gray-500">Expires</th>
              <th className="text-left p-3 font-medium text-gray-500">Status</th>
              <th className="text-left p-3 font-medium text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="p-6 text-center text-gray-400">Loading...</td></tr>
            ) : data?.data.length === 0 ? (
              <tr><td colSpan={6} className="p-6 text-center text-gray-400">No coupons found</td></tr>
            ) : (
              data?.data.map(coupon => (
                <tr key={coupon.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="p-3 font-mono font-bold text-sm">{coupon.code}</td>
                  <td className="p-3">
                    {coupon.discountPercent ? `${coupon.discountPercent}%` : coupon.discountAmount ? `₹${coupon.discountAmount}` : '--'}
                  </td>
                  <td className="p-3">{coupon.usedCount}/{coupon.maxUses ?? '∞'}</td>
                  <td className="p-3 text-admin-text-muted">{coupon.expiresAt ? new Date(coupon.expiresAt).toLocaleDateString() : '--'}</td>
                  <td className="p-3">
                    <span className={coupon.active ? 'badge-success' : 'badge-error'}>
                      {coupon.active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <button onClick={() => handleDelete(coupon.id)} className="text-red-500 hover:text-red-700">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {data && data.totalPages > 1 && (
        <div className="flex items-center justify-between text-sm">
          <span className="text-admin-text-muted">Page {data.page} of {data.totalPages}</span>
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>Prev</Button>
            <Button variant="secondary" size="sm" disabled={page >= data.totalPages} onClick={() => setPage(p => p + 1)}>Next</Button>
          </div>
        </div>
      )}
    </div>
  );
}
