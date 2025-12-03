import React, { useState } from "react";
import api from "../api.js";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [result, setResult] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setResult("");
    const res = await api.post("/auth/forgot-password", { email });
    setResult(res.data.message + (res.data.resetToken ? ` Reset token: ${res.data.resetToken}` : ""));
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
      <h1 className="text-lg font-semibold mb-4">Forgot Password</h1>
      <form className="space-y-3" onSubmit={onSubmit}>
        <div>
          <label className="block text-xs font-medium mb-1">Email</label>
          <input
            type="email"
            className="w-full border rounded-md px-3 py-2 text-sm"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <button
          type="submit"
          className="w-full bg-primary text-white text-sm font-semibold py-2 rounded-md"
        >
          Generate Reset Link (Demo)
        </button>
      </form>
      {result && <p className="mt-3 text-xs text-slate-600">{result}</p>}
    </div>
  );
}
