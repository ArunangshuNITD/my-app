"use client";
import { useState, useEffect } from "react";
import { Timer } from "lucide-react";

export default function PvPTimer({ duration, onTimeUp, questionIndex }) {
  const [timeLeft, setTimeLeft] = useState(duration);

  // Reset timer whenever the question index changes
  useEffect(() => {
    setTimeLeft(duration);
  }, [questionIndex, duration]);

  useEffect(() => {
    if (timeLeft <= 0) {
      onTimeUp(); // Trigger the parent component to move to the next question
      return;
    }

    const timerId = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timerId);
  }, [timeLeft, onTimeUp]);

  // Visual cues: turn red when time is low
  const isLowTime = timeLeft <= 5;

  return (
    <div className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold border-2 transition-colors ${
      isLowTime 
        ? "bg-red-500/20 border-red-500 text-red-500 animate-pulse" 
        : "bg-slate-800 border-slate-700 text-slate-300"
    }`}>
      <Timer size={20} />
      <span>{timeLeft}s</span>
    </div>
  );
}