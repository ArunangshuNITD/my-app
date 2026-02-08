import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Review from "@/models/Review";
import Mentor from "@/models/Mentor";
import Booking from "@/models/Booking";
import { auth } from "@/lib/auth";

export async function POST(req, { params }) {
  await connectDB();

  const session = await auth();
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id: mentorId } = params;
  const { rating, comment, bookingId } = await req.json();

  // 1️⃣ Validate booking
  const booking = await Booking.findOne({
    _id: bookingId,
    mentor: mentorId,
    student: session.user.id,
    status: "completed",
  });

  if (!booking) {
    return NextResponse.json(
      { error: "Invalid or incomplete session" },
      { status: 403 }
    );
  }

  // 2️⃣ Create review
  const review = await Review.create({
    mentor: mentorId,
    student: session.user.id,
    booking: bookingId,
    rating,
    comment,
  });

  // 3️⃣ Update mentor rating
  const mentor = await Mentor.findById(mentorId);

  const newTotal = mentor.totalReviews + 1;
  const newAverage =
    (mentor.averageRating * mentor.totalReviews + rating) / newTotal;

  mentor.totalReviews = newTotal;
  mentor.averageRating = newAverage;

  await mentor.save();

  return NextResponse.json({ success: true, review });
}

// GET reviews for mentor profile
export async function GET(req, { params }) {
  await connectDB();

  const reviews = await Review.find({ mentor: params.id })
    .populate("student", "name image")
    .sort({ createdAt: -1 });

  return NextResponse.json(reviews);
}