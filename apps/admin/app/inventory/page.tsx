'use client';

import { useState, useEffect } from 'react';
import { AlertTriangle, Search, ClipboardList } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { adminApi } from '@/lib/api';

interface InventoryItem {
  id: string;
  sku: string;
  price: number;
  stockQty: number;
  product: { name: string; brand: { name: string } };
}

interface PaginatedResponse {
  data: InventoryItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export default function InventoryPage() {
  const [data, setData] = useState<PaginatedResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [lowStockOnly, setLowStockOnly] = useState(false);
  const [search, setSearch] = useState('');
  const [adjustVariantId, setAdjustVariantId] = useState<string | null>(null);
  const [adjustForm, setAdjustForm] = useState({ delta: '', reason: '' });
  const [saving, setSaving] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams({ page: String(page), limit: '15' });
      if (lowStockOnly) params.set('lowStock', 'true');
      if (search) params.set('search', search);
      const res = await adminApi.get<PaginatedResponse>(`/admin/inventory?${params}`);
      setData(res);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [page, lowStockOnly]);

  const handleAdjust = async () => {
    if (!adjustVariantId) return;
    setSaving(true);
    setError('');
    try {
      await adminApi.post('/admin/inventory/adjust', {
        variantId: adjustVariantId,
        delta: parseInt(adjustForm.delta, 10),
        reason: adjustForm.reason,
      });
      setAdjustVariantId(null);
      setAdjustForm({ delta: '', reason: '' });
      fetchData();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const stockColor = (qty: number) => {
    if (qty === 0) return 'text-red-600 font-bold';
    if (qty < 10) return 'text-amber-600 font-medium';
    return '';
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-admin-text">Inventory</h1>
          <p className="text-sm text-admin-text-muted mt-1">Track and manage stock levels</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by SKU or product..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && fetchData()}
            className="input-field pl-10"
          />
        </div>
        <Button variant="secondary" size="sm" onClick={fetchData}>Search</Button>
        <label className="flex items-center gap-2 cursor-pointer text-sm">
          <input type="checkbox" checked={lowStockOnly} onChange={e => { setLowStockOnly(e.target.checked); setPage(1); }} className="rounded border-gray-300 text-admin-accent" />
          Low stock only
        </label>
      </div>

      {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">{error}</div>}

      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="text-left p-3 font-medium text-gray-500">SKU</th>
              <th className="text-left p-3 font-medium text-gray-500">Product</th>
              <th className="text-left p-3 font-medium text-gray-500">Brand</th>
              <th className="text-left p-3 font-medium text-gray-500">Price</th>
              <th className="text-left p-3 font-medium text-gray-500">Stock</th>
              <th className="text-left p-3 font-medium text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="p-6 text-center text-gray-400">Loading...</td></tr>
            ) : data?.data.length === 0 ? (
              <tr><td colSpan={6} className="p-6 text-center text-gray-400">No inventory items found</td></tr>
            ) : (
              data?.data.map(item => (
                <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="p-3 font-mono text-xs">{item.sku}</td>
                  <td className="p-3 font-medium">{item.product.name}</td>
                  <td className="p-3 text-admin-text-muted">{item.product.brand.name}</td>
                  <td className="p-3">₹{item.price}</td>
                  <td className={`p-3 ${stockColor(item.stockQty)}`}>{item.stockQty}</td>
                  <td className="p-3">
                    {adjustVariantId === item.id ? (
                      <div className="flex items-center gap-2">
                        <input
                          className="input-field w-20 text-xs"
                          type="number"
                          placeholder="Delta"
                          value={adjustForm.delta}
                          onChange={e => setAdjustForm({ ...adjustForm, delta: e.target.value })}
                        />
                        <input
                          className="input-field w-28 text-xs"
                          placeholder="Reason"
                          value={adjustForm.reason}
                          onChange={e => setAdjustForm({ ...adjustForm, reason: e.target.value })}
                        />
                        <Button size="sm" loading={saving} onClick={handleAdjust}>Save</Button>
                        <Button variant="ghost" size="sm" onClick={() => setAdjustVariantId(null)}>X</Button>
                      </div>
                    ) : (
                      <Button variant="ghost" size="sm" onClick={() => { setAdjustVariantId(item.id); setAdjustForm({ delta: '', reason: '' }); }}>
                        <ClipboardList className="w-3 h-3 mr-1" /> Adjust
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
