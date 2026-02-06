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
    // Updates every 30 seconds for real-time button activation
    const timer = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(timer);
  }, []);

  const isSessionActive = (booking) => {
    if (!booking || (booking.status !== "confirmed" && booking.status !== "ongoing")) return false;
    if (!booking.timeSlot || typeof booking.timeSlot !== "string") return false;

    try {
      const bDate = new Date(booking.date);
      const dateStr = bDate.toISOString().split('T')[0];
      const parts = booking.timeSlot.split(" - ");
      if (parts.length !== 2) return false;

      const [startTimeStr, endTimeStr] = parts;

      const parseTime = (dateString, timeStr) => {
        if (!timeStr || typeof timeStr !== 'string') return null;
        const [time, modifier] = timeStr.trim().split(" ");
        let [hours, minutes] = time.split(":");
        let h = parseInt(hours, 10);
        if (modifier === "PM" && h < 12) h += 12;
        if (modifier === "AM" && h === 12) h = 0;
        const combined = new Date(`${dateString}T${h.toString().padStart(2, '0')}:${minutes}:00`);
        return isNaN(combined.getTime()) ? null : combined;
      };

      const startDate = parseTime(dateStr, startTimeStr);
      const endDate = parseTime(dateStr, endTimeStr);

      if (!startDate || !endDate) return false;

      const bufferBefore = 15 * 60 * 1000; 
      return now >= (startDate.getTime() - bufferBefore) && now <= endDate.getTime();
    } catch (e) {
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
        // Ensure activeRoomId is always a string and falls back to booking ID
        const activeRoomId = (booking.roomId || booking._id).toString();

        return (
          <div
            key={booking._id}
            className={`border p-5 rounded-xl shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-all duration-300
              ${booking.status === "completed"
                ? "bg-zinc-50 border-zinc-200 dark:bg-zinc-900/50 dark:border-zinc-800 opacity-75"
                : canJoin || booking.status === "ongoing"
                  ? "bg-indigo-50 border-indigo-200 dark:bg-indigo-900/20 dark:border-indigo-600 shadow-lg ring-1 ring-indigo-500"
                  : "bg-white border-zinc-200 dark:bg-zinc-900 dark:border-zinc-800"}`}
          >
            <div className="flex-1">
              <h4 className="font-bold text-zinc-900 dark:text-white flex items-center gap-2 text-lg">
                <FaChalkboardTeacher className={booking.status === "completed" ? "text-zinc-400" : "text-indigo-500"} />
                {booking.mentorName || booking.studentName || "Mentoring Session"}
              </h4>
              <div className="flex flex-wrap gap-4 text-sm text-zinc-500 mt-2 font-medium">
                <span className="flex items-center gap-1.5">
                  <FaCalendarDay className="text-zinc-400" /> {new Date(booking.date).toLocaleDateString('en-GB')}
                </span>
                <span className="flex items-center gap-1.5">
                  <FaClock className="text-zinc-400" /> {booking.timeSlot}
                </span>
              </div>
            </div>

            <div className="flex flex-col items-end gap-3 min-w-[160px]">
              {booking.status === "pending" && (
                <div className="flex items-center gap-2 px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-bold uppercase tracking-tight">
                  <FaHourglassHalf /> Pending
                </div>
              )}

              {booking.status === "rejected" && (
                <div className="flex items-center gap-2 px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-bold uppercase tracking-tight">
                  <FaTimesCircle /> Declined
                </div>
              )}

              {booking.status === "completed" && (
                <div className="flex items-center gap-2 px-3 py-1 bg-zinc-200 text-zinc-700 rounded-full text-xs font-bold uppercase tracking-tight">
                  <FaCheckDouble /> Session Ended
                </div>
              )}

              {booking.status === "confirmed" && !canJoin && (
                <div className="flex flex-col items-end gap-2 animate-in fade-in duration-700">
                  <div className="flex items-center gap-2 px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold uppercase tracking-tight">
                    <FaCheckCircle /> Confirmed
                  </div>
                  <CountdownTimer targetDate={booking.date} timeSlot={booking.timeSlot} />
                  <p className="text-[10px] text-zinc-400 font-medium text-right">Link activates 15m early</p>
                </div>
              )}

              {(canJoin || booking.status === "ongoing") && (
                <div className="flex flex-col items-end animate-in zoom-in-95 duration-300">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
                    </span>
                    <span className="text-xs font-extrabold text-rose-600 uppercase tracking-widest">Ongoing Now</span>
                  </div>

                  {booking.meetingLink ? (
                    <a
                      href={booking.meetingLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 bg-zinc-900 hover:bg-black text-white px-6 py-2.5 rounded-xl font-bold shadow-xl transition-all hover:scale-105 active:scale-95"
                    >
                      <FaVideo /> Join Meeting
                    </a>
                  ) : (
                    <Link
                      href={`/video-call/${activeRoomId}`}
                      className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-extrabold shadow-xl transition-all hover:scale-105 active:scale-95 border-b-4 border-indigo-900"
                    >
                      <FaVideo /> Join Classroom
                    </Link>
                  )}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}