import React, { createContext, useContext, useEffect, useState } from "react";
import api from "../api.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMe() {
      try {
        const res = await api.get("/auth/me");
        setUser(res.data.user);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    fetchMe();
  }, []);

  const login = async (email, password) => {
  const res = await api.post("/auth/login", { email, password });
  setUser(res.data.user);
};

  const register = async (name, email, password) => {
    const res = await api.post("/auth/register", { name, email, password });
    setUser(res.data.user);
  };

  const logout = async () => {
    await api.post("/auth/logout");
    setUser(null);
  };

  const toggleWishlist = async (productId) => {
    const res = await api.post(`/auth/wishlist/${productId}`);
    setUser((prev) => (prev ? { ...prev, wishlist: res.data.wishlist } : prev));
  };

  const value = { user, loading, login, register, logout, toggleWishlist };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
