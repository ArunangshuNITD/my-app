"use client";

import { useState } from "react";
import { FaStar, FaTimes, FaPen } from "react-icons/fa";
// Ensure this import matches the name of your server action function
import { submitSessionReview } from "@/app/actions/reviewActions"; 
import { useRouter } from "next/navigation";

export default function ReviewModal({ mentorId, currentUser, bookingId }) {
  const [isOpen, setIsOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async () => {
    if (rating === 0) return alert("Please select a star rating.");
    
    setIsSubmitting(true);
    
    try {
      // ✅ CHANGED: Passing a single object to match the Server Action signature
      const result = await submitSessionReview({
        mentorId,
        rating,
        comment,
        bookingId: bookingId || null
      });
      
      if (result.success) {
        setIsOpen(false);
        setRating(0);
        setComment("");
        router.refresh(); 
      } else {
        alert(result.error || "Failed to submit review");
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!currentUser) {
    return (
      <button 
        onClick={() => router.push("/login")}
        className="text-sm font-medium text-indigo-600 hover:underline"
      >
        Log in to write a review
      </button>
    );
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 rounded-lg bg-gray-900 px-4 py-2 text-sm font-bold text-white transition hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200"
      >
        <FaPen size={12} /> Write a Review
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Rate Experience</h3>
              <button 
                onClick={() => setIsOpen(false)}
                className="rounded-full p-2 text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
              >
                <FaTimes />
              </button>
            </div>

            {/* Star Rating */}
            <div className="mb-6 flex justify-center gap-2">
              {[...Array(5)].map((_, index) => {
                const ratingValue = index + 1;
                return (
                  <label key={index} className="cursor-pointer group">
                    <input
                      type="radio"
                      name="rating"
                      className="hidden"
                      value={ratingValue}
                      onClick={() => setRating(ratingValue)}
                    />
                    <FaStar
                      className="transition-transform duration-200 group-hover:scale-110"
                      size={32}
                      color={ratingValue <= (hover || rating) ? "#fbbf24" : "#e4e4e7"} // Yellow-400 vs Zinc-200
                      onMouseEnter={() => setHover(ratingValue)}
                      onMouseLeave={() => setHover(0)}
                    />
                  </label>
                );
              })}
            </div>

            {/* Comment Box */}
            <label className="block text-xs font-bold uppercase text-zinc-500 mb-2">
              Your Feedback
            </label>
            <textarea
              className="mb-6 w-full rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-zinc-700 dark:bg-black dark:text-white resize-none"
              rows={4}
              placeholder="Share your experience..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={() => setIsOpen(false)}
                className="flex-1 rounded-xl border border-gray-200 bg-white py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 dark:border-zinc-700 dark:bg-transparent dark:text-gray-300 dark:hover:bg-zinc-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex-1 rounded-xl bg-indigo-600 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 hover:bg-indigo-700 disabled:opacity-70 disabled:cursor-not-allowed transition-all active:scale-95"
              >
                {isSubmitting ? "Submitting..." : "Submit Review"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}