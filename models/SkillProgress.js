import mongoose from 'mongoose';

const SkillProgressSchema = new mongoose.Schema({
  userId: { 
    type: String, // <--- CHANGED: Now accepts the UUID string from NextAuth
    required: true 
  },
  // We only need to store the IDs of nodes they have successfully passed
  masteredNodes: [{ 
    type: String // e.g., "jee_phy_mech_kinematics"
  }],
  // Optional: Track specific quiz scores if mentors need them
  quizScores: [{
    nodeId: String,
    score: Number,
    attempts: Number
  }]
}, { timestamps: true });

export default mongoose.models.SkillProgress || mongoose.model('SkillProgress', SkillProgressSchema);