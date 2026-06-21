'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Percent, IndianRupee } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { adminApi } from '@/lib/api';

export default function NewCouponPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [discountType, setDiscountType] = useState<'percent' | 'amount'>('percent');
  const [form, setForm] = useState({
    code: '',
    discountPercent: '',
    discountAmount: '',
    maxUses: '',
    expiresAt: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const body: any = { code: form.code, maxUses: form.maxUses ? parseInt(form.maxUses) : null, expiresAt: form.expiresAt || null };
      if (discountType === 'percent') {
        body.discountPercent = parseFloat(form.discountPercent);
        body.discountAmount = null;
      } else {
        body.discountAmount = parseFloat(form.discountAmount);
        body.discountPercent = null;
      }
      await adminApi.post('/admin/coupons', body);
      router.push('/coupons');
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
          <h1 className="text-2xl font-bold text-admin-text">New Coupon</h1>
        </div>
      </div>

      {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">{error}</div>}

      <form onSubmit={handleSubmit} className="max-w-xl">
        <div className="card p-6 space-y-4">
          <div>
            <label className="form-label">Code</label>
            <input className="input-field w-full uppercase" value={form.code} onChange={e => setForm({ ...form, code: e.target.value.toUpperCase() })} required />
          </div>

          <div>
            <label className="form-label">Discount Type</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="discountType" checked={discountType === 'percent'} onChange={() => setDiscountType('percent')} className="text-admin-accent" />
                <Percent className="w-4 h-4" /> Percentage
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="discountType" checked={discountType === 'amount'} onChange={() => setDiscountType('amount')} className="text-admin-accent" />
                <IndianRupee className="w-4 h-4" /> Fixed Amount
              </label>
            </div>
          </div>

          {discountType === 'percent' ? (
            <div>
              <label className="form-label">Discount Percent</label>
              <input className="input-field w-full" type="number" value={form.discountPercent} onChange={e => setForm({ ...form, discountPercent: e.target.value })} placeholder="e.g. 20" required />
            </div>
          ) : (
            <div>
              <label className="form-label">Discount Amount (₹)</label>
              <input className="input-field w-full" type="number" value={form.discountAmount} onChange={e => setForm({ ...form, discountAmount: e.target.value })} placeholder="e.g. 100" required />
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="form-label">Max Uses</label>
              <input className="input-field w-full" type="number" value={form.maxUses} onChange={e => setForm({ ...form, maxUses: e.target.value })} placeholder="Leave empty for unlimited" />
            </div>
            <div>
              <label className="form-label">Expires At</label>
              <input className="input-field w-full" type="date" value={form.expiresAt} onChange={e => setForm({ ...form, expiresAt: e.target.value })} />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <Button variant="secondary" onClick={() => router.back()}>Cancel</Button>
          <Button type="submit" loading={saving}><Save className="w-4 h-4 mr-1" /> Create Coupon</Button>
        </div>
      </form>
    </div>
  );
}
