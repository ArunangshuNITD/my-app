"use server";

import connectDB from "@/lib/db";
import Match from "@/models/Match";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// 1. Generate Questions dynamically
async function generatePvPQuestions(mode, category) {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
  
  let promptContext = mode === "exam" 
    ? `Generate a balanced mix of 7 questions for the entire ${category} syllabus (Physics, Chemistry, and Math/Biology).`
    : `Generate 7 questions specifically for ${category}. Focus strictly on this subject.`;

  const prompt = `
    You are an expert examiner for Indian competitive exams.
    ${promptContext}
    Provide 2 Easy, 3 Medium, and 2 Hard questions.
    
    Return ONLY a raw JSON array of objects (no markdown, no backticks). Structure exactly like this:
    [
      {
        "text": "Question text here",
        "subject": "Physics",
        "difficulty": "easy",
        "options": [
          {"id": "A", "text": "Option 1"},
          {"id": "B", "text": "Option 2"},
          {"id": "C", "text": "Option 3"},
          {"id": "D", "text": "Option 4"}
        ],
        "correctAnswer": "A"
      }
    ]
  `;

  try {
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    const jsonStr = responseText.replace(/```json|```/g, "").trim();
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error("AI Generation failed:", error);
    return null; 
  }
}

// 2. Matchmaking Logic
export async function findOrStartMatch(userId, userName, mode, category) {
  await connectDB();

  // Atomically try to join an existing waiting match.
  let match = await Match.findOneAndUpdate(
    { 
      status: "waiting", 
      mode, 
      category,
      "player2.userId": null, 
      "player1.userId": { $ne: userId } // Prevent joining your own match
    },
    { 
      $set: { 
        "player2.userId": userId, 
        "player2.name": userName, 
        "player2.score": 0 
      } 
    },
    { new: true }
  );

  if (match) {
    return { success: true, matchId: match._id.toString(), isHost: false };
  }

  // Generate questions if no match found
  const questions = await generatePvPQuestions(mode, category);
  
  if (!questions) {
    return { success: false, message: "Failed to generate arena." };
  }

  // Create new match
  match = await Match.create({
    mode,
    category,
    status: "waiting",
    player1: { userId, name: userName, score: 0 },
    player2: { userId: null, name: null, score: 0 },
    questions: questions
  });

  return { success: true, matchId: match._id.toString(), isHost: true };
}

// 3. Submit Results
export async function submitMatchResults(matchId, userId, finalScore) {
  await connectDB();

  try {
    const match = await Match.findById(matchId);
    if (!match) return { success: false, message: "Match not found" };

    // Update specific player
    if (match.player1.userId === userId) {
        match.player1.score = finalScore;
    } else if (match.player2.userId === userId) {
        match.player2.score = finalScore;
    }

    const p1Finished = match.player1.score > 0 || finalScore === 0;
    const p2Finished = match.player2.score > 0;

    if (p1Finished && p2Finished && match.status !== "completed") {
      match.status = "completed";
      
      if (match.player1.score > match.player2.score) {
        match.winner = match.player1.userId;
      } else if (match.player2.score > match.player1.score) {
        match.winner = match.player2.userId;
      } else {
        match.winner = "draw";
      }
    }

    // Force Mongoose to recognize the nested update
    match.markModified('player1');
    match.markModified('player2');
    
    await match.save();
    return { success: true, winner: match.winner };
    
  } catch (error) {
    console.error("Error saving match results:", error);
    return { success: false, message: "Failed to record results" };
  }
}

// 4. Cancel Match
export async function cancelMatch(matchId) {
  await connectDB();
  try {
    const match = await Match.findById(matchId);
    if (match && match.status === "waiting") {
      match.status = "cancelled";
      await match.save();
      return { success: true, message: "Match cancelled." };
    }
    return { success: false, message: "Match started or not found." };
  } catch (error) {
    return { success: false, message: "Server error." };
  }
}

// 5. Check Status
export async function checkMatchStatus(matchId) {
  await connectDB();
  const match = await Match.findById(matchId).select('status');
  return match ? match.status : null;
}