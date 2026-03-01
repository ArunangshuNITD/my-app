"use client";

import {
  FaCalendarDay,
  FaClock,
  FaChalkboardTeacher,
  FaVideo,
  FaHourglassHalf,
  FaCheckCircle,
  FaTimesCircle,
  FaCheckDouble,
  FaStar,
  FaTimes
} from "react-icons/fa";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
// Ensure this path matches exactly where your action is located
import { submitSessionReview } from "@/app/actions/reviewActions"; 

export default function StudentBookingList({ bookings = [] }) {
  const [now, setNow] = useState(new Date());
  
  // Review Modal State
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  
  const router = useRouter();

  // Update the current time every 30 seconds to trigger the "Join Now" button dynamically
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(timer);
  }, []);

  // --- Helper: Check if session is currently active ---
  const isSessionActive = (booking) => {
    if (!booking || (booking.status !== "confirmed" && booking.status !== "ongoing")) return false;
    if (!booking.timeSlot || typeof booking.timeSlot !== "string") return false;

    try {
      const bDate = new Date(booking.date);
      
      // Use local date to avoid timezone shift issues (e.g., IST shifting to previous day in UTC)
      const yyyy = bDate.getFullYear();
      const mm = String(bDate.getMonth() + 1).padStart(2, '0');
      const dd = String(bDate.getDate()).padStart(2, '0');
      const dateStr = `${yyyy}-${mm}-${dd}`; 

      // Handle both "08:30 AM - 09:30 AM" AND "08:30 AM" formats
      const parts = booking.timeSlot.split(" - ");
      const startTimeStr = parts[0].trim();
      const endTimeStr = parts.length === 2 ? parts[1].trim() : null;

      const parseTime = (dateString, timeStr) => {
        if (!timeStr || typeof timeStr !== 'string') return null;
        const [time, modifier] = timeStr.trim().split(" ");
        const [hours, minutes] = time.split(":");
        let h = parseInt(hours, 10);
        if (modifier === "PM" && h < 12) h += 12;
        if (modifier === "AM" && h === 12) h = 0;
        
        // Construct standard ISO-like local date
        const combined = new Date(`${dateString}T${h.toString().padStart(2, '0')}:${minutes}:00`);
        return isNaN(combined.getTime()) ? null : combined;
      };

      const startDate = parseTime(dateStr, startTimeStr);
      if (!startDate) return false;

      let endDate = null;
      if (endTimeStr) {
        endDate = parseTime(dateStr, endTimeStr);
      } else {
        // If no end time exists in the database, assume the session lasts 1 hour
        endDate = new Date(startDate.getTime() + 60 * 60 * 1000);
      }

      if (!endDate) return false;

      // Allows joining 15 minutes before start time
      const bufferBefore = 15 * 60 * 1000; 
      
      return now >= (startDate.getTime() - bufferBefore) && now <= endDate.getTime();
    } catch (e) {
      console.error("Error parsing session time:", e);
      return false;
    }
  };

  // --- Handler: Open Modal ---
  const openRateModal = (booking) => {
    setSelectedBooking(booking);
    setRating(5);
    setComment("");
  };

  // --- Handler: Submit Review ---
  const handleSubmitReview = async () => {
    if (!selectedBooking) return;
    setSubmitting(true);

    try {
        const mentorId = selectedBooking.mentorId || selectedBooking.mentor?._id || selectedBooking.mentor;

        if (!mentorId) {
            alert("Error: Missing Mentor ID. Please refresh and try again.");
            setSubmitting(false);
            return;
        }

        const result = await submitSessionReview({
            bookingId: selectedBooking._id,
            mentorId: mentorId, 
            rating,
            comment
        });

        if (result.success) {
            setSelectedBooking(null);
            router.refresh(); 
        } else {
            alert(result.error || "Failed to submit review");
        }
    } catch (error) {
        console.error("Review submission error:", error);
        alert("An error occurred while submitting.");
    } finally {
        setSubmitting(false);
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
        const activeRoomId = (booking.roomId || booking._id).toString();

        return (
          <div
            key={booking._id}
            className={`border p-5 rounded-xl shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-all duration-300
              ${booking.status === "completed"
                ? "bg-zinc-50 border-zinc-200 dark:bg-zinc-900/50 dark:border-zinc-800 opacity-90"
                : canJoin || booking.status === "ongoing"
                  ? "bg-indigo-50 border-indigo-200 dark:bg-indigo-900/20 dark:border-indigo-600 shadow-lg ring-1 ring-indigo-500"
                  : "bg-white border-zinc-200 dark:bg-zinc-900 dark:border-zinc-800"}`}
          >
            {/* --- LEFT SIDE: INFO --- */}
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

            {/* --- RIGHT SIDE: ACTIONS --- */}
            <div className="flex flex-col items-end gap-3 min-w-[160px]">
              
              {/* STATUS: PENDING */}
              {booking.status === "pending" && (
                <div className="flex items-center gap-2 px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-bold uppercase tracking-tight">
                  <FaHourglassHalf /> Pending
                </div>
              )}

              {/* STATUS: REJECTED */}
              {booking.status === "rejected" && (
                <div className="flex items-center gap-2 px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-bold uppercase tracking-tight">
                  <FaTimesCircle /> Declined
                </div>
              )}

              {/* STATUS: COMPLETED */}
              {booking.status === "completed" && (
                <div className="flex flex-col items-end gap-2 w-full">
                  <div className="flex items-center gap-2 px-3 py-1 bg-zinc-200 text-zinc-700 rounded-full text-xs font-bold uppercase tracking-tight ml-auto">
                    <FaCheckDouble /> Session Ended
                  </div>

                  {!booking.hasReview && !booking.isReviewed ? (
                    <div className="mt-1 p-2 rounded-lg bg-yellow-50 border border-yellow-200 w-full text-center">
                      <p className="text-[10px] font-bold text-yellow-800 mb-1 uppercase tracking-wide">
                        Pending Feedback
                      </p>
                      <button
                        onClick={() => openRateModal(booking)}
                        className="w-full bg-yellow-400 hover:bg-yellow-500 text-black text-xs font-bold py-1.5 px-3 rounded shadow-sm transition-colors flex items-center justify-center gap-1"
                      >
                          <FaStar size={10} /> Rate Mentor
                      </button>
                    </div>
                  ) : (
                    <p className="text-[11px] text-green-600 font-semibold flex items-center gap-1 mt-1">
                      <FaCheckCircle size={10} /> You rated this mentor
                    </p>
                  )}
                </div>
              )}

              {/* STATUS: CONFIRMED (Not yet time) */}
              {booking.status === "confirmed" && !canJoin && (
                <div className="flex flex-col items-end gap-2 animate-in fade-in duration-700">
                  <div className="flex items-center gap-2 px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold uppercase tracking-tight">
                    <FaCheckCircle /> Confirmed
                  </div>
                  <p className="text-[10px] text-zinc-400 font-medium text-right">Link activates 15m early</p>
                </div>
              )}

              {/* STATUS: ONGOING / CAN JOIN (Time is right!) */}
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
                      className="flex items-center gap-2 bg-zinc-900 hover:bg-black text-white px-5 py-2 rounded-xl font-bold shadow-xl transition-all hover:scale-105 active:scale-95 text-sm"
                    >
                      <FaVideo /> Join Meeting
                    </a>
                  ) : (
                    // This is the link to your internal ZegoCloud Video room
                    <Link
                      href={`/meeting/${activeRoomId}`}
                      className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-xl font-bold shadow-xl transition-all hover:scale-105 active:scale-95 border-b-4 border-indigo-900 text-sm"
                    >
                      <FaVideo /> Join Now
                    </Link>
                  )}
                </div>
              )}
            </div>
          </div>
        );
      })}

      {/* --- RATING MODAL (Unchanged) --- */}
      {selectedBooking && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-zinc-900 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 animate-in fade-in zoom-in duration-200">
            
            {/* Modal Header */}
            <div className="bg-zinc-50 dark:bg-zinc-800/50 px-6 py-4 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center">
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white">Rate Session</h3>
              <button 
                onClick={() => setSelectedBooking(null)} 
                className="text-zinc-400 hover:text-red-500 transition-colors p-1"
              >
                <FaTimes size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5">
              <div className="text-center">
                <p className="text-sm text-zinc-500 mb-1">How was your session with</p>
                <p className="font-bold text-xl text-zinc-900 dark:text-white">
                    {selectedBooking.mentorName || selectedBooking.mentor?.name || "the Mentor"}?
                </p>
              </div>

              {/* Star Rating */}
              <div className="flex justify-center gap-3 py-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    type="button"
                    className={`text-4xl transition-transform hover:scale-110 ${
                      star <= rating ? "text-yellow-400 drop-shadow-sm" : "text-gray-200 dark:text-gray-700"
                    }`}
                  >
                    ★
                  </button>
                ))}
              </div>

              {/* Text Review */}
              <div>
                <label className="block text-xs font-bold uppercase text-zinc-500 mb-2">Write a review (optional)</label>
                <textarea
                  className="w-full p-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-black text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none transition-all"
                  rows="3"
                  placeholder="What did you learn? Was the mentor helpful?"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
              </div>

              <button
                onClick={handleSubmitReview}
                disabled={submitting}
                className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white py-3.5 rounded-xl font-bold text-sm transition-all flex justify-center items-center gap-2 shadow-lg hover:shadow-indigo-500/25"
              >
                {submitting ? "Submitting..." : "Submit Review"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}