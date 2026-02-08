"use client";

import { useCart } from "@/context/CartContext";
import Link from "next/link";
import { useState } from "react";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const { cart, removeFromCart, clearCart } = useCart();
  const { data: session } = useSession();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const router = useRouter();

  const totalPrice = cart.reduce((sum, item) => sum + item.price, 0);

  const handleCheckout = async () => {
    if (!session) {
      signIn();
      return;
    }

    setIsCheckingOut(true);

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cart,
          totalAmount: totalPrice,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Checkout failed");
      }

      alert("Purchase successful! Check your profile for order details.");
      clearCart();
      router.push("/profile");
    } catch (error) {
      console.error("Checkout error:", error);
      alert("Checkout failed. Please try again.");
    } finally {
      setIsCheckingOut(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 py-16 text-center">
        <div className="mb-6">
          <div className="text-8xl">🏬</div>
        </div>
        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3">Welcome to the Mall</h2>
        <p className="text-lg text-gray-600 mb-8 max-w-lg">Your cart is empty — browse storefronts and grab deals from top sellers.</p>
        <Link
          href="/store"
          className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-pink-500 via-red-500 to-yellow-400 text-white font-bold rounded-2xl shadow-2xl hover:scale-105 transition-transform duration-300"
        >
          Visit Storefronts
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 md:py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white via-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8 flex items-center justify-between">
          <h1 className="text-4xl font-extrabold text-gray-900">Mall Cart</h1>
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 text-sm rounded-full bg-amber-100 text-amber-700 font-semibold">Holiday Deals</span>
            <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg shadow hover:shadow-md">Stores</button>
          </div>
        </header>

        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Items */}
          <section className="lg:col-span-8 space-y-6">
            {cart.map((item, idx) => (
              <div
                key={`${item._id}-${idx}`}
                className="flex flex-col sm:flex-row gap-5 sm:gap-6 p-5 sm:p-6 bg-white rounded-2xl border border-gray-200 shadow-lg hover:shadow-2xl transition-shadow duration-300 group"
              >
                <div className="relative w-full sm:w-36 h-36 sm:h-36 flex-shrink-0 rounded-xl overflow-hidden bg-gray-100">
                  <img
                    src={item.coverImage}
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  {/* Storefront badge */}
                  <div className="absolute left-2 top-2 bg-white/90 text-xs px-2 py-0.5 rounded font-semibold shadow">Store</div>
                </div>

                <div className="flex-1 flex flex-col">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg md:text-xl text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                      {item.name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      ID: {item._id.slice(-6).toUpperCase()}
                    </p>
                  </div>

                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
                    <div className="flex items-center gap-4">
                      <span className="text-xl font-bold text-gray-900">₹{Number(item.price).toLocaleString("en-IN")}</span>
                      <div className="text-sm text-green-600 font-semibold">Free Pickup</div>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => removeFromCart(item._id)}
                        className="text-sm text-red-600 hover:text-red-700 font-medium flex items-center gap-1.5"
                      >
                        Remove
                      </button>
                      <div className="bg-gray-100 px-3 py-1 rounded-full text-sm font-medium">Qty: 1</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </section>

          {/* Summary */}
          <aside className="lg:col-span-4">
            <div className="sticky top-6 lg:top-10 bg-gradient-to-br from-white to-amber-50 rounded-2xl border border-gray-200 shadow-2xl overflow-hidden">
              <div className="p-7 lg:p-8">
                <h2 className="text-2xl font-extrabold text-gray-900 mb-4">Order Summary</h2>

                <div className="space-y-4 text-gray-700">
                  <div className="flex justify-between">
                    <span className="text-sm">Subtotal</span>
                    <span className="font-semibold">₹{totalPrice.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Discount</span>
                    <span className="text-green-600 font-semibold">-₹0</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Shipping</span>
                    <span className="text-green-600 font-semibold">Free</span>
                  </div>

                  <div className="h-px bg-gray-200 my-5" />

                  <div className="flex justify-between text-2xl font-extrabold text-gray-900">
                    <span>Total</span>
                    <span>₹{totalPrice.toLocaleString("en-IN")}</span>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  disabled={isCheckingOut}
                  className="mt-8 w-full bg-gradient-to-r from-pink-500 via-red-500 to-yellow-400 text-white py-4 px-6 rounded-2xl font-extrabold text-lg shadow-2xl hover:scale-105 transition-transform duration-300 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isCheckingOut ? (
                    <>
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8h8a8 8 0 01-16 0z" />
                      </svg>
                      Processing...
                    </>
                  ) : (
                    "Checkout at Mall"
                  )}
                </button>

                <p className="text-xs text-center text-gray-500 mt-5">Pay securely • Pickup or home delivery available</p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}