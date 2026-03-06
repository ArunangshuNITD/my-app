import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema(
  {
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
    },
    senderEmail: { type: String, required: true },
    text: { type: String, default: "" }, // Made optional (default empty string)
    fileUrl: { type: String, default: null }, // Link to Cloudinary
    fileType: { 
      type: String, 
      enum: ["image", "video", "audio", "pdf", "document", null], 
      default: null 
    },
    fileName: { type: String, default: null }, // e.g., "homework.pdf"
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.models.Message || mongoose.model("Message", MessageSchema);