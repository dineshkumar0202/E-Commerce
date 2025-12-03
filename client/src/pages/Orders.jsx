import React, { useEffect, useState } from "react";
import api from "../api.js";

export default function Orders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    async function load() {
      const res = await api.get("/orders/my");
      setOrders(res.data);
    }
    load();
  }, []);

  if (orders.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 text-center text-sm text-slate-600">
        You have no orders yet.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 space-y-3">
      <h1 className="text-lg font-semibold">My Orders</h1>
      {orders.map((order) => (
        <div key={order._id} className="border border-slate-100 rounded-lg p-3 text-xs sm:text-sm">
          <div className="flex justify-between mb-2">
            <span>Order #{order._id.slice(-6)}</span>
            <span className="capitalize">{order.status}</span>
          </div>
          <div className="flex justify-between mb-1">
            <span>Items</span>
            <span>{order.items.length}</span>
          </div>
          <div className="flex justify-between mb-1">
            <span>Total</span>
            <span>₹{order.totalAmount.toLocaleString()}</span>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {order.items.map((item) => (
              <span key={item._id} className="px-2 py-1 bg-slate-50 rounded border border-slate-200">
                {item.product?.name || "Product"} × {item.qty}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
