"use client";

import Link from "next/link";
import { FaArrowLeft, FaUserCircle, FaPaperPlane } from "react-icons/fa";
import { manualAddMentor } from "@/app/actions/getMentors"; 
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AddMentor() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  if (status === "loading") {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (status === "unauthenticated") {
    router.push("/api/auth/signin");
    return null;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMsg("");
    setSuccessMsg("");

    const formData = new FormData(event.target);
    const result = await manualAddMentor(formData);

    if (result?.error) {
      setErrorMsg(result.error);
      setIsSubmitting(false);
      window.scrollTo(0, 0); 
    } else {
      setSuccessMsg(result.message || "Mentor added successfully!");
      setTimeout(() => {
        router.push("/dashboard");
      }, 1500);
    }
  }

  return (
    <div className="min-h-screen bg-zinc-50 px-6 py-12 dark:bg-black lg:px-8">
      <div className="mx-auto max-w-2xl">
        <Link href="/dashboard" className="mb-6 inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-indigo-600 dark:text-zinc-400">
          <FaArrowLeft /> Back to Dashboard
        </Link>

        <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-zinc-200 dark:bg-zinc-900 dark:ring-zinc-800">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
              Manually Add Mentor
            </h2>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              Enter the details of the mentor you wish to onboard.
            </p>
          </div>

          {errorMsg && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm font-medium text-center">
              {errorMsg}
            </div>
          )}

          {successMsg && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm font-medium text-center">
              {successMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* 1. Profile Image Upload */}
            <div>
              <label className="block text-sm font-medium leading-6 text-zinc-900 dark:text-white">Profile Photo</label>
              <div className="mt-2 flex items-center gap-x-3">
                <FaUserCircle className="h-12 w-12 text-zinc-300" aria-hidden="true" />
                <input
                  type="file"
                  name="image" /* ✅ CHANGED FROM 'profile-image' TO 'image' TO MATCH BACKEND */
                  accept="image/*"
                  className="block w-full text-sm text-zinc-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 dark:text-zinc-400"
                />
              </div>
            </div>

            {/* 2. Personal Details */}
            <div className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium leading-6 text-zinc-900 dark:text-zinc-300">First name</label>
                <input required type="text" name="first-name" className="mt-2 block w-full rounded-md border-0 py-2.5 px-3 ring-1 ring-inset ring-zinc-300 focus:ring-2 focus:ring-indigo-600 dark:bg-zinc-800 dark:text-white dark:ring-zinc-700" />
              </div>
              <div>
                <label className="block text-sm font-medium leading-6 text-zinc-900 dark:text-zinc-300">Last name</label>
                <input required type="text" name="last-name" className="mt-2 block w-full rounded-md border-0 py-2.5 px-3 ring-1 ring-inset ring-zinc-300 focus:ring-2 focus:ring-indigo-600 dark:bg-zinc-800 dark:text-white dark:ring-zinc-700" />
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium leading-6 text-zinc-900 dark:text-zinc-300">
                Email address
              </label>
              <input 
                type="email" 
                name="email" 
                required
                placeholder="mentor@example.com"
                className="mt-2 block w-full rounded-md border-0 py-2.5 px-3 ring-1 ring-inset ring-zinc-300 focus:ring-2 focus:ring-indigo-600 dark:bg-zinc-800 dark:text-white dark:ring-zinc-700" 
              />
            </div>

            {/* Credentials Section */}
            <div className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
               <div>
                <label className="block text-sm font-medium leading-6 text-zinc-900 dark:text-zinc-300">Current Role / College</label>
                <input required type="text" name="organization" placeholder="Ex: IIT Bombay or Google" className="mt-2 block w-full rounded-md border-0 py-2.5 px-3 ring-1 ring-inset ring-zinc-300 focus:ring-2 focus:ring-indigo-600 dark:bg-zinc-800 dark:text-white dark:ring-zinc-700" />
              </div>
              <div>
                <label className="block text-sm font-medium leading-6 text-zinc-900 dark:text-zinc-300">LinkedIn Profile</label>
                <input required type="url" name="linkedin" placeholder="https://linkedin.com/in/..." className="mt-2 block w-full rounded-md border-0 py-2.5 px-3 ring-1 ring-inset ring-zinc-300 focus:ring-2 focus:ring-indigo-600 dark:bg-zinc-800 dark:text-white dark:ring-zinc-700" />
              </div>
            </div>

            {/* 3. Expertise */}
            <div>
              <label className="block text-sm font-medium leading-6 text-zinc-900 dark:text-zinc-300">Primary Domain</label>
              <select name="domain" className="mt-2 block w-full rounded-md border-0 py-2.5 px-3 ring-1 ring-inset ring-zinc-300 focus:ring-2 focus:ring-indigo-600 dark:bg-zinc-800 dark:text-white dark:ring-zinc-700">
                <option value="JEE">JEE Mains & Advanced</option>
                <option value="NEET">NEET (Medical)</option>
                <option value="GATE">GATE (Engineering)</option>
                <option value="UPSC">UPSC (Civil Services)</option>
                <option value="CAT">CAT (Management)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium leading-6 text-zinc-900 dark:text-zinc-300">Short Bio & Achievements</label>
              <textarea required name="about" rows={3} placeholder="Ex: AIR 45 in JEE Adv, 4 years teaching experience..." className="mt-2 block w-full rounded-md border-0 py-2.5 px-3 ring-1 ring-inset ring-zinc-300 focus:ring-2 focus:ring-indigo-600 dark:bg-zinc-800 dark:text-white dark:ring-zinc-700" />
            </div>

            <button 
              type="submit" 
              disabled={isSubmitting}
              className="flex w-full justify-center items-center gap-2 rounded-md bg-indigo-600 px-3 py-3 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Processing..." : (
                <>Add / Update Mentor <FaPaperPlane/></>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}