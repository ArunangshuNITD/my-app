import Link from "next/link";
import { FaCheckCircle, FaArrowRight } from "react-icons/fa";

export default function ApplicationSuccessPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 px-6 text-center dark:bg-black">
      <div className="max-w-md w-full rounded-2xl bg-white p-10 shadow-xl ring-1 ring-zinc-100 dark:bg-zinc-900 dark:ring-zinc-800 animate-in fade-in zoom-in duration-500">
        
        {/* Success Icon */}
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
          <FaCheckCircle className="h-10 w-10 text-green-600 dark:text-green-500" />
        </div>
        
        <h1 className="mb-4 text-3xl font-bold text-zinc-900 dark:text-white">
          Application Received!
        </h1>
        
        <p className="mb-8 text-lg text-zinc-600 dark:text-zinc-400">
          We have received your details. Your profile is now <span className="font-bold text-yellow-600">Pending Review</span> and will be visible once approved by an admin.
        </p>
        
        <div className="space-y-3">
          <Link 
            href="/"
            className="group flex items-center justify-center gap-2 w-full rounded-full bg-indigo-600 px-8 py-3 font-semibold text-white transition hover:bg-indigo-500"
          >
            Return Home <FaArrowRight className="text-sm transition-transform group-hover:translate-x-1"/>
          </Link>
          
          <Link 
            href="/mentors"
            className="block w-full rounded-full bg-white px-8 py-3 font-semibold text-zinc-700 ring-1 ring-zinc-200 transition hover:bg-zinc-50 dark:bg-zinc-800 dark:text-zinc-300 dark:ring-zinc-700 dark:hover:bg-zinc-700"
          >
            Browse Other Mentors
          </Link>
        </div>

      </div>
    </div>
  );
}