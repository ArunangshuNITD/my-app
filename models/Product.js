import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    stock: { type: Number, required: true, min: 0 },

    pdfUrl: { type: String, required: true },
    coverImage: { type: String, required: true },

    subjects: { type: [String], index: true },

    rating: { type: Number, default: 0 },
    totalRatings: { type: Number, default: 0 },

    createdBy: String
  },
  { timestamps: true }
);

export default mongoose.models.Product ||
  mongoose.model("Product", ProductSchema);