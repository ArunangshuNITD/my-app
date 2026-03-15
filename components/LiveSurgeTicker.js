"use client";

import { useState, useEffect } from "react";
import { calculateSurgePrice } from "@/lib/surgePricing";

export default function LiveSurgeTicker({ 
  baseAmount, 
  maxBudget, 
  createdAt, 
  deadline, 
  status, 
  finalPrice 
}) {
  const [currentPrice, setCurrentPrice] = useState(() => {
    if (status === 'open' && deadline && maxBudget) {
      return calculateSurgePrice(baseAmount, maxBudget, createdAt, deadline);
    }
    return finalPrice || baseAmount;
  });

  // Local state to track "Heat" internally for real-time UI shifts
  const [isHot, setIsHot] = useState(false);

  useEffect(() => {
    if (status !== 'open' || !deadline || !maxBudget) return;

    const end = new Date(deadline).getTime();

    const updateTicker = () => {
      const now = Date.now();
      
      // 1. Calculate Heat (less than 60 minutes remaining)
      const minsRemaining = (end - now) / (1000 * 60);
      setIsHot(minsRemaining > 0 && minsRemaining < 60);

      // 2. Handle Expiry
      if (now >= end) {
        setCurrentPrice(maxBudget);
        return false; // Stop interval
      }

      // 3. Update Price
      const newPrice = calculateSurgePrice(baseAmount, maxBudget, createdAt, deadline);
      setCurrentPrice((prevPrice) => newPrice > prevPrice ? newPrice : prevPrice);
      return true;
    };

    // Initial check
    updateTicker();

    const intervalId = setInterval(() => {
      const shouldContinue = updateTicker();
      if (!shouldContinue) clearInterval(intervalId);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [baseAmount, maxBudget, createdAt, deadline, status]);

  const isSurging = currentPrice > baseAmount && status === 'open';

  // Define styling based on state
  // Standard: Yellow -> Surging: Red -> Heat: Animated Orange/Red
  const getTickerStyles = () => {
    if (status !== 'open') return 'bg-gray-100 text-gray-800'; // Locked/Claimed
    if (isHot) return 'bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-[0_0_15px_rgba(234,88,12,0.5)] animate-pulse';
    if (isSurging) return 'bg-red-100 text-red-800 shadow-[0_0_10px_rgba(239,68,68,0.3)]';
    return 'bg-yellow-100 text-yellow-800';
  };

  return (
    <div className="flex flex-col items-end">
      {isSurging && (
         <span className={`text-xs mb-1 transition-all font-bold ${isHot ? 'text-orange-300' : 'text-gray-400 line-through'}`}>
           ₹{baseAmount} {isHot && "BASE"}
         </span>
      )}
      <span 
        className={`px-3 py-1 rounded-full font-mono font-black text-lg transition-all duration-500 transform ${isHot ? 'scale-110' : 'scale-100'} ${getTickerStyles()}`}
      >
        ₹{currentPrice}
      </span>
    </div>
  );
}