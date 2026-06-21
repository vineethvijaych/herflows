"use client";

import React from "react";
import { TrendingUp, TrendingDown, LucideIcon } from "lucide-react";

type StatCardProps = {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon: LucideIcon;
  color?: string;
};

export default function StatCard({ title, value, change, changeLabel, icon: Icon, color = "text-admin-accent" }: StatCardProps) {
  const isPositive = change !== undefined && change >= 0;

  return (
    <div className="stat-card">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-admin-text-secondary font-medium">{title}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
          {change !== undefined && (
            <p className={`text-sm mt-1 flex items-center gap-1 ${isPositive ? "text-admin-success" : "text-admin-danger"}`}>
              {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
              {isPositive ? "+" : ""}{change}% {changeLabel || "vs last month"}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-lg bg-opacity-10 ${color} bg-current`}>
          <Icon size={24} className={color} />
        </div>
      </div>
    </div>
  );
}
