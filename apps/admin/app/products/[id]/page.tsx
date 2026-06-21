"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Save, Plus, Edit, Trash2, HelpCircle, CheckCircle, Loader2, AlertCircle } from "lucide-react";
import { adminApi } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import StatusBadge from "@/components/StatusBadge";
import Modal from "@/components/Modal";
import { useToast } from "@/lib/toast-context";

interface Variant {
  id: string;
  name: string;
  price: number;
  stockQty: number;
  sku: string;
  attributes: Record<string, string>;
}

interface ProductImage {
  id: string;
  productId: string;
  url: string;
  sortOrder: number;
}

interface ProductDetail {
  id: string;
  name: string;
  description: string;
  brandId: string;
  categoryId: string;
  status: string;
  brand: { name: string };
  category: { name: string };
  variants: Variant[];
  images: ProductImage[];
}

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const { notify } = useToast();
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [brandId, setBrandId] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [status, setStatus] = useState("");

  const [showVariantModal, setShowVariantModal] = useState(false);
  const [editingVariant, setEditingVariant] = useState<Variant | null>(null);
  const [variantForm, setVariantForm] = useState({ name: "", price: "", stockQty: "", sku: "" });
  const [variantSaving, setVariantSaving] = useState(false);

  const [imageUrl, setImageUrl] = useState("");
  const [addingImage, setAddingImage] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await adminApi.get<ProductDetail>(`/admin/products/${params.id}`);
        setProduct(res);
        setName(res.name);
        setDescription(res.description || "");
        setBrandId(res.brandId);
        setCategoryId(res.categoryId);
        setStatus(res.status);
      } catch (err: any) {
        setError(err.message || "Failed to load product");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [params.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      setError("");
      await adminApi.patch(`/admin/products/${params.id}`, { name, description, brandId, categoryId, status });
      setSaved(true);
      notify({ type: "success", message: "Product saved! Redirecting to products list..." });
      setTimeout(() => router.push("/products"), 1200);
    } catch (err: any) {
      setError(err.message || "Failed to update product");
      notify({ type: "error", message: err.message || "Failed to update product" });
    } finally {
      setSaving(false);
    }
  };

  const resetVariantForm = () => {
    setVariantForm({ name: "", price: "", stockQty: "", sku: "" });
    setEditingVariant(null);
  };

  const handleAddVariant = async () => {
    try {
      setVariantSaving(true);
      setError("");
      await adminApi.post(`/admin/products/${params.id}/variants`, {
        name: variantForm.name,
        price: parseFloat(variantForm.price),
        stockQty: parseInt(variantForm.stockQty, 10),
        sku: variantForm.sku,
        attributes: { name: variantForm.name },
      });
      const updated = await adminApi.get<ProductDetail>(`/admin/products/${params.id}`);
      setProduct(updated);
      setShowVariantModal(false);
      resetVariantForm();
      notify({ type: "success", message: `Variant "${variantForm.name}" added successfully` });
    } catch (err: any) {
      setError(err.message || "Failed to add variant");
      notify({ type: "error", message: err.message || "Failed to add variant" });
    } finally {
      setVariantSaving(false);
    }
  };

  const handleEditVariant = async () => {
    if (!editingVariant) return;
    try {
      setVariantSaving(true);
      setError("");
      await adminApi.patch(`/admin/products/variants/${editingVariant.id}`, {
        name: variantForm.name,
        price: parseFloat(variantForm.price),
        stockQty: parseInt(variantForm.stockQty, 10),
        sku: variantForm.sku,
        attributes: { name: variantForm.name },
      });
      const updated = await adminApi.get<ProductDetail>(`/admin/products/${params.id}`);
      setProduct(updated);
      setShowVariantModal(false);
      resetVariantForm();
      notify({ type: "success", message: `Variant "${variantForm.name}" updated` });
    } catch (err: any) {
      setError(err.message || "Failed to update variant");
      notify({ type: "error", message: err.message || "Failed to update variant" });
    } finally {
      setVariantSaving(false);
    }
  };

  const handleDeleteVariant = async (variantId: string) => {
    if (!confirm("Are you sure you want to delete this variant?")) return;
    try {
      setError("");
      await adminApi.delete(`/admin/products/variants/${variantId}`);
      const updated = await adminApi.get<ProductDetail>(`/admin/products/${params.id}`);
      setProduct(updated);
      notify({ type: "success", message: "Variant deleted" });
    } catch (err: any) {
      setError(err.message || "Failed to delete variant");
      notify({ type: "error", message: err.message || "Failed to delete variant" });
    }
  };

  const handleAddImage = async () => {
    if (!imageUrl.trim()) return;
    try {
      setAddingImage(true);
      setError("");
      const newImage = await adminApi.post<ProductImage>(`/admin/products/${params.id}/images`, { url: imageUrl.trim() });
      setProduct((prev) => prev ? { ...prev, images: [...prev.images, newImage] } : prev);
      setImageUrl("");
      notify({ type: "success", message: "Image added" });
    } catch (err: any) {
      setError(err.message || "Failed to add image");
      notify({ type: "error", message: err.message || "Failed to add image" });
    } finally {
      setAddingImage(false);
    }
  };

  const handleRemoveImage = async (imageId: string) => {
    if (!confirm("Remove this image?")) return;
    try {
      setError("");
      await adminApi.delete(`/admin/products/${params.id}/images/${imageId}`);
      setProduct((prev) => prev ? { ...prev, images: prev.images.filter((img) => img.id !== imageId) } : prev);
      notify({ type: "success", message: "Image removed" });
    } catch (err: any) {
      setError(err.message || "Failed to remove image");
      notify({ type: "error", message: err.message || "Failed to remove image" });
    }
  };

  const openEditVariant = (variant: Variant) => {
    setEditingVariant(variant);
    setVariantForm({
      name: variant.name,
      price: String(variant.price),
      stockQty: String(variant.stockQty),
      sku: variant.sku,
    });
    setShowVariantModal(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-admin-accent"></div>
      </div>
    );
  }

  if (error && !product) {
    return (
      <div className="p-6">
        <div className="card p-6 text-red-600">{error}</div>
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => router.push("/products")} className="text-gray-400 hover:text-gray-600">
          <ArrowLeft size={20} />
        </button>
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold">Edit Product</h1>
            <StatusBadge status={product.status} />
          </div>
          <p className="text-admin-text-secondary text-sm mt-1">ID: {params.id}</p>
        </div>
      </div>

      {saved && (
        <div className="bg-green-50 border-2 border-green-400 rounded-xl p-6 flex items-center gap-4 shadow-sm">
          <div className="bg-green-100 rounded-full p-2">
            <CheckCircle size={28} className="text-green-600" />
          </div>
          <div className="flex-1">
            <p className="text-green-900 text-lg font-semibold">Product saved successfully!</p>
            <p className="text-green-700 text-sm mt-0.5">Redirecting to products list...</p>
          </div>
          <Loader2 size={22} className="text-green-500 animate-spin shrink-0" />
        </div>
      )}

      {error && <div className="card p-4 text-red-600 text-sm">{error}</div>}

      {!saved && (<><form onSubmit={handleSubmit} className="max-w-4xl">
        <div className="card p-6 space-y-6">
          <h2 className="text-lg font-semibold">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Product Name" value={name} onChange={(e) => setName(e.target.value)} required />
            <div className="space-y-1">
              <label className="form-label">Status</label>
              <select value={status} onChange={(e) => setStatus(e.target.value)} className="select">
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="draft">Draft</option>
              </select>
            </div>
          </div>
          <div>
            <label className="form-label">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="input-field min-h-[100px]"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <Button variant="secondary" onClick={() => router.push("/products")}>Cancel</Button>
          <Button type="submit" loading={saving}>
            <Save size={16} className="mr-1" /> Save Changes
          </Button>
        </div>
      </form>

      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold">Variants</h2>
            <p className="text-sm text-gray-500 mt-1">
              Variants let you sell this product in different options (e.g. sizes, colors). 
              If you only need one version, create a single variant as the default.
            </p>
          </div>
          <Button size="sm" onClick={() => { resetVariantForm(); setShowVariantModal(true); }}>
            <Plus size={16} className="mr-1" /> Add Variant
          </Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-admin-border">
                <th className="text-left py-2 text-admin-text-secondary font-medium">Name</th>
                <th className="text-left py-2 text-admin-text-secondary font-medium">SKU</th>
                <th className="text-right py-2 text-admin-text-secondary font-medium">Price</th>
                <th className="text-right py-2 text-admin-text-secondary font-medium">Stock</th>
                <th className="text-right py-2 text-admin-text-secondary font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {product.variants.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-4 text-center text-gray-500">No variants yet. Click "Add Variant" to create one.</td>
                </tr>
              ) : (
                product.variants.map((variant) => (
                  <tr key={variant.id} className="border-b border-gray-50">
                    <td className="py-2">{variant.name}</td>
                    <td className="py-2 text-gray-500">{variant.sku}</td>
                    <td className="py-2 text-right">₹{variant.price}</td>
                    <td className="py-2 text-right">{variant.stockQty}</td>
                    <td className="py-2 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="sm" onClick={() => openEditVariant(variant)}>
                          <Edit size={14} />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDeleteVariant(variant.id)}>
                          <Trash2 size={14} className="text-red-500" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold">Images</h2>
            <p className="text-sm text-gray-500 mt-1">Add product images by entering external URLs</p>
          </div>
        </div>

        {product.images.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-4">
            {product.images.map((img) => (
              <div key={img.id} className="relative group rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
                <img
                  src={img.url}
                  alt=""
                  className="w-full h-32 object-cover"
                  onError={(e) => { (e.target as HTMLImageElement).src = ""; (e.target as HTMLImageElement).classList.add("hidden"); }}
                />
                <button
                  onClick={() => handleRemoveImage(img.id)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            ))}
          </div>
        )}

        {product.images.length === 0 && (
          <p className="text-sm text-gray-400 mb-4">No images yet.</p>
        )}

        <div className="flex items-end gap-3">
          <div className="flex-1">
            <label className="form-label">Image URL</label>
            <div className="flex gap-2">
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddImage(); } }}
                placeholder="https://example.com/image.jpg"
                className="input-field flex-1"
              />
            </div>
            {imageUrl.trim() && (
              <div className="mt-2 relative w-20 h-20 rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
                <img
                  src={imageUrl.trim()}
                  alt="preview"
                  className="w-full h-full object-cover"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  onLoad={(e) => { (e.target as HTMLImageElement).style.display = 'block'; }}
                />
              </div>
            )}
          </div>
          <Button size="sm" onClick={handleAddImage} loading={addingImage} disabled={!imageUrl.trim()}>
            <Plus size={14} className="mr-1" /> Add
          </Button>
        </div>
      </div>

      <Modal isOpen={showVariantModal} onClose={() => { setShowVariantModal(false); resetVariantForm(); }} title={editingVariant ? "Edit Variant" : "Add Variant"} size="md">
        <div className="space-y-4">
          <div>
            <Input label="Variant Name" value={variantForm.name} onChange={(e) => setVariantForm(f => ({ ...f, name: e.target.value }))} required />
            <p className="text-xs text-gray-400 mt-1">e.g. "Small Blue", "500ml Bottle", "Gift Box"</p>
          </div>
          <div>
            <Input label="SKU (Stock Keeping Unit)" value={variantForm.sku} onChange={(e) => setVariantForm(f => ({ ...f, sku: e.target.value }))} required />
            <p className="text-xs text-gray-400 mt-1">Unique code to track this variant in inventory (e.g. "HERF-SML-BLU")</p>
          </div>
          <div>
            <Input label="Price (₹)" type="number" value={variantForm.price} onChange={(e) => setVariantForm(f => ({ ...f, price: e.target.value }))} required />
            <p className="text-xs text-gray-400 mt-1">Selling price in Indian Rupees</p>
          </div>
          <div>
            <Input label="Stock Quantity" type="number" value={variantForm.stockQty} onChange={(e) => setVariantForm(f => ({ ...f, stockQty: e.target.value }))} required />
            <p className="text-xs text-gray-400 mt-1">Number of units available in inventory</p>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" onClick={() => { setShowVariantModal(false); resetVariantForm(); }}>Cancel</Button>
            <Button onClick={editingVariant ? handleEditVariant : handleAddVariant} loading={variantSaving}>
              {editingVariant ? "Update Variant" : "Add Variant"}
            </Button>
          </div>
        </div>
      </Modal>
      </>)}
    </div>
  );
}
