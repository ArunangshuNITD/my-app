import mongoose from "mongoose";

const ConversationSchema = new mongoose.Schema(
  {
    participants: [{ type: String, required: true }], // Array of emails (e.g., student@email.com, mentor@email.com)
    participantNames: [{ type: String }], // Optional: Cache names for faster inbox loading
    participantImages: [{ type: String }], // Optional: Cache images
    lastMessage: { type: String },
    lastMessageAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.models.Conversation || mongoose.model("Conversation", ConversationSchema);