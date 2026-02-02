"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  FaShieldAlt, FaUserLock, FaArrowLeft, 
  FaGhost 
} from "react-icons/fa";

const forbiddenPhrases = [
  "Access denied. Nice try though.",
  "This area is off-limits. Go study JEE/NEET instead.",
  "You shall not pass... admin panel.",
  "404 vibes but make it ✨ restricted ✨",
  "Only chosen ones (admins) may enter.",
  "Intruder alert! (jk... but seriously, leave)",
];

export default function ForbiddenPage() {
  const [phrase, setPhrase] = useState(""); // Start empty to avoid text mismatch too
  const [showGhost, setShowGhost] = useState(false);
  const [particles, setParticles] = useState([]); // 👈 Store random particles here

  useEffect(() => {
    // 1. Set the random phrase once mounted
    const randomIndex = Math.floor(Math.random() * forbiddenPhrases.length);
    setPhrase(forbiddenPhrases[randomIndex]);

    // 2. Generate random particles strictly on the client
    const generatedParticles = [...Array(20)].map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      duration: Math.random() * 10 + 10,
      delay: Math.random() * 5,
    }));
    setParticles(generatedParticles);

    // 3. Ghost timer
    const timer = setTimeout(() => setShowGhost(true), 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-slate-950 via-indigo-950 to-purple-950 text-white flex items-center justify-center px-4">
      
      {/* Background animated particles */}
      <div className="absolute inset-0 pointer-events-none">
        {particles.map((p) => (
          <motion.div
            key={p.id}
            className="absolute w-1 h-1 bg-indigo-400/40 rounded-full"
            initial={{
              x: p.x + "vw",
              y: p.y + "vh",
              scale: 0,
            }}
            animate={{
              x: p.x + "vw",
              y: p.y + "vh",
              scale: [0, 1.2, 0],
              opacity: [0, 0.7, 0],
            }}
            transition={{
              duration: p.duration,
              repeat: Infinity,
              delay: p.delay,
            }}
          />
        ))}
      </div>

      {/* Floating ghost */}
      {showGhost && (
        <motion.div
          className="absolute top-20 right-10 md:right-32 text-8xl md:text-9xl opacity-30"
          animate={{
            y: [0, -30, 0],
            rotate: [0, 5, -5, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        >
          <FaGhost className="text-purple-300/60" />
        </motion.div>
      )}

      <div className="relative z-10 text-center max-w-2xl">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 120, damping: 12 }}
        >
          <div className="mb-8 relative inline-block">
            <motion.div
              className="absolute -inset-8 rounded-full bg-red-600/20 blur-3xl"
              animate={{ scale: [1, 1.4, 1] }}
              transition={{ duration: 4, repeat: Infinity }}
            />
            <FaUserLock className="text-8xl md:text-10xl text-red-500 mx-auto" />
          </div>

          <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-4 bg-gradient-to-r from-red-400 via-pink-400 to-purple-500 bg-clip-text text-transparent">
            ACCESS DENIED
          </h1>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-xl md:text-2xl mb-8 text-slate-300 font-light min-h-[32px]"
          >
            {phrase || "Loading access protocols..."}
          </motion.p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/"
              className="group relative inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-700 rounded-xl text-lg font-semibold overflow-hidden shadow-lg shadow-indigo-900/40 hover:shadow-indigo-700/60 transition-all duration-300"
            >
              <span className="relative z-10 flex items-center gap-2">
                <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
                Back to Safety
              </span>
              <motion.span
                className="absolute inset-0 bg-gradient-to-r from-indigo-500/30 to-purple-600/30"
                initial={{ x: "-100%" }}
                whileHover={{ x: "100%" }}
                transition={{ duration: 0.6 }}
              />
            </Link>

            <Link
              href="/mentors"
              className="px-8 py-4 bg-slate-800/60 backdrop-blur-sm border border-slate-700 rounded-xl text-lg font-medium hover:bg-slate-700/80 transition-colors"
            >
              Browse Mentors
            </Link>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="mt-12 text-sm text-slate-500"
          >
            <FaShieldAlt className="inline mr-2" />
            Area restricted to authorized personnel only
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}