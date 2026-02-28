"use server";

import dbConnect from "@/lib/db";
import Booking from "@/models/Booking";
import Mentor from "@/models/Mentor";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// ---------------------------------------------------------
// HELPER: CALCULATE TIME STATUS (Future vs Ongoing vs Past)
// ---------------------------------------------------------
function checkTimeStatus(bookingDate, timeSlot, durationInMinutes) {
  try {
    const now = new Date();
    
    // 1. Robust Date Parsing
    const bDate = new Date(bookingDate);
    const sessionStart = new Date();
    sessionStart.setFullYear(bDate.getFullYear());
    sessionStart.setMonth(bDate.getMonth());
    sessionStart.setDate(bDate.getDate());

    // 2. Parse "10:00 AM" from "10:00 AM - 11:00 AM"
    const startTimeString = timeSlot.split("-")[0].trim();
    const [time, modifier] = startTimeString.split(" ");
    let [hours, minutes] = time.split(":");

    hours = parseInt(hours, 10);
    minutes = parseInt(minutes, 10);

    // Convert 12h to 24h
    if (hours === 12) {
      hours = modifier === "PM" ? 12 : 0;
    } else if (modifier === "PM") {
      hours += 12;
    }

    sessionStart.setHours(hours, minutes, 0, 0);

    // 3. Calculate End Time
    const duration = durationInMinutes || 60;
    const sessionEnd = new Date(sessionStart.getTime() + duration * 60 * 1000);

    // LOGIC:
    // A. If NOW is past End Time -> Completed
    if (now > sessionEnd) return "completed";
    
    // B. If NOW is between Start and End -> Ongoing
    if (now >= sessionStart && now <= sessionEnd) return "ongoing";

    // C. Otherwise -> Remains Confirmed (Future)
    return "confirmed";
  } catch (error) {
    console.error("Error checking time status:", error);
    return "confirmed";
  }
}

// ---------------------------------------------------------
// 1. GET TAKEN SLOTS
// ---------------------------------------------------------
export async function getTakenSlots(mentorId, dateString) {
  await dbConnect();
  const queryDate = new Date(dateString);

  const bookings = await Booking.find({
    mentorId: mentorId,
    date: queryDate,
    status: { $ne: "cancelled" },
  }).select("timeSlot");

  return bookings.map((b) => b.timeSlot);
}

// ---------------------------------------------------------
// 2. CREATE A NEW BOOKING
// ---------------------------------------------------------
export async function createBooking(formData) {
  const session = await auth();
  if (!session || !session.user) {
    throw new Error("You must be logged in.");
  }

  await dbConnect();

  const mentorId = formData.get("mentorId");
  const dateString = formData.get("date");
  const timeSlot = formData.get("timeSlot");

  if (!mentorId || !dateString || !timeSlot) {
    throw new Error("Missing booking details.");
  }

  // --- COLLISION CHECK ---
  const bookingDate = new Date(dateString);

  const existingBooking = await Booking.findOne({
    mentorId: mentorId,
    date: bookingDate,
    timeSlot: timeSlot,
    status: { $ne: "cancelled" },
  });

  if (existingBooking) {
    redirect(`/booking-error?mentorId=${mentorId}`);
  }

  // --- FETCH MENTOR DETAILS ---
  const mentor = await Mentor.findById(mentorId);
  if (!mentor) throw new Error("Mentor not found.");

  // --- CREATE BOOKING ---
  await Booking.create({
    mentorId: mentor._id,
    studentEmail: session.user.email,
    studentName: session.user.name || "Student",
    date: bookingDate,
    timeSlot: timeSlot,
    duration: mentor.sessionDuration || 60,
    price: mentor.pricePerSession || 0,
    status: "pending",
  });

  revalidatePath("/profile");
  redirect(`/mentors/${mentorId}/book/success`);
}

// ---------------------------------------------------------
// 3. GET INCOMING REQUESTS (For Mentor Dashboard)
// ---------------------------------------------------------
export async function getIncomingBookings(mentorEmail) {
  await dbConnect();
  
  const mentor = await Mentor.findOne({ email: mentorEmail });
  
  if (!mentor) {
    return [];
  }

  // Explicitly find pending bookings
  const bookings = await Booking.find({
    mentorId: mentor._id,
    status: "pending", 
  })
    .sort({ date: 1 })
    .lean();

  // STRICT SERIALIZATION
  return bookings.map((b) => ({
    _id: b._id.toString(),
    mentorId: b.mentorId.toString(),
    studentName: b.studentName || "Student",
    studentEmail: b.studentEmail,
    date: b.date.toISOString(),
    timeSlot: b.timeSlot,
    status: b.status,
    price: b.price,
    message: b.message || "",
    meetingLink: b.meetingLink || "", 
  }));
}

// ---------------------------------------------------------
// 4. GET BOOKING HISTORY (For Mentor)
// ---------------------------------------------------------
export async function getMentorBookingHistory(mentorEmail) {
  await dbConnect();
  const mentor = await Mentor.findOne({ email: mentorEmail });
  if (!mentor) return [];

  // Find Confirmed, Rejected, Completed, OR Ongoing
  const bookings = await Booking.find({
    mentorId: mentor._id,
    status: { $in: ["confirmed", "rejected", "completed", "ongoing"] },
  }).sort({ updatedAt: -1 });

  // AUTO-UPDATE STATUS
  // We use Promise.all to handle async saves in parallel
  await Promise.all(bookings.map(async (b) => {
    if (b.status === "confirmed" || b.status === "ongoing") {
      const newStatus = checkTimeStatus(b.date, b.timeSlot, b.duration);
      if (newStatus !== b.status) {
        b.status = newStatus;
        await b.save();
      }
    }
  }));

  // Map for UI
  return bookings.map((b) => ({
    _id: b._id.toString(),
    mentorId: b.mentorId.toString(),
    studentName: b.studentName || "Student",
    status: b.status, 
    date: b.date.toISOString(),
    timeSlot: b.timeSlot,
    price: b.price,
    meetingLink: b.meetingLink || "", 
  }));
}

// ---------------------------------------------------------
// 5. VERIFY BOOKING (Approve/Reject)
// ---------------------------------------------------------
export async function verifyBooking(bookingId, newStatus) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  await dbConnect();

  await Booking.findByIdAndUpdate(bookingId, {
    status: newStatus,
  });

  // Revalidate the dashboard so the UI updates immediately
  revalidatePath("/dashboard"); 
  revalidatePath("/mentor/dashboard");
}

// ---------------------------------------------------------
// 6. GET STUDENT'S BOOKINGS (With Review Status)
// ---------------------------------------------------------
export async function getStudentBookings(studentEmail) {
  await dbConnect();

  // 1. Find all bookings for this student
  let bookings = await Booking.find({ studentEmail }).sort({ createdAt: -1 });

  if (!bookings.length) return [];

  // 2. AUTO-UPDATE STATUS
  await Promise.all(bookings.map(async (b) => {
    if (b.status === "confirmed" || b.status === "ongoing") {
      const newStatus = checkTimeStatus(b.date, b.timeSlot, b.duration);
      if (newStatus !== b.status) {
        b.status = newStatus;
        await b.save();
      }
    }
  }));

  // 3. Convert documents to plain objects for easier manipulation
  // Note: We cannot use .lean() above because we needed to .save() inside the loop
  const bookingsPlain = bookings.map(b => b.toObject());

  // 4. Get unique mentor IDs to fetch names efficiently
  const mentorIds = [...new Set(bookingsPlain.map((b) => b.mentorId))];
  const mentors = await Mentor.find({ _id: { $in: mentorIds } }).select("name");

  // Create a Lookup Map: { "mentorId": "Mentor Name" }
  const mentorMap = mentors.reduce((acc, m) => {
    acc[m._id.toString()] = m.name;
    return acc;
  }, {});

  // 5. Return Clean Data
  return bookingsPlain.map((b) => ({
    _id: b._id.toString(),
    mentorId: b.mentorId.toString(),
    mentorName: mentorMap[b.mentorId.toString()] || "Unknown Mentor",
    date: b.date.toISOString(),
    timeSlot: b.timeSlot,
    status: b.status, 
    price: b.price,
    meetingLink: b.meetingLink || "",
    // ✅ CRITICAL ADDITION: Pass this to frontend to hide/show Review button
    hasReview: b.hasReview || false, 
  }));
}