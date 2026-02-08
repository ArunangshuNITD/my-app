// app/mentors/[id]/page.js

import { getMentorById } from "@/app/actions/getMentors";
import { auth } from "@/lib/auth";
import Link from "next/link";
import {
  FaLinkedin,
  FaArrowLeft,
  FaBriefcase,
  FaGraduationCap,
  FaMapMarkerAlt,
  FaEdit,
  FaCalendarAlt,
  FaStar,
  FaCheckCircle,
} from "react-icons/fa";

export default async function MentorProfilePage({ params }) {
  const { id } = await params;
  const mentor = await getMentorById(id);
  const session = await auth();

  if (!mentor) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-[#09090b]">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Mentor Not Found</h1>
          <Link href="/mentors" className="mt-4 text-indigo-600 hover:underline font-medium">
            ← Back
          </Link>
        </div>
      </div>
    );
  }

  // --- Color scheme per category ---
  const categoryStyles = {
    JEE: {
      gradient: "from-indigo-600 via-indigo-700 to-indigo-800",
      text: "text-indigo-600",
      darkText: "dark:text-indigo-400",
      bgLight: "bg-indigo-50 dark:bg-indigo-900/30",
      ring: "ring-indigo-700/10 dark:ring-indigo-400/30",
      icon: "text-indigo-600 dark:text-indigo-400",
      button: "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-500/20",
    },
    NEET: {
      gradient: "from-emerald-600 via-emerald-700 to-emerald-800",
      text: "text-emerald-600",
      darkText: "dark:text-emerald-400",
      bgLight: "bg-emerald-50 dark:bg-emerald-900/30",
      ring: "ring-emerald-700/10 dark:ring-emerald-400/30",
      icon: "text-emerald-600 dark:text-emerald-400",
      button: "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/20",
    },
    GATE: {
      gradient: "from-purple-600 via-purple-700 to-purple-800",
      text: "text-purple-600",
      darkText: "dark:text-purple-400",
      bgLight: "bg-purple-50 dark:bg-purple-900/30",
      ring: "ring-purple-700/10 dark:ring-purple-400/30",
      icon: "text-purple-600 dark:text-purple-400",
      button: "bg-purple-600 hover:bg-purple-700 shadow-purple-500/20",
    },
    UPSC: {
      gradient: "from-amber-600 via-amber-700 to-amber-800",
      text: "text-amber-600",
      darkText: "dark:text-amber-400",
      bgLight: "bg-amber-50 dark:bg-amber-900/30",
      ring: "ring-amber-700/10 dark:ring-amber-400/30",
      icon: "text-amber-600 dark:text-amber-400",
      button: "bg-amber-600 hover:bg-amber-700 shadow-amber-500/20",
    },
    CAT: {
      gradient: "from-rose-600 via-rose-700 to-rose-800",
      text: "text-rose-600",
      darkText: "dark:text-rose-400",
      bgLight: "bg-rose-50 dark:bg-rose-900/30",
      ring: "ring-rose-700/10 dark:ring-rose-400/30",
      icon: "text-rose-600 dark:text-rose-400",
      button: "bg-rose-600 hover:bg-rose-700 shadow-rose-500/20",
    },
  };

  const style = categoryStyles[mentor.domain] || categoryStyles.JEE; // fallback to JEE

  // --- ADMIN LOGIC ---
  const ADMIN_EMAIL = "arunangshud3@gmail.com";
  const isOwner = session?.user?.email === mentor.email;
  const isAdmin = session?.user?.email === ADMIN_EMAIL;
  const canEdit = isOwner || isAdmin;

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-[#09090b] font-sans pb-20">
      {/* Top Navigation */}
      <div className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-md px-6 py-4 dark:border-white/10 dark:bg-[#09090b]/80">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <Link
            href="/mentors"
            className="group flex items-center gap-2 text-sm font-medium text-gray-600 transition hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 group-hover:bg-gray-200 dark:bg-white/10 dark:group-hover:bg-white/20">
              <FaArrowLeft className="h-3 w-3" />
            </span>
            Back to Mentors
          </Link>
          {canEdit && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-700 dark:bg-amber-900/30 dark:text-amber-500">
              <FaEdit /> {isAdmin ? "Admin Mode" : "Owner"}
            </span>
          )}
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative">
        <div
          className={`h-64 w-full bg-gradient-to-br ${style.gradient} dark:opacity-90`}
        >
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
        </div>

        <div className="mx-auto max-w-6xl px-6">
          <div className="relative -mt-24 flex flex-col md:flex-row md:items-end md:gap-8">
            <div className="group relative mx-auto md:mx-0">
              <div className="relative h-48 w-48 overflow-hidden rounded-full border-[6px] border-white bg-white shadow-2xl dark:border-[#09090b] dark:bg-[#09090b]">
                <img
                  src={mentor.image || "/default-avatar.png"}
                  alt={mentor.name}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
              </div>
              <div className="absolute bottom-4 right-4 rounded-full bg-white p-1.5 shadow-sm dark:bg-[#09090b]">
                <FaCheckCircle className={`h-6 w-6 ${style.icon}`} />
              </div>
            </div>

            <div className="mt-6 flex-1 text-center md:mb-6 md:mt-0 md:text-left">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
                    {mentor.name}
                  </h1>
                  <p className="mt-2 text-lg font-medium text-gray-600 dark:text-gray-300">
                    {mentor.organization || "Top Educator"}
                  </p>
                  <div className="mt-3 flex flex-wrap justify-center gap-2 md:justify-start">
                    <span
                      className={`inline-flex items-center rounded-full ${style.bgLight} px-3 py-1 text-xs font-medium ${style.text} ${style.ring}`}
                    >
                      {mentor.domain} Expert
                    </span>
                  </div>
                </div>

                {canEdit && (
                  <Link
                    href={`/mentors/${id}/edit`}
                    className="mt-4 hidden items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-gray-300 hover:bg-gray-50 dark:bg-white/10 dark:text-white dark:ring-transparent dark:hover:bg-white/20 md:inline-flex"
                  >
                    <FaEdit /> Edit Profile
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="mx-auto mt-12 grid max-w-6xl grid-cols-1 gap-8 px-6 lg:grid-cols-3">
        {/* Left Sidebar */}
        <div className="space-y-6 lg:col-span-1">
          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-white/10 dark:bg-[#18181b]">
            <div className="p-6">
              <Link
                href={`/mentors/${id}/book`}
                className={`w-full flex items-center justify-center gap-2 rounded-xl ${style.button} px-4 py-3.5 text-sm font-bold text-white transition-all`}
              >
                <FaCalendarAlt className="text-lg" /> Book Session
              </Link>
            </div>
            {mentor.linkedin && (
              <div className="border-t border-gray-100 px-6 py-4 dark:border-white/5">
                <a
                  href={mentor.linkedin}
                  target="_blank"
                  className="flex items-center justify-center gap-2 text-sm font-semibold text-gray-600 hover:text-[#0077b5] transition dark:text-gray-300"
                >
                  <FaLinkedin className="text-lg" /> Connect on LinkedIn
                </a>
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-[#18181b]">
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-gray-900 dark:text-white">
              Mentor Details
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <FaBriefcase className="mt-1 text-gray-400" />
                <div>
                  <span className="block text-sm font-medium text-gray-900 dark:text-white">
                    Organization
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {mentor.organization || "Independent"}
                  </span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <FaGraduationCap className="mt-1 text-gray-400" />
                <div>
                  <span className="block text-sm font-medium text-gray-900 dark:text-white">
                    Domain
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {mentor.domain}
                  </span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <FaMapMarkerAlt className="mt-1 text-gray-400" />
                <div>
                  <span className="block text-sm font-medium text-gray-900 dark:text-white">
                    Location
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">India</span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <FaStar className="mt-1 text-yellow-500" />
                <div>
                  <span className="block text-sm font-medium text-gray-900 dark:text-white">
                    Rating
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {(mentor.averageRating ?? 0).toFixed(1)} ({mentor.totalReviews ?? 0} Reviews)
                  </span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Right Content */}
        <div className="lg:col-span-2 space-y-8">
          {canEdit && (
            <div className="md:hidden">
              <Link
                href={`/mentors/${id}/edit`}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gray-900 py-3 text-sm font-bold text-white shadow-sm dark:bg-white dark:text-black"
              >
                <FaEdit /> Edit Profile
              </Link>
            </div>
          )}

          <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm dark:border-white/10 dark:bg-[#18181b]">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">About Me</h2>
            <div className={`mt-4 h-1 w-12 rounded-full bg-${style.color}-600`}></div>
            <div className="prose prose-zinc mt-6 max-w-none text-gray-600 dark:prose-invert dark:text-gray-300 whitespace-pre-line leading-relaxed">
              {mentor.bio || (
                <span className="italic text-gray-400">
                  This mentor hasn't updated their bio yet.
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}