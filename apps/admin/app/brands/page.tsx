'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { adminApi } from '@/lib/api';

interface Brand {
  id: string;
  name: string;
  description: string;
}

export default function BrandsPage() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', description: '' });
  const [saving, setSaving] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await adminApi.get<{ data: Brand[] }>('/admin/brands');
      setBrands(res.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const openNew = () => {
    setEditId(null);
    setForm({ name: '', description: '' });
    setShowForm(true);
  };

  const openEdit = (brand: Brand) => {
    setEditId(brand.id);
    setForm({ name: brand.name, description: brand.description || '' });
    setShowForm(true);
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    try {
      if (editId) {
        await adminApi.patch(`/admin/brands/${editId}`, form);
      } else {
        await adminApi.post('/admin/brands', form);
      }
      setShowForm(false);
      fetchData();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this brand?')) return;
    try {
      await adminApi.delete(`/admin/brands/${id}`);
      fetchData();
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-admin-text">Brands</h1>
          <p className="text-sm text-admin-text-muted mt-1">Manage product brands</p>
        </div>
        <Button onClick={openNew}><Plus className="w-4 h-4 mr-1" /> Add Brand</Button>
      </div>

      {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">{error}</div>}

      {showForm && (
        <div className="card p-4">
          <div className="flex items-end gap-4">
            <div className="flex-1">
              <label className="form-label">Name</label>
              <input className="input-field w-full" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div className="flex-1">
              <label className="form-label">Description</label>
              <input className="input-field w-full" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
            </div>
            <div className="flex gap-2">
              <Button size="sm" loading={saving} onClick={handleSave}>{editId ? 'Save' : 'Create'}</Button>
              <Button variant="ghost" size="sm" onClick={() => setShowForm(false)}>Cancel</Button>
            </div>
          </div>
        </div>
      )}

      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="text-left p-3 font-medium text-gray-500">Name</th>
              <th className="text-left p-3 font-medium text-gray-500">Description</th>
              <th className="text-left p-3 font-medium text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={3} className="p-6 text-center text-gray-400">Loading...</td></tr>
            ) : brands.length === 0 ? (
              <tr><td colSpan={3} className="p-6 text-center text-gray-400">No brands found</td></tr>
            ) : (
              brands.map(brand => (
                <tr key={brand.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="p-3 font-medium">{brand.name}</td>
                  <td className="p-3 text-admin-text-muted">{brand.description || '--'}</td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <button onClick={() => openEdit(brand)} className="text-admin-accent hover:text-admin-accent-hover"><Edit className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete(brand.id)} className="text-red-500 hover:text-red-700"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
