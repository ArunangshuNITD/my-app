"use server";

import { auth } from "@/lib/auth"; // Update path if needed
import dbConnect from "@/lib/db";
import Booking from "@/models/Booking";
import Mentor from "@/models/Mentor";
import Review from "@/models/Review";
import { revalidatePath } from "next/cache";

export async function submitSessionReview({ bookingId, mentorId, rating, comment }) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return { success: false, error: "Unauthorized" };
    }

    await dbConnect();
    const studentId = session.user.id;
    let isVerified = false;
    let finalBookingId = null;

    // --- 1. DUAL MODE LOGIC ---
    
    if (bookingId) {
      // === MODE A: VERIFIED SESSION ===
      const booking = await Booking.findById(bookingId);
      if (!booking) return { success: false, error: "Booking not found." };

      // Verify Ownership (using ID or Email based on your schema)
      const isOwner = booking.studentId === studentId || booking.studentEmail === session.user.email;
      if (!isOwner) return { success: false, error: "Not authorized for this booking." };

      if (booking.status !== "completed") return { success: false, error: "Session must be completed." };
      if (booking.hasReview) return { success: false, error: "Already reviewed." };

      isVerified = true;
      finalBookingId = bookingId;

      // Mark booking as reviewed
      booking.hasReview = true;
      await booking.save();

    } else {
      // === MODE B: GENERAL REVIEW ===
      // Check for duplicate general review (Optional: limit 1 general review per student)
      const existingGeneral = await Review.findOne({
        mentor: mentorId,
        studentId: studentId,
        booking: null
      });
      
      if (existingGeneral) {
        return { success: false, error: "You already wrote a general review for this mentor." };
      }
      
      isVerified = false;
      finalBookingId = null;
    }

    // --- 2. CREATE REVIEW ---
    // We match the fields from your API route snippet
    const newReview = await Review.create({
      mentor: mentorId,
      studentId: studentId,        // Store Auth ID
      studentName: session.user.name, 
      studentImage: session.user.image,
      booking: finalBookingId,     // ID or Null
      rating: Number(rating),
      comment: comment,
      isVerified: isVerified       // New field
    });

    // --- 3. UPDATE MENTOR STATS ---
    // Using the logic from your API snippet (Efficient)
    const mentor = await Mentor.findById(mentorId);
    if (mentor) {
      const currentTotal = mentor.totalReviews || 0;
      const currentAvg = mentor.averageRating || 0;
      const newTotal = currentTotal + 1;
      // Calculate new weighted average
      const newAverage = ((currentAvg * currentTotal) + Number(rating)) / newTotal;

      mentor.totalReviews = newTotal;
      mentor.averageRating = newAverage;
      await mentor.save();
    }

    // --- 4. REFRESH UI ---
    revalidatePath(`/mentors/${mentorId}`);
    revalidatePath("/student/bookings");

    return { success: true };

  } catch (error) {
    console.error("Submit Review Error:", error);
    return { success: false, error: "Internal Server Error" };
  }
}