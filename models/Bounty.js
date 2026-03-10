import mongoose from "mongoose";

const bountySchema = new mongoose.Schema({
  question: { type: String, required: true },
  subject: { type: String, required: true },
  amount: { type: Number, required: true },
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
  upvotes: { type: [String], default: [] }, // MUST be defined
}, { timestamps: true });

export default mongoose.models.Bounty || mongoose.model("Bounty", bountySchema);