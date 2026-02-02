import { getDashboardStats } from "../actions/dashboard";
import Link from "next/link";
import { FaUserTie, FaEnvelopeOpenText, FaPenFancy, FaPlus, FaUserCheck } from "react-icons/fa";
import { auth } from "@/lib/auth"; 
import { redirect } from "next/navigation"; 

export default async function DashboardPage() {
  // 1. Get Session
  const session = await auth();

  // 2. Check: Is user logged in?
  if (!session || !session.user) {
    redirect("/api/auth/signin");
  }

  // 3. Check: Is user an Admin? (Using .env variable)
  // Ensure this matches exactly what is in your .env.local file
  const ADMIN_EMAIL = process.env.ADMIN_EMAIL;

  if (session.user.email !== ADMIN_EMAIL) {
    // If they are logged in but not the admin, kick them out
    redirect("/"); 
  }

  // 4. If passed, fetch data
  const stats = await getDashboardStats();

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">Overview</h1>
        
        <div className="flex gap-3">
            {/* Write Blog Button */}
            <Link 
              href="/dashboard/blogs/create" 
              className="flex items-center gap-2 bg-zinc-100 text-zinc-900 px-4 py-2 rounded-lg hover:bg-zinc-200 transition-colors font-medium text-sm"
            >
             <FaPenFancy /> Write Blog
            </Link>

            {/* Manual Add Mentor Button */}
            <Link 
              href="/dashboard/add-mentor" 
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm shadow-sm"
            >
             <FaPlus /> Manual Add Mentor
            </Link>
        </div>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* 1. Total Mentors */}
        <Link href="/mentors" className="group">
            <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-blue-500 dark:bg-[#242526] transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl cursor-pointer">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-zinc-500 group-hover:text-blue-600 transition-colors">Total Mentors</p>
                  <h3 className="text-3xl font-bold text-zinc-800 dark:text-white">{stats.mentors}</h3>
                </div>
                <div className="p-3 bg-blue-100 text-blue-600 rounded-full group-hover:bg-blue-600 group-hover:text-white transition-colors">
                   <FaUserTie size={20} />
                </div>
              </div>
            </div>
        </Link>

        {/* 2. Messages */}
        <Link href="/dashboard/messages" className="group">
            <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-green-500 dark:bg-[#242526] transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl cursor-pointer">
            <div className="flex items-center justify-between">
                <div>
                <p className="text-sm text-zinc-500 group-hover:text-green-600 transition-colors">Messages</p>
                <h3 className="text-3xl font-bold text-zinc-800 dark:text-white">{stats.messages}</h3>
                </div>
                <div className="p-3 bg-green-100 text-green-600 rounded-full group-hover:bg-green-600 group-hover:text-white transition-colors">
                    <FaEnvelopeOpenText size={20} />
                </div>
            </div>
            </div>
        </Link>

        {/* 3. Pending Blogs */}
        <Link href="/dashboard/blogs" className="group">
          <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-orange-500 dark:bg-[#242526] transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl cursor-pointer">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-zinc-500 font-medium text-orange-600 group-hover:text-orange-700 transition-colors">Blog Approvals</p>
                <h3 className="text-3xl font-bold text-zinc-800 dark:text-white">{stats.pendingBlogs}</h3>
              </div>
              <div className="p-3 bg-orange-100 text-orange-600 rounded-full group-hover:bg-orange-600 group-hover:text-white transition-colors">
                  <FaPenFancy size={20} />
              </div>
            </div>
          </div>
        </Link>

        {/* 4. Pending Mentor Verifications */}
        <Link href="/admin/verify" className="group">
          <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-purple-500 dark:bg-[#242526] transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl cursor-pointer">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-zinc-500 font-medium text-purple-600 group-hover:text-purple-700 transition-colors">Verification Req</p>
                <h3 className="text-3xl font-bold text-zinc-800 dark:text-white">{stats.pendingMentors}</h3>
              </div>
              <div className="p-3 bg-purple-100 text-purple-600 rounded-full group-hover:bg-purple-600 group-hover:text-white transition-colors">
                  <FaUserCheck size={20} />
              </div>
            </div>
          </div>
        </Link>

      </div>
    </div>
  );
}