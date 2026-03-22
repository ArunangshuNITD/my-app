import mongoose from "mongoose";

// Tracks how a player answered each specific question
const ResponseSchema = new mongoose.Schema({
  questionIndex: Number,
  selectedOption: { type: String, default: null }, // null means time ran out
  timeTaken: Number,
  isCorrect: { type: Boolean, default: false } // Graded later
}, { _id: false });

// Define a strict sub-schema for players
const PlayerSchema = new mongoose.Schema({
  userId: { type: String, default: null },
  name: { type: String, default: null },
  score: { type: Number, default: 0 },
  finished: { type: Boolean, default: false }, // Did they finish all questions?
  responses: [ResponseSchema] // Store their answers here securely
}, { _id: false });

// Define the Question sub-schema
const QuestionSchema = new mongoose.Schema({
  text: String,
  options: [{ id: String, text: String, _id: false }],
  correctAnswer: String,
  difficulty: String,
  subject: String
}, { _id: false });

const MatchSchema = new mongoose.Schema({
  mode: { type: String, enum: ["subject", "exam"], required: true },
  category: { type: String, required: true }, 
  status: { type: String, enum: ["waiting", "playing", "completed", "cancelled"], default: "waiting" },
  
  // Use the strict sub-schemas
  player1: { type: PlayerSchema, required: true },
  player2: { type: PlayerSchema, default: () => ({ userId: null, name: null, score: 0, finished: false, responses: [] }) },
  
  questions: [QuestionSchema],
  
  winner: { type: String, default: null }
}, { timestamps: true });

export default mongoose.models.Match || mongoose.model("Match", MatchSchema);