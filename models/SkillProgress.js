import mongoose from 'mongoose';

const SkillProgressSchema = new mongoose.Schema({
  userId: { 
    type: String, 
    required: true 
  },
  masteredNodes: [{ 
    type: String 
  }],
  quizScores: [{
    nodeId: String,
    score: Number,
    attempts: Number
  }],
  // NEW: Store aggregate analytics per subject (e.g., "physics", "chemistry")
  subjectAnalytics: {
    type: Map,
    of: {
      totalAttempted: { type: Number, default: 0 },
      totalCorrect: { type: Number, default: 0 },
      easy: { attempted: { type: Number, default: 0 }, correct: { type: Number, default: 0 } },
      medium: { attempted: { type: Number, default: 0 }, correct: { type: Number, default: 0 } },
      hard: { attempted: { type: Number, default: 0 }, correct: { type: Number, default: 0 } },
    },
    default: {}
  }
}, { timestamps: true });

export default mongoose.models.SkillProgress || mongoose.model('SkillProgress', SkillProgressSchema);