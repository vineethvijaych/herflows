"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft, Package, Truck, CheckCircle, XCircle, Clock, MapPin, CreditCard, User, FileText,
} from "lucide-react";
import { adminApi } from "@/lib/api";
import StatusBadge from "@/components/StatusBadge";
import { Button } from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Modal from "@/components/Modal";

interface OrderItem {
  id: string;
  product: string;
  sku: string;
  qty: number;
  price: number;
  total: number;
  image: string | null;
}

interface TimelineEntry {
  id: string;
  status: string;
  note: string;
  by: string;
  date: string;
}

interface OrderDetail {
  id: string;
  userId: string;
  user: { email: string; phone: string };
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  notes: string;
  shippingAddress: { line1: string; line2?: string; city: string; state: string; zip: string; country: string };
  items: OrderItem[];
  timeline: TimelineEntry[];
  createdAt: string;
}

const statusFlow = ["pending", "confirmed", "processing", "shipped", "delivered"];

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [statusNote, setStatusNote] = useState("");
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const res = await adminApi.get<OrderDetail>(`/admin/orders/${params.id}`);
        setOrder(res);
        setSelectedStatus(res.status);
      } catch (err: any) {
        setError(err.message || "Failed to load order");
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [params.id]);

  const handleStatusUpdate = async () => {
    if (!order) return;
    try {
      setUpdating(true);
      await adminApi.patch(`/admin/orders/${order.id}/status`, { status: selectedStatus, note: statusNote });
      const updated = await adminApi.get<OrderDetail>(`/admin/orders/${params.id}`);
      setOrder(updated);
      setShowStatusModal(false);
      setStatusNote("");
    } catch (err: any) {
      setError(err.message || "Failed to update status");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-admin-accent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="card p-6 text-red-600">{error}</div>
      </div>
    );
  }

  if (!order) return null;

  const currentStep = statusFlow.indexOf(order.status);
  const canUpdateStatus = order.status !== "cancelled" && order.status !== "delivered";

  const getTimelineIcon = (status: string) => {
    switch (status) {
      case "pending": return <Clock size={16} />;
      case "confirmed": return <CreditCard size={16} />;
      case "processing": return <Package size={16} />;
      case "shipped": return <Truck size={16} />;
      case "delivered": return <CheckCircle size={16} />;
      case "cancelled": return <XCircle size={16} />;
      default: return <Clock size={16} />;
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => router.back()} className="text-gray-400 hover:text-gray-600">
            <ArrowLeft size={20} />
          </button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold">{order.id}</h1>
              <StatusBadge status={order.status} type="order" />
              <StatusBadge status={order.paymentStatus} type="payment" />
            </div>
            <p className="text-admin-text-secondary text-sm mt-1">
              Placed on {new Date(order.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {canUpdateStatus && (
            <Button onClick={() => setShowStatusModal(true)}>Update Status</Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="card p-6">
            <h2 className="text-lg font-semibold mb-4">Order Items</h2>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-admin-border">
                  <th className="text-left py-2 text-admin-text-secondary font-medium">Product</th>
                  <th className="text-center py-2 text-admin-text-secondary font-medium">Qty</th>
                  <th className="text-right py-2 text-admin-text-secondary font-medium">Price</th>
                  <th className="text-right py-2 text-admin-text-secondary font-medium">Total</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item) => (
                  <tr key={item.id} className="border-b border-admin-border">
                    <td className="py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                          <Package size={20} className="text-gray-400" />
                        </div>
                        <div>
                          <p className="font-medium">{item.product}</p>
                          <p className="text-xs text-admin-text-secondary">SKU: {item.sku}</p>
                        </div>
                      </div>
                    </td>
                    <td className="text-center py-3">{item.qty}</td>
                    <td className="text-right py-3">₹{item.price}</td>
                    <td className="text-right py-3 font-medium">₹{item.total}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={3} className="text-right py-2 text-admin-text-secondary">Subtotal</td>
                  <td className="text-right py-2">₹{order.subtotal}</td>
                </tr>
                <tr>
                  <td colSpan={3} className="text-right py-2 text-admin-text-secondary">Tax</td>
                  <td className="text-right py-2">₹{order.tax}</td>
                </tr>
                <tr>
                  <td colSpan={3} className="text-right py-2 text-admin-text-secondary">Shipping</td>
                  <td className="text-right py-2">₹{order.shipping}</td>
                </tr>
                <tr>
                  <td colSpan={3} className="text-right py-2 font-semibold">Total</td>
                  <td className="text-right py-2 font-bold text-lg">₹{order.total}</td>
                </tr>
              </tfoot>
            </table>
          </div>

          <div className="card p-6">
            <h2 className="text-lg font-semibold mb-4">Status Timeline</h2>
            <div className="space-y-0">
              {order.timeline.map((entry, i) => (
                <div key={entry.id} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      i === 0 ? "bg-admin-accent text-white" : "bg-gray-100 text-gray-500"
                    }`}>
                      {getTimelineIcon(entry.status)}
                    </div>
                    {i < order.timeline.length - 1 && <div className="w-0.5 flex-1 bg-gray-200 my-1" />}
                  </div>
                  <div className="pb-6">
                    <p className="text-sm font-medium capitalize">{entry.status.replace(/_/g, " ")}</p>
                    <p className="text-xs text-admin-text-secondary">{entry.note}</p>
                    <p className="text-xs text-admin-text-secondary">{entry.date} by {entry.by}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {order.notes && (
            <div className="card p-6">
              <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
                <FileText size={18} className="text-gray-400" />
                Order Notes
              </h2>
              <p className="text-sm text-gray-600">{order.notes}</p>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="card p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <User size={18} className="text-gray-400" />
              Customer
            </h2>
            <div className="space-y-2 text-sm">
              <p className="font-medium">{order.user.email}</p>
              <p className="text-admin-text-secondary">{order.user.phone}</p>
              <Button variant="secondary" size="sm" className="mt-2" onClick={() => router.push(`/users/${order.userId}`)}>
                View Customer
              </Button>
            </div>
          </div>

          <div className="card p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <MapPin size={18} className="text-gray-400" />
              Shipping Address
            </h2>
            <div className="text-sm space-y-1">
              <p>{order.shippingAddress.line1}</p>
              {order.shippingAddress.line2 && <p>{order.shippingAddress.line2}</p>}
              <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}</p>
              <p>{order.shippingAddress.country}</p>
            </div>
          </div>

          <div className="card p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <CreditCard size={18} className="text-gray-400" />
              Payment Info
            </h2>
            <div className="text-sm space-y-2">
              <div className="flex justify-between">
                <span className="text-admin-text-secondary">Method</span>
                <span>{order.paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-admin-text-secondary">Status</span>
                <StatusBadge status={order.paymentStatus} type="payment" />
              </div>
              <div className="flex justify-between">
                <span className="text-admin-text-secondary">Subtotal</span>
                <span>₹{order.subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-admin-text-secondary">Tax</span>
                <span>₹{order.tax}</span>
              </div>
              <div className="flex justify-between font-semibold border-t border-admin-border pt-2 mt-2">
                <span>Total</span>
                <span>₹{order.total}</span>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <h2 className="text-lg font-semibold mb-4">Update Status</h2>
            <div className="flex flex-wrap gap-2">
              {statusFlow.map((s) => (
                <button
                  key={s}
                  onClick={async () => {
                    setSelectedStatus(s);
                    try {
                      setUpdating(true);
                      await adminApi.patch(`/admin/orders/${order.id}/status`, { status: s, note: `Status changed to ${s}` });
                      const updated = await adminApi.get<OrderDetail>(`/admin/orders/${params.id}`);
                      setOrder(updated);
                    } catch (err: any) {
                      setError(err.message || "Failed to update status");
                    } finally {
                      setUpdating(false);
                    }
                  }}
                  disabled={statusFlow.indexOf(s) <= currentStep || updating}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    statusFlow.indexOf(s) <= currentStep
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-admin-accent/10 text-admin-accent hover:bg-admin-accent hover:text-white"
                  }`}
                >
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Modal isOpen={showStatusModal} onClose={() => setShowStatusModal(false)} title="Update Order Status" size="md">
        <div className="space-y-4">
          <div>
            <label className="form-label">New Status</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="select"
            >
              {statusFlow.map((s) => (
                <option key={s} value={s} disabled={statusFlow.indexOf(s) <= currentStep}>
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </option>
              ))}
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <Input
            label="Status Note (optional)"
            textarea
            value={statusNote}
            onChange={(e) => setStatusNote(e.target.value)}
            placeholder="Add a note about this status change..."
          />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" onClick={() => setShowStatusModal(false)}>Cancel</Button>
            <Button onClick={handleStatusUpdate} loading={updating}>Update Status</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
