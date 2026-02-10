import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Review from "@/models/Review";
import Mentor from "@/models/Mentor";
import Booking from "@/models/Booking";
import User from "@/models/User"; // Import User model to resolve email to ID
import { auth } from "@/lib/auth";

export async function POST(req, { params }) {
  try {
    await connectDB();
    const session = await auth();
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // FIX 1: Await params (Required for Next.js 15+)
    const { id: mentorId } = await params;
    
    const body = await req.json();
    const { rating, comment, bookingId } = body;

    // FIX 2: Resolve User ID using Email
    // Since your ProfilePage uses email, we ensure we have the correct DB _id here
    const studentUser = await User.findOne({ email: session.user.email });
    
    if (!studentUser) {
      return NextResponse.json({ error: "User record not found" }, { status: 404 });
    }

    // FIX 3: Check for existing review to prevent duplicates
    const existingReview = await Review.findOne({ booking: bookingId });
    if (existingReview) {
      return NextResponse.json({ error: "You have already reviewed this session" }, { status: 400 });
    }

    // 4. Validate booking
    // We use studentUser._id here to ensure we match the DB reference correctly
    const booking = await Booking.findOne({
      _id: bookingId,
      mentor: mentorId,
      student: studentUser._id, 
      status: "completed",
    });

    if (!booking) {
      return NextResponse.json(
        { error: "Invalid booking. Session must be 'completed' and belong to you." },
        { status: 403 }
      );
    }

    // 5. Create review
    const review = await Review.create({
      mentor: mentorId,
      student: studentUser._id,
      booking: bookingId,
      rating,
      comment,
    });

    // 6. Update mentor stats safely
    const mentor = await Mentor.findById(mentorId);
    
    // Handle cases where fields might be undefined (new mentors)
    const currentTotal = mentor.totalReviews || 0;
    const currentAvg = mentor.averageRating || 0;

    const newTotal = currentTotal + 1;
    // Math: ((Old Avg * Old Count) + New Rating) / New Count
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
  // FIX: Await params here too
  const { id: mentorId } = await params;

  const reviews = await Review.find({ mentor: mentorId })
    .populate("student", "name image")
    .sort({ createdAt: -1 });

  return NextResponse.json(reviews);
}