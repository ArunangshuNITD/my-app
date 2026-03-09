// app/actions/userActivity.js
"use server";

import connectDB from "@/lib/db";
import UserActivity from "@/models/UserActivity";

export async function logUserActivity(userEmail) {
  if (!userEmail) return { success: false, message: "No email provided" };

  try {
    await connectDB();
    
    // Get today's date in YYYY-MM-DD format (e.g., "2026-03-09")
    const today = new Date().toISOString().split('T')[0];

    // Find the user by email, and $addToSet ensures the date is only added once
    // { upsert: true } creates the document if this user has never logged activity before
    await UserActivity.findOneAndUpdate(
      { userEmail: userEmail },
      { $addToSet: { activeDates: today } },
      { upsert: true, new: true }
    );
   
    return { success: true };
  } catch (error) {
    console.error("Failed to log activity:", error);
    return { success: false };
  }
}