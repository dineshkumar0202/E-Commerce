import React, { useEffect, useState } from "react";
import api from "../api.js";
import { useAuth } from "../context/AuthContext.jsx";

export default function Profile() {
  const { user } = useAuth();
  const [form, setForm] = useState({ name: "", address: {} });
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name,
        address: user.address || {}
      });
    }
  }, [user]);

  const onSubmit = async (e) => {
    e.preventDefault();
    const res = await api.put("/auth/profile", form);
    setMessage(res.data.message);
  };

  if (!user) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 text-center text-sm text-slate-600">
        Login to view your profile.
      </div>
    );
  }

  const updateAddress = (field, value) => {
    setForm((prev) => ({
      ...prev,
      address: { ...prev.address, [field]: value }
    }));
  };

  return (
    <div className="max-w-lg mx-auto bg-white rounded-2xl shadow-sm border border-slate-100 p-5 space-y-4">
      <h1 className="text-lg font-semibold">My Profile</h1>
      <form className="space-y-3" onSubmit={onSubmit}>
        <div>
          <label className="block text-xs font-medium mb-1">Name</label>
          <input
            className="w-full border rounded-md px-3 py-2 text-sm"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-xs font-medium mb-1">Email</label>
          <input
            disabled
            className="w-full border rounded-md px-3 py-2 text-sm bg-slate-100"
            value={user.email}
          />
        </div>
        <fieldset className="border rounded-md p-3">
          <legend className="text-xs text-slate-500 px-1">Shipping Address</legend>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <input
              placeholder="Address line 1"
              className="border rounded-md px-2 py-1.5"
              value={form.address.line1 || ""}
              onChange={(e) => updateAddress("line1", e.target.value)}
            />
            <input
              placeholder="Address line 2"
              className="border rounded-md px-2 py-1.5"
              value={form.address.line2 || ""}
              onChange={(e) => updateAddress("line2", e.target.value)}
            />
            <input
              placeholder="City"
              className="border rounded-md px-2 py-1.5"
              value={form.address.city || ""}
              onChange={(e) => updateAddress("city", e.target.value)}
            />
            <input
              placeholder="State"
              className="border rounded-md px-2 py-1.5"
              value={form.address.state || ""}
              onChange={(e) => updateAddress("state", e.target.value)}
            />
            <input
              placeholder="Postal code"
              className="border rounded-md px-2 py-1.5"
              value={form.address.postalCode || ""}
              onChange={(e) => updateAddress("postalCode", e.target.value)}
            />
            <input
              placeholder="Country"
              className="border rounded-md px-2 py-1.5"
              value={form.address.country || ""}
              onChange={(e) => updateAddress("country", e.target.value)}
            />
          </div>
        </fieldset>
        <button
          type="submit"
          className="bg-primary text-white text-sm font-semibold px-4 py-2 rounded-md"
        >
          Save Changes
        </button>
      </form>
      {message && <p className="text-xs text-emerald-600">{message}</p>}
    </div>
  );
}
