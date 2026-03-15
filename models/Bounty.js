import mongoose from "mongoose";

const bountySchema = new mongoose.Schema({
  question: { type: String, required: true },
  subject: { type: String, required: true },
  amount: { type: Number, required: true },
  // --- NEW FIELDS FOR SURGE ---
  maxBudget: { type: Number }, // The maximum the student will pay
  deadline: { type: Date },    // The urgency timer
  finalPrice: { type: Number }, // Locks in the actual paid price upon claim
  // ----------------------------
  student: { type: String, required: true },
  contributors: [
    {
      user: { type: String, required: true },
      amount: { type: Number, required: true },
    }
  ],
  solver: { type: String },
  status: { type: String, default: 'open' },
  solutionText: { type: String },
  solutionLink: { type: String },
  upvotes: { type: [String], default: [] },
}, { timestamps: true });

export default mongoose.models.Bounty || mongoose.model("Bounty", bountySchema);