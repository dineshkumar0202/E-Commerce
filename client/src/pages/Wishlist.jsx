import React, { useEffect, useState } from "react";
import api from "../api.js";
import ProductCard from "../components/ProductCard.jsx";
import { useAuth } from "../context/AuthContext.jsx";

export default function Wishlist() {
  const { user, loading } = useAuth();
  const [items, setItems] = useState([]);

  useEffect(() => {
    async function load() {
      if (!user) return;
      const res = await api.get("/auth/wishlist");
      setItems(res.data.items);
    }
    load();
  }, [user]);

  if (!user && !loading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 text-center text-sm text-slate-600">
        Login to view your wishlist.
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 text-center text-sm text-slate-600">
        Your wishlist is empty.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4">
      <h1 className="text-lg font-semibold mb-3">My Wishlist ({items.length})</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {items.map((p) => (
          <ProductCard key={p._id} product={p} />
        ))}
      </div>
    </div>
  );
}
