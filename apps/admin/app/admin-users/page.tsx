'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { adminApi } from '@/lib/api';

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: { id: string; name: string };
  createdAt: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [roles, setRoles] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ name: '', email: '', roleId: '' });
  const [saving, setSaving] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const [usersRes, rolesRes] = await Promise.all([
        adminApi.get<AdminUser[]>('/admin/admin-users'),
        adminApi.get<{ id: string; name: string }[]>('/admin/roles'),
      ]);
      setUsers(usersRes);
      setRoles(rolesRes);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const startEdit = (user: AdminUser) => {
    setEditingId(user.id);
    setEditForm({ name: user.name, email: user.email, roleId: user.role.id });
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const handleSaveEdit = async () => {
    if (!editingId) return;
    setSaving(true);
    setError('');
    try {
      await adminApi.patch(`/admin/admin-users/${editingId}`, editForm);
      setEditingId(null);
      fetchData();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this admin user?')) return;
    try {
      await adminApi.delete(`/admin/admin-users/${id}`);
      fetchData();
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-admin-text">Admin Users</h1>
          <p className="text-sm text-admin-text-muted mt-1">Manage administrator accounts</p>
        </div>
        <Link href="/admin-users/new">
          <Button><Plus className="w-4 h-4 mr-1" /> Add Admin</Button>
        </Link>
      </div>

      {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">{error}</div>}

      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="text-left p-3 font-medium text-gray-500">Name</th>
              <th className="text-left p-3 font-medium text-gray-500">Email</th>
              <th className="text-left p-3 font-medium text-gray-500">Role</th>
              <th className="text-left p-3 font-medium text-gray-500">Created</th>
              <th className="text-left p-3 font-medium text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} className="p-6 text-center text-gray-400">Loading...</td></tr>
            ) : users.length === 0 ? (
              <tr><td colSpan={5} className="p-6 text-center text-gray-400">No admin users found</td></tr>
            ) : (
              users.map(user => (
                <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                  {editingId === user.id ? (
                    <>
                      <td className="p-3"><input className="input-field w-full text-sm" value={editForm.name} onChange={e => setEditForm({ ...editForm, name: e.target.value })} /></td>
                      <td className="p-3"><input className="input-field w-full text-sm" value={editForm.email} onChange={e => setEditForm({ ...editForm, email: e.target.value })} /></td>
                      <td className="p-3">
                        <select className="input-field w-full text-sm" value={editForm.roleId} onChange={e => setEditForm({ ...editForm, roleId: e.target.value })}>
                          <option value="">Select role</option>
                          {roles.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                        </select>
                      </td>
                      <td className="p-3">{new Date(user.createdAt).toLocaleDateString()}</td>
                      <td className="p-3">
                        <div className="flex gap-2">
                          <Button size="sm" loading={saving} onClick={handleSaveEdit}>Save</Button>
                          <Button variant="ghost" size="sm" onClick={cancelEdit}>Cancel</Button>
                        </div>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="p-3 font-medium">{user.name}</td>
                      <td className="p-3 text-admin-text-muted">{user.email}</td>
                      <td className="p-3"><span className="badge-info">{user.role.name}</span></td>
                      <td className="p-3 text-admin-text-muted">{new Date(user.createdAt).toLocaleDateString()}</td>
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <button onClick={() => startEdit(user)} className="text-admin-accent hover:text-admin-accent-hover"><Edit className="w-4 h-4" /></button>
                          <button onClick={() => handleDelete(user.id)} className="text-red-500 hover:text-red-700"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
