import mongoose from "mongoose";

const MatchSchema = new mongoose.Schema({
  mode: { type: String, enum: ["subject", "exam"], required: true },
  category: { type: String, required: true }, 
  status: { type: String, enum: ["waiting", "playing", "completed", "cancelled"], default: "waiting" },
  
  // Explicit P1 and P2 objects
  player1: {
    userId: { type: String, required: true },
    name: { type: String, required: true },
    score: { type: Number, default: 0 },
  },
  player2: {
    userId: { type: String, default: null }, // null means waiting for opponent
    name: { type: String, default: null },
    score: { type: Number, default: 0 },
  },
  
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