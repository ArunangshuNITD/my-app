// components/BadgeGallery.js
"use client";

import { 
  FaFire, 
  FaTrophy, 
  FaStar, 
  FaBrain, 
  FaMedal, 
  FaAward, 
  FaCrosshairs, 
  FaCrown, 
  FaCoins 
} from "react-icons/fa";

// The master dictionary of badges
export const ALL_BADGES = [
  // Existing Badges
  { id: "streak_10", name: "10-Day Streak", description: "Kept the fire alive for 10 days.", icon: FaFire, color: "text-orange-500", bg: "bg-orange-500/10", border: "border-orange-500/20" },
  { id: "master_solver", name: "Master Solver", description: "Solved 100 platform challenges.", icon: FaBrain, color: "text-purple-500", bg: "bg-purple-500/10", border: "border-purple-500/20" },
  { id: "master_mentor", name: "Top Mentor", description: "Achieved a 4.9+ rating from peers.", icon: FaStar, color: "text-yellow-500", bg: "bg-yellow-500/10", border: "border-yellow-500/20" },
  { id: "first_blood", name: "First Blood", description: "Completed your very first quiz.", icon: FaTrophy, color: "text-emerald-500", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
  
  // Mentor Badges (Based on active teaching sessions)
  { id: "mentor_gold", name: "Gold Mentor", description: "50+ Active Teaching Sessions.", icon: FaMedal, color: "text-yellow-400", bg: "bg-yellow-400/10", border: "border-yellow-400/20" },
  { id: "mentor_silver", name: "Silver Mentor", description: "20+ Active Teaching Sessions.", icon: FaMedal, color: "text-slate-400", bg: "bg-slate-400/10", border: "border-slate-400/20" },
  { id: "mentor_bronze", name: "Bronze Mentor", description: "10+ Active Teaching Sessions.", icon: FaMedal, color: "text-orange-700", bg: "bg-orange-700/10", border: "border-orange-700/20" },

  // Student Badges (Based on learning sessions)
  { id: "student_gold", name: "Gold Scholar", description: "50+ Learning Sessions.", icon: FaAward, color: "text-yellow-400", bg: "bg-yellow-400/10", border: "border-yellow-400/20" },
  { id: "student_silver", name: "Silver Scholar", description: "20+ Learning Sessions.", icon: FaAward, color: "text-slate-400", bg: "bg-slate-400/10", border: "border-slate-400/20" },
  { id: "student_bronze", name: "Bronze Scholar", description: "10+ Learning Sessions.", icon: FaAward, color: "text-orange-700", bg: "bg-orange-700/10", border: "border-orange-700/20" },

  // Bounty Board Badges
  { id: "bounty_hunter", name: "Bounty Hunter", description: "Successfully solved your first bounty.", icon: FaCrosshairs, color: "text-red-500", bg: "bg-red-500/10", border: "border-red-500/20" },
  { id: "bounty_master", name: "Bounty Master", description: "Solved 10+ bounties and collected the rewards.", icon: FaCrown, color: "text-amber-500", bg: "bg-amber-500/10", border: "border-amber-500/20" },
  { id: "generous_scholar", name: "Generous Scholar", description: "Posted 5+ bounties to support the mentor community.", icon: FaCoins, color: "text-emerald-600", bg: "bg-emerald-600/10", border: "border-emerald-600/20" },
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
              title={badge.description} // Tooltip to see descriptions on hover
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