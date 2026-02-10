"use client";

import { useState } from "react";
import { FaStar, FaTimes, FaPen } from "react-icons/fa";
import { submitReview } from "@/app/actions/reviewActions";
import { useRouter } from "next/navigation";

export default function ReviewModal({ mentorId, currentUser }) {
  const [isOpen, setIsOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async () => {
    if (rating === 0) return alert("Please select a star rating.");
    
    setIsSubmitting(true);
    const result = await submitReview(mentorId, rating, comment);
    setIsSubmitting(false);

    if (result.success) {
      setIsOpen(false);
      setRating(0);
      setComment("");
      router.refresh(); // Refresh to show new review
    } else {
      alert(result.error);
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
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl dark:bg-[#18181b] animate-in fade-in zoom-in duration-200">
            {/* Header */}
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Rate Experience</h3>
              <button 
                onClick={() => setIsOpen(false)}
                className="rounded-full p-2 text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10"
              >
                <FaTimes />
              </button>
            </div>

            {/* Star Rating */}
            <div className="mb-6 flex justify-center gap-2">
              {[...Array(5)].map((_, index) => {
                const ratingValue = index + 1;
                return (
                  <label key={index} className="cursor-pointer">
                    <input
                      type="radio"
                      name="rating"
                      className="hidden"
                      value={ratingValue}
                      onClick={() => setRating(ratingValue)}
                    />
                    <FaStar
                      className="transition-colors duration-200"
                      size={32}
                      color={ratingValue <= (hover || rating) ? "#fbbf24" : "#e5e7eb"}
                      onMouseEnter={() => setHover(ratingValue)}
                      onMouseLeave={() => setHover(0)}
                    />
                  </label>
                );
              })}
            </div>

            {/* Comment Box */}
            <textarea
              className="mb-6 w-full rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
              rows={4}
              placeholder="Share your experience with this mentor..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={() => setIsOpen(false)}
                className="flex-1 rounded-xl border border-gray-200 bg-white py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 dark:border-zinc-700 dark:bg-transparent dark:text-gray-300 dark:hover:bg-zinc-800"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex-1 rounded-xl bg-indigo-600 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 hover:bg-indigo-700 disabled:opacity-70"
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