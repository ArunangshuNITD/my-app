"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"; // To navigate to Mentors page
import { motion } from "framer-motion";
import { FaSearch } from "react-icons/fa";

export default function SmartSearch() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const handleSearch = () => {
    if (query.trim()) {
      // Redirects to MentorsPage with the search query
      router.push(`/mentors?q=${encodeURIComponent(query)}`);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="mt-8 w-full max-w-2xl"
    >
      <div className="relative group rounded-2xl p-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
        <div className="bg-white dark:bg-zinc-950 rounded-xl p-2 sm:p-3 flex flex-col sm:flex-row items-center gap-3 relative z-10">
          <div className="flex-1 flex items-center gap-3 w-full px-3">
            <FaSearch className="text-zinc-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="I want to crack NEET, JEE..."
              className="w-full bg-transparent border-none outline-none text-zinc-900 dark:text-white placeholder:text-zinc-400 font-medium focus:ring-0"
            />
          </div>
          <div className="h-8 w-[1px] bg-zinc-200 dark:bg-zinc-800 hidden sm:block"></div>
          <button
            onClick={handleSearch}
            className="w-full sm:w-auto px-6 py-3 rounded-lg bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-500/30"
          >
            Find Mentors
          </button>
        </div>
      </div>
      
      {/* Popular Tags */}
      <div className="mt-3 flex flex-wrap justify-center gap-2 text-xs font-medium text-zinc-500">
        <span>Popular:</span>
        {["IIT Bombay", "AIIMS Delhi", "UPSC Strategy", "Physics Doubts"].map(
          (tag) => (
            <button
              key={tag}
              onClick={() => router.push(`/mentors?q=${encodeURIComponent(tag)}`)}
              className="cursor-pointer hover:text-indigo-500 underline decoration-dashed bg-transparent border-none p-0"
            >
              {tag}
            </button>
          )
        )}
      </div>
    </motion.div>
  );
}