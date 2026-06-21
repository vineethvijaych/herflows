'use client';

import { useState, useEffect } from 'react';
import { FileText, Edit } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { adminApi } from '@/lib/api';

interface Policy {
  id: string;
  type: string;
  version: number;
  publishedAt: string;
}

interface PaginatedResponse {
  data: Policy[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

const policyLabels: Record<string, string> = {
  privacy_policy: 'Privacy Policy',
  terms_and_conditions: 'Terms & Conditions',
  cookie_policy: 'Cookie Policy',
  shipping_policy: 'Shipping Policy',
  return_policy: 'Return Policy',
  medical_disclaimer: 'Medical Disclaimer',
};

export default function PoliciesPage() {
  const [data, setData] = useState<PaginatedResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [editId, setEditId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await adminApi.get<PaginatedResponse>(`/admin/policies?page=${page}&limit=10`);
      setData(res);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [page]);

  const handleEdit = async (id: string) => {
    setSaving(true);
    setError('');
    try {
      await adminApi.patch(`/admin/policies/${id}`, { content: editContent });
      setEditId(null);
      setEditContent('');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-admin-text">Policies</h1>
        <p className="text-sm text-admin-text-muted mt-1">Manage legal policies and documents</p>
      </div>

      {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">{error}</div>}

      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="text-left p-3 font-medium text-gray-500">Policy Type</th>
              <th className="text-left p-3 font-medium text-gray-500">Version</th>
              <th className="text-left p-3 font-medium text-gray-500">Published</th>
              <th className="text-left p-3 font-medium text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={4} className="p-6 text-center text-gray-400">Loading...</td></tr>
            ) : data?.data.length === 0 ? (
              <tr><td colSpan={4} className="p-6 text-center text-gray-400">No policies found</td></tr>
            ) : (
              data?.data.map(policy => (
                <tr key={policy.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="p-3 font-medium flex items-center gap-2">
                    <FileText className="w-4 h-4 text-gray-400" />
                    {policyLabels[policy.type] || policy.type.replace(/_/g, ' ')}
                  </td>
                  <td className="p-3"><span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">v{policy.version}</span></td>
                  <td className="p-3 text-admin-text-muted">{policy.publishedAt ? new Date(policy.publishedAt).toLocaleDateString() : '--'}</td>
                  <td className="p-3">
                    {editId === policy.id ? (
                      <div className="flex items-center gap-2">
                        <textarea
                          className="input-field text-xs w-48"
                          rows={2}
                          value={editContent}
                          onChange={e => setEditContent(e.target.value)}
                          placeholder="New content..."
                        />
                        <Button size="sm" loading={saving} onClick={() => handleEdit(policy.id)}>Save</Button>
                        <Button variant="ghost" size="sm" onClick={() => setEditId(null)}>Cancel</Button>
                      </div>
                    ) : (
                      <Button variant="ghost" size="sm" onClick={() => { setEditId(policy.id); setEditContent(''); }}>
                        <Edit className="w-3 h-3 mr-1" /> Edit
                      </Button>
                    )}
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
