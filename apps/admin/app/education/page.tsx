'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { adminApi } from '@/lib/api';

interface Article {
  id: string;
  title: string;
  category: string;
  publishedAt: string;
}

interface PaginatedResponse {
  data: Article[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export default function EducationPage() {
  const [data, setData] = useState<PaginatedResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await adminApi.get<PaginatedResponse>(`/admin/education?page=${page}&limit=10${search ? `&search=${search}` : ''}`);
      setData(res);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [page]);

  const handleSearch = () => { setPage(1); fetchData(); };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this article?')) return;
    try {
      await adminApi.delete(`/admin/education/${id}`);
      fetchData();
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-admin-text">Education</h1>
          <p className="text-sm text-admin-text-muted mt-1">Manage educational articles</p>
        </div>
        <Link href="/education/new">
          <Button><Plus className="w-4 h-4 mr-1" /> Add Article</Button>
        </Link>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search articles..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSearch()}
            className="input-field pl-10"
          />
        </div>
        <Button variant="secondary" onClick={handleSearch}>Search</Button>
      </div>

      {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">{error}</div>}

      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="text-left p-3 font-medium text-gray-500">Title</th>
              <th className="text-left p-3 font-medium text-gray-500">Category</th>
              <th className="text-left p-3 font-medium text-gray-500">Published</th>
              <th className="text-left p-3 font-medium text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={4} className="p-6 text-center text-gray-400">Loading...</td></tr>
            ) : data?.data.length === 0 ? (
              <tr><td colSpan={4} className="p-6 text-center text-gray-400">No articles found</td></tr>
            ) : (
              data?.data.map(article => (
                <tr key={article.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="p-3 font-medium">{article.title}</td>
                  <td className="p-3"><span className="badge-info">{article.category}</span></td>
                  <td className="p-3 text-admin-text-muted">{article.publishedAt ? new Date(article.publishedAt).toLocaleDateString() : '--'}</td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <Link href={`/education/${article.id}`}>
                        <Button variant="ghost" size="sm"><Edit className="w-3 h-3 mr-1" /> Edit</Button>
                      </Link>
                      <button onClick={() => handleDelete(article.id)} className="text-red-500 hover:text-red-700">
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
