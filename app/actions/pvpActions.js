// app/actions/pvpActions.js
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
export async function findOrStartMatch(userId, mode, category) {
  await connectDB();

  // 1. Atomically try to join an existing waiting match.
  // The "$ne: userId" ensures a player doesn't join a match they created.
  let match = await Match.findOneAndUpdate(
    { 
      status: "waiting", 
      mode, 
      category,
      "players.userId": { $ne: userId } 
    },
    { 
      $push: { players: { userId, score: 0 } },
      $set: { status: "playing" } // Game starts!
    },
    { new: true }
  );

  if (match) {
    // Successfully joined an existing match!
    return { success: true, matchId: match._id.toString(), isHost: false };
  }

  // 2. If no match is found, CREATE the match FIRST so it exists in the DB.
  match = await Match.create({
    mode,
    category,
    status: "waiting",
    players: [{ userId, score: 0 }],
    questions: [] // Empty for now, we'll fill this in after creation
  });

  // 3. NOW generate the questions (while the match is visible to Player 2)
  const questions = await generatePvPQuestions(mode, category);
  
  if (!questions) {
    // If AI fails, delete the empty match so it doesn't get stuck
    await Match.findByIdAndDelete(match._id);
    return { success: false, message: "Failed to generate arena." };
  }

  // 4. Update the match with the generated questions
  match.questions = questions;
  await match.save();

  return { success: true, matchId: match._id.toString(), isHost: true };
}

// 3. Submit Results
export async function submitMatchResults(matchId, userId, finalScore) {
  await connectDB();

  try {
    const match = await Match.findById(matchId);
    if (!match) return { success: false, message: "Match not found" };

    const playerIndex = match.players.findIndex(p => p.userId === userId);
    if (playerIndex > -1) {
      match.players[playerIndex].score = finalScore;
    }

    const bothPlayersFinished = match.players.every(p => p.score > 0) || match.status === "completed";

    if (bothPlayersFinished) {
      match.status = "completed";
      
      const player1 = match.players[0];
      const player2 = match.players[1];

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