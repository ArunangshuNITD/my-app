"use server";

import connectDB from "@/lib/db";
import Match from "@/models/Match";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// 1. Generate Questions dynamically based on Mode
async function generatePvPQuestions(mode, category) {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
  
  let promptContext = "";
  if (mode === "exam") {
    promptContext = `Generate a balanced mix of 7 questions for the entire ${category} syllabus (Physics, Chemistry, and Math/Biology).`;
  } else {
    promptContext = `Generate 7 questions specifically for ${category}. Focus strictly on this subject.`;
  }

  const prompt = `
    You are an expert examiner for Indian competitive exams.
    ${promptContext}
    Provide 2 Easy, 3 Medium, and 2 Hard questions.
    
    Return ONLY a raw JSON array of objects (no markdown, no backticks). Structure each object exactly like this:
    [
      {
        "text": "Question text here",
        "subject": "Physics/Chemistry/Math/Biology",
        "difficulty": "easy/medium/hard",
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

// 2. FIXED Matchmaking Logic
export async function findOrStartMatch(userId, userName, mode, category) {
  await connectDB();

  // 1. Atomically try to join an existing waiting match.
  let match = await Match.findOneAndUpdate(
    { 
      status: "waiting", 
      mode, 
      category,
      "player2.userId": null, 
      "player1.userId": { $ne: userId } // Prevent joining your own match
    },
    { 
      $set: { player2: { userId, name: userName, score: 0 } }
    },
    { new: true }
  );

  if (match) {
    // Successfully joined an existing match!
    return { success: true, matchId: match._id.toString(), isHost: false };
  }

  // 2. If no match is found, generate the questions FIRST
  const questions = await generatePvPQuestions(mode, category);
  
  if (!questions) {
    return { success: false, message: "Failed to generate arena." };
  }

  // 3. Create the match with the generated questions ready to go
  match = await Match.create({
    mode,
    category,
    status: "waiting",
    player1: { userId, name: userName, score: 0 },
    player2: { userId: null, name: null, score: 0 }, // Waiting for P2
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

    // Update the correct player's score
    if (match.player1.userId === userId) {
        match.player1.score = finalScore;
    } else if (match.player2.userId === userId) {
        match.player2.score = finalScore;
    }

    // Since we don't have a strict "completed" flag per player yet, 
    // we'll assume the match ends when both have scores > 0, or just let the DB record it.
    // For a robust system, you might want to add a `finished: boolean` to the player object later.
    const p1Finished = match.player1.score > 0 || finalScore === 0; // Simple fallback
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
      return { success: true, message: "Match cancelled due to timeout." };
    }
    
    return { success: false, message: "Match already started or not found." };
  } catch (error) {
    console.error("Failed to cancel match:", error);
    return { success: false, message: "Server error." };
  }
}

// 5. Check Status
export async function checkMatchStatus(matchId) {
  await connectDB();
  const match = await Match.findById(matchId).select('status');
  return match ? match.status : null;
}