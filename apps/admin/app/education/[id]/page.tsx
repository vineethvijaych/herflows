'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Save } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { adminApi } from '@/lib/api';

export default function EditEducationPage() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ title: '', content: '', category: '', imageUrl: '' });

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await adminApi.get<any>(`/admin/education/${params.id}`);
        setForm({ title: res.title || '', content: res.content || '', category: res.category || '', imageUrl: res.imageUrl || '' });
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [params.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      await adminApi.patch(`/admin/education/${params.id}`, form);
      router.push('/education');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-6"><p className="text-admin-text-muted">Loading...</p></div>;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => router.back()} className="text-gray-400 hover:text-gray-600">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-admin-text">Edit Article</h1>
        </div>
      </div>

      {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">{error}</div>}

      <form onSubmit={handleSubmit} className="max-w-3xl">
        <div className="card p-6 space-y-4">
          <div>
            <label className="form-label">Title</label>
            <input className="input-field w-full" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
          </div>
          <div>
            <label className="form-label">Category</label>
            <input className="input-field w-full" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} required />
          </div>
          <div>
            <label className="form-label">Content</label>
            <textarea className="input-field w-full min-h-[200px]" value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} required />
          </div>
          <div>
            <label className="form-label">Image URL</label>
            <input className="input-field w-full" value={form.imageUrl} onChange={e => setForm({ ...form, imageUrl: e.target.value })} placeholder="https://..." />
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <Button variant="secondary" onClick={() => router.back()}>Cancel</Button>
          <Button type="submit" loading={saving}><Save className="w-4 h-4 mr-1" /> Save Changes</Button>
        </div>
      </form>
    </div>
  );
}
