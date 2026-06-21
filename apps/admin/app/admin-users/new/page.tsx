'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { adminApi } from '@/lib/api';

export default function NewAdminUserPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [roles, setRoles] = useState<{ id: string; name: string }[]>([]);
  const [form, setForm] = useState({ name: '', email: '', password: '', roleId: '' });

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const res = await adminApi.get<{ id: string; name: string }[]>('/admin/roles');
        setRoles(res);
        if (res.length > 0) setForm(f => ({ ...f, roleId: res[0].id }));
      } catch (err: any) {
        setError(err.message);
      }
    };
    fetchRoles();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      await adminApi.post('/admin/admin-users', form);
      router.push('/admin-users');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => router.back()} className="text-gray-400 hover:text-gray-600">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-admin-text">New Admin User</h1>
        </div>
      </div>

      {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">{error}</div>}

      <form onSubmit={handleSubmit} className="max-w-xl">
        <div className="card p-6 space-y-4">
          <div>
            <label className="form-label">Name</label>
            <input className="input-field w-full" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
          </div>
          <div>
            <label className="form-label">Email</label>
            <input className="input-field w-full" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
          </div>
          <div>
            <label className="form-label">Password</label>
            <input className="input-field w-full" type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required placeholder="Min 8 characters" />
          </div>
          <div>
            <label className="form-label">Role</label>
            <select className="input-field w-full" value={form.roleId} onChange={e => setForm({ ...form, roleId: e.target.value })} required>
              <option value="">Select a role</option>
              {roles.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
            </select>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <Button variant="secondary" onClick={() => router.back()}>Cancel</Button>
          <Button type="submit" loading={saving}><Save className="w-4 h-4 mr-1" /> Create Admin</Button>
        </div>
      </form>
    </div>
  );
}
