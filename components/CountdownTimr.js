"use client";

import { useState, useEffect } from "react";
import { FaClock, FaVideo } from "react-icons/fa";

export default function CountdownTimer({ targetDate, timeSlot }) {
  const [timeLeft, setTimeLeft] = useState("");
  const [isLive, setIsLive] = useState(false);
  const [mounted, setMounted] = useState(false); // Prevents hydration error

  // 1. Helper to parse your specific date + "10:00 AM" format
  const getTargetTime = () => {
    try {
      const date = new Date(targetDate);
      const startTimeString = timeSlot.split("-")[0].trim(); // Get "10:00 AM"
      const [time, modifier] = startTimeString.split(" ");
      let [hours, minutes] = time.split(":");

      if (hours === "12") hours = "00";
      if (modifier === "PM") hours = parseInt(hours, 10) + 12;

      date.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0);
      return date;
    } catch (e) {
      return null;
    }
  };

  useEffect(() => {
    setMounted(true); // Tell React we are on the client now

    const target = getTargetTime();
    if (!target) return;

    const interval = setInterval(() => {
      const now = new Date();
      const diff = target - now;

      // If session started (within the last hour) or is starting now
      if (diff <= 0) {
        setIsLive(true);
        setTimeLeft("Session Started!");
        // Optional: clear interval if you want to stop checking
        // clearInterval(interval); 
      } else {
        // Calculate Days, Hours, Minutes, Seconds
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        // Format string
        let result = "";
        if (days > 0) result += `${days}d `;
        result += `${hours}h ${minutes}m ${seconds}s`;
        
        setTimeLeft(result);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate, timeSlot]);

  // 2. Prevent Hydration Error: Don't render anything until mounted
  if (!mounted) return <span className="text-zinc-400 text-sm">Loading timer...</span>;

  // 3. Render logic
  if (isLive) {
    return (
      <span className="inline-flex items-center gap-2 text-green-600 font-bold animate-pulse">
        <FaVideo /> Join Now
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-2 text-blue-600 font-mono font-medium bg-blue-50 px-2 py-1 rounded text-sm">
      <FaClock size={12} />
      {timeLeft || "Calculating..."}
    </span>
  );
}