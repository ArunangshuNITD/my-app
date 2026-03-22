"use server";

import connectDB from "@/lib/db"; // Ensure your path is correct
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

  let match = await Match.findOneAndUpdate(
    { 
      status: "waiting", 
      mode, 
      category,
      "player2.userId": null, 
      "player1.userId": { $ne: userId }
    },
    { 
      $set: { 
        "player2.userId": userId, 
        "player2.name": userName, 
        "player2.score": 0,
        "player2.finished": false,
        "player2.responses": []
      } 
    },
    { new: true }
  );

  if (match) return { success: true, matchId: match._id.toString(), isHost: false };

  const questions = await generatePvPQuestions(mode, category);
  if (!questions) return { success: false, message: "Failed to generate arena." };

  match = await Match.create({
    mode,
    category,
    status: "waiting",
    player1: { userId, name: userName, score: 0, finished: false, responses: [] },
    player2: { userId: null, name: null, score: 0, finished: false, responses: [] },
    questions: questions
  });

  return { success: true, matchId: match._id.toString(), isHost: true };
}

// 3. STEP-BY-STEP: Save individual answer to DB (No grading yet)
export async function savePlayerAnswer(matchId, userId, responseObj) {
  await connectDB();
  
  try {
    const match = await Match.findById(matchId);
    if (!match) return { success: false };

    const isPlayer1 = match.player1.userId === userId;
    const playerKey = isPlayer1 ? "player1" : "player2";

    match[playerKey].responses.push({
      questionIndex: responseObj.questionIndex,
      selectedOption: responseObj.selectedOption,
      timeTaken: responseObj.timeTaken,
      isCorrect: false 
    });

    await match.save();
    return { success: true };
  } catch (error) {
    console.error("Error saving answer:", error);
    return { success: false };
  }
}

// 4. SECURE GRADING: Check results and calculate winner only when finished
export async function calculateFinalResults(matchId, userId) {
  await connectDB();

  try {
    const match = await Match.findById(matchId);
    if (!match) return { success: false };

    // Mark the requesting player as finished
    const isPlayer1 = match.player1.userId === userId;
    const playerKey = isPlayer1 ? "player1" : "player2";
    match[playerKey].finished = true;

    // Wait for BOTH players to finish before grading
    if (!match.player1.finished || !match.player2.finished) {
      await match.save();
      return { success: true, matchCompleted: false };
    }

    // Both are finished! Calculate the true results.
    let p1Score = 0;
    let p2Score = 0;

    // Grade Player 1
    match.player1.responses.forEach(res => {
      const actualAnswer = match.questions[res.questionIndex].correctAnswer;
      if (res.selectedOption === actualAnswer) {
        res.isCorrect = true;
        p1Score += 10;
      }
    });

    // Grade Player 2
    match.player2.responses.forEach(res => {
      const actualAnswer = match.questions[res.questionIndex].correctAnswer;
      if (res.selectedOption === actualAnswer) {
        res.isCorrect = true;
        p2Score += 10;
      }
    });

    // Save final scores and declare winner
    match.player1.score = p1Score;
    match.player2.score = p2Score;
    match.status = "completed";

    if (p1Score > p2Score) match.winner = match.player1.userId;
    else if (p2Score > p1Score) match.winner = match.player2.userId;
    else match.winner = "draw";

    await match.save();

    return { 
      success: true, 
      matchCompleted: true,
      finalScore: isPlayer1 ? p1Score : p2Score
    };
  } catch (error) {
    console.error("Error calculating results:", error);
    return { success: false };
  }
}

// 5. Cancel Match
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

// 6. Check Status
export async function checkMatchStatus(matchId) {
  await connectDB();
  const match = await Match.findById(matchId).select('status');
  return match ? match.status : null;
}