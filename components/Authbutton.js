"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { FaChartPie, FaSignOutAlt, FaUser } from "react-icons/fa"; 
import { useCart } from "@/context/CartContext"; // 1. Import Cart Context

export default function AuthButton() {
  const { data: session } = useSession();
  const { clearCart } = useCart(); // 2. Get clearCart function
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Define the Admin Email
  const ADMIN_EMAIL = "arunangshud3@gmail.com";
  const isAdmin = session?.user?.email === ADMIN_EMAIL;

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (session) {
    return (
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 rounded-full p-1 hover:bg-zinc-100 transition-all border border-transparent focus:ring-2 focus:ring-indigo-500"
        >
          {session.user?.image ? (
            <Image
              src={session.user.image}
              alt="Profile"
              width={32}
              height={32}
              className="rounded-full border border-zinc-200"
            />
          ) : (
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white">
              {session.user?.name?.[0] || "U"}
            </div>
          )}
          {/* Chevron */}
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`h-4 w-4 text-zinc-500 transition-transform ${isOpen ? "rotate-180" : ""}`}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
          </svg>
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-zinc-100 rounded-xl border border-zinc-200 bg-white shadow-lg ring-1 ring-black ring-opacity-5 z-50 dark:bg-[#1c1c1e] dark:border-zinc-800 dark:divide-zinc-700">
            <div className="px-4 py-3">
              <p className="text-xs text-zinc-500 dark:text-zinc-400">Signed in as</p>
              <p className="truncate text-sm font-medium text-zinc-900 dark:text-white">
                {session.user?.email}
              </p>
            </div>

            <div className="py-1">
              {/* 1. Admin Dashboard Link (Only for Admin) */}
              {isAdmin && (
                <Link
                  href="/dashboard"
                  onClick={() => setIsOpen(false)}
                  className="group flex items-center px-4 py-2 text-sm text-zinc-700 hover:bg-indigo-50 hover:text-indigo-600 dark:text-zinc-300 dark:hover:bg-zinc-800"
                >
                  <FaChartPie className="mr-3 h-4 w-4 text-zinc-400 group-hover:text-indigo-600" />
                  Admin Dashboard
                </Link>
              )}
              
              {/* 2. My Profile Link */}
              <Link
                  href="/profile"
                  onClick={() => setIsOpen(false)}
                  className="group flex items-center px-4 py-2 text-sm text-zinc-700 hover:bg-indigo-50 hover:text-indigo-600 dark:text-zinc-300 dark:hover:bg-zinc-800"
                >
                  <FaUser className="mr-3 h-4 w-4 text-zinc-400 group-hover:text-indigo-600" />
                  My Profile
              </Link>
            </div>

            <div className="py-1">
              <button
                onClick={() => {
                  clearCart(); // 3. Clear cart BEFORE signing out
                  signOut();
                }}
                className="group flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:text-red-500 dark:hover:bg-red-900/20"
              >
                <FaSignOutAlt className="mr-3 h-4 w-4 text-red-500" />
                Sign Out
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <button
      onClick={() => signIn()}
      className="rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
    >
      Sign In
    </button>
  );
}