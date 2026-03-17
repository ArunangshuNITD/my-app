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
    attempts: Number,
    history: [{
      score: Number,
      date: Date
    }]
  }],
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
  },
  roadmap: {
    generatedAt: Date,
    days: [{
      day: Number,
      title: String,
      tasks: [{
        id: String,
        text: String,
        completed: { type: Boolean, default: false }
      }]
    }]
  }
}, { timestamps: true });

export default mongoose.models.SkillProgress || mongoose.model('SkillProgress', SkillProgressSchema);