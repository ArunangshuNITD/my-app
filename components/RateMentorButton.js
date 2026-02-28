"use client";

import { useState } from "react";
import { FaStar } from "react-icons/fa";
import { submitReview } from "@/app/actions/reviewActions"; // Import Server Action
import { useRouter } from "next/navigation";

export default function RateMentorButton({ mentorId, bookingId }) {
  const [rating, setRating] = useState(0);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const router = useRouter();

  const submitRating = async (value) => {
    setRating(value);
    setLoading(true);

    try {
      // Use the Server Action instead of fetch
      // We pass an empty comment string "" since this is just a star rating
      const result = await submitReview(mentorId, value, "", bookingId);

      if (result.success) {
        setSubmitted(true);
        router.refresh();
      } else {
        alert(result.error);
        setRating(0); // Reset on error
      }
    } catch (error) {
      console.error(error);
      alert("Failed to submit rating");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <p className="text-xs text-green-600 font-medium">
        ✓ Thanks for rating
      </p>
    );
  }

  return (
    <div className="flex items-center gap-1 mt-2">
      {[1, 2, 3, 4, 5].map(star => (
        <FaStar
          key={star}
          onClick={() => !loading && submitRating(star)}
          className={`cursor-pointer text-lg transition ${
            rating >= star ? "text-yellow-400" : "text-zinc-300"
          } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
        />
      ))}
      {loading && (
        <span className="ml-2 text-xs text-zinc-400">Saving…</span>
      )}
    </div>
  );
}