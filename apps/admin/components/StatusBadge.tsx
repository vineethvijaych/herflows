"use client";

import React from "react";

type StatusBadgeProps = {
  status: string;
  type?: "order" | "subscription" | "review" | "general" | "payment" | "ticket";
};

const statusStyles: Record<string, Record<string, string>> = {
  order: {
    pending: "bg-yellow-100 text-yellow-800",
    confirmed: "bg-blue-100 text-blue-800",
    processing: "bg-indigo-100 text-indigo-800",
    shipped: "bg-purple-100 text-purple-800",
    delivered: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
    refunded: "bg-gray-100 text-gray-800",
  },
  subscription: {
    active: "bg-green-100 text-green-800",
    paused: "bg-yellow-100 text-yellow-800",
    cancelled: "bg-red-100 text-red-800",
    expired: "bg-gray-100 text-gray-800",
    trial: "bg-blue-100 text-blue-800",
  },
  review: {
    pending: "bg-yellow-100 text-yellow-800",
    approved: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-800",
    flagged: "bg-orange-100 text-orange-800",
  },
  payment: {
    succeeded: "bg-green-100 text-green-800",
    pending: "bg-yellow-100 text-yellow-800",
    failed: "bg-red-100 text-red-800",
    refunded: "bg-gray-100 text-gray-800",
  },
  ticket: {
    open: "bg-blue-100 text-blue-800",
    in_progress: "bg-indigo-100 text-indigo-800",
    waiting_on_customer: "bg-yellow-100 text-yellow-800",
    resolved: "bg-green-100 text-green-800",
    closed: "bg-gray-100 text-gray-800",
  },
  general: {
    active: "bg-green-100 text-green-800",
    inactive: "bg-gray-100 text-gray-800",
    draft: "bg-yellow-100 text-yellow-800",
    published: "bg-green-100 text-green-800",
    archived: "bg-gray-100 text-gray-800",
    low: "bg-red-100 text-red-800",
    medium: "bg-yellow-100 text-yellow-800",
    high: "bg-green-100 text-green-800",
    out_of_stock: "bg-red-100 text-red-800",
    in_stock: "bg-green-100 text-green-800",
    enabled: "bg-green-100 text-green-800",
    disabled: "bg-gray-100 text-gray-800",
    verified: "bg-green-100 text-green-800",
    unverified: "bg-yellow-100 text-yellow-800",
    approved: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-800",
  },
};

export default function StatusBadge({ status, type = "general" }: StatusBadgeProps) {
  const style = statusStyles[type]?.[status] || statusStyles.general[status] || "bg-gray-100 text-gray-800";

  return (
    <span className={`badge ${style}`}>
      {status.replace(/_/g, " ")}
    </span>
  );
}
