import { applyForMentorship } from "@/app/actions/getMentors";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AddMentorPage() {
  const session = await auth();
  
  // 🔒 SECURITY: Only allow Admin (You) to access this page
  if (session?.user?.email !== "arunangshud3@gmail.com") {
    redirect("/"); // Kick others to home page
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6 dark:bg-[#18191a]">
      <div className="w-full max-w-2xl bg-white p-8 rounded-xl shadow-md border dark:bg-[#242526] dark:border-zinc-700">
        <h1 className="text-2xl font-bold mb-2 text-center text-zinc-900 dark:text-white">
          Admin: Add New Mentor
        </h1>
        <p className="text-center text-zinc-500 mb-8 text-sm">
            Mentors added here are <span className="font-bold text-green-600">Auto-Approved</span>.
        </p>
        
        <form action={applyForMentorship} className="space-y-6">
          
          {/* Email Field */}
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Mentor Email (Required for Login/Edit)
            </label>
            <input 
                name="email" 
                type="email" 
                required 
                className="w-full mt-2 p-2.5 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-zinc-800 dark:border-zinc-700 dark:text-white" 
                placeholder="mentor@example.com" 
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Name</label>
                <input name="name" required className="w-full mt-2 p-2.5 border border-zinc-300 rounded-lg dark:bg-zinc-800 dark:border-zinc-700 dark:text-white" placeholder="John Doe" />
            </div>

            <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Domain</label>
                <select name="domain" className="w-full mt-2 p-2.5 border border-zinc-300 rounded-lg dark:bg-zinc-800 dark:border-zinc-700 dark:text-white">
                    <option value="JEE">JEE</option>
                    <option value="NEET">NEET</option>
                    <option value="UPSC">UPSC</option>
                    <option value="CAT">CAT</option>
                    <option value="GATE">GATE</option>
                    <option value="SSC">SSC</option>
                </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Organization</label>
            <input name="organization" className="w-full mt-2 p-2.5 border border-zinc-300 rounded-lg dark:bg-zinc-800 dark:border-zinc-700 dark:text-white" placeholder="Google, IIT Bombay, etc." />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">LinkedIn URL</label>
            <input name="linkedin" className="w-full mt-2 p-2.5 border border-zinc-300 rounded-lg dark:bg-zinc-800 dark:border-zinc-700 dark:text-white" placeholder="https://linkedin.com/in/..." />
          </div>

          <div>
             <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Image URL</label>
             <input name="image" className="w-full mt-2 p-2.5 border border-zinc-300 rounded-lg dark:bg-zinc-800 dark:border-zinc-700 dark:text-white" placeholder="https://..." />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Bio</label>
            <textarea name="bio" rows="3" className="w-full mt-2 p-2.5 border border-zinc-300 rounded-lg dark:bg-zinc-800 dark:border-zinc-700 dark:text-white" placeholder="Short description..."></textarea>
          </div>

          <button 
            type="submit" 
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition shadow-sm"
          >
            Add Mentor
          </button>
        </form>
      </div>
    </div>
  );
}