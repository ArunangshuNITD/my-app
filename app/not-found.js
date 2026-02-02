"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function NotFound() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 px-4 text-center dark:bg-black">
      <div className={`transition-all duration-1000 ease-out ${mounted ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}>
        <h1 className="select-none text-9xl font-black text-zinc-200 dark:text-zinc-800 sm:text-[12rem]">
          4<span className="inline-block animate-bounce text-indigo-600">0</span>4
        </h1>
      </div>

      <div className={`relative -mt-12 transition-all duration-1000 delay-300 ease-out ${mounted ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}>
        <div className="rounded-2xl bg-white p-8 shadow-xl ring-1 ring-zinc-200 dark:bg-zinc-900 dark:ring-zinc-800">
          <h2 className="mb-2 text-2xl font-bold text-zinc-900 dark:text-white">Page not found</h2>
          <p className="mb-6 max-w-xs text-zinc-500 dark:text-zinc-400">
            Sorry, we couldn't find the page you're looking for.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white hover:bg-indigo-500"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}