'use server';

import dbConnect from '@/lib/db'; // adjust path as needed
import SkillProgress from '@/models/SkillProgress';

export async function getSpacedRepetitionQueue(userId) {
  try {
    await dbConnect();
    const progress = await SkillProgress.findOne({ userId });
    
    if (!progress || !progress.masteredNodes || progress.masteredNodes.length === 0) {
      return { success: true, queue: [] };
    }

    // Set threshold to 14 days ago
    const DECAY_THRESHOLD_DAYS = 14;
    const decayDate = new Date();
    decayDate.setDate(decayDate.getDate() - DECAY_THRESHOLD_DAYS);

    const reviewQueue = [];

    for (const nodeId of progress.masteredNodes) {
      const quizData = progress.quizScores.find(q => q.nodeId === nodeId);
      
      if (quizData && quizData.history && quizData.history.length > 0) {
        // Get the most recent attempt date
        const sortedHistory = quizData.history.sort((a, b) => new Date(b.date) - new Date(a.date));
        const lastAttemptDate = new Date(sortedHistory[0].date);

        // If the last attempt is older than 14 days, flag it
        if (lastAttemptDate < decayDate) {
          const diffTime = Math.abs(new Date() - lastAttemptDate);
          const daysSince = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          
          reviewQueue.push({
            nodeId,
            formattedName: nodeId.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
            daysSince,
            lastScore: sortedHistory[0].score
          });
        }
      }
    }

    // Sort the queue so the most overdue nodes appear first
    reviewQueue.sort((a, b) => b.daysSince - a.daysSince);

    // Return top 5 most urgent nodes
    return { success: true, queue: reviewQueue.slice(0, 5) };
  } catch (error) {
    console.error("Error fetching spaced repetition queue:", error);
    return { success: false, queue: [] };
  }
}