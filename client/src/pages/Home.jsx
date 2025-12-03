import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import api from "../api.js";
import ProductCard from "../components/ProductCard.jsx";

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(["All"]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const search = params.get("search") || "";

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const [featuredRes, productsRes] = await Promise.all([
          api.get("/products/featured"),
          api.get("/products", { params: { search, category: activeCategory } })
        ]);
        setFeatured(featuredRes.data);
        setProducts(productsRes.data);
        const cats = new Set(productsRes.data.map((p) => p.category));
        setCategories(["All", ...Array.from(cats)]);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [search, activeCategory]);

  return (
    <div className="flex flex-col gap-6">
      {/* Hero banner */}
      <section className="bg-primary rounded-2xl text-white relative overflow-hidden">
        <div className="px-5 py-6 sm:px-8 sm:py-8 flex flex-col md:flex-row gap-6 items-center">
          <div className="flex-1 space-y-3">
            <p className="uppercase text-xs tracking-widest text-white/70">
              DualSense Wireless Controller
            </p>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold leading-tight">
              Bring Gaming Worlds To Life
            </h1>
            <p className="text-sm text-white/80">
              Explore the latest gaming accessories, consoles and headsets with instant discounts.
            </p>
            <div className="flex items-baseline gap-3 mt-2">
              <span className="text-sm text-white/70">Starting at</span>
              <span className="text-2xl font-extrabold text-accent">$449.99</span>
            </div>
            <button className="mt-3 bg-accent text-black text-sm font-semibold px-4 py-2 rounded-md">
              Shop Now
            </button>
          </div>
          <div className="flex-1 flex justify-center">
            <div className="w-52 h-52 sm:w-64 sm:h-64 rounded-full bg-white/10 flex items-center justify-center">
              <div className="w-40 h-40 sm:w-52 sm:h-52 bg-white/10 rounded-3xl border border-white/10 flex items-center justify-center text-6xl">
                🎮
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category row */}
      <section className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4">
        <h2 className="text-sm font-semibold mb-3">Shop By Category</h2>
        <div className="flex gap-3 overflow-x-auto pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`flex flex-col items-center justify-center px-4 py-2 min-w-[96px] rounded-xl border text-xs sm:text-sm ${
                activeCategory === cat
                  ? "bg-primary text-white border-primary"
                  : "bg-slate-50 text-slate-700 border-slate-200"
              }`}
            >
              <span>{cat}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Featured deals slider style */}
      <section className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-sm font-semibold">Today's Featured Deals</h2>
          <span className="text-xs text-slate-500">Limited time offers</span>
        </div>
        {featured.length === 0 ? (
          <p className="text-xs text-slate-500">No featured products yet.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-3">
            {featured.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        )}
      </section>

      {/* Trending section */}
      <section className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-sm font-semibold">Trending This Week</h2>
        </div>
        {loading ? (
          <p className="text-center py-8 text-sm text-slate-500">Loading products...</p>
        ) : products.length === 0 ? (
          <p className="text-center py-8 text-sm text-slate-500">No products found.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {products.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        )}
      </section>

      {/* Discount banner */}
      <section className="bg-slate-900 rounded-2xl text-white px-5 py-6 flex flex-col md:flex-row items-center gap-4">
        <div className="flex-1 space-y-2">
          <p className="text-xs uppercase tracking-widest text-white/60">
            New Collection
          </p>
          <h2 className="text-2xl font-bold">Up to 30% Off Instant Discount</h2>
          <p className="text-sm text-white/75">
            On select laptops, tablets and accessories using cards and wallet payments.
          </p>
        </div>
        <div className="flex-1 flex justify-center text-6xl">
          💻
        </div>
      </section>
    </div>
  );
}
