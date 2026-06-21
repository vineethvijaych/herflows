'use client';

import { useState, useEffect, useCallback } from 'react';
import { Check, X } from 'lucide-react';
import { adminApi } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import StatusBadge from '@/components/StatusBadge';

interface Review {
  id: string;
  rating: number;
  text: string;
  status: string;
  user: { email: string };
  product: { name: string };
  createdAt: string;
}

interface PaginatedResponse {
  data: Review[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

const statusFilters = ['', 'pending', 'approved', 'rejected'];

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchReviews = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({ page: String(page), limit: '20' });
      if (statusFilter) params.set('status', statusFilter);
      const res = await adminApi.get<PaginatedResponse>(`/admin/reviews?${params}`);
      setReviews(res.data);
      setTotal(res.total);
      setTotalPages(res.totalPages);
    } catch (err: any) {
      setError(err.message || 'Failed to load reviews');
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const handleModerate = async (id: string, status: 'approved' | 'rejected') => {
    try {
      await adminApi.patch(`/admin/reviews/${id}/moderate`, { status });
      setReviews(prev => prev.map(r => r.id === id ? { ...r, status } : r));
    } catch (err: any) {
      setError(err.message || 'Failed to moderate review');
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-admin-text mb-6">Reviews Moderation</h1>

      {error && <div className="card p-4 text-red-600 text-sm mb-4">{error}</div>}

      <div className="flex items-center gap-4 mb-6">
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          className="input-field max-w-[160px]"
        >
          <option value="">All Statuses</option>
          {statusFilters.filter(Boolean).map((s) => (
            <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="flex items-center justify-center p-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-admin-accent"></div>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {reviews.length === 0 ? (
              <div className="card p-6 text-center text-gray-500">No reviews found.</div>
            ) : (
              reviews.map(review => (
                <div key={review.id} className="card p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <p className="font-medium">{review.user.email}</p>
                        <span className="text-xs text-gray-500">on {review.product.name}</span>
                        <div className="flex">
                          {Array.from({ length: review.rating }).map((_, i) => (
                            <span key={i} className="text-amber-400 text-sm">★</span>
                          ))}
                        </div>
                        <StatusBadge status={review.status} type="review" />
                      </div>
                      <p className="text-sm text-gray-600">{review.text.length > 200 ? review.text.substring(0, 200) + '...' : review.text}</p>
                      <p className="text-xs text-gray-400 mt-1">{new Date(review.createdAt).toLocaleDateString()}</p>
                    </div>

                    {review.status === 'pending' && (
                      <div className="flex space-x-2 ml-4">
                        <Button size="sm" variant="primary" onClick={() => handleModerate(review.id, 'approved')}>
                          <Check className="w-3 h-3 mr-1" /> Approve
                        </Button>
                        <Button size="sm" variant="danger" onClick={() => handleModerate(review.id, 'rejected')}>
                          <X className="w-3 h-3 mr-1" /> Reject
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
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
  );
}
