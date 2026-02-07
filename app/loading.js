'use client';

import { useState, useEffect } from 'react';

const motivationalPhrases = [
  "Stay ahead of the curve",
  "Progress over perfection",
  "Building the future",
  "One commit at a time",
  "Code. Create. Conquer.",
  "Dream big. Code bigger.",
  "Turning ideas into reality",
  "Keep pushing forward",
  "The best is yet to come",
  "Focus. Build. Repeat.",
  "Creating tomorrow, today",
  "Leveling up every second",
  "Your next breakthrough awaits",
  "Make it happen",
  "Stay hungry. Stay foolish.",
  "Flow state activated",
  "Grinding in silence",
  "Small steps, big results",
  "Code today, win tomorrow",
  "Embrace the challenge",
  "Innovation starts here",
  "Keep calm and refactor",
  "Building something meaningful",
  "Chasing excellence",
  "Momentum is everything",
  "Create > Consume",
  "Rise and grind",
  "Unlock your potential",
  "Every line counts",
  "Future you is watching",
  "Stay consistent",
  "Crafting digital magic",
  "No limits. Just code.",
  "Believe in your build",
  "Progress is progress",
  "Write the future",
  "Energy follows focus",
  "Keep the vision alive",
  "One pixel at a time",
  "Dreams demand discipline",
  "Code with purpose",
  "The grind never lies",
  "Create what matters",
  "You're becoming unstoppable",
  "Stay in the game",
  "Build it. Ship it.",
  "Better every day",
  "Ignite your potential",
  "The journey is the reward",
  "Make today legendary",
];

export default function Loading() {
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPhraseIndex((prev) => (prev + 1) % motivationalPhrases.length);
    }, 1800); // change phrase every 1.8 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-50/80 backdrop-blur-sm dark:bg-black/80">
      <div className="flex flex-col items-center gap-6">
        
        {/* Animated Logo */}
        <div className="relative flex h-16 w-16 animate-bounce items-center justify-center rounded-xl bg-indigo-600 shadow-lg shadow-indigo-600/20">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="h-10 w-10 text-white"
          >
            <path d="M4.5 4.5a1.5 1.5 0 00-1.5 1.5v12a1.5 1.5 0 001.5 1.5h2.25a.75.75 0 00.75-.75v-6.75l3.75 3.75a1.5 1.5 0 002.12 0l3.75-3.75v6.75a.75.75 0 00.75.75h2.25a1.5 1.5 0 001.5-1.5v-12a1.5 1.5 0 00-1.5-1.5h-2.25a1.5 1.5 0 00-1.06.44L12 9.88 7.31 5.19A1.5 1.5 0 006.25 4.5H4.5z" />
          </svg>
        </div>

        {/* Cycling motivational phrase */}
        <div className="min-h-[1.5rem] px-4 text-center">
          <p className="text-lg font-medium text-zinc-700 dark:text-zinc-300 animate-fade-in-out">
            {motivationalPhrases[currentPhraseIndex]}
          </p>
        </div>

        {/* Dots loader */}
        <div className="flex items-center gap-1.5 mt-2">
          <div className="h-2.5 w-2.5 animate-pulse rounded-full bg-indigo-600 [animation-delay:0ms]"></div>
          <div className="h-2.5 w-2.5 animate-pulse rounded-full bg-indigo-600 [animation-delay:150ms]"></div>
          <div className="h-2.5 w-2.5 animate-pulse rounded-full bg-indigo-600 [animation-delay:300ms]"></div>
        </div>

      </div>
    </div>
  );
}