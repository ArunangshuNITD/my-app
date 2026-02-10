import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Review from "@/models/Review";
import Mentor from "@/models/Mentor";
import Booking from "@/models/Booking"; 
// REMOVED: import User ... (Not needed)
import { auth } from "@/lib/auth";

export async function POST(req, { params }) {
  try {
    await connectDB();
    const session = await auth();
    
    // Check if user is logged in
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Next.js 15+ Params Fix
    const { id: mentorId } = await params;
    
    const body = await req.json();
    const { rating, comment, bookingId } = body;

    // 1. Check for Duplicate Review
    const existingReview = await Review.findOne({ booking: bookingId });
    if (existingReview) {
      return NextResponse.json({ error: "You have already reviewed this session" }, { status: 400 });
    }

    // 2. Validate Booking
    // Since we don't have a User ID, we verify the booking belongs to this email
    // Make sure your Booking model has a 'studentEmail' or matching field!
    const booking = await Booking.findOne({
      _id: bookingId,
      mentor: mentorId,
      // Using email to verify ownership since we don't have a reliable User DB ID
      // If your Booking model uses 'studentId' (string), use session.user.id instead
      studentEmail: session.user.email, 
      status: "completed", // Ensure session actually happened
    });

    if (!booking) {
      return NextResponse.json(
        { error: "Invalid booking. Session must be 'completed' and belong to you." },
        { status: 403 }
      );
    }

    // 3. Create Review
    // We save the Name/Image directly because we can't .populate() later
    const review = await Review.create({
      mentor: mentorId,
      studentId: session.user.id,     // Store Auth ID
      studentName: session.user.name, // Store Name
      studentImage: session.user.image,// Store Image
      booking: bookingId,
      rating,
      comment,
    });

    // 4. Update Mentor Stats
    const mentor = await Mentor.findById(mentorId);
    
    const currentTotal = mentor.totalReviews || 0;
    const currentAvg = mentor.averageRating || 0;

    const newTotal = currentTotal + 1;
    // Calculate new average
    const newAverage = ((currentAvg * currentTotal) + rating) / newTotal;

    mentor.totalReviews = newTotal;
    mentor.averageRating = newAverage;

    await mentor.save();

    return NextResponse.json({ success: true, review });

  } catch (error) {
    console.error("Review Submission Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function GET(req, { params }) {
  await connectDB();
  const { id: mentorId } = await params;

  // REMOVED: .populate("student") 
  // We now just return the review, which contains studentName/studentImage inside it
  const reviews = await Review.find({ mentor: mentorId })
    .sort({ createdAt: -1 });

  return NextResponse.json(reviews);
}