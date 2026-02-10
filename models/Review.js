import mongoose from "mongoose";

const ReviewSchema = new mongoose.Schema(
  {
    mentor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Mentor",
      required: true,
    },
    // Change this to String (stores Auth ID)
    studentId: {
      type: String, 
      required: true,
    },
    // Store Name & Image directly (Snapshot) since we can't populate
    studentName: {
      type: String,
      required: true,
    },
    studentImage: {
      type: String,
    },
    booking: {
      type: mongoose.Schema.Types.ObjectId,
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

ReviewSchema.index({ booking: 1 }, { unique: true });

export default mongoose.models.Review || mongoose.model("Review", ReviewSchema);