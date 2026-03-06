"use client";

import { usePathname } from "next/navigation";

export default function MessagesClientLayout({ sidebar, children }) {
  const pathname = usePathname();
  
  // Checks if we are on the root messages list (e.g., /messages or /profile/messages)
  const isListView = pathname.endsWith("/messages");

  return (
    <div className="max-w-6xl mx-auto bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800 overflow-hidden flex h-[80vh]">
      
      {/* Sidebar: Shows on mobile ONLY if in List View. Always shows on Desktop */}
      <div 
        className={`${isListView ? "block" : "hidden"} md:block w-full md:w-1/3 border-r border-zinc-200 dark:border-zinc-800 flex flex-col bg-zinc-50/50 dark:bg-zinc-900/50`}
      >
        {sidebar}
      </div>

      {/* Right Pane (Chat): Shows on mobile ONLY if a chat is active. Always shows on Desktop */}
      <div 
        className={`${!isListView ? "flex" : "hidden"} md:flex flex-1 flex-col bg-white dark:bg-zinc-900`}
      >
        {children}
      </div>

    </div>
  );
}