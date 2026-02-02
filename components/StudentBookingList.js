"use client";

import { 
  FaCalendarDay, 
  FaClock, 
  FaChalkboardTeacher, 
  FaCheckCircle, 
  FaTimesCircle, 
  FaHourglassHalf, 
  FaCheckDouble,
  FaVideo 
} from "react-icons/fa";
// Assuming CountdownTimer is in the same folder or adjust path accordingly
import CountdownTimer from "./CountdownTimr"; 

export default function StudentBookingList({ bookings = [] }) {
  
  if (bookings.length === 0) {
    return (
      <div className="p-8 text-center border border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-900/50">
        <p className="text-zinc-500 text-sm">You haven't applied for any sessions yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {bookings.map((booking) => (
        <div 
          key={booking._id} 
          className={`border p-5 rounded-xl shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-all
            ${booking.status === "completed" 
                ? "bg-zinc-50 border-zinc-200 dark:bg-zinc-900/50 dark:border-zinc-800 opacity-75" 
                : booking.status === "ongoing"
                ? "bg-indigo-50 border-indigo-200 dark:bg-indigo-900/20 dark:border-indigo-800 shadow-sm"
                : "bg-white border-zinc-200 dark:bg-zinc-900 dark:border-zinc-800"}`}
        >
          {/* Left Side: Session Details */}
          <div>
            <h4 className="font-bold text-zinc-900 dark:text-white flex items-center gap-2 text-lg">
              <FaChalkboardTeacher className={booking.status === "completed" ? "text-zinc-400" : "text-indigo-500"} /> 
              {booking.mentorName}
            </h4>
            <div className="flex flex-wrap gap-4 text-sm text-zinc-500 mt-2">
              <span className="flex items-center gap-1.5">
                <FaCalendarDay /> {new Date(booking.date).toLocaleDateString('en-GB')}
              </span>
              <span className="flex items-center gap-1.5">
                <FaClock /> {booking.timeSlot}
              </span>
            </div>
          </div>

          {/* Right Side: Status Badge & Timer */}
          <div>
            {booking.status === "pending" && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-800">
                <FaHourglassHalf className="animate-pulse" />
                <span className="text-xs font-bold uppercase tracking-wide">Pending Approval</span>
              </div>
            )}

            {booking.status === "confirmed" && (
              <div className="flex flex-col items-end gap-3">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800">
                  <FaCheckCircle />
                  <span className="text-xs font-bold uppercase tracking-wide">Confirmed</span>
                </div>
                
                <div className="flex flex-col items-end">
                   <span className="text-[10px] text-zinc-400 uppercase font-semibold mb-1">Session Starts In</span>
                   {/* Ensure targetDate is passed as a valid date string or object */}
                   <CountdownTimer targetDate={booking.date} timeSlot={booking.timeSlot} />
                </div>
              </div>
            )}

            {/* 👇 ONGOING STATUS LOGIC */}
            {booking.status === "ongoing" && (
              <div className="flex flex-col items-end gap-3">
                 <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-600 text-white shadow-md animate-pulse">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                    </span>
                    <span className="text-xs font-bold uppercase tracking-wide">Ongoing Now</span>
                 </div>
                 
                 {/* JOIN BUTTON */}
                 {booking.meetingLink ? (
                   <a 
                     href={booking.meetingLink} 
                     target="_blank" 
                     rel="noopener noreferrer"
                     className="flex items-center gap-2 text-xs bg-white text-indigo-700 border border-indigo-200 hover:bg-indigo-50 px-4 py-2 rounded-lg font-bold transition shadow-sm"
                   >
                      <FaVideo /> Join Meeting
                   </a>
                 ) : (
                   <button disabled className="flex items-center gap-2 text-xs bg-zinc-100 text-zinc-400 border border-zinc-200 px-4 py-2 rounded-lg font-bold cursor-not-allowed">
                      <FaVideo /> No Link Yet
                   </button>
                 )}
              </div>
            )}

            {booking.status === "rejected" && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-800">
                <FaTimesCircle />
                <span className="text-xs font-bold uppercase tracking-wide">Declined</span>
              </div>
            )}

            {booking.status === "completed" && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700">
                <FaCheckDouble />
                <span className="text-xs font-bold uppercase tracking-wide">Completed</span>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}