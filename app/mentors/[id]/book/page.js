import { getMentorById } from "@/app/actions/getMentors";
import { createBooking } from "@/app/actions/bookingActions";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { FaCalendarAlt, FaClock, FaRupeeSign, FaArrowLeft } from "react-icons/fa";

export default async function BookingPage({ params }) {
  const { id } = await params;
  const session = await auth();
  const mentor = await getMentorById(id);

  if (!session) {
    redirect("/api/auth/signin"); // Force login
  }

  if (!mentor) {
    return <div className="text-center mt-20">Mentor not found</div>;
  }

  // Generate simple time slots (10 AM to 6 PM)
  const timeSlots = [
    "10:00 AM", "11:00 AM", "12:00 PM", 
    "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM", "06:00 PM"
  ];

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 px-4 py-12">
      <div className="mx-auto max-w-lg">
        {/* Header */}
        <Link href={`/mentors/${id}`} className="mb-6 flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200">
           <FaArrowLeft /> Back to Profile
        </Link>
        
        <div className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-xl dark:border-zinc-800 dark:bg-zinc-900">
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Book a Session</h1>
            <p className="text-zinc-500 dark:text-zinc-400">with {mentor.name}</p>
          </div>

          {/* Mentor Summary */}
          <div className="mb-8 flex items-center justify-between rounded-xl bg-zinc-50 p-4 dark:bg-zinc-800/50">
            <div className="flex items-center gap-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">
              <FaClock className="text-indigo-500" /> {mentor.sessionDuration || 60} mins
            </div>
            <div className="flex items-center gap-1 text-lg font-bold text-zinc-900 dark:text-white">
              <FaRupeeSign className="text-sm" /> {mentor.pricePerSession || 0}
            </div>
          </div>

          {/* Booking Form */}
          <form action={createBooking} className="space-y-6">
            <input type="hidden" name="mentorId" value={id} />
            
            {/* Date Picker */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                Select Date
              </label>
              <input 
                type="date" 
                name="date"
                required
                min={new Date().toISOString().split("T")[0]}
                className="w-full rounded-xl border border-zinc-300 bg-white p-3 text-zinc-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white"
              />
            </div>

            {/* Time Slot Picker (Simple Radio Grid) */}
            <div>
              <label className="mb-3 block text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                Select Time Slot
              </label>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {timeSlots.map((slot) => (
                  <label key={slot} className="cursor-pointer">
                    <input type="radio" name="timeSlot" value={slot} required className="peer sr-only" />
                    <div className="rounded-lg border border-zinc-200 py-2 text-center text-sm font-medium text-zinc-600 transition-all hover:bg-zinc-50 peer-checked:border-indigo-600 peer-checked:bg-indigo-50 peer-checked:text-indigo-700 dark:border-zinc-700 dark:text-zinc-400 dark:peer-checked:border-indigo-500 dark:peer-checked:bg-indigo-900/30 dark:peer-checked:text-indigo-400">
                      {slot}
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <button 
              type="submit"
              className="mt-4 w-full rounded-xl bg-indigo-600 py-4 text-base font-bold text-white shadow-lg shadow-indigo-500/20 transition-all hover:bg-indigo-700 active:scale-[0.98]"
            >
              Confirm Booking
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}