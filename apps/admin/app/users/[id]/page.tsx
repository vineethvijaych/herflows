"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Mail, Phone, Calendar, ShoppingCart, Repeat, CreditCard } from "lucide-react";
import { adminApi } from "@/lib/api";
import StatusBadge from "@/components/StatusBadge";

interface UserDetail {
  id: string;
  email: string;
  phone: string;
  status: string;
  createdAt: string;
  preferences: Record<string, boolean>;
  _count: {
    orders: number;
    subscriptions: number;
    rewardTransactions: number;
    reviews: number;
    supportTickets: number;
  };
  orders: Array<{
    id: string;
    totalAmount: number;
    status: string;
    placedAt: string;
    items: number;
    payment: { status: string };
  }>;
}

export default function UserDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [user, setUser] = useState<UserDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const res = await adminApi.get<UserDetail>(`/admin/users/${params.id}`);
        setUser(res);
      } catch (err: any) {
        setError(err.message || "Failed to load user");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [params.id]);

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

  if (!user) return null;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => router.back()} className="text-gray-400 hover:text-gray-600">
          <ArrowLeft size={20} />
        </button>
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold">{user.email}</h1>
            <StatusBadge status={user.status} />
          </div>
          <p className="text-admin-text-secondary text-sm mt-1">User ID: {user.id}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <div className="card p-6">
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-full bg-admin-accent text-white flex items-center justify-center text-2xl font-bold mb-3">
                {user.email.charAt(0).toUpperCase()}
              </div>
              <h2 className="text-lg font-bold">{user.email}</h2>
              <p className="text-sm text-admin-text-secondary mt-1">
                Joined {new Date(user.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
              </p>
            </div>
          </div>

          <div className="card p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-admin-accent">{user._count.orders}</p>
                <p className="text-xs text-admin-text-secondary">Orders</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-admin-success">{user._count.subscriptions}</p>
                <p className="text-xs text-admin-text-secondary">Subscriptions</p>
              </div>
              <div>
                <p className="text-2xl font-bold">{user._count.rewardTransactions}</p>
                <p className="text-xs text-admin-text-secondary">Rewards</p>
              </div>
              <div>
                <p className="text-2xl font-bold">{user._count.reviews}</p>
                <p className="text-xs text-admin-text-secondary">Reviews</p>
              </div>
            </div>
          </div>

          <div className="card p-6 space-y-3">
            <h3 className="text-sm font-semibold text-admin-text-secondary uppercase tracking-wider">Contact</h3>
            <div className="flex items-center gap-3 text-sm">
              <Mail size={16} className="text-gray-400" />
              <a href={`mailto:${user.email}`} className="text-admin-accent hover:underline">{user.email}</a>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Phone size={16} className="text-gray-400" />
              <span>{user.phone || "--"}</span>
            </div>
          </div>

          {user.preferences && Object.keys(user.preferences).length > 0 && (
            <div className="card p-6 space-y-3">
              <h3 className="text-sm font-semibold text-admin-text-secondary uppercase tracking-wider">Preferences</h3>
              {Object.entries(user.preferences).map(([key, val]) => (
                <div key={key} className="flex items-center justify-between">
                  <span className="text-sm">{key.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase())}</span>
                  <span className={val ? "text-admin-success" : "text-admin-danger"}>
                    {val ? "Enabled" : "Disabled"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="lg:col-span-3 space-y-6">
          <div className="card p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <ShoppingCart size={18} className="text-gray-400" />
              Recent Orders
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-admin-border">
                    <th className="text-left py-2 font-medium text-admin-text-secondary">Order</th>
                    <th className="text-right py-2 font-medium text-admin-text-secondary">Items</th>
                    <th className="text-right py-2 font-medium text-admin-text-secondary">Amount</th>
                    <th className="text-left py-2 font-medium text-admin-text-secondary">Status</th>
                    <th className="text-left py-2 font-medium text-admin-text-secondary">Payment</th>
                    <th className="text-left py-2 font-medium text-admin-text-secondary">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {user.orders.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-4 text-center text-gray-500">No orders yet.</td>
                    </tr>
                  ) : (
                    user.orders.map((order) => (
                      <tr key={order.id} className="border-b border-gray-50 hover:bg-gray-50 cursor-pointer" onClick={() => router.push(`/orders/${order.id}`)}>
                        <td className="py-2 pr-2 font-medium">{order.id}</td>
                        <td className="py-2 pr-2 text-right">{order.items}</td>
                        <td className="py-2 pr-2 text-right font-medium">₹{order.totalAmount}</td>
                        <td className="py-2 pr-2"><StatusBadge status={order.status} type="order" /></td>
                        <td className="py-2 pr-2"><StatusBadge status={order.payment.status} type="payment" /></td>
                        <td className="py-2 text-admin-text-secondary">{new Date(order.placedAt).toLocaleDateString()}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="card p-6">
            <h2 className="text-lg font-semibold mb-4">Account Activity</h2>
            <div className="text-sm space-y-3">
              <div className="flex justify-between py-2 border-b border-admin-border">
                <span>Support Tickets</span>
                <span className="text-admin-text-secondary">{user._count.supportTickets}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-admin-border">
                <span>Reviews Written</span>
                <span className="text-admin-text-secondary">{user._count.reviews}</span>
              </div>
              <div className="flex justify-between py-2">
                <span>Reward Transactions</span>
                <span className="text-admin-text-secondary">{user._count.rewardTransactions}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
