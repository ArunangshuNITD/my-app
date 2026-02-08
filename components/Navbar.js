"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { FiSun, FiMoon, FiShoppingCart, FiMenu, FiX } from "react-icons/fi"; // Added FiMenu, FiX for cleaner icons
import AuthButton from "./Authbutton";
import { useCart } from "@/context/CartContext";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const { cart } = useCart();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (pathname && pathname.startsWith("/dashboard")) {
    return null;
  }

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Find Mentors", href: "/mentors" },
    { name: "Blogs", href: "/blogs" },
    { name: "Store", href: "/store" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  const ThemeToggle = () => {
    if (!mounted) return <div className="w-9 h-9" />;

    return (
      <button
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        className="flex items-center justify-center h-9 w-9 rounded-full transition-all focus:outline-none ring-1 
          bg-zinc-100 text-zinc-600 ring-zinc-200 
          dark:bg-black dark:text-lime-400 dark:ring-lime-500/50 dark:hover:shadow-[0_0_10px_rgba(163,230,53,0.2)]"
        aria-label="Toggle Dark Mode"
      >
        {theme === "dark" ? <FiSun size={18} /> : <FiMoon size={18} />}
      </button>
    );
  };

  // Helper component for Cart Icon to avoid code duplication
  const CartIcon = () => (
    <Link href="/cart" className="relative p-2 text-zinc-600 dark:text-lime-400 hover:text-indigo-600 transition-colors">
      <FiShoppingCart size={22} />
      {cart.length > 0 && (
        <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
          {cart.length}
        </span>
      )}
    </Link>
  );

  return (
    <nav className="sticky top-0 z-50 w-full transition-colors duration-300 border-b 
      border-zinc-200 bg-white/80 backdrop-blur-md 
      dark:border-lime-900/30 dark:bg-black/90">

      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 md:px-12">

        {/* 1. Logo Section */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="relative flex h-8 w-8 items-center justify-center overflow-hidden rounded-lg transition-all 
            bg-indigo-600 group-hover:bg-indigo-500
            dark:bg-lime-500 dark:group-hover:bg-lime-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-5 w-5 text-white dark:text-black"
            >
              <path d="M4.5 4.5a1.5 1.5 0 00-1.5 1.5v12a1.5 1.5 0 001.5 1.5h2.25a.75.75 0 00.75-.75v-6.75l3.75 3.75a1.5 1.5 0 002.12 0l3.75-3.75v6.75a.75.75 0 00.75-.75h2.25a1.5 1.5 0 001.5-1.5v-12a1.5 1.5 0 00-1.5-1.5h-2.25a1.5 1.5 0 00-1.06.44L12 9.88 7.31 5.19A1.5 1.5 0 006.25 4.5H4.5z" />
            </svg>
          </div>

          <span className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white">
            Mentor<span className="text-indigo-600 dark:text-lime-400">Connect</span>
          </span>
        </Link>

        {/* 2. Desktop Navigation (Hidden on Mobile) */}
        <div className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-sm font-medium transition-colors 
                  text-zinc-600 hover:text-indigo-600 
                  dark:text-zinc-400 dark:hover:text-lime-400"
              >
                {link.name}
              </Link>
            ))}
        </div>

        {/* 3. Auth Buttons & Dark Mode (Desktop Only) */}
        <div className="hidden items-center gap-4 md:flex">
          <CartIcon />
          <ThemeToggle />
          <div className="h-6 w-px bg-zinc-200 dark:bg-lime-900/30"></div>
          <AuthButton />
        </div>

        {/* 4. Mobile Header Section (Visible on Phone) */}
        <div className="flex items-center gap-3 md:hidden">
          {/* ADDED: Cart Icon for Mobile */}
          <CartIcon />
          
          <ThemeToggle />
          
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="rounded-md p-2 transition-colors
              text-zinc-600 hover:bg-zinc-100 
              dark:text-lime-400 dark:hover:bg-lime-950"
          >
            {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      </div>

      {/* 5. Mobile Dropdown Menu */}
      {isOpen && (
        <div className="absolute left-0 top-full w-full border-b px-6 py-8 md:hidden 
          animate-in slide-in-from-top-2 fade-in duration-300
          border-zinc-200 bg-white/95 backdrop-blur-xl 
          dark:border-lime-900/30 dark:bg-black/95">

          {/* Flex container to center everything */}
          <div className="flex flex-col items-center justify-center gap-6 text-center">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="text-lg font-semibold transition-colors
                  text-zinc-700 hover:text-indigo-600 
                  dark:text-zinc-300 dark:hover:text-lime-400"
              >
                {link.name}
              </Link>
            ))}

            {/* Visual Divider */}
            <div className="h-px w-24 bg-gradient-to-r from-transparent via-zinc-200 to-transparent dark:via-lime-900/50" />

            {/* Auth Button Centered */}
            <div className="w-full flex justify-center pb-4">
              <AuthButton />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}