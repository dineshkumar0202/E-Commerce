import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { user, toggleWishlist } = useAuth();

  const inWishlist = user?.wishlist?.some((id) => id === product._id);

  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-slate-100 flex flex-col">
      <div className="flex justify-between items-start p-2">
        <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-50 text-green-700 border border-green-200">
          Top Deal
        </span>
        {user && (
          <button
            onClick={() => toggleWishlist(product._id)}
            className={`text-xs ${inWishlist ? "text-red-500" : "text-slate-400"}`}
          >
            ♥
          </button>
        )}
      </div>
      <Link to={`/product/${product._id}`} className="flex-1 flex flex-col px-3 pb-3">
        <div className="flex items-center justify-center h-40 mb-3">
          <img
            src={product.image}
            alt={product.name}
            className="max-h-full max-w-full object-contain"
          />
        </div>
        <h3 className="text-sm font-semibold line-clamp-2 mb-1">{product.name}</h3>
        <p className="text-xs text-slate-500 mb-1">{product.brand}</p>
        <div className="flex items-center gap-1 text-xs mb-1">
          <span className="bg-green-600 text-white px-1.5 py-0.5 rounded text-[10px]">
            {product.rating.toFixed(1)} ★
          </span>
          <span className="text-slate-500">({product.numReviews})</span>
        </div>
        <p className="text-base font-bold text-slate-900">₹{product.price.toLocaleString()}</p>
      </Link>
      <button
        onClick={() => addToCart(product)}
        className="mt-auto bg-accent text-sm font-semibold text-black py-2 rounded-b-lg"
      >
        Add to Cart
      </button>
    </div>
  );
}
