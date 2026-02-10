"use client";

import { useState } from "react";
import { FaStar } from "react-icons/fa";

export default function RateMentorButton({ mentorId, bookingId }) {
  const [rating, setRating] = useState(0);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const submitRating = async (value) => {
    setRating(value);
    setLoading(true);

    await fetch(`/api/mentors/${mentorId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        rating: value,
        bookingId,
      }),
    });

    setLoading(false);
    setSubmitted(true);
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
          onClick={() => submitRating(star)}
          className={`cursor-pointer text-lg transition ${
            rating >= star ? "text-yellow-400" : "text-zinc-300"
          }`}
        />
      ))}
      {loading && (
        <span className="ml-2 text-xs text-zinc-400">Saving…</span>
      )}
    </div>
  );
}