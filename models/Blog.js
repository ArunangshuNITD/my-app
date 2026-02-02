import mongoose from "mongoose";

// 1. Reply Schema
const ReplySchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true,
    default: "Anonymous"
  },
  email: { type: String, required: true },
  image: { type: String },
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

// Enable Infinite Nesting
ReplySchema.add({
  replies: [ReplySchema] 
});

// 2. Blog Schema
const BlogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    excerpt: { type: String },
    category: { type: String, default: "General" },
    authorName: { type: String, required: true },
    authorEmail: { type: String, required: true },
    authorImage: { type: String },
    status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
    
    tags: { type: [String], default: [], index: true },
    upvotes: [{ type: String }],

    comments: [
      {
        name: { 
          type: String, 
          required: true,
          default: "Anonymous"
        },
        email: { type: String, required: true },
        image: { type: String },
        text: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
        replies: [ReplySchema], 
      },
    ],
  },
  { timestamps: true }
);

// ✅ FIXED HOOK: Removed 'next' parameter and 'next()' call
BlogSchema.pre("save", async function () {
  if (this.isModified("title") || this.isModified("content")) {
      const textToScan = `${this.title} ${this.content}`;
      const hashtagRegex = /#[a-z0-9_]+/gi;
      const foundTags = textToScan.match(hashtagRegex) || [];
      this.tags = [...new Set(foundTags.map((tag) => tag.toLowerCase().slice(1)))];
  }
  // No next() needed here because it is async
});

export default mongoose.models.Blog || mongoose.model("Blog", BlogSchema);