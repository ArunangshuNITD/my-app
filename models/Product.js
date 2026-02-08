import mongoose from "mongoose";

const ReviewSchema = new mongoose.Schema({
  user: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    stock: { type: Number, required: true, min: 0 },
    pdfUrl: { type: String, required: true },
    coverImage: { type: String, required: true },
    subjects: { type: [String], index: true },
    
    // Updated fields for the rating logic
    rating: { type: Number, default: 0 }, // This will be the Average
    totalRatings: { type: Number, default: 0 }, // Count of reviews
    reviews: [ReviewSchema], 

    createdBy: String
  },
  { timestamps: true }
);

export default mongoose.models.Product || mongoose.model("Product", ProductSchema);