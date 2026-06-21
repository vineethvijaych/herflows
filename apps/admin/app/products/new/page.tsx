"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Package, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { adminApi } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { useToast } from "@/lib/toast-context";

interface Brand {
  id: string;
  name: string;
}

interface Category {
  id: string;
  name: string;
}

export default function NewProductPage() {
  const router = useRouter();
  const { notify } = useToast();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [brandId, setBrandId] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [brands, setBrands] = useState<Brand[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [imageUrl, setImageUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [brandsRes, categoriesRes] = await Promise.all([
          adminApi.get<Brand[]>("/admin/brands"),
          adminApi.get<Category[]>("/admin/categories"),
        ]);
        const brandsData = Array.isArray(brandsRes) ? brandsRes : (brandsRes as any).data || [];
        const categoriesData = Array.isArray(categoriesRes) ? categoriesRes : (categoriesRes as any).data || [];
        setBrands(brandsData);
        setCategories(categoriesData);
        if (brandsData.length > 0) setBrandId(brandsData[0].id);
        if (categoriesData.length > 0) setCategoryId(categoriesData[0].id);
      } catch (err: any) {
        setError(err.message || "Failed to load form data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      setError("");
      const res: any = await adminApi.post("/admin/products", { name, description, brandId, categoryId });
      const productId = res.id || res.data?.id;
      if (imageUrl.trim()) {
        await adminApi.post(`/admin/products/${productId}/images`, { url: imageUrl.trim() }).catch(() => {});
      }
      setSuccess(true);
      notify({ type: "success", message: "Product created!", description: "Redirecting to edit page..." });
      setTimeout(() => {
        router.push(`/products/${productId}`);
      }, 1200);
    } catch (err: any) {
      const msg = err.message || "Failed to create product";
      setError(msg);
      notify({ type: "error", message: msg });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-admin-accent"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => router.back()} className="text-gray-400 hover:text-gray-600">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold">New Product</h1>
          <p className="text-admin-text-secondary text-sm mt-1">Add a new product to the catalog</p>
        </div>
      </div>

      {success && (
        <div className="bg-green-50 border border-green-300 rounded-lg p-4 flex items-center gap-3">
          <CheckCircle size={22} className="text-green-600 shrink-0" />
          <div>
            <p className="text-green-800 font-medium">Product created successfully!</p>
            <p className="text-green-600 text-sm">Redirecting to edit page...</p>
          </div>
          <Loader2 size={18} className="text-green-500 animate-spin ml-auto shrink-0" />
        </div>
      )}

      {error && !success && (
        <div className="bg-red-50 border border-red-300 rounded-lg p-4 flex items-center gap-3">
          <AlertCircle size={22} className="text-red-600 shrink-0" />
          <div>
            <p className="text-red-800 font-medium">Error</p>
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        </div>
      )}

      {!success && (
        <form onSubmit={handleSubmit} className="max-w-4xl">
          <div className="card p-6 space-y-6">
            <h2 className="text-lg font-semibold">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Product Name" value={name} onChange={(e) => setName(e.target.value)} required />
              <div className="space-y-1">
                <label className="form-label">Brand <span className="text-admin-danger">*</span></label>
                <select value={brandId} onChange={(e) => setBrandId(e.target.value)} className="select" required>
                  <option value="">Select brand</option>
                  {brands.map((b) => (
                    <option key={b.id} value={b.id}>{b.name}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1">
                <label className="form-label">Category <span className="text-admin-danger">*</span></label>
                <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className="select" required>
                  <option value="">Select category</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
            </div>
          <div>
            <label className="form-label">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="input-field min-h-[100px]"
              placeholder="Product description..."
            />
          </div>
          <div>
            <label className="form-label">Image URL <span className="text-gray-400 text-xs">(optional)</span></label>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="input-field"
              placeholder="https://example.com/product-image.jpg"
            />
          </div>
        </div>

          <div className="card p-6 space-y-4 bg-blue-50 border-blue-200">
            <div className="flex items-start gap-3">
              <Package size={20} className="text-blue-600 shrink-0 mt-0.5" />
              <div>
                <h2 className="text-lg font-semibold text-blue-900">Variants (Optional)</h2>
                <p className="text-sm text-blue-700 mt-1">
                  Variants let you sell the same product in different options — like different sizes, colors, 
                  material types, or bundle quantities. Each variant can have its own price, SKU, and stock 
                  count. You can add variants after creating this product.
                </p>
                <ul className="text-sm text-blue-700 mt-2 space-y-1 list-disc list-inside">
                  <li><strong>Single product (no variants):</strong> Just set the price and stock on the first variant.</li>
                  <li><strong>Multiple variants:</strong> e.g. "Small / Blue", "Medium / Blue", "Large / Red".</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <Button variant="secondary" onClick={() => router.back()}>Cancel</Button>
            <Button type="submit" loading={saving}>
              <Save size={16} className="mr-1" /> Save Product
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
