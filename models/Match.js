import mongoose from "mongoose";

const MatchSchema = new mongoose.Schema({
  mode: { type: String, enum: ["subject", "exam"], required: true },
  category: { type: String, required: true }, // e.g., "JEE", "NEET", "JEE Physics"
  status: { type: String, enum: ["waiting", "playing", "completed"], default: "waiting" },
  players: [{
    userId: { type: String, required: true }, // You can change to ObjectId if refing User model
    score: { type: Number, default: 0 },
  }],
  questions: [{
    text: String,
    options: [{ id: String, text: String }],
    correctAnswer: String,
    difficulty: String,
    subject: String
  }],
  winner: { type: String, default: null }
}, { timestamps: true });

export default mongoose.models.Match || mongoose.model("Match", MatchSchema);