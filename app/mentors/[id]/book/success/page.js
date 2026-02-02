import Link from "next/link";
import { FaCheckCircle, FaArrowRight } from "react-icons/fa";

export default function SuccessPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4 dark:bg-zinc-950">
      <div className="w-full max-w-md text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
          <FaCheckCircle className="h-10 w-10 text-blue-600 dark:text-blue-400" />
        </div>
        
        {/* 👇 UPDATED TEXT */}
        <h1 className="mb-2 text-3xl font-extrabold text-zinc-900 dark:text-white">
          Request Sent!
        </h1>
        <p className="mb-8 text-zinc-500 dark:text-zinc-400">
          Your booking request has been sent to the mentor. You will be notified once they <strong>approve</strong> or <strong>reject</strong> it.
        </p>

        <div className="space-y-3">
          <Link 
            href="/profile"
            className="block w-full rounded-xl bg-zinc-900 py-3.5 font-bold text-white transition hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            Go to My Profile
          </Link>
          <Link 
            href="/mentors"
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white py-3.5 font-semibold text-zinc-600 transition hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800"
          >
            Browse More Mentors <FaArrowRight className="text-xs" />
          </Link>
        </div>
      </div>
    </div>
  );
}