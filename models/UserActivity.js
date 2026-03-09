// models/UserActivity.js
import mongoose from "mongoose";

const UserActivitySchema = new mongoose.Schema({
  // We use email as the unique identifier since it comes from your auth session
  userEmail: { 
    type: String, 
    required: true, 
    unique: true 
  },
  activeDates: { 
    type: [String], 
    default: [] 
  }
});

export default mongoose.models.UserActivity || mongoose.model("UserActivity", UserActivitySchema);