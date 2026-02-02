"use client";

import { useState } from "react";
import { 
  FaCheckCircle, 
  FaTimesCircle, 
  FaCheckDouble, 
  FaClock 
} from "react-icons/fa";
import { verifyBooking } from "@/app/actions/bookingActions";

// Note: Ensure you pass 'historyBookings' and 'incomingBookings' from the parent
export default function BookingManager({ incomingBookings = [], historyBookings = [] }) {
  const [activeTab, setActiveTab] = useState("incoming");
  const [loadingId, setLoadingId] = useState(null);

  const handleVerify = async (bookingId, status) => {
    setLoadingId(bookingId);
    try {
      await verifyBooking(bookingId, status);
    } catch (error) {
      alert("Something went wrong");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="w-full">
      {/* 1. TABS */}
      <div className="flex gap-6 border-b border-zinc-200 dark:border-zinc-800 mb-6">
        <button
          onClick={() => setActiveTab("incoming")}
          className={`pb-3 text-sm font-medium transition-colors relative ${
            activeTab === "incoming"
              ? "text-indigo-600 dark:text-indigo-400"
              : "text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
          }`}
        >
          Incoming Requests
          {incomingBookings.length > 0 && (
            <span className="ml-2 bg-indigo-100 text-indigo-700 text-[10px] px-2 py-0.5 rounded-full">
              {incomingBookings.length}
            </span>
          )}
          {activeTab === "incoming" && (
            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 dark:bg-indigo-400" />
          )}
        </button>

        <button
          onClick={() => setActiveTab("history")}
          className={`pb-3 text-sm font-medium transition-colors relative ${
            activeTab === "history"
              ? "text-indigo-600 dark:text-indigo-400"
              : "text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
          }`}
        >
          Session History
          {activeTab === "history" && (
            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 dark:bg-indigo-400" />
          )}
        </button>
      </div>

      {/* 2. TAB CONTENT: INCOMING */}
      {activeTab === "incoming" && (
        <div className="space-y-4">
          {incomingBookings.length === 0 ? (
            <div className="p-8 text-center border border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-900/50">
              <p className="text-zinc-500 text-sm">No pending requests.</p>
            </div>
          ) : (
            incomingBookings.map((booking) => (
              <div
                key={booking._id}
                className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-4 rounded-xl shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
              >
                <div>
                  <h4 className="font-bold text-zinc-900 dark:text-white">
                    {booking.studentName}
                  </h4>
                  <div className="flex gap-3 text-sm text-zinc-500 mt-1">
                    <span className="flex items-center gap-1">
                      <FaClock size={12} /> {new Date(booking.date).toLocaleDateString()}
                    </span>
                    <span>{booking.timeSlot}</span>
                  </div>
                </div>

                <div className="flex gap-2 w-full sm:w-auto">
                  <button
                    disabled={loadingId === booking._id}
                    onClick={() => handleVerify(booking._id, "rejected")}
                    className="flex-1 sm:flex-none px-4 py-2 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition disabled:opacity-50"
                  >
                    Reject
                  </button>
                  <button
                    disabled={loadingId === booking._id}
                    onClick={() => handleVerify(booking._id, "confirmed")}
                    className="flex-1 sm:flex-none px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition disabled:opacity-50 shadow-md shadow-indigo-500/20"
                  >
                    {loadingId === booking._id ? "Processing..." : "Approve"}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* 3. TAB CONTENT: HISTORY */}
      {activeTab === "history" && (
        <div className="space-y-4">
          {historyBookings.length === 0 ? (
            <div className="p-8 text-center border border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-900/50">
              <p className="text-zinc-500 text-sm">No history available.</p>
            </div>
          ) : (
            historyBookings.map((booking) => (
              <div
                key={booking._id}
                className="bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800 p-4 rounded-xl flex items-center justify-between transition"
              >
                <div>
                  <h4 className="font-bold text-zinc-900 dark:text-white text-sm">
                    {booking.studentName}
                  </h4>
                  <div className="flex gap-3 text-xs text-zinc-500 mt-1">
                    <span>{new Date(booking.date).toLocaleDateString()}</span>
                    <span>{booking.timeSlot}</span>
                  </div>
                </div>
                <div>
                  {booking.status === "confirmed" && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                      <FaCheckCircle size={10} /> Confirmed
                    </span>
                  )}
                  {booking.status === "rejected" && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
                      <FaTimesCircle size={10} /> Rejected
                    </span>
                  )}
                  {booking.status === "completed" && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-zinc-200 text-zinc-700 dark:bg-zinc-700 dark:text-zinc-300">
                      <FaCheckDouble size={10} /> Completed
                    </span>
                  )}
                  {/* 👇 NEW: ONGOING STATUS FOR MENTOR */}
                  {booking.status === "ongoing" && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300 animate-pulse">
                       <div className="w-2 h-2 rounded-full bg-indigo-600 animate-ping mr-2"></div>
                       Ongoing
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}