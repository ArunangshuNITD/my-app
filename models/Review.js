import mongoose from "mongoose";

const ReviewSchema = new mongoose.Schema(
  {
    mentor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Mentor",
      required: true,
    },
    student: {
      type: String, // <--- CHANGED FROM ObjectId TO String
      // ref: "User", // Remove ref since we don't have a synced User collection for auth
      required: true,
    },
    booking: {
      type: mongoose.Schema.Types.ObjectId, // Keep this as ObjectId (assuming Bookings are in DB)
      ref: "Booking",
      required: true, 
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },
    comment: {
      type: String,
      trim: true,
      maxlength: 500,
    },
  },
  { timestamps: true }
);

// Prevent duplicate review per booking
ReviewSchema.index({ booking: 1 }, { unique: true });

export default mongoose.models.Review || mongoose.model("Review", ReviewSchema);