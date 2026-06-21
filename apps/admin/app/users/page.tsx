"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Eye, Search } from "lucide-react";
import { adminApi } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import StatusBadge from "@/components/StatusBadge";

interface User {
  id: string;
  email: string;
  phone: string;
  status: string;
  createdAt: string;
  _count: {
    orders: number;
    subscriptions: number;
    rewardTransactions: number;
  };
}

interface PaginatedResponse {
  data: User[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({ page: String(page), limit: "20" });
      if (search) params.set("search", search);
      const res = await adminApi.get<PaginatedResponse>(`/admin/users?${params}`);
      setUsers(res.data);
      setTotal(res.total);
      setTotalPages(res.totalPages);
    } catch (err: any) {
      setError(err.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleSearch = (val: string) => {
    setSearch(val);
    setPage(1);
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Users</h1>
        <p className="text-admin-text-secondary text-sm mt-1">View and manage customer accounts</p>
      </div>

      {error && <div className="card p-4 text-red-600 text-sm">{error}</div>}

      <div className="relative max-w-xs">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search by email..."
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          className="input-field pl-10"
        />
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
                  <th className="text-left p-3 font-medium text-gray-500">Email</th>
                  <th className="text-left p-3 font-medium text-gray-500">Phone</th>
                  <th className="text-left p-3 font-medium text-gray-500">Status</th>
                  <th className="text-left p-3 font-medium text-gray-500">Orders</th>
                  <th className="text-left p-3 font-medium text-gray-500">Subs</th>
                  <th className="text-left p-3 font-medium text-gray-500">Rewards</th>
                  <th className="text-left p-3 font-medium text-gray-500">Joined</th>
                  <th className="text-left p-3 font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-6 text-center text-gray-500">No users found.</td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="p-3">{user.email}</td>
                      <td className="p-3 text-gray-600">{user.phone || "--"}</td>
                      <td className="p-3"><StatusBadge status={user.status} /></td>
                      <td className="p-3">{user._count.orders}</td>
                      <td className="p-3">{user._count.subscriptions}</td>
                      <td className="p-3">{user._count.rewardTransactions}</td>
                      <td className="p-3 text-gray-500">{new Date(user.createdAt).toLocaleDateString()}</td>
                      <td className="p-3">
                        <Link href={`/users/${user.id}`} className="text-admin-accent hover:text-admin-accent-hover">
                          <Eye size={18} />
                        </Link>
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
