import mongoose from "mongoose";

const BookingSchema = new mongoose.Schema(
  {
    mentorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Mentor",
      required: true,
    },
    studentEmail: {
      type: String,
      required: true,
    },
    studentName: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    timeSlot: {
      type: String, // e.g., "10:00 AM - 11:00 AM"
      required: true,
    },
    duration: {
      type: Number, // in minutes
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      // Added 'ongoing' to the enum
      enum: ["pending", "confirmed", "rejected", "cancelled", "completed", "ongoing"],
      default: "pending", 
    },
    // EXISTING: For external links like Zoom/Meet
    meetingLink: {
      type: String, 
    },
    // NEW: For internal Video Call feature
    roomId: { 
      type: String, 
      default: () => new mongoose.Types.ObjectId().toString() // Auto-generates a unique room ID
    }, 
  },
  { timestamps: true }
);

export default mongoose.models.Booking || mongoose.model("Booking", BookingSchema);