import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";

export default function Cart() {
  const { items, total, updateQty, removeFromCart, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 text-center text-sm text-slate-600">
        Your cart is empty. <Link to="/" className="text-primary font-medium">Shop now</Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row gap-4">
      <div className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-100 p-4">
        <h1 className="text-lg font-semibold mb-3">My Cart ({items.length})</h1>
        <div className="flex flex-col gap-3">
          {items.map((item) => (
            <div
              key={item._id}
              className="flex gap-3 border-b border-slate-100 pb-3 last:border-b-0"
            >
              <div className="w-20 flex items-center justify-center">
                <img
                  src={item.image}
                  alt={item.name}
                  className="max-h-16 object-contain"
                />
              </div>
              <div className="flex-1">
                <h2 className="text-sm font-semibold line-clamp-2">
                  {item.name}
                </h2>
                <p className="text-xs text-slate-500 mb-1">{item.brand}</p>
                <p className="text-sm font-bold text-slate-900">
                  ₹{item.price.toLocaleString()}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <button
                    onClick={() => updateQty(item._id, item.qty - 1)}
                    className="w-7 h-7 border rounded-md text-sm"
                  >
                    -
                  </button>
                  <span className="w-8 text-center text-sm">{item.qty}</span>
                  <button
                    onClick={() => updateQty(item._id, item.qty + 1)}
                    className="w-7 h-7 border rounded-md text-sm"
                  >
                    +
                  </button>
                  <button
                    onClick={() => removeFromCart(item._id)}
                    className="ml-4 text-xs text-red-500"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <button
          onClick={clearCart}
          className="mt-4 text-xs text-red-500 underline"
        >
          Clear Cart
        </button>
      </div>
      <div className="w-full md:w-80 bg-white rounded-2xl shadow-sm border border-slate-100 p-4 h-fit">
        <h2 className="text-sm font-semibold mb-3">Price Details</h2>
        <div className="flex justify-between text-sm mb-1">
          <span>Price ({items.length} items)</span>
          <span>₹{total.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-sm mb-1">
          <span>Delivery Charges</span>
          <span className="text-emerald-600">FREE</span>
        </div>
        <div className="border-t border-slate-200 my-2"></div>
        <div className="flex justify-between text-base font-semibold mb-3">
          <span>Total Amount</span>
          <span>₹{total.toLocaleString()}</span>
        </div>
        <button
          onClick={() => {
            if (!user) navigate("/login");
            else navigate("/checkout");
          }}
          className="w-full bg-primary text-white text-sm font-semibold py-2 rounded-md"
        >
          Place Order
        </button>
      </div>
    </div>
  );
}
