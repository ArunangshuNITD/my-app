'use server'

import dbConnect from '@/lib/db';
import SkillProgress from '@/models/SkillProgress';
import { revalidatePath } from 'next/cache';
import { GoogleGenerativeAI } from '@google/generative-ai'; 

// ==========================================
// 1. Fetch user's current progress
// ==========================================
export async function getUserProgress(userId) {
  await dbConnect();
  try {
    const progress = await SkillProgress.findOne({ userId });
    return progress ? JSON.parse(JSON.stringify(progress)) : null; 
  } catch (error) {
    console.error("Error fetching progress:", error);
    return null;
  }
}

// ==========================================
// 2. Submit quiz and unlock node
// ==========================================
export async function submitNodeQuiz(userId, nodeId, score, passedThreshold, stats, subject) {
  await dbConnect();
  try {
    // You can remove this threshold block if you want fails to register in the history.
    // If you keep this here, only passing grades update the DB. I'm modifying it slightly
    // to always record the attempt so users can see their failed tries in the history graph too.
    
    let progress = await SkillProgress.findOne({ userId });

    if (!progress) {
      progress = new SkillProgress({
        userId,
        masteredNodes: [],
        quizScores: [],
        subjectAnalytics: {}
      });
    }

    // Add node to mastered if threshold is passed and not already there
    if (passedThreshold && !progress.masteredNodes.includes(nodeId)) {
      progress.masteredNodes.push(nodeId);
    }

    // Define the new history entry
    const newHistoryEntry = {
      score,
      date: new Date().toISOString()
    };

    const existingScoreIndex = progress.quizScores.findIndex(q => q.nodeId === nodeId);
    
    if (existingScoreIndex >= 0) {
      // Reattempt logic
      progress.quizScores[existingScoreIndex].attempts = (progress.quizScores[existingScoreIndex].attempts || 1) + 1;
      
      // Update max score if needed
      if (score > progress.quizScores[existingScoreIndex].score) {
        progress.quizScores[existingScoreIndex].score = score;
      }
      
      // Push into history array for the graph
      if (!progress.quizScores[existingScoreIndex].history) {
        progress.quizScores[existingScoreIndex].history = [];
      }
      progress.quizScores[existingScoreIndex].history.push(newHistoryEntry);
    } else {
      // First attempt
      progress.quizScores.push({ 
        nodeId, 
        score, 
        attempts: 1,
        history: [newHistoryEntry]
      });
    }

    // Since we are pushing to a potentially nested mixed array, it's good practice to mark it modified
    progress.markModified('quizScores');

    // Update Subject Analytics
    let currentSubjectStats = progress.subjectAnalytics.get(subject);
    if (!currentSubjectStats) {
      currentSubjectStats = {
        totalAttempted: 0, totalCorrect: 0,
        easy: { attempted: 0, correct: 0 },
        medium: { attempted: 0, correct: 0 },
        hard: { attempted: 0, correct: 0 }
      };
    }

    const totalAttemptedForQuiz = stats.easy.attempted + stats.medium.attempted + stats.hard.attempted;
    const totalCorrectForQuiz = stats.easy.correct + stats.medium.correct + stats.hard.correct;

    currentSubjectStats.totalAttempted += totalAttemptedForQuiz;
    currentSubjectStats.totalCorrect += totalCorrectForQuiz;
    
    ['easy', 'medium', 'hard'].forEach(diff => {
      currentSubjectStats[diff].attempted += stats[diff].attempted;
      currentSubjectStats[diff].correct += stats[diff].correct;
    });

    progress.subjectAnalytics.set(subject, currentSubjectStats);
    await progress.save();

    revalidatePath('/journey'); 
    return { success: true, message: "Node Update Successful!" };
  } catch (error) {
    console.error("Error updating progress:", error);
    return { success: false, message: "Server error" };
  }
}

// ==========================================
// 3. Generate Dynamic Quiz via Gemini AI
// ==========================================
export async function generateDynamicQuiz(topicName, topicDescription) {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash", 
      generationConfig: {
        responseMimeType: "application/json", 
        temperature: 0.7,
      }
    });

    const prompt = `
      You are an expert JEE Physics/Math/Chemistry examiner. 
      Create a multiple-choice quiz on the topic: "${topicName}".
      Context: ${topicDescription}

      You MUST generate exactly 11 questions with this exact difficulty distribution:
      - 5 "easy" questions (basic formula application, definitions)
      - 3 "medium" questions (multi-step problems, combining concepts)
      - 3 "hard" questions (JEE Advanced level, tricky, conceptual depth)

      Return an array of objects. Each object must perfectly match this structure:
      [
        {
          "id": "q1",
          "difficulty": "easy",
          "text": "Question text here?",
          "options": [
            { "id": "a", "text": "Option A" },
            { "id": "b", "text": "Option B" },
            { "id": "c", "text": "Option C" },
            { "id": "d", "text": "Option D" }
          ],
          "correctAnswer": "c"
        }
      ]
    `;

    console.log(`🤖 Summoning Gemini to generate quiz for: ${topicName}...`);

    const result = await model.generateContent(prompt);
    const textResult = result.response.text();
    
    const questions = JSON.parse(textResult);
    
    return { success: true, questions };
  } catch (error) {
    console.error("Error generating quiz:", error);
    return { success: false, message: "Failed to generate questions. Please try again." };
  }
}