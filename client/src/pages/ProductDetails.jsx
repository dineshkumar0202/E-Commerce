import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api.js";
import { useCart } from "../context/CartContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";

export default function ProductDetails() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { user, toggleWishlist } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const inWishlist = user?.wishlist?.some((pid) => pid === product?._id);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const res = await api.get(`/products/${id}`);
        setProduct(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  if (loading) {
    return <p className="text-center py-10 text-sm text-slate-500">Loading...</p>;
  }
  if (!product) {
    return <p className="text-center py-10 text-sm text-slate-500">Product not found.</p>;
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 flex flex-col md:flex-row gap-6">
      <div className="flex-1 flex items-center justify-center">
        <img
          src={product.image}
          alt={product.name}
          className="max-h-80 object-contain"
        />
      </div>
      <div className="flex-[1.3] flex flex-col gap-2">
        <h1 className="text-xl sm:text-2xl font-semibold">{product.name}</h1>
        <p className="text-sm text-slate-500">{product.brand}</p>
        <div className="flex items-center gap-2 text-xs">
          <span className="bg-green-600 text-white px-1.5 py-0.5 rounded text-[10px]">
            {product.rating?.toFixed(1)} ★
          </span>
          <span className="text-slate-500">({product.numReviews} ratings)</span>
        </div>
        <p className="text-2xl font-bold text-slate-900 mt-2">
          ₹{product.price.toLocaleString()}
        </p>
        <p className="text-xs text-slate-600">
          Inclusive of all taxes · Free delivery for orders above ₹499
        </p>
        <p className="text-sm mt-3">{product.description}</p>
        <p className="text-sm mt-1">
          Availability:{" "}
          {product.countInStock > 0 ? (
            <span className="text-emerald-600 font-semibold">In stock</span>
          ) : (
            <span className="text-red-500 font-semibold">Out of stock</span>
          )}
        </p>
        <div className="flex gap-3 mt-4">
          <button
            onClick={() => addToCart(product)}
            className="bg-accent px-6 py-2 rounded-md text-sm font-semibold"
          >
            Add to Cart
          </button>
          {user && (
            <button
              onClick={() => toggleWishlist(product._id)}
              className={`px-6 py-2 rounded-md text-sm font-semibold border ${
                inWishlist ? "border-red-400 text-red-500" : "border-slate-300"
              }`}
            >
              {inWishlist ? "Remove from Wishlist" : "Wishlist"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
