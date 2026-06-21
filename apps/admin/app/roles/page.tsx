'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Shield } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { adminApi } from '@/lib/api';

interface Role {
  id: string;
  name: string;
  permissions: { module: string; action: string }[];
  _count: { adminUsers: number };
}

export default function RolesPage() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', permissionStrings: '' });
  const [saving, setSaving] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await adminApi.get<Role[]>('/admin/roles');
      setRoles(res);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const openNew = () => {
    setEditId(null);
    setForm({ name: '', permissionStrings: '' });
    setShowForm(true);
  };

  const openEdit = (role: Role) => {
    setEditId(role.id);
    setForm({ name: role.name, permissionStrings: role.permissions.map(p => `${p.module}:${p.action}`).join(', ') });
    setShowForm(true);
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    try {
      const permissions = form.permissionStrings.split(',').map(s => s.trim()).filter(Boolean).map(s => {
        const [module, action] = s.split(':');
        return { module, action };
      });
      const body = { name: form.name, permissions };
      if (editId) {
        await adminApi.patch(`/admin/roles/${editId}`, body);
      } else {
        await adminApi.post('/admin/roles', body);
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
    if (!confirm('Delete this role?')) return;
    try {
      await adminApi.delete(`/admin/roles/${id}`);
      fetchData();
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-admin-text">Roles & Permissions</h1>
          <p className="text-sm text-admin-text-muted mt-1">Define roles and permissions</p>
        </div>
        <Button onClick={openNew}><Plus className="w-4 h-4 mr-1" /> New Role</Button>
      </div>

      {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">{error}</div>}

      {showForm && (
        <div className="card p-4">
          <div className="space-y-4">
            <div className="flex items-end gap-4">
              <div className="flex-1">
                <label className="form-label">Role Name</label>
                <input className="input-field w-full" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
              </div>
              <div className="flex gap-2">
                <Button size="sm" loading={saving} onClick={handleSave}>{editId ? 'Save' : 'Create'}</Button>
                <Button variant="ghost" size="sm" onClick={() => setShowForm(false)}>Cancel</Button>
              </div>
            </div>
            <div>
              <label className="form-label">Permissions (module:action, comma separated)</label>
              <input className="input-field w-full" value={form.permissionStrings} onChange={e => setForm({ ...form, permissionStrings: e.target.value })} placeholder="e.g. orders:view, orders:manage" />
              <p className="text-xs text-admin-text-muted mt-1">Format: <code>module:action</code>, separate multiple with commas</p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {loading ? (
          <div className="col-span-3 text-center text-gray-400 py-12">Loading...</div>
        ) : roles.length === 0 ? (
          <div className="col-span-3 text-center text-gray-400 py-12">No roles found</div>
        ) : (
          roles.map(role => (
            <div key={role.id} className="card p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-admin-accent/10 text-admin-accent">
                    <Shield className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{role.name}</h3>
                    <p className="text-xs text-admin-text-muted">{role._count.adminUsers} admins</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => openEdit(role)} className="text-gray-400 hover:text-admin-accent"><Edit className="w-4 h-4" /></button>
                  <button onClick={() => handleDelete(role.id)} className="text-gray-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
              <div className="flex flex-wrap gap-1">
                <span className="badge bg-gray-100 text-gray-600 text-xs">{role.permissions.length} permissions</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
