"use server";

import dbConnect from "@/lib/db";
import Mentor from "@/models/Mentor";
import Contact from "@/models/Contact";
import Blog from "@/models/Blog"; // Assuming you have this

export async function getDashboardStats() {
  await dbConnect();

  // 1. ✅ FIX: Only count APPROVED mentors for the main "Total Mentors" card
  const mentorCount = await Mentor.countDocuments({ applicationStatus: "approved" });

  // 2. Count Messages
  const messageCount = await Contact.countDocuments();
  
  // 3. Pending Counts
  const pendingBlogs = await Blog.countDocuments({ status: "pending" });
  
  // 4. Pending Mentors (Verification Requests)
  const pendingMentors = await Mentor.countDocuments({ applicationStatus: "pending" });

  return {
    mentors: mentorCount,
    messages: messageCount,
    pendingBlogs, 
    pendingMentors, 
  };
}

export async function getMessages() {
  await dbConnect();
  const messages = await Contact.find({}).sort({ createdAt: -1 });
  // Serialize to plain JSON to avoid Next.js "Plain Object" warnings
  return JSON.parse(JSON.stringify(messages));
}