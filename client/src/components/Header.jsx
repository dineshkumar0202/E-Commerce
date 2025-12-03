import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useCart } from "../context/CartContext.jsx";

export default function Header() {
  const { user, logout } = useAuth();
  const { items } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const search = params.get("search") || "";

  const onSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const value = formData.get("search") || "";
    const next = new URLSearchParams(location.search);
    if (value) next.set("search", value);
    else next.delete("search");
    navigate({ pathname: "/", search: next.toString() });
  };

  return (
    <header className="bg-primary text-white sticky top-0 z-20 shadow-md">
      <div className="max-w-6xl mx-auto flex items-center gap-3 px-2 sm:px-4 py-2">
        <Link to="/" className="flex items-center gap-1">
          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center font-bold text-lg">
            m
          </div>
          <span className="text-xl sm:text-2xl font-bold leading-tight">
            my<span className="text-accent">shopping</span>
          </span>
        </Link>
        <form
          onSubmit={onSubmit}
          className="flex-1 hidden sm:flex items-center max-w-xl"
        >
          <input
            name="search"
            defaultValue={search}
            placeholder="Search for products, brands and more"
            className="w-full text-black rounded-l-md px-3 py-1.5 text-sm outline-none"
          />
          <button
            type="submit"
            className="bg-accent px-4 py-1.5 text-sm font-medium rounded-r-md hover:brightness-95"
          >
            Search
          </button>
        </form>
        <div className="flex items-center gap-3 text-xs sm:text-sm ml-auto">
          <Link to="/cart" className="relative">
            <span className="font-medium">Cart</span>
            {items.length > 0 && (
              <span className="absolute -top-2 -right-3 text-[10px] bg-accent text-black rounded-full px-1.5 py-0.5">
                {items.length}
              </span>
            )}
          </Link>
          <Link to="/wishlist" className="hidden sm:inline-block">
            Wishlist
          </Link>
          {user ? (
            <>
              {user.role === "admin" && (
                <Link to="/admin/dashboard" className="hidden sm:inline-block">
                  Admin
                </Link>
              )}
              <Link to="/profile" className="font-medium">
                Hi, {user.name.split(" ")[0]}
              </Link>
              <button
                onClick={logout}
                className="border border-white/40 px-2 py-1 rounded-md text-xs"
              >
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" className="border border-white/40 px-3 py-1 rounded-md">
              Login
            </Link>
          )}
        </div>
      </div>
      <form
        onSubmit={onSubmit}
        className="sm:hidden px-2 pb-2 flex items-center gap-1 bg-primary"
      >
        <input
          name="search"
          defaultValue={search}
          placeholder="Search products"
          className="w-full text-black rounded-l-md px-3 py-1.5 text-sm outline-none"
        />
        <button
          type="submit"
          className="bg-accent px-3 py-1.5 text-xs font-medium rounded-r-md"
        >
          Go
        </button>
      </form>
    </header>
  );
}
