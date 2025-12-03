import React from "react";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-200 text-xs sm:text-sm mt-6">
      <div className="max-w-6xl mx-auto px-3 py-4 flex flex-col sm:flex-row justify-between gap-2">
        <p>© {new Date().getFullYear()} myshopping. All rights reserved.</p>
        <p className="text-slate-400">
          Demo project · React · Vite · Tailwind · MongoDB · Stripe.
        </p>
      </div>
    </footer>
  );
}
