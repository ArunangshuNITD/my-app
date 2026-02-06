"use client";

import { 
  FaCalendarDay, 
  FaClock, 
  FaChalkboardTeacher, 
  FaVideo,
  FaHourglassHalf,
  FaCheckCircle,
  FaTimesCircle,
  FaCheckDouble
} from "react-icons/fa";
import Link from "next/link"; 
import { useState, useEffect } from "react";
import CountdownTimer from "./CountdownTimr"; 

export default function StudentBookingList({ bookings = [] }) {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    // Update the "current time" every minute to refresh the "Join" button state
    const timer = setInterval(() => setNow(new Date()), 60000); 
    return () => clearInterval(timer);
  }, []);

  const isSessionActive = (booking) => {
    if (booking.status !== "confirmed" && booking.status !== "ongoing") return false;
    if (!booking.timeSlot || typeof booking.timeSlot !== "string") return false;

    try {
      const bookingDate = new Date(booking.date);
      const parts = booking.timeSlot.split(" - ");
      if (parts.length !== 2) return false; 

      const [startTimeStr, endTimeStr] = parts;
      
      const parseTime = (dateBase, timeStr) => {
        if (!timeStr) return null;
        const cleanTime = timeStr.trim();
        const [time, modifier] = cleanTime.split(" ");
        if (!time || !modifier) return null;

        let [hours, minutes] = time.split(":");
        if (hours === "12") hours = "00";
        if (modifier === "PM") hours = parseInt(hours, 10) + 12;
        
        const d = new Date(dateBase);
        d.setHours(parseInt(hours), parseInt(minutes), 0, 0);
        return d;
      };

      const startDate = parseTime(bookingDate, startTimeStr);
      const endDate = parseTime(bookingDate, endTimeStr);

      if (!startDate || !endDate) return false;

      // New: Allow joining 15 minutes early for the new VideoSDK room
      const joinWindowStart = new Date(startDate.getTime() - 15 * 60000); 

      return now >= joinWindowStart && now <= endDate;
    } catch (e) {
      console.error("Date parsing error:", booking._id, e);
      return false;
    }
  };

  if (bookings.length === 0) {
    return (
      <div className="p-8 text-center border border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-900/50">
        <p className="text-zinc-500 text-sm">No scheduled sessions found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {bookings.map((booking) => {
        const canJoin = isSessionActive(booking);
        
        // We use the booking ID as the fallback room ID for VideoSDK
        const activeRoomId = booking.roomId || booking._id;

        return (
          <div 
            key={booking._id} 
            className={`border p-5 rounded-xl shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-all
              ${booking.status === "completed" 
                  ? "bg-zinc-50 border-zinc-200 dark:bg-zinc-900/50 dark:border-zinc-800 opacity-75" 
                  : canJoin || booking.status === "ongoing"
                  ? "bg-indigo-50 border-indigo-200 dark:bg-indigo-900/20 dark:border-indigo-800 shadow-md ring-1 ring-indigo-500"
                  : "bg-white border-zinc-200 dark:bg-zinc-900 dark:border-zinc-800"}`}
          >
            {/* Left: Mentor & Time Info */}
            <div>
              <h4 className="font-bold text-zinc-900 dark:text-white flex items-center gap-2 text-lg">
                <FaChalkboardTeacher className={booking.status === "completed" ? "text-zinc-400" : "text-indigo-500"} /> 
                {booking.mentorName || "Professional Mentoring"}
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

            {/* Right: Actions */}
            <div className="flex flex-col items-end gap-3">
              {booking.status === "pending" && (
                <div className="flex items-center gap-2 px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-bold uppercase">
                  <FaHourglassHalf /> Awaiting Approval
                </div>
              )}

              {booking.status === "confirmed" && !canJoin && (
                <div className="flex flex-col items-end gap-2">
                  <div className="flex items-center gap-2 px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold uppercase">
                    <FaCheckCircle /> Confirmed
                  </div>
                  <CountdownTimer targetDate={booking.date} timeSlot={booking.timeSlot} />
                </div>
              )}

              {(canJoin || booking.status === "ongoing") && (
                <div className="flex flex-col items-end animate-in fade-in slide-in-from-right-4 duration-500">
                   <div className="flex items-center gap-2 mb-2">
                      <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
                      </span>
                      <span className="text-xs font-extrabold text-rose-600 uppercase tracking-wider">Live Now</span>
                   </div>
                   
                   {/* Logic to choose between an external link (Zoom/Google Meet) or your New Internal Room */}
                   {booking.meetingLink ? (
                     <a 
                       href={booking.meetingLink} 
                       target="_blank" 
                       rel="noopener noreferrer"
                       className="flex items-center gap-2 bg-zinc-900 hover:bg-black text-white px-6 py-2.5 rounded-lg font-bold shadow-lg transition-all active:scale-95"
                     >
                        <FaVideo /> Join External Meeting
                     </a>
                   ) : (
                     <Link 
                       href={`/video-call/${activeRoomId}`}
                       className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg font-bold shadow-lg transition-all active:scale-95 border-b-4 border-indigo-800"
                     >
                        <FaVideo /> Enter Classroom
                     </Link>
                   )}
                </div>
              )}

              {booking.status === "rejected" && (
                <div className="flex items-center gap-2 px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-bold uppercase">
                  <FaTimesCircle /> Declined
                </div>
              )}
              
              {booking.status === "completed" && (
                 <div className="flex items-center gap-2 px-3 py-1 bg-zinc-200 text-zinc-700 rounded-full text-xs font-bold uppercase">
                  <FaCheckDouble /> Session Ended
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}