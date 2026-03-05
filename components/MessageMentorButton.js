"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { startConversation } from "@/app/actions/messageAction";
import { FaCommentDots } from "react-icons/fa";

export default function MessageMentorButton({ mentorId }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleMessage = async () => {
    try {
      setLoading(true);
      const conversationId = await startConversation(mentorId);
      router.push(`/profile/messages/${conversationId}`);
    } catch (error) {
      console.error(error);
      alert(error.message || "Failed to start conversation");
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleMessage}
      disabled={loading}
      className="w-full mt-3 flex items-center justify-center gap-2 rounded-xl bg-white border border-indigo-200 text-indigo-600 hover:bg-indigo-50 dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-700 px-4 py-3.5 text-sm font-bold transition-all disabled:opacity-50"
    >
      <FaCommentDots className="text-lg" /> 
      {loading ? "Opening Chat..." : "Message Mentor"}
    </button>
  );
}