import { getPendingMentors,verifyMentor } from "@/app/actions/getMentors";
import { FaCheck, FaTimes, FaLinkedin } from "react-icons/fa";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export default async function AdminVerifyPage() {
  const session = await auth();
  
  // 🔒 Security Check: Replace with your actual admin email
  if (session?.user?.email !== "arunangshud3@gmail.com") {
    redirect("/"); 
  }

  const pendingMentors = await getPendingMentors();

  return (
    <div className="min-h-screen bg-zinc-50 p-8 dark:bg-black">
      <h1 className="mb-8 text-3xl font-bold text-zinc-900 dark:text-white">
        Pending Verification Requests
      </h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {pendingMentors.length === 0 ? (
           <div className="col-span-full flex h-40 items-center justify-center rounded-xl border border-dashed border-zinc-300 bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-900">
             <p className="text-zinc-500">No pending applications.</p>
           </div>
        ) : (
          pendingMentors.map((m) => (
            <div key={m._id} className="flex flex-col rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              
              <div className="flex items-start justify-between">
                <div>
                   <h3 className="text-xl font-bold text-zinc-900 dark:text-white">{m.name}</h3>
                   <span className="text-sm font-medium text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded dark:bg-indigo-900/30 dark:text-indigo-400">{m.domain}</span>
                </div>
                {m.linkedin && (
                    <a href={m.linkedin} target="_blank" className="text-blue-600 hover:text-blue-500">
                        <FaLinkedin size={24} />
                    </a>
                )}
              </div>
              
              <p className="mt-4 flex-1 text-sm text-zinc-600 dark:text-zinc-400">
                "{m.bio}"
              </p>
              
              <div className="mt-4 border-t pt-2 text-xs text-zinc-400 dark:border-zinc-700">
                Email: {m.email}<br/>
                Org: {m.organization}
              </div>

              {/* Action Buttons */}
              <div className="mt-6 flex gap-3">
                <form action={async () => {
                    "use server";
                    await verifyMentor(m._id, "approve");
                }} className="flex-1">
                    <button className="flex w-full items-center justify-center gap-2 rounded-lg bg-green-600 py-2.5 text-sm font-bold text-white hover:bg-green-500 transition-colors">
                        <FaCheck /> Approve
                    </button>
                </form>

                <form action={async () => {
                    "use server";
                    await verifyMentor(m._id, "reject");
                }} className="flex-1">
                    <button className="flex w-full items-center justify-center gap-2 rounded-lg bg-red-100 py-2.5 text-sm font-bold text-red-600 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 transition-colors">
                        <FaTimes /> Reject
                    </button>
                </form>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}