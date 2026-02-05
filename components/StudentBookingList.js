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
    const timer = setInterval(() => setNow(new Date()), 60000); 
    return () => clearInterval(timer);
  }, []);

  // Helper: Check if the session is currently active
  const isSessionActive = (booking) => {
    // 1. Basic Safety Checks
    if (booking.status !== "confirmed" && booking.status !== "ongoing") return false;
    if (!booking.timeSlot || typeof booking.timeSlot !== "string") return false;

    try {
      const bookingDate = new Date(booking.date);
      
      // 2. Safe Split: Ensure we actually have two parts
      const parts = booking.timeSlot.split(" - ");
      if (parts.length !== 2) return false; // Stop if format is wrong

      const [startTimeStr, endTimeStr] = parts;
      
      // 3. Define parse function locally
      const parseTime = (dateBase, timeStr) => {
        if (!timeStr) return null; // Extra safety
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

      // 4. Allow joining 10 minutes before start
      const joinWindowStart = new Date(startDate.getTime() - 10 * 60000); 

      return now >= joinWindowStart && now <= endDate;
      
    } catch (e) {
      console.error("Date parsing error for booking:", booking._id, e);
      return false;
    }
  };

  if (bookings.length === 0) {
    return (
      <div className="p-8 text-center border border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-900/50">
        <p className="text-zinc-500 text-sm">You haven't applied for any sessions yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {bookings.map((booking) => {
        const canJoin = isSessionActive(booking);
        
        return (
          <div 
            key={booking._id} 
            className={`border p-5 rounded-xl shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-all
              ${booking.status === "completed" 
                  ? "bg-zinc-50 border-zinc-200 dark:bg-zinc-900/50 dark:border-zinc-800 opacity-75" 
                  : canJoin || booking.status === "ongoing"
                  ? "bg-indigo-50 border-indigo-200 dark:bg-indigo-900/20 dark:border-indigo-800 shadow-md ring-1 ring-indigo-200"
                  : "bg-white border-zinc-200 dark:bg-zinc-900 dark:border-zinc-800"}`}
          >
            {/* Left Side: Session Details */}
            <div>
              <h4 className="font-bold text-zinc-900 dark:text-white flex items-center gap-2 text-lg">
                <FaChalkboardTeacher className={booking.status === "completed" ? "text-zinc-400" : "text-indigo-500"} /> 
                {booking.mentorName || "Mentor Session"}
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

            {/* Right Side: Status & Actions */}
            <div className="flex flex-col items-end gap-3">
              
              {booking.status === "pending" && (
                <div className="flex items-center gap-2 px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-bold uppercase">
                  <FaHourglassHalf /> Pending
                </div>
              )}

              {booking.status === "confirmed" && !canJoin && (
                <div className="flex flex-col items-end gap-2">
                  <div className="flex items-center gap-2 px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-bold uppercase">
                    <FaCheckCircle /> Confirmed
                  </div>
                  <CountdownTimer targetDate={booking.date} timeSlot={booking.timeSlot} />
                </div>
              )}

              {(canJoin || booking.status === "ongoing") && (
                <div className="animate-in fade-in zoom-in duration-300">
                   <div className="flex items-center justify-end gap-2 mb-2">
                      <span className="relative flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-indigo-500"></span>
                      </span>
                      <span className="text-xs font-bold text-indigo-600 uppercase">Happening Now</span>
                   </div>
                   
                   {booking.meetingLink ? (
                     <a 
                       href={booking.meetingLink} 
                       target="_blank" 
                       rel="noopener noreferrer"
                       className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg font-bold shadow-sm transition-all hover:scale-105"
                     >
                        <FaVideo /> Join Meeting
                     </a>
                   ) : (
                     <Link 
                       href={`/video-call/${booking.roomId || booking._id}`}
                       className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg font-bold shadow-sm transition-all hover:scale-105"
                     >
                        <FaVideo /> Join Classroom
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
                 <div className="flex items-center gap-2 px-3 py-1 bg-zinc-100 text-zinc-600 rounded-full text-xs font-bold uppercase">
                  <FaCheckDouble /> Completed
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}