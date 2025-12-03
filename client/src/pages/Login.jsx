import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Login() {
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await login(form.email, form.password);
      const from = location.state?.from || "/";
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
      <h1 className="text-lg font-semibold mb-4">Login</h1>
      <form className="space-y-3" onSubmit={onSubmit}>
        <div>
          <label className="block text-xs font-medium mb-1">Email</label>
          <input
            type="email"
            className="w-full border rounded-md px-3 py-2 text-sm"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-xs font-medium mb-1">Password</label>
          <input
            type="password"
            className="w-full border rounded-md px-3 py-2 text-sm"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
        </div>
        {error && <p className="text-xs text-red-500">{error}</p>}
        <button
          type="submit"
          className="w-full bg-primary text-white text-sm font-semibold py-2 rounded-md"
        >
          Login
        </button>
      </form>
      <div className="flex justify-between items-center mt-3 text-xs">
        <Link to="/forgot-password" className="text-primary">
          Forgot password?
        </Link>
        <Link to="/register" className="text-primary">
          New user? Register
        </Link>
      </div>
    </div>
  );
}
