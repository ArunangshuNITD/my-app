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
    let progress = await SkillProgress.findOne({ userId });

    if (!progress) {
      progress = new SkillProgress({
        userId,
        masteredNodes: [],
        badges: [], // Ensure badges array is initialized
        quizScores: [],
        subjectAnalytics: {}
      });
    }

    const newlyUnlockedBadges = [];

    // Add node to mastered if threshold is passed and not already there
    if (passedThreshold && !progress.masteredNodes.includes(nodeId)) {
      progress.masteredNodes.push(nodeId);

      // --- BADGE EVALUATION LOGIC ---
      if (!progress.badges) progress.badges = [];

      const award = (badgeId) => {
        if (!progress.badges.includes(badgeId)) {
          progress.badges.push(badgeId);
          newlyUnlockedBadges.push(badgeId);
        }
      };

      // 1. Count current mastery levels based on ID prefixes
      const jpCount = progress.masteredNodes.filter(id => id.includes('jee_phys')).length;
      const jcCount = progress.masteredNodes.filter(id => id.includes('jee_chem')).length;
      const jmCount = progress.masteredNodes.filter(id => id.includes('jee_math')).length;
      const npCount = progress.masteredNodes.filter(id => id.includes('neet_phys')).length;
      const ncCount = progress.masteredNodes.filter(id => id.includes('neet_chem')).length;
      const nbCount = progress.masteredNodes.filter(id => id.includes('neet_bio')).length;
      const totalNodes = progress.masteredNodes.length;

      // Platform Badges
      if (totalNodes === 1) award('first_blood');

      // --- JEE Physics ---
      if (jpCount >= 1) award('jee_phys_newbie');
      if (jpCount >= 5) award('jee_phys_amateur');
      if (jpCount >= 10) award('jee_phys_pro');
      if (jpCount >= 25) award('jee_phys_knight');

      // --- JEE Chemistry ---
      if (jcCount >= 1) award('jee_chem_newbie');
      if (jcCount >= 5) award('jee_chem_amateur');
      if (jcCount >= 10) award('jee_chem_pro');
      if (jcCount >= 25) award('jee_chem_knight');

      // --- JEE Maths ---
      if (jmCount >= 1) award('jee_math_newbie');
      if (jmCount >= 5) award('jee_math_amateur');
      if (jmCount >= 10) award('jee_math_pro');
      if (jmCount >= 25) award('jee_math_knight');

      // --- NEET Physics ---
      if (npCount >= 1) award('neet_phys_newbie');
      if (npCount >= 5) award('neet_phys_amateur');
      if (npCount >= 10) award('neet_phys_pro');
      if (npCount >= 25) award('neet_phys_knight');

      // --- NEET Chemistry ---
      if (ncCount >= 1) award('neet_chem_newbie');
      if (ncCount >= 5) award('neet_chem_amateur');
      if (ncCount >= 10) award('neet_chem_pro');
      if (ncCount >= 25) award('neet_chem_knight');

      // --- NEET Biology ---
      if (nbCount >= 1) award('neet_bio_newbie');
      if (nbCount >= 5) award('neet_bio_amateur');
      if (nbCount >= 10) award('neet_bio_pro');
      if (nbCount >= 25) award('neet_bio_knight');
    }

    // --- History & Score Tracking ---
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
    progress.markModified('badges');

    // --- Subject Analytics ---
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
    
    // Return newlyUnlockedBadges so the frontend can trigger the popup
    return { 
      success: true, 
      message: "Node Update Successful!",
      newBadges: newlyUnlockedBadges 
    };
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
      model: "gemini-2.5-flash-lite", 
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