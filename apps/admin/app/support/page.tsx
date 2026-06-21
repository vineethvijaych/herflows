'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { MessageSquare } from 'lucide-react';
import { adminApi } from '@/lib/api';
import { Button } from '@/components/ui/Button';

export default function AdminSupportPage() {
  const [data, setData] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [totalPages, setTotalPages] = useState(0);
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');
    adminApi.get<{ data: any[]; total: number; page: number; limit: number; totalPages: number }>(
      `/admin/support?page=${page}&limit=${limit}${statusFilter ? `&status=${statusFilter}` : ''}`
    )
      .then(res => {
        setData(res.data);
        setTotal(res.total);
        setTotalPages(res.totalPages);
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [page, statusFilter]);

  return (
    <div>
      <h1 className="text-2xl font-bold text-admin-text mb-6">Support Tickets</h1>

      <div className="flex items-center space-x-4 mb-6">
        <select
          value={statusFilter}
          onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
          className="input-field w-40"
        >
          <option value="">All Status</option>
          <option value="open">Open</option>
          <option value="pending">Pending</option>
          <option value="resolved">Resolved</option>
        </select>
        <span className="text-sm text-gray-500">{total} tickets</span>
      </div>

      {error && <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-4">{error}</div>}

      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="text-left p-3 font-medium text-gray-500">Ticket ID</th>
              <th className="text-left p-3 font-medium text-gray-500">User</th>
              <th className="text-left p-3 font-medium text-gray-500">Subject</th>
              <th className="text-left p-3 font-medium text-gray-500">Status</th>
              <th className="text-left p-3 font-medium text-gray-500">Date</th>
              <th className="text-left p-3 font-medium text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="p-6 text-center text-gray-500">Loading...</td></tr>
            ) : data.length === 0 ? (
              <tr><td colSpan={6} className="p-6 text-center text-gray-500">No tickets found</td></tr>
            ) : data.map(ticket => (
              <tr key={ticket.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="p-3 font-medium">{ticket.id.slice(0, 8)}</td>
                <td className="p-3">{ticket.user?.email || 'N/A'}</td>
                <td className="p-3">{ticket.subject}</td>
                <td className="p-3">
                  <span className={
                    ticket.status === 'open' ? 'badge-error' :
                    ticket.status === 'pending' ? 'badge-warning' : 'badge-success'
                  }>
                    {ticket.status}
                  </span>
                </td>
                <td className="p-3 text-gray-500">{new Date(ticket.createdAt).toLocaleDateString()}</td>
                <td className="p-3">
                  <Link href={`/support/${ticket.id}`}>
                    <span className="text-admin-accent hover:underline text-sm cursor-pointer">View</span>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4 text-sm text-gray-500">
          <span>Page {page} of {totalPages}</span>
          <div className="flex space-x-2">
            <Button variant="ghost" size="sm" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>Prev</Button>
            <Button variant="ghost" size="sm" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}>Next</Button>
          </div>
        </div>
      )}
    </div>
  );
}
