import Link from "next/link";
import { 
    FaChartPie, FaUserPlus, FaEnvelope, 
    FaArrowLeft, FaUserCheck, FaNewspaper 
} from "react-icons/fa";

export default function DashboardLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-[#18191a]">
      
      {/* --- SIDEBAR --- */}
      <aside className="w-64 bg-white shadow-md dark:bg-[#242526] hidden md:block sticky top-0 h-screen overflow-y-auto">
        <div className="p-6 border-b dark:border-zinc-700">
          <h1 className="text-2xl font-bold text-indigo-600 tracking-tighter">Admin<span className="text-zinc-800 dark:text-white">Panel</span></h1>
        </div>
        
        <nav className="p-4 space-y-1">
          <p className="px-3 text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2 mt-2">Overview</p>
          
          <Link href="/dashboard" className="flex items-center gap-3 p-3 text-zinc-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg transition-all dark:text-zinc-300 dark:hover:bg-zinc-700">
            <FaChartPie /> Dashboard
          </Link>
          
          <Link href="/dashboard/messages" className="flex items-center gap-3 p-3 text-zinc-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg transition-all dark:text-zinc-300 dark:hover:bg-zinc-700">
            <FaEnvelope /> Messages
          </Link>

          <p className="px-3 text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2 mt-6">Management</p>

          {/* 👇 NEW: Verification Link */}
          <Link href="/admin/verify" className="flex items-center gap-3 p-3 text-zinc-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg transition-all dark:text-zinc-300 dark:hover:bg-zinc-700">
            <FaUserCheck /> Verify Mentors
          </Link>

          <Link href="/dashboard/blogs" className="flex items-center gap-3 p-3 text-zinc-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg transition-all dark:text-zinc-300 dark:hover:bg-zinc-700">
            <FaNewspaper /> Manage Blogs
          </Link>

          <Link href="/dashboard/add-mentor" className="flex items-center gap-3 p-3 text-zinc-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg transition-all dark:text-zinc-300 dark:hover:bg-zinc-700">
            <FaUserPlus /> Manual Add
          </Link>
          
          <div className="my-4 border-t dark:border-zinc-700"></div>

          <Link href="/" className="flex items-center gap-3 p-3 text-zinc-500 hover:bg-zinc-100 rounded-lg dark:text-zinc-400 dark:hover:bg-zinc-700">
            <FaArrowLeft /> Back to Website
          </Link>
        </nav>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}