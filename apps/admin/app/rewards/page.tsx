'use client';

import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { adminApi } from '@/lib/api';

interface Reward {
  id: string;
  type: string;
  source: string;
  amount: number;
  balanceAfter: number;
  user: { email: string };
  createdAt: string;
}

interface PaginatedResponse {
  data: Reward[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export default function RewardsPage() {
  const [data, setData] = useState<PaginatedResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await adminApi.get<PaginatedResponse>(`/admin/rewards?page=${page}&limit=15${search ? `&search=${search}` : ''}`);
      setData(res);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [page]);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-admin-text">Rewards</h1>
        <p className="text-sm text-admin-text-muted mt-1">Customer reward point transactions</p>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by user email..."
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
              <th className="text-left p-3 font-medium text-gray-500">User</th>
              <th className="text-left p-3 font-medium text-gray-500">Type</th>
              <th className="text-left p-3 font-medium text-gray-500">Source</th>
              <th className="text-left p-3 font-medium text-gray-500">Amount</th>
              <th className="text-left p-3 font-medium text-gray-500">Balance After</th>
              <th className="text-left p-3 font-medium text-gray-500">Date</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="p-6 text-center text-gray-400">Loading...</td></tr>
            ) : data?.data.length === 0 ? (
              <tr><td colSpan={6} className="p-6 text-center text-gray-400">No rewards found</td></tr>
            ) : (
              data?.data.map(r => (
                <tr key={r.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="p-3">{r.user.email}</td>
                  <td className="p-3">
                    <span className={r.type === 'earn' ? 'badge-success' : 'badge-error'}>
                      {r.type}
                    </span>
                  </td>
                  <td className="p-3 text-admin-text-muted">{r.source}</td>
                  <td className="p-3 font-medium">
                    <span className={r.amount > 0 ? 'text-green-600' : 'text-red-600'}>
                      {r.amount > 0 ? '+' : ''}{r.amount}
                    </span>
                  </td>
                  <td className="p-3">{r.balanceAfter}</td>
                  <td className="p-3 text-admin-text-muted">{new Date(r.createdAt).toLocaleString()}</td>
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
