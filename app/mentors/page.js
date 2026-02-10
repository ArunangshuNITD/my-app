"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getMentorsList } from "../actions/getMentors";
import {
  FaSearch,
  FaStar,
  FaLinkedin,
  FaUniversity,
  FaFilter,
  FaGraduationCap,
} from "react-icons/fa";

export default function MentorsPage() {
  const router = useRouter();
  const [mentors, setMentors] = useState([]);
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const data = await getMentorsList();
        setMentors(data || []);
      } catch (error) {
        console.error("Failed to fetch mentors:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  const categories = ["JEE", "NEET", "GATE", "UPSC", "CAT"];

  // Color theme per category
  const categoryStyles = {
    JEE: {
      color: "indigo",
      gradient: "from-indigo-500 to-indigo-600",
      text: "text-indigo-600 dark:text-indigo-400",
      hoverText: "hover:text-indigo-700 dark:hover:text-indigo-300",
      shadow: "shadow-indigo-500/20",
      borderHover: "hover:border-indigo-400/60",
      icon: "text-indigo-600 dark:text-indigo-400",
      bgLight: "bg-indigo-500/10 dark:bg-indigo-500/20",
    },
    NEET: {
      color: "emerald",
      gradient: "from-emerald-500 to-emerald-600",
      text: "text-emerald-600 dark:text-emerald-400",
      hoverText: "hover:text-emerald-700 dark:hover:text-emerald-300",
      shadow: "shadow-emerald-500/20",
      borderHover: "hover:border-emerald-400/60",
      icon: "text-emerald-600 dark:text-emerald-400",
      bgLight: "bg-emerald-500/10 dark:bg-emerald-500/20",
    },
    GATE: {
      color: "purple",
      gradient: "from-purple-500 to-purple-600",
      text: "text-purple-600 dark:text-purple-400",
      hoverText: "hover:text-purple-700 dark:hover:text-purple-300",
      shadow: "shadow-purple-500/20",
      borderHover: "hover:border-purple-400/60",
      icon: "text-purple-600 dark:text-purple-400",
      bgLight: "bg-purple-500/10 dark:bg-purple-500/20",
    },
    UPSC: {
      color: "amber",
      gradient: "from-amber-500 to-amber-600",
      text: "text-amber-600 dark:text-amber-400",
      hoverText: "hover:text-amber-700 dark:hover:text-amber-300",
      shadow: "shadow-amber-500/20",
      borderHover: "hover:border-amber-400/60",
      icon: "text-amber-600 dark:text-amber-400",
      bgLight: "bg-amber-500/10 dark:bg-amber-500/20",
    },
    CAT: {
      color: "rose",
      gradient: "from-rose-500 to-rose-600",
      text: "text-rose-600 dark:text-rose-400",
      hoverText: "hover:text-rose-700 dark:hover:text-rose-300",
      shadow: "shadow-rose-500/20",
      borderHover: "hover:border-rose-400/60",
      icon: "text-rose-600 dark:text-rose-400",
      bgLight: "bg-rose-500/10 dark:bg-rose-500/20",
    },
  };

  const getStyle = (cat) => categoryStyles[cat] || categoryStyles.JEE;

  // Filter mentors (search + category)
  const filteredMentors = mentors.filter((mentor) => {
    const matchesSearch =
      (mentor.name || "").toLowerCase().includes(search.toLowerCase()) ||
      (mentor.bio || "").toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      activeFilter === "All" || mentor.domain === activeFilter;
    return matchesSearch && matchesCategory;
  });

  // Group mentors by category
  const mentorsByCategory =
    activeFilter === "All"
      ? categories
          .map((cat) => ({
            category: cat,
            mentors: filteredMentors.filter((m) => m.domain === cat),
          }))
          .filter((group) => group.mentors.length > 0)
      : [{ category: activeFilter, mentors: filteredMentors }];

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-50 to-white dark:from-black dark:to-zinc-950 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header + Search */}
        <header className="mb-12 flex flex-col gap-6 border-b border-zinc-200/80 pb-10 dark:border-zinc-800/60 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent sm:text-5xl">
              Find Your Mentor
            </h1>
            <p className="mt-3 text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl">
              Connect with toppers and experts who’ve already walked the path
              you’re on.
            </p>
          </div>

          <div className="relative w-full md:w-96">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-500" />
            <input
              type="text"
              placeholder="Search by name, subject, college..."
              className="w-full rounded-full border border-zinc-300/70 bg-white/80 py-3.5 pl-12 pr-5 text-base shadow-sm backdrop-blur-sm transition-all placeholder:text-zinc-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 dark:border-zinc-700/70 dark:bg-zinc-900/60 dark:text-white dark:placeholder:text-zinc-500"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </header>

        {/* Filter Pills */}
        <div className="mb-12 flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
            <FaFilter className="text-indigo-500" /> Filter by Exam:
          </div>
          <button
            onClick={() => setActiveFilter("All")}
            className={`rounded-full px-6 py-2 text-sm font-medium transition-all backdrop-blur-sm ${
              activeFilter === "All"
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/30"
                : "bg-white/80 text-zinc-700 ring-1 ring-zinc-300/70 hover:bg-zinc-100 dark:bg-zinc-800/60 dark:text-zinc-300 dark:ring-zinc-700/60 dark:hover:bg-zinc-700/80"
            }`}
          >
            All
          </button>
          {categories.map((cat) => {
            const style = getStyle(cat);
            const isActive = activeFilter === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className={`rounded-full px-6 py-2 text-sm font-medium transition-all backdrop-blur-sm ${
                  isActive
                    ? `bg-gradient-to-r ${style.gradient} text-white shadow-lg ${style.shadow}`
                    : "bg-white/80 text-zinc-700 ring-1 ring-zinc-300/70 hover:bg-zinc-100 dark:bg-zinc-800/60 dark:text-zinc-300 dark:ring-zinc-700/60 dark:hover:bg-zinc-700/80"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Controls: sort + view */}
        <div className="mb-8 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-sm text-zinc-600 dark:text-zinc-300">
            <label className="font-medium">Sort:</label>
            <select
              className="px-3 py-2 rounded-md border border-zinc-200 bg-white text-sm shadow-sm dark:bg-zinc-900 dark:border-zinc-700"
              onChange={(e) => {
                const v = e.target.value;
                if (v === "popular") {
                  setMentors((m) =>
                    [...m].sort(
                      (a, b) => (b.averageRating || 0) - (a.averageRating || 0)
                    )
                  );
                }
                if (v === "new") {
                  setMentors((m) =>
                    [...m].sort((a, b) =>
                      (b.createdAt || "") > (a.createdAt || "") ? 1 : -1
                    )
                  );
                }
              }}
            >
              <option value="popular">Most Popular</option>
              <option value="new">Newest</option>
            </select>
          </div>

          <div className="text-sm text-zinc-500">
            Showing{" "}
            <span className="font-semibold text-zinc-900 dark:text-white">
              {filteredMentors.length}
            </span>{" "}
            mentors
          </div>
        </div>

        {/* Mentors Content */}
        {mentorsByCategory.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-zinc-300/70 py-16 text-center dark:border-zinc-700/50">
            <p className="text-lg font-medium text-zinc-500 dark:text-zinc-400">
              No mentors found matching your search.
            </p>
          </div>
        ) : (
          <div className="space-y-20">
            {mentorsByCategory.map((group) => {
              const style = getStyle(group.category);
              return (
                <section key={group.category} className="scroll-mt-24">
                  <div className="mb-8 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`rounded-xl ${style.bgLight} p-3`}>
                        <FaGraduationCap className={`h-7 w-7 ${style.icon}`} />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
                          {group.category} Mentors
                        </h2>
                        <p className="text-sm text-zinc-500 dark:text-zinc-400">
                          Top performers • Rankers • AIR &lt; 100
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {group.mentors.map((mentor) => (
                      // 1. Changed outer wrapper from Link to div
                      <div
                        key={mentor._id}
                        className="group relative block h-full"
                      >
                        <div
                          className={`relative flex h-full flex-col rounded-2xl border border-zinc-200/70 bg-white/70 shadow-sm transition-all duration-300 hover:-translate-y-2 ${style.borderHover} hover:shadow-2xl hover:shadow-[color-mix(in_oklch,${style.text},transparent_80%)] dark:border-zinc-800/60 dark:bg-zinc-900/50 backdrop-blur-sm`}
                        >
                          {/* 2. Main Profile Link - Stretched to cover the card, z-index 10 */}
                          <Link
                            href={`/mentors/${mentor._id}`}
                            className="absolute inset-0 z-10 rounded-2xl"
                          >
                            <span className="sr-only">View Profile</span>
                          </Link>

                          {/* Card Content - z-index 0 so link covers it (making it clickable) */}
                          <div className="p-6 flex flex-col h-full">
                            {/* Avatar + Name */}
                            <div className="mb-5 flex items-center gap-4">
                              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full ring-2 ring-zinc-100/70 dark:ring-zinc-800/40">
                                <img
                                  src={mentor.image || "/default-avatar.png"}
                                  alt={mentor.name}
                                  className="h-full w-full object-cover transition-transform group-hover:scale-105"
                                />
                              </div>
                              <div className="min-w-0 flex-1">
                                <h3
                                  className={`truncate text-lg font-bold text-zinc-900 dark:text-white transition-colors`}
                                >
                                  {mentor.name}
                                </h3>
                                <div className="mt-1 flex items-center gap-2 text-xs font-medium text-zinc-600 dark:text-zinc-400">
                                  <FaUniversity className={`${style.icon}`} />
                                  <span className="truncate">
                                    {mentor.organization || "Top Institute"}
                                  </span>
                                </div>
                              </div>
                              {/* Ribbon */}
                              <div
                                className={`absolute top-4 right-4 rounded-full px-3 py-1 text-xs font-semibold ${style.bgLight} ${style.text}`}
                              >
                                {group.category}
                              </div>
                            </div>

                            {/* Bio */}
                            <p className="mb-6 line-clamp-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
                              {mentor.bio ||
                                "Passionate mentor helping students crack competitive exams with proven strategies."}
                            </p>

                            {/* Footer: Ratings, Price & Actions */}
                            <div className="mt-auto flex items-center justify-between border-t border-zinc-100/80 pt-4 dark:border-zinc-800/60">
                              <div className="flex flex-col">
                                {/* Rating Section */}
                                <div className="flex items-center gap-1.5">
                                  <FaStar className="text-yellow-400" />
                                  <span className="text-sm font-bold text-zinc-900 dark:text-white">
                                    {mentor.averageRating
                                      ? mentor.averageRating.toFixed(1)
                                      : "New"}
                                  </span>
                                  <span className="text-xs text-zinc-500">
                                    ({mentor.totalReviews || 0})
                                  </span>
                                </div>
                                {/* Price Section */}
                                <div className="mt-1 text-xs font-medium text-zinc-500">
                                  ₹{mentor.pricePerSession || "Free"} / session
                                </div>
                              </div>

                              {/* 3. Interactive Buttons - z-index 20 to sit ABOVE the stretched link */}
                              <div className="relative z-20 flex items-center gap-2">
                                {/* LinkedIn Icon */}
                                {mentor.linkedin && (
                                  <a
                                    href={mentor.linkedin}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="mr-1 text-zinc-400 hover:text-blue-600 transition-colors p-1"
                                  >
                                    <FaLinkedin className="h-5 w-5" />
                                  </a>
                                )}

                                <button
                                  onClick={() =>
                                    router.push(`/mentors/${mentor._id}#book`)
                                  }
                                  className="text-sm px-4 py-1.5 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-all shadow-md shadow-indigo-500/20"
                                >
                                  Book
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}