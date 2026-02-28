import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    mentor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Mentor",
      required: true,
    },
    studentId: {
      type: String, 
      required: true,
    },
    studentName: { type: String },
    studentImage: { type: String },
    
    // 👇 UPDATE THIS FIELD
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      default: null, 
      // ❌ REMOVE "unique: true" from here if it exists!
    },

    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: false, // Comment can be empty for star-only ratings
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// 👇 ADD THIS INDEX AT THE BOTTOM
// This tells MongoDB: "Enforce uniqueness ONLY when booking has a real ObjectId value"
reviewSchema.index(
  { booking: 1 }, 
  { 
    unique: true, 
    partialFilterExpression: { booking: { $type: "objectId" } } 
  }
);

// Prevent a student from reviewing the SAME mentor multiple times generally (without booking)
// Optional: Ensure one general review per student per mentor
reviewSchema.index(
  { mentor: 1, studentId: 1, booking: 1 }, 
  { unique: true }
);

export default mongoose.models.Review || mongoose.model("Review", reviewSchema);