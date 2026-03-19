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
  `;

  try {
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    const jsonStr = responseText.replace(/```json|```/g, "").trim();
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error("AI Generation failed:", error);
    return null; // Handle fallback in production
  }
}

// 2. Matchmaking Logic
export async function findOrStartMatch(userId, mode, category) {
  await connectDB();

  // Try to find a waiting match with the exact same mode and category
  let match = await Match.findOne({ status: "waiting", mode, category });

  if (match) {
    // Join existing match
    match.players.push({ userId, score: 0 });
    match.status = "playing"; // Game starts!
    await match.save();
    return { success: true, matchId: match._id.toString(), isHost: false };
  } else {
    // Create new match and generate questions
    const questions = await generatePvPQuestions(mode, category);
    if (!questions) return { success: false, message: "Failed to generate arena." };

    match = await Match.create({
      mode,
      category,
      status: "waiting",
      players: [{ userId, score: 0 }],
      questions
    });
    return { success: true, matchId: match._id.toString(), isHost: true };
  }
}
// ... existing findOrStartMatch and AI generation code ...

export async function submitMatchResults(matchId, userId, finalScore) {
  await connectDB();

  try {
    const match = await Match.findById(matchId);
    if (!match) return { success: false, message: "Match not found" };

    // Find the current player and update their score
    const playerIndex = match.players.findIndex(p => p.userId === userId);
    if (playerIndex > -1) {
      match.players[playerIndex].score = finalScore;
    }

    // Check if both players have submitted their final scores
    // (Assuming 2 players max for now)
    const bothPlayersFinished = match.players.every(p => p.score > 0) || match.status === "completed";

    if (bothPlayersFinished) {
      match.status = "completed";
      
      const player1 = match.players[0];
      const player2 = match.players[1];

      // Determine Winner
      if (player1.score > player2.score) {
        match.winner = player1.userId;
      } else if (player2.score > player1.score) {
        match.winner = player2.userId;
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