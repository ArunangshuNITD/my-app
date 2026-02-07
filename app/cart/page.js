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
        <div className="mb-8 text-7xl opacity-30">🛒</div>
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-gray-100 mb-4">
          Your cart is empty
        </h2>
        <p className="text-lg text-gray-500 dark:text-gray-400 mb-8 max-w-md">
          Looks like you haven’t added anything yet. Start shopping now!
        </p>
        <Link
          href="/store"
          className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
        >
          Explore Store
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/40 dark:bg-gray-950/40 py-8 md:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-10 md:mb-12">
          Shopping Cart
        </h1>

        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Items */}
          <section className="lg:col-span-8 space-y-6">
            {cart.map((item, idx) => (
              <div
                key={`${item._id}-${idx}`}
                className="flex flex-col sm:flex-row gap-5 sm:gap-6 p-5 sm:p-6 bg-white dark:bg-gray-900/80 rounded-2xl border border-gray-200/70 dark:border-gray-800/70 shadow-sm hover:shadow-md transition-shadow duration-300 group"
              >
                <div className="relative w-full sm:w-32 h-32 sm:h-32 flex-shrink-0 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800">
                  <img
                    src={item.coverImage}
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
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

                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100 dark:border-gray-800">
                    <span className="text-xl font-bold text-gray-900 dark:text-white">
                      ₹{Number(item.price).toLocaleString("en-IN")}
                    </span>
                    <button
                      onClick={() => removeFromCart(item._id)}
                      className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 font-medium text-sm flex items-center gap-1.5 transition-colors"
                    >
                      <span>Remove</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </section>

          {/* Summary */}
          <aside className="lg:col-span-4">
            <div className="sticky top-6 lg:top-10 bg-white dark:bg-gray-900/90 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-lg overflow-hidden">
              <div className="p-7 lg:p-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-7">
                  Order Summary
                </h2>

                <div className="space-y-4 text-gray-600 dark:text-gray-300">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>₹{totalPrice.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax (0%)</span>
                    <span>₹0</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className="text-green-600 dark:text-green-400">Free</span>
                  </div>

                  <div className="h-px bg-gray-200 dark:bg-gray-700 my-5" />

                  <div className="flex justify-between text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
                    <span>Total</span>
                    <span>₹{totalPrice.toLocaleString("en-IN")}</span>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  disabled={isCheckingOut}
                  className="mt-8 w-full bg-gradient-to-r from-gray-900 to-black hover:from-gray-800 hover:to-gray-950 dark:from-white dark:to-gray-100 dark:text-black text-white py-4 px-6 rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 transform hover:-translate-y-0.5"
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
                    "Proceed to Checkout"
                  )}
                </button>

                <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-5">
                  Secure checkout • No real payment processed (simulation)
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}