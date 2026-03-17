'use server'

import dbConnect from '@/lib/db'; // Adjust path if your db config is named differently
import SkillProgress from '@/models/SkillProgress';
import { revalidatePath } from 'next/cache';
import { GoogleGenerativeAI } from '@google/generative-ai';

// ==========================================
// 1. Generate 7-Day Plan via Gemini AI
// ==========================================
export async function generateStudyRoadmap(userId, examType) {
  await dbConnect();
  try {
    const progress = await SkillProgress.findOne({ userId });
    if (!progress) return { success: false, message: "No progress found." };

    const mastered = progress.masteredNodes.join(', ') || "None";
    const scores = progress.quizScores.map(q => `${q.nodeId}: ${q.score}% (Attempts: ${q.attempts})`).join('\n') || "No quizzes taken yet.";

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash", 
      generationConfig: {
        responseMimeType: "application/json", 
        temperature: 0.7,
      }
    });

    const prompt = `
      You are an expert ${examType || 'exam'} tutor. Analyze the student's progress and create a 7-day study plan.
      
      Mastered Concepts: ${mastered}
      Recent Performance:
      ${scores}

      Rules for the plan:
      1. If the student has high attempts but low accuracy (< 70%) on certain nodes, focus the upcoming days on mastering those weak points.
      2. If all attempted nodes are cleared/mastered with high accuracy, generate a revision and advanced practice pattern.
      3. Create exactly 7 days of tasks.
      
      Return ONLY a JSON object matching this exact structure:
      {
        "days": [
          {
            "day": 1,
            "title": "Day Focus Title",
            "tasks": [
              { "id": "unique_string_id_1", "text": "Task description", "completed": false },
              { "id": "unique_string_id_2", "text": "Task description", "completed": false }
            ]
          }
        ]
      }
    `;

    console.log(`🤖 Generating 7-day ${examType} roadmap for user...`);
    const result = await model.generateContent(prompt);
    let textResult = result.response.text();
    
    // SAFETY: Strip potential markdown wrapping from Gemini output (e.g. ```json ... ```)
    textResult = textResult.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
    const roadmapData = JSON.parse(textResult);

    // Save to database
    progress.roadmap = {
      generatedAt: new Date(),
      days: roadmapData.days
    };
    
    await progress.save();
    revalidatePath('/journey'); // Ensure the UI refreshes with the new DB data
    
    return { success: true, roadmap: progress.roadmap };
  } catch (error) {
    console.error("Error generating roadmap:", error);
    return { success: false, message: "Failed to generate roadmap." };
  }
}

// ==========================================
// 2. Toggle Task Completion
// ==========================================
export async function toggleRoadmapTask(userId, dayIndex, taskId, isCompleted) {
  await dbConnect();
  try {
    const progress = await SkillProgress.findOne({ userId });
    if (!progress || !progress.roadmap) return { success: false };

    const day = progress.roadmap.days[dayIndex];
    const task = day.tasks.find(t => t.id === taskId);
    if (task) {
      task.completed = isCompleted;
      progress.markModified('roadmap'); // Crucial for nested array mutations in Mongoose
      await progress.save();
      revalidatePath('/journey');
      return { success: true };
    }
    return { success: false };
  } catch (error) {
    console.error("Error toggling task:", error);
    return { success: false };
  }
}

// ==========================================
// 3. Delete Roadmap
// ==========================================
export async function deleteRoadmap(userId) {
  await dbConnect();
  try {
    const progress = await SkillProgress.findOne({ userId });
    if (progress) {
      progress.roadmap = undefined;
      await progress.save();
      revalidatePath('/journey');
      return { success: true };
    }
  } catch (error) {
    console.error("Error deleting roadmap:", error);
    return { success: false };
  }
}