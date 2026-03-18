"use client";

import { 
  FaFire, FaTrophy, FaStar, FaBrain, FaMedal, FaAward, FaCrosshairs, FaCrown, FaCoins,
  FaAtom, FaFlask, FaCalculator, FaDna
} from "react-icons/fa";

// The master dictionary of badges
export const ALL_BADGES = [
  // --- Existing Platform Badges ---
  { id: "streak_10", name: "10-Day Streak", description: "Kept the fire alive for 10 days.", icon: FaFire, color: "text-orange-500", bg: "bg-orange-500/10", border: "border-orange-500/20" },
  { id: "master_solver", name: "Master Solver", description: "Solved 100 platform challenges.", icon: FaBrain, color: "text-purple-500", bg: "bg-purple-500/10", border: "border-purple-500/20" },
  { id: "master_mentor", name: "Top Mentor", description: "Achieved a 4.9+ rating from peers.", icon: FaStar, color: "text-yellow-500", bg: "bg-yellow-500/10", border: "border-yellow-500/20" },
  { id: "first_blood", name: "First Blood", description: "Completed your very first quiz.", icon: FaTrophy, color: "text-emerald-500", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
  
  { id: "mentor_gold", name: "Gold Mentor", description: "50+ Active Teaching Sessions.", icon: FaMedal, color: "text-yellow-400", bg: "bg-yellow-400/10", border: "border-yellow-400/20" },
  { id: "mentor_silver", name: "Silver Mentor", description: "20+ Active Teaching Sessions.", icon: FaMedal, color: "text-slate-400", bg: "bg-slate-400/10", border: "border-slate-400/20" },
  { id: "mentor_bronze", name: "Bronze Mentor", description: "10+ Active Teaching Sessions.", icon: FaMedal, color: "text-orange-700", bg: "bg-orange-700/10", border: "border-orange-700/20" },

  { id: "student_gold", name: "Gold Scholar", description: "50+ Learning Sessions.", icon: FaAward, color: "text-yellow-400", bg: "bg-yellow-400/10", border: "border-yellow-400/20" },
  { id: "student_silver", name: "Silver Scholar", description: "20+ Learning Sessions.", icon: FaAward, color: "text-slate-400", bg: "bg-slate-400/10", border: "border-slate-400/20" },
  { id: "student_bronze", name: "Bronze Scholar", description: "10+ Learning Sessions.", icon: FaAward, color: "text-orange-700", bg: "bg-orange-700/10", border: "border-orange-700/20" },

  { id: "bounty_hunter", name: "Bounty Hunter", description: "Successfully solved your first bounty.", icon: FaCrosshairs, color: "text-red-500", bg: "bg-red-500/10", border: "border-red-500/20" },
  { id: "bounty_master", name: "Bounty Master", description: "Solved 10+ bounties and collected the rewards.", icon: FaCrown, color: "text-amber-500", bg: "bg-amber-500/10", border: "border-amber-500/20" },
  { id: "generous_scholar", name: "Generous Scholar", description: "Posted 5+ bounties to support the mentor community.", icon: FaCoins, color: "text-emerald-600", bg: "bg-emerald-600/10", border: "border-emerald-600/20" },

  // --- NEW: JEE Physics (4 levels) ---
  { id: "jee_phys_newbie", name: "JEE Phys Newbie", description: "Mastered 1 JEE Physics node.", icon: FaAtom, color: "text-blue-300", bg: "bg-blue-300/10", border: "border-blue-300/20" },
  { id: "jee_phys_amateur", name: "JEE Phys Amateur", description: "Mastered 5 JEE Physics nodes.", icon: FaAtom, color: "text-blue-400", bg: "bg-blue-400/10", border: "border-blue-400/20" },
  { id: "jee_phys_pro", name: "JEE Phys Pro", description: "Mastered 10 JEE Physics nodes.", icon: FaAtom, color: "text-blue-500", bg: "bg-blue-500/10", border: "border-blue-500/20" },
  { id: "jee_phys_knight", name: "JEE Phys Knight", description: "Mastered 25 JEE Physics nodes.", icon: FaAtom, color: "text-blue-700", bg: "bg-blue-700/10", border: "border-blue-700/20" },

  // --- NEW: JEE Chemistry (4 levels) ---
  { id: "jee_chem_newbie", name: "JEE Chem Newbie", description: "Mastered 1 JEE Chemistry node.", icon: FaFlask, color: "text-emerald-300", bg: "bg-emerald-300/10", border: "border-emerald-300/20" },
  { id: "jee_chem_amateur", name: "JEE Chem Amateur", description: "Mastered 5 JEE Chemistry nodes.", icon: FaFlask, color: "text-emerald-400", bg: "bg-emerald-400/10", border: "border-emerald-400/20" },
  { id: "jee_chem_pro", name: "JEE Chem Pro", description: "Mastered 10 JEE Chemistry nodes.", icon: FaFlask, color: "text-emerald-500", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
  { id: "jee_chem_knight", name: "JEE Chem Knight", description: "Mastered 25 JEE Chemistry nodes.", icon: FaFlask, color: "text-emerald-700", bg: "bg-emerald-700/10", border: "border-emerald-700/20" },

  // --- NEW: JEE Maths (4 levels) ---
  { id: "jee_math_newbie", name: "JEE Math Newbie", description: "Mastered 1 JEE Maths node.", icon: FaCalculator, color: "text-indigo-300", bg: "bg-indigo-300/10", border: "border-indigo-300/20" },
  { id: "jee_math_amateur", name: "JEE Math Amateur", description: "Mastered 5 JEE Maths nodes.", icon: FaCalculator, color: "text-indigo-400", bg: "bg-indigo-400/10", border: "border-indigo-400/20" },
  { id: "jee_math_pro", name: "JEE Math Pro", description: "Mastered 10 JEE Maths nodes.", icon: FaCalculator, color: "text-indigo-500", bg: "bg-indigo-500/10", border: "border-indigo-500/20" },
  { id: "jee_math_knight", name: "JEE Math Knight", description: "Mastered 25 JEE Maths nodes.", icon: FaCalculator, color: "text-indigo-700", bg: "bg-indigo-700/10", border: "border-indigo-700/20" },

  // --- NEW: NEET Physics (4 levels) ---
  { id: "neet_phys_newbie", name: "NEET Phys Newbie", description: "Mastered 1 NEET Physics node.", icon: FaAtom, color: "text-rose-300", bg: "bg-rose-300/10", border: "border-rose-300/20" },
  { id: "neet_phys_amateur", name: "NEET Phys Amateur", description: "Mastered 5 NEET Physics nodes.", icon: FaAtom, color: "text-rose-400", bg: "bg-rose-400/10", border: "border-rose-400/20" },
  { id: "neet_phys_pro", name: "NEET Phys Pro", description: "Mastered 10 NEET Physics nodes.", icon: FaAtom, color: "text-rose-500", bg: "bg-rose-500/10", border: "border-rose-500/20" },
  { id: "neet_phys_knight", name: "NEET Phys Knight", description: "Mastered 25 NEET Physics nodes.", icon: FaAtom, color: "text-rose-700", bg: "bg-rose-700/10", border: "border-rose-700/20" },

  // --- NEW: NEET Chemistry (4 levels) ---
  { id: "neet_chem_newbie", name: "NEET Chem Newbie", description: "Mastered 1 NEET Chemistry node.", icon: FaFlask, color: "text-teal-300", bg: "bg-teal-300/10", border: "border-teal-300/20" },
  { id: "neet_chem_amateur", name: "NEET Chem Amateur", description: "Mastered 5 NEET Chemistry nodes.", icon: FaFlask, color: "text-teal-400", bg: "bg-teal-400/10", border: "border-teal-400/20" },
  { id: "neet_chem_pro", name: "NEET Chem Pro", description: "Mastered 10 NEET Chemistry nodes.", icon: FaFlask, color: "text-teal-500", bg: "bg-teal-500/10", border: "border-teal-500/20" },
  { id: "neet_chem_knight", name: "NEET Chem Knight", description: "Mastered 25 NEET Chemistry nodes.", icon: FaFlask, color: "text-teal-700", bg: "bg-teal-700/10", border: "border-teal-700/20" },

  // --- NEW: NEET Biology (4 levels) ---
  { id: "neet_bio_newbie", name: "NEET Bio Newbie", description: "Mastered 1 NEET Biology node.", icon: FaDna, color: "text-green-300", bg: "bg-green-300/10", border: "border-green-300/20" },
  { id: "neet_bio_amateur", name: "NEET Bio Amateur", description: "Mastered 5 NEET Biology nodes.", icon: FaDna, color: "text-green-400", bg: "bg-green-400/10", border: "border-green-400/20" },
  { id: "neet_bio_pro", name: "NEET Bio Pro", description: "Mastered 10 NEET Biology nodes.", icon: FaDna, color: "text-green-500", bg: "bg-green-500/10", border: "border-green-500/20" },
  { id: "neet_bio_knight", name: "NEET Bio Knight", description: "Mastered 25 NEET Biology nodes.", icon: FaDna, color: "text-green-700", bg: "bg-green-700/10", border: "border-green-700/20" },
];

export default function BadgeGallery({ earnedBadgeIds = [] }) {
  // Filter to only show badges the user actually has
  const earnedBadges = ALL_BADGES.filter(badge => earnedBadgeIds.includes(badge.id));

  // If no badges are earned, hide the whole section completely
  if (earnedBadges.length === 0) return null;

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-xl shadow-sm">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-zinc-900 dark:text-white flex items-center gap-2">
          <FaTrophy className="text-yellow-500" /> Secret Achievements
        </h3>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Rare badges you've discovered along your journey.
        </p>
      </div>

      <div className="flex flex-wrap gap-4">
        {earnedBadges.map((badge) => {
          const Icon = badge.icon;
          return (
            <div 
              key={badge.id} 
              className={`flex flex-col items-center justify-center p-4 rounded-xl border ${badge.bg} ${badge.border} shadow-sm w-32 transition-transform hover:scale-105`}
              title={badge.description} 
            >
              <div className={`text-4xl mb-3 drop-shadow-sm ${badge.color}`}>
                <Icon />
              </div>
              <h4 className="text-sm font-bold text-center text-zinc-900 dark:text-white leading-tight mb-1">
                {badge.name}
              </h4>
            </div>
          );
        })}
      </div>
    </div>
  );
}