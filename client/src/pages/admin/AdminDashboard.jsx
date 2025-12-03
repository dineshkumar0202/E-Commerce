import React, { useEffect, useState } from "react";
import api from "../../api.js";
import { useAuth } from "../../context/AuthContext.jsx";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const COLORS = ["#0058ff", "#ff9f00", "#10b981", "#f97316", "#ef4444"];

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    async function load() {
      const [statsRes, ordersRes] = await Promise.all([
        api.get("/admin/stats"),
        api.get("/admin/orders")
      ]);
      setStats(statsRes.data);
      setOrders(ordersRes.data);
    }
    if (user?.role === "admin") {
      load();
    }
  }, [user]);

  if (!user || user.role !== "admin") {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 text-center text-sm text-slate-600">
        Admin access only.
      </div>
    );
  }

  if (!stats) {
    return <p className="text-center py-10 text-sm text-slate-500">Loading dashboard...</p>;
  }

  const statusData = stats.byStatus.map((s, idx) => ({
    name: s._id,
    value: s.count,
    color: COLORS[idx % COLORS.length]
  }));
  const revenueData = stats.lastSixMonths.map((m) => ({
    month: m._id,
    revenue: m.total
  }));

  return (
    <div className="space-y-4">
      <h1 className="text-lg font-semibold">Admin Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-white rounded-xl border border-slate-100 p-3">
          <p className="text-xs text-slate-500">Total Users</p>
          <p className="text-2xl font-bold">{stats.totalUsers}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-100 p-3">
          <p className="text-xs text-slate-500">Total Orders</p>
          <p className="text-2xl font-bold">{stats.totalOrders}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-100 p-3">
          <p className="text-xs text-slate-500">Total Revenue</p>
          <p className="text-2xl font-bold">₹{stats.totalRevenue.toLocaleString()}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-slate-100 p-3 h-72">
          <h2 className="text-sm font-semibold mb-2">Order Flow (Status)</h2>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                dataKey="value"
                data={statusData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                label={(entry) => `${entry.name} (${entry.value})`}
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white rounded-xl border border-slate-100 p-3 h-72">
          <h2 className="text-sm font-semibold mb-2">Revenue (Last 6 Months)</h2>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="revenue" stroke="#0058ff" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-100 p-3">
        <h2 className="text-sm font-semibold mb-3">Recent Orders</h2>
        <div className="overflow-x-auto text-xs sm:text-sm">
          <table className="min-w-full">
            <thead>
              <tr className="text-left border-b border-slate-100">
                <th className="py-1 pr-3">Order ID</th>
                <th className="py-1 pr-3">Customer</th>
                <th className="py-1 pr-3">Total</th>
                <th className="py-1 pr-3">Status</th>
                <th className="py-1 pr-3">Created</th>
              </tr>
            </thead>
            <tbody>
              {orders.slice(0, 8).map((order) => (
                <tr key={order._id} className="border-b border-slate-50">
                  <td className="py-1 pr-3 text-xs">{order._id.slice(-6)}</td>
                  <td className="py-1 pr-3">{order.user?.name || "User"}</td>
                  <td className="py-1 pr-3">₹{order.totalAmount.toLocaleString()}</td>
                  <td className="py-1 pr-3 capitalize">{order.status}</td>
                  <td className="py-1 pr-3">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
