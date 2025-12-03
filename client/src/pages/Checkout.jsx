import React, { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useCart } from "../context/CartContext.jsx";
import api from "../api.js";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || "");

function CheckoutForm() {
  const { items, total, clearCart } = useCart();
  const stripe = useStripe();
  const elements = useElements();
  const [clientSecret, setClientSecret] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    async function createIntent() {
      if (!items.length) return;
      const res = await api.post("/orders/create-payment-intent", {
        items: items.map((i) => ({ productId: i._id, qty: i.qty }))
      });
      setClientSecret(res.data.clientSecret);
    }
    createIntent();
  }, [items]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements || !clientSecret) return;
    setStatus("Processing payment...");
    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement)
      }
    });
    if (result.error) {
      setStatus(result.error.message || "Payment failed");
    } else if (result.paymentIntent.status === "succeeded") {
      try {
        await api.post("/orders", {
          items: items.map((i) => ({
            productId: i._id,
            qty: i.qty,
            price: i.price
          })),
          totalAmount: total,
          paymentIntentId: result.paymentIntent.id
        });
        clearCart();
        setStatus("Payment successful! Order placed.");
      } catch {
        setStatus("Payment succeeded but order creation failed.");
      }
    }
  };

  if (!items.length) {
    return <p className="text-center text-sm text-slate-600">Cart is empty.</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="border border-slate-200 rounded-md p-3 bg-slate-50">
        <CardElement options={{ hidePostalCode: true }} />
      </div>
      <button
        disabled={!stripe}
        className="w-full bg-primary text-white text-sm font-semibold py-2 rounded-md"
      >
        Pay ₹{total.toLocaleString()}
      </button>
      {status && <p className="text-xs text-slate-600">{status}</p>}
    </form>
  );
}

export default function Checkout() {
  return (
    <div className="max-w-lg mx-auto bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
      <h1 className="text-lg font-semibold mb-3">Checkout</h1>
      <Elements stripe={stripePromise}>
        <CheckoutForm />
      </Elements>
    </div>
  );
}
