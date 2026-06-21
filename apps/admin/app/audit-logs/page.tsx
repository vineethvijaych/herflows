'use client';

import { useState, useEffect } from 'react';
import { ScrollText, Search } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { adminApi } from '@/lib/api';

interface AuditLog {
  id: string;
  action: string;
  entity: string;
  entityId: string;
  adminUser: { name: string; email: string };
  at: string;
}

interface PaginatedResponse {
  data: AuditLog[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export default function AuditLogsPage() {
  const [data, setData] = useState<PaginatedResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await adminApi.get<PaginatedResponse>(`/admin/audit-logs?page=${page}&limit=15${search ? `&search=${search}` : ''}`);
      setData(res);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [page]);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-admin-text">Audit Logs</h1>
          <p className="text-sm text-admin-text-muted mt-1">Read-only. All admin actions are permanently recorded.</p>
        </div>
        <div className="flex items-center space-x-2 bg-amber-50 text-amber-700 px-4 py-2 rounded-lg text-sm">
          <ScrollText className="w-4 h-4" />
          <span>Read Only</span>
        </div>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by admin or action..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && fetchData()}
            className="input-field pl-10"
          />
        </div>
        <Button variant="secondary" size="sm" onClick={fetchData}>Search</Button>
      </div>

      {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4">{error}</div>}

      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="text-left p-3 font-medium text-admin-text-muted">Admin</th>
              <th className="text-left p-3 font-medium text-admin-text-muted">Action</th>
              <th className="text-left p-3 font-medium text-admin-text-muted">Entity</th>
              <th className="text-left p-3 font-medium text-admin-text-muted">Entity ID</th>
              <th className="text-left p-3 font-medium text-admin-text-muted">Date</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} className="p-6 text-center text-gray-400">Loading...</td></tr>
            ) : data?.data.length === 0 ? (
              <tr><td colSpan={5} className="p-6 text-center text-gray-400">No audit logs found</td></tr>
            ) : (
              data?.data.map(log => (
                <tr key={log.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="p-3">{log.adminUser.name}<br /><span className="text-xs text-admin-text-muted">{log.adminUser.email}</span></td>
                  <td className="p-3"><span className="badge-info">{log.action.replace(/_/g, ' ')}</span></td>
                  <td className="p-3">{log.entity}</td>
                  <td className="p-3 text-admin-text-muted font-mono text-xs">{log.entityId}</td>
                  <td className="p-3 text-admin-text-muted">{new Date(log.at).toLocaleString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {data && data.totalPages > 1 && (
        <div className="flex items-center justify-between text-sm mt-4">
          <span className="text-admin-text-muted">Page {data.page} of {data.totalPages}</span>
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>Prev</Button>
            <Button variant="secondary" size="sm" disabled={page >= data.totalPages} onClick={() => setPage(p => p + 1)}>Next</Button>
          </div>
        </div>
      )}

      <p className="text-xs text-admin-text-muted mt-4 italic">
        Audit logs are append-only. Records cannot be edited or deleted.
      </p>
    </div>
  );
}
