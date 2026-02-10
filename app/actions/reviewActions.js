"use server";

import dbConnect from "@/lib/db";
import Review from "@/models/Review";
import Mentor from "@/models/Mentor"; 
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import mongoose from "mongoose"; 

// 1. ADD bookingId to the arguments
export async function submitReview(mentorId, rating, comment, bookingId) {
  const session = await auth();
  
  if (!session || !session.user || !session.user.id) {
    return { error: "You must be logged in to leave a review." };
  }

  // 2. Validate bookingId
  if (!bookingId) {
    return { error: "No booking associated with this review." };
  }

  await dbConnect();

  try {
    await Review.create({
      mentor: mentorId,
      student: session.user.id, 
      booking: bookingId, // 3. SAVE THE BOOKING ID
      rating,
      comment,
    });

    // Recalculate Stats (Standard aggregation)
    const stats = await Review.aggregate([
      { $match: { mentor: new mongoose.Types.ObjectId(mentorId) } },
      {
        $group: {
          _id: "$mentor",
          averageRating: { $avg: "$rating" },
          totalReviews: { $sum: 1 },
        },
      },
    ]);

    const newAvg = stats[0]?.averageRating || 0;
    const newTotal = stats[0]?.totalReviews || 0;

    await Mentor.findByIdAndUpdate(mentorId, {
      averageRating: newAvg,
      totalReviews: newTotal,
    });

    revalidatePath(`/mentors/${mentorId}`);
    return { success: true };

  } catch (error) {
    console.error("Review Submission Error:", error);
    // Handle Duplicate Review specifically
    if (error.code === 11000) {
        return { error: "You have already reviewed this session." };
    }
    return { error: error.message || "Failed to submit review." };
  }
}