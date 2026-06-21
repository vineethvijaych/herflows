"use client";

import React from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";

type RevenueChartProps = {
  data: { month: string; revenue: number; subscriptions: number; orders: number }[];
};

const COLORS = ["#5867dd", "#28a745", "#ffc107", "#dc3545", "#17a2b8", "#6610f2"];

export function RevenueChart({ data }: RevenueChartProps) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#5867dd" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#5867dd" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#e9ecef" />
        <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#6c757d" />
        <YAxis tick={{ fontSize: 12 }} stroke="#6c757d" />
        <Tooltip
          contentStyle={{ borderRadius: "8px", border: "1px solid #e9ecef" }}
        />
        <Area
          type="monotone"
          dataKey="revenue"
          stroke="#5867dd"
          fill="url(#revenueGrad)"
          strokeWidth={2}
          name="Revenue"
        />
        <Legend />
      </AreaChart>
    </ResponsiveContainer>
  );
}

type SubscriptionChartProps = {
  data: { month: string; active: number; cancelled: number; new: number }[];
};

export function SubscriptionChart({ data }: SubscriptionChartProps) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e9ecef" />
        <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#6c757d" />
        <YAxis tick={{ fontSize: 12 }} stroke="#6c757d" />
        <Tooltip
          contentStyle={{ borderRadius: "8px", border: "1px solid #e9ecef" }}
        />
        <Legend />
        <Line type="monotone" dataKey="active" stroke="#28a745" strokeWidth={2} name="Active" />
        <Line type="monotone" dataKey="new" stroke="#5867dd" strokeWidth={2} name="New" />
        <Line type="monotone" dataKey="cancelled" stroke="#dc3545" strokeWidth={2} name="Cancelled" />
      </LineChart>
    </ResponsiveContainer>
  );
}

type BarChartProps = {
  data: { name: string; value: number }[];
  title?: string;
};

export function SimpleBarChart({ data, title }: BarChartProps) {
  return (
    <div>
      {title && <h3 className="text-sm font-medium text-admin-text-secondary mb-3">{title}</h3>}
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e9ecef" />
          <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="#6c757d" />
          <YAxis tick={{ fontSize: 11 }} stroke="#6c757d" />
          <Tooltip
            contentStyle={{ borderRadius: "8px", border: "1px solid #e9ecef" }}
          />
          <Bar dataKey="value" fill="#5867dd" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

type PieChartProps = {
  data: { name: string; value: number }[];
  title?: string;
};

export function SimplePieChart({ data, title }: PieChartProps) {
  return (
    <div>
      {title && <h3 className="text-sm font-medium text-admin-text-secondary mb-3">{title}</h3>}
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={90}
            fill="#8884d8"
            paddingAngle={2}
            dataKey="value"
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          >
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{ borderRadius: "8px", border: "1px solid #e9ecef" }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
