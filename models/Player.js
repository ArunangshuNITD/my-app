import mongoose from "mongoose";

const PlayerSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  totalPoints: { type: Number, default: 0 },
  wins: { type: Number, default: 0 },
  losses: { type: Number, default: 0 },
  draws: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.models.Player || mongoose.model("Player", PlayerSchema);