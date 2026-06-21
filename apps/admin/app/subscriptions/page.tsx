"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Search } from "lucide-react";
import { adminApi } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import StatusBadge from "@/components/StatusBadge";

interface Subscription {
  id: string;
  planType: string;
  status: string;
  nextDispatchDate: string;
  editLockDate: string;
  user: { email: string };
  createdAt: string;
}

interface PaginatedResponse {
  data: Subscription[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

const statusFilters = ["", "active", "paused", "cancelled", "expired", "trial"];

export default function SubscriptionsPage() {
  const [subs, setSubs] = useState<Subscription[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchSubs = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({ page: String(page), limit: "20" });
      if (search) params.set("search", search);
      if (statusFilter) params.set("status", statusFilter);
      const res = await adminApi.get<PaginatedResponse>(`/admin/subscriptions?${params}`);
      setSubs(res.data);
      setTotal(res.total);
      setTotalPages(res.totalPages);
    } catch (err: any) {
      setError(err.message || "Failed to load subscriptions");
    } finally {
      setLoading(false);
    }
  }, [page, search, statusFilter]);

  useEffect(() => {
    fetchSubs();
  }, [fetchSubs]);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Subscriptions</h1>
        <p className="text-admin-text-secondary text-sm mt-1">Manage recurring subscriptions</p>
      </div>

      {error && <div className="card p-4 text-red-600 text-sm">{error}</div>}

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search subscriptions..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="input-field pl-10"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          className="input-field max-w-[160px]"
        >
          <option value="">All Statuses</option>
          {statusFilters.filter(Boolean).map((s) => (
            <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
          ))}
        </select>
      </div>

      <div className="card overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center p-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-admin-accent"></div>
          </div>
        ) : (
          <>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left p-3 font-medium text-gray-500">ID</th>
                  <th className="text-left p-3 font-medium text-gray-500">User</th>
                  <th className="text-left p-3 font-medium text-gray-500">Plan</th>
                  <th className="text-left p-3 font-medium text-gray-500">Status</th>
                  <th className="text-left p-3 font-medium text-gray-500">Next Dispatch</th>
                  <th className="text-left p-3 font-medium text-gray-500">Created</th>
                  <th className="text-left p-3 font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {subs.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-6 text-center text-gray-500">No subscriptions found.</td>
                  </tr>
                ) : (
                  subs.map((sub) => (
                    <tr key={sub.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="p-3 font-medium">{sub.id}</td>
                      <td className="p-3">{sub.user.email}</td>
                      <td className="p-3">{sub.planType}</td>
                      <td className="p-3"><StatusBadge status={sub.status} type="subscription" /></td>
                      <td className="p-3">{sub.nextDispatchDate ? new Date(sub.nextDispatchDate).toLocaleDateString() : "--"}</td>
                      <td className="p-3 text-gray-500">{new Date(sub.createdAt).toLocaleDateString()}</td>
                      <td className="p-3">
                        <span className="text-admin-accent text-sm">{sub.editLockDate ? "Locked" : "Editable"}</span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            {totalPages > 1 && (
              <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
                <p className="text-sm text-admin-text-secondary">Page {page} of {totalPages} ({total} total)</p>
                <div className="flex gap-2">
                  <Button size="sm" variant="secondary" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>Prev</Button>
                  <Button size="sm" variant="secondary" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}>Next</Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
