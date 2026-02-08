// app/models/Mentor.js
import mongoose from "mongoose";

const MentorSchema = new mongoose.Schema(
  {
    // --- Existing Identity Fields ---
    name: { type: String, required: true },
    email: { type: String, required: true },
    domain: { type: String, required: true },
    organization: { type: String },
    linkedin: { type: String },
    image: { type: String },
    bio: { type: String },
    averageRating: {
      type: Number,
      default: 0,
    },
    totalReviews: {
      type: Number,
      default: 0,
    },
    // --- NEW: Booking & Session Configuration ---
    pricePerSession: {
      type: Number,
      default: 0, // 0 = Free, or set a base price like 500
    },
    sessionDuration: {
      type: Number,
      default: 30, // Duration in minutes
    },
    timezone: {
      type: String,
      default: "Asia/Kolkata", // Crucial for calculating time differences
    },
    isAcceptingBookings: {
      type: Boolean,
      default: true, // Master switch to pause bookings
    },

    // --- Admin Control ---
    applicationStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending"
    },

    // OPTIONAL: Link to the main User account (Recommended for Auth)
    // If you don't have a separate User model yet, you can ignore this.
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

// Prevent model recompilation error in Next.js hot reloading
export default mongoose.models.Mentor || mongoose.model("Mentor", MentorSchema);