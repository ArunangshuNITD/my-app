import Link from "next/link";
import { 
  FaSearch, 
  FaCalendarCheck, 
  FaVideo, 
  FaUserEdit, 
  FaCheckCircle, 
  FaChalkboardTeacher,
  FaArrowRight,
  FaUserPlus,
  FaSignInAlt
} from "react-icons/fa";

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black text-zinc-900 dark:text-white pb-20">
      
      {/* 1. Hero Section */}
      <div className="bg-indigo-600 py-20 px-6 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6">
          How MentorConnect Works
        </h1>
        <p className="text-indigo-100 text-lg md:text-xl max-w-2xl mx-auto">
          Whether you are a student seeking guidance or an expert looking to share knowledge, we have made the process simple.
        </p>
        
        <div className="mt-8 flex flex-col md:flex-row items-center justify-center gap-4">
          <Link href="/mentors" className="inline-flex items-center gap-3 bg-white text-indigo-700 px-6 py-3 rounded-full font-semibold shadow hover:scale-[1.02] transition-transform">
            <FaUserPlus /> Get Started (Student)
          </Link>
          <Link href="/become-mentor" className="inline-flex items-center gap-3 bg-indigo-700/80 text-white px-6 py-3 rounded-full font-semibold shadow hover:scale-[1.02] transition-transform">
            <FaSignInAlt /> I'm a Mentor — Apply
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 -mt-10 relative z-10 space-y-20">
        {/* Quick Start Card for New Users */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-lg p-6 md:p-8 border border-zinc-200 dark:border-zinc-800">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold">New here? Quick Start</h3>
              <p className="text-zinc-600 dark:text-zinc-400 mt-2 max-w-2xl">
                Welcome to MentorConnect — start by creating an account, completing your profile, and following the short steps below depending on whether you are a student or mentor.
              </p>
            </div>

            <div className="flex gap-3">
              <Link href="/api/auth/signin" className="px-4 py-2 rounded-lg bg-indigo-600 text-white font-medium">Sign in</Link>
              <Link href="/profile" className="px-4 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700">Complete Profile</Link>
            </div>
          </div>

          <div className="mt-4 grid md:grid-cols-2 gap-4">
            <div className="p-4 bg-indigo-50 dark:bg-zinc-800 rounded-lg">
              <h4 className="font-semibold">Student Quick Steps</h4>
              <ol className="list-decimal list-inside text-zinc-600 dark:text-zinc-400 mt-2 space-y-1">
                <li>Create an account and complete your profile.</li>
                <li>Browse mentors by subject, ratings, and reviews.</li>
                <li>Book a session and join the video call at the scheduled time.</li>
              </ol>
            </div>

            <div className="p-4 bg-indigo-50 dark:bg-zinc-800 rounded-lg">
              <h4 className="font-semibold">Mentor Quick Steps</h4>
              <ol className="list-decimal list-inside text-zinc-600 dark:text-zinc-400 mt-2 space-y-1">
                <li>Apply to become a mentor via the Apply page.</li>
                <li>Complete verification and set your availability.</li>
                <li>Accept bookings, host sessions, and manage students from your dashboard.</li>
              </ol>
            </div>
          </div>
        </div>

        {/* =========================================
            SECTION A: FOR STUDENTS
        ========================================= */}
        <section className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl p-8 md:p-12 border border-zinc-200 dark:border-zinc-800">
          <div className="text-center mb-12">
            <span className="bg-indigo-100 text-indigo-700 font-bold px-4 py-1.5 rounded-full text-sm uppercase tracking-wide">
              For Students
            </span>
            <h2 className="text-3xl font-bold mt-4">Get Guidance in 3 Steps</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connecting Line (Hidden on Mobile) */}
            <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-zinc-200 dark:bg-zinc-800 z-0"></div>

            {/* Step 1 */}
            <Link href="/mentors" className="relative z-10 flex flex-col items-center text-center group">
              <div className="w-24 h-24 bg-white dark:bg-zinc-800 border-4 border-indigo-100 dark:border-zinc-700 rounded-full flex items-center justify-center text-indigo-600 shadow-sm mb-6 group-hover:scale-105 transition-transform">
                <FaSearch size={32} />
              </div>
              <h3 className="text-xl font-bold mb-3">1. Find a Mentor</h3>
              <p className="text-zinc-600 dark:text-zinc-400">
                Browse profiles of top rankers (JEE, NEET, UPSC). Filter by domain and read reviews to find the perfect match.
              </p>
            </Link>

            {/* Step 2 */}
            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="w-24 h-24 bg-white dark:bg-zinc-800 border-4 border-indigo-100 dark:border-zinc-700 rounded-full flex items-center justify-center text-indigo-600 shadow-sm mb-6">
                <FaCalendarCheck size={32} />
              </div>
              <h3 className="text-xl font-bold mb-3">2. Book a Session</h3>
              <p className="text-zinc-600 dark:text-zinc-400">
                Pick a time slot that works for you. Securely pay for the session to confirm your appointment instantly.
              </p>
            </div>

            {/* Step 3 */}
            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="w-24 h-24 bg-white dark:bg-zinc-800 border-4 border-indigo-100 dark:border-zinc-700 rounded-full flex items-center justify-center text-indigo-600 shadow-sm mb-6">
                <FaVideo size={32} />
              </div>
              <h3 className="text-xl font-bold mb-3">3. Connect & Learn</h3>
              <p className="text-zinc-600 dark:text-zinc-400">
                Join the 1-on-1 video call at the scheduled time. Get personalized advice, strategy tips, and doubt resolution.
              </p>
            </div>
          </div>

          <div className="mt-12 text-center">
            <Link href="/mentors" className="inline-flex items-center gap-2 bg-indigo-600 text-white px-8 py-3 rounded-full font-bold hover:bg-indigo-700 transition-colors">
              Browse Mentors <FaArrowRight />
            </Link>
          </div>
        </section>


        {/* =========================================
            SECTION B: FOR MENTORS
        ========================================= */}
        <section className="bg-zinc-900 text-white rounded-2xl shadow-xl p-8 md:p-12 border border-zinc-700 relative overflow-hidden">
          {/* Decorative Background Blob */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/20 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>

          <div className="text-center mb-12 relative z-10">
            <span className="bg-zinc-700 text-zinc-300 font-bold px-4 py-1.5 rounded-full text-sm uppercase tracking-wide">
              For Mentors
            </span>
            <h2 className="text-3xl font-bold mt-4">Join as an Expert</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative z-10">
            
            {/* Step 1 */}
            <div className="bg-zinc-800/50 p-6 rounded-xl border border-zinc-700 hover:border-indigo-500/50 transition-colors">
              <div className="w-12 h-12 bg-indigo-600 rounded-lg flex items-center justify-center mb-4">
                <FaUserEdit size={24} />
              </div>
              <h3 className="text-xl font-bold mb-2">1. Apply</h3>
              <p className="text-zinc-400 text-sm">
                Fill out the application form with your achievements (Rank, College, Work) and LinkedIn profile.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-zinc-800/50 p-6 rounded-xl border border-zinc-700 hover:border-indigo-500/50 transition-colors">
              <div className="w-12 h-12 bg-indigo-600 rounded-lg flex items-center justify-center mb-4">
                <FaCheckCircle size={24} />
              </div>
              <h3 className="text-xl font-bold mb-2">2. Verification</h3>
              <p className="text-zinc-400 text-sm">
                Our team reviews your profile to ensure authenticity. Once approved, you will receive an email notification.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-zinc-800/50 p-6 rounded-xl border border-zinc-700 hover:border-indigo-500/50 transition-colors">
              <div className="w-12 h-12 bg-indigo-600 rounded-lg flex items-center justify-center mb-4">
                <FaChalkboardTeacher size={24} />
              </div>
              <h3 className="text-xl font-bold mb-2">3. Start Mentoring</h3>
              <p className="text-zinc-400 text-sm">
                Your profile goes live! Set your schedule, accept bookings, and start guiding students while earning.
              </p>
            </div>

          </div>

          <div className="mt-10 text-center relative z-10">
            <Link href="/become-mentor" className="inline-flex items-center gap-2 bg-white text-black px-8 py-3 rounded-full font-bold hover:bg-zinc-200 transition-colors">
              Apply Now <FaArrowRight />
            </Link>
          </div>
        </section>

      </div>
    </div>
  );
}