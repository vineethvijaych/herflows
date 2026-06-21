'use client';

import { useState, useEffect } from 'react';
import { Save } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { adminApi } from '@/lib/api';

export default function SettingsPage() {
  const [settings, setSettings] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const fetchSettings = async () => {
    try {
      const res = await adminApi.get<Record<string, any>>('/admin/settings');
      setSettings(res);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchSettings(); }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      await adminApi.patch('/admin/settings', settings);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-6"><p className="text-admin-text-muted">Loading...</p></div>;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-admin-text">Settings</h1>
          <p className="text-sm text-admin-text-muted mt-1">System configuration</p>
        </div>
        <Button onClick={handleSubmit} loading={saving}>
          <Save className="w-4 h-4 mr-1" /> Save Changes
        </Button>
      </div>

      {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">{error}</div>}

      <form onSubmit={handleSubmit} className="max-w-2xl">
        <div className="card p-6 space-y-4">
          {Object.entries(settings).map(([key, value]) => (
            <div key={key}>
              <label className="label capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</label>
              {typeof value === 'boolean' ? (
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" name={key} checked={value} onChange={handleChange} className="rounded border-gray-300 text-admin-accent" />
                  <span className="text-sm">{key}</span>
                </label>
              ) : (
                <input
                  className="input-field w-full"
                  name={key}
                  value={value ?? ''}
                  onChange={handleChange}
                  type={key.toLowerCase().includes('secret') || key.toLowerCase().includes('key') || key.toLowerCase().includes('password') ? 'password' : 'text'}
                />
              )}
            </div>
          ))}
        </div>

        <div className="flex justify-end mt-6">
          <Button type="submit" loading={saving}>
            <Save className="w-4 h-4 mr-1" /> Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
}
