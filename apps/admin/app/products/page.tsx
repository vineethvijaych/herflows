'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Plus, Edit, Search } from 'lucide-react';
import { adminApi } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import StatusBadge from '@/components/StatusBadge';

interface Product {
  id: string;
  name: string;
  brand: { name: string };
  category: { name: string };
  variants: Array<{ price: number; stockQty: number }>;
  status: string;
  images: { url: string }[];
}

interface PaginatedResponse {
  data: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({ page: String(page), limit: '20' });
      if (search) params.set('search', search);
      const res = await adminApi.get<PaginatedResponse>(`/admin/products?${params}`);
      setProducts(res.data);
      setTotal(res.total);
      setTotalPages(res.totalPages);
    } catch (err: any) {
      setError(err.message || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleSearch = (val: string) => {
    setSearch(val);
    setPage(1);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-admin-text">Products</h1>
        <Link href="/products/new">
          <Button><Plus className="w-4 h-4 mr-1" /> Add Product</Button>
        </Link>
      </div>

      {error && <div className="card p-4 text-red-600 text-sm mb-4">{error}</div>}

      <div className="relative max-w-xs mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={e => handleSearch(e.target.value)}
          className="input-field pl-10"
        />
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
                  <th className="text-left p-3 font-medium text-gray-500 w-14">Image</th>
                  <th className="text-left p-3 font-medium text-gray-500">Product Name</th>
                  <th className="text-left p-3 font-medium text-gray-500">Brand</th>
                  <th className="text-left p-3 font-medium text-gray-500">Category</th>
                  <th className="text-left p-3 font-medium text-gray-500">Price</th>
                  <th className="text-left p-3 font-medium text-gray-500">Stock</th>
                  <th className="text-left p-3 font-medium text-gray-500">Status</th>
                  <th className="text-left p-3 font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-6 text-center text-gray-500">No products found.</td>
                  </tr>
                ) : (
                  products.map(product => {
                    const minPrice = product.variants.length > 0
                      ? Math.min(...product.variants.map(v => v.price))
                      : 0;
                    const totalStock = product.variants.reduce((sum, v) => sum + v.stockQty, 0);
                    return (
                      <tr key={product.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="p-3">
                          {product.images?.[0]?.url ? (
                            <img src={product.images[0].url} alt="" className="w-10 h-10 rounded-lg object-cover" />
                          ) : (
                            <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-300">
                              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                            </div>
                          )}
                        </td>
                        <td className="p-3 font-medium">{product.name}</td>
                        <td className="p-3 text-gray-600">{product.brand.name}</td>
                        <td className="p-3 text-gray-600">{product.category.name}</td>
                        <td className="p-3">₹{minPrice}</td>
                        <td className="p-3">
                          <span className={totalStock === 0 ? 'text-red-600 font-medium' : totalStock < 50 ? 'text-amber-600' : ''}>
                            {totalStock}
                          </span>
                        </td>
                        <td className="p-3"><StatusBadge status={product.status} /></td>
                        <td className="p-3">
                          <Link href={`/products/${product.id}`}>
                            <Button variant="ghost" size="sm"><Edit className="w-3 h-3 mr-1" /> Edit</Button>
                          </Link>
                        </td>
                      </tr>
                    );
                  })
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
