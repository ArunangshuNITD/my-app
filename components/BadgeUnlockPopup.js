// components/BadgeUnlockPopup.js
"use client";

import { useEffect, useState } from "react";
import { ALL_BADGES } from "./BadgeGallery";

export default function BadgeUnlockPopup({ badgeId, onClose }) {
  const [isVisible, setIsVisible] = useState(false);
  
  const badge = ALL_BADGES.find(b => b.id === badgeId);

  // Trigger the entrance animation when the component mounts
  useEffect(() => {
    if (badge) {
      setIsVisible(true);
      // Optional: Auto-close after 5 seconds
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(onClose, 300); // Wait for fade out before unmounting
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [badge, onClose]);

  if (!badge) return null;

  const Icon = badge.icon;

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${isVisible ? "opacity-100" : "opacity-0"}`}>
      <div className={`bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-8 rounded-2xl shadow-2xl flex flex-col items-center transform transition-transform duration-500 ease-out ${isVisible ? "scale-100 translate-y-0" : "scale-75 translate-y-8"}`}>
        
        <p className="text-sm font-bold text-zinc-500 uppercase tracking-widest mb-4">
          Achievement Unlocked!
        </p>
        
        {/* Animated Icon */}
        <div className={`text-7xl mb-6 ${badge.color} animate-bounce`}>
          <Icon />
        </div>

        <h2 className="text-3xl font-black text-zinc-900 dark:text-white mb-2">
          {badge.name}
        </h2>
        
        <p className="text-zinc-500 dark:text-zinc-400 text-center max-w-xs mb-8">
          {badge.description}
        </p>

        <button 
          onClick={() => {
            setIsVisible(false);
            setTimeout(onClose, 300);
          }}
          className="bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 px-8 py-3 rounded-full font-bold hover:scale-105 transition-transform"
        >
          Awesome!
        </button>

      </div>
    </div>
  );
}