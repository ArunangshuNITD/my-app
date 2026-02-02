// app/booking-error/page.js
'use client';

import { use } from "react"; // 1. Import 'use' hook
import Link from "next/link";
import { FaCalendarTimes, FaArrowLeft } from "react-icons/fa";
import { motion } from "framer-motion";

export default function BookingErrorPage({ searchParams }) {
  // 2. Unwrap the searchParams promise
  const params = use(searchParams);
  const mentorId = params?.mentorId;

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
    }
  };

  const iconVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: { 
      scale: 1, 
      opacity: 1,
      transition: { 
        type: "spring",
        stiffness: 200,
        damping: 10
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-black p-4">
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="max-w-md w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-8 text-center shadow-xl overflow-hidden relative"
      >
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-red-500/50 via-red-400/50 to-red-500/50" />

        <motion.div variants={iconVariants} className="flex justify-center mb-6">
          <div className="relative">
             <motion.div 
               animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
               transition={{ duration: 2, repeat: Infinity }}
               className="absolute inset-0 bg-red-500/20 rounded-full blur-md"
             />
             
            <div className="w-20 h-20 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center text-red-500 dark:text-red-400 text-4xl relative z-10">
              <FaCalendarTimes />
            </div>
          </div>
        </motion.div>

        <motion.h1 variants={itemVariants} className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">
          Slot No Longer Available
        </motion.h1>
        
        <motion.p variants={itemVariants} className="text-zinc-500 dark:text-zinc-400 mb-8">
          Someone else just booked this time slot or it is pending approval. Please choose a different time.
        </motion.p>

        <motion.div variants={itemVariants} className="space-y-3">
          {mentorId ? (
            <Link 
              href={`/mentors/${mentorId}`}
              className="block w-full"
            >
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-colors shadow-lg shadow-indigo-500/20"
              >
                Try Another Slot
              </motion.button>
            </Link>
          ) : (
             <Link 
              href="/mentors"
              className="block w-full"
            >
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-colors shadow-lg shadow-indigo-500/20"
              >
                Browse Mentors
              </motion.button>
            </Link>
          )}

          <Link 
            href="/"
            className="block w-full"
          >
            <motion.button
               whileHover={{ scale: 1.02, backgroundColor: "rgba(var(--zinc-100), 0.1)" }}
               whileTap={{ scale: 0.98 }}
               className="w-full py-3 px-4 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-700 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
            >
              <FaArrowLeft size={14} /> Go Home
            </motion.button>
          </Link>
        </motion.div>

      </motion.div>
    </div>
  );
}