"use server";

import connectDB from "@/lib/db";
import Match from "@/models/Match";
import Player from "@/models/Player"; 
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function generatePvPQuestions(mode, category) {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
  let promptContext = mode === "exam" 
    ? `Generate a balanced mix of 7 questions for the entire ${category} syllabus, PLUS 1 extremely hard sudden-death tie-breaker question.`
    : `Generate 7 questions specifically for ${category}. Focus strictly on this subject, PLUS 1 extremely hard sudden-death tie-breaker question.`;

  const prompt = `
    You are an expert examiner for Indian competitive exams.
    ${promptContext}
    Provide 2 Easy, 3 Medium, and 2 Hard questions for the main set. The 8th question MUST be "hard" difficulty and have "Tie-Breaker" as the subject.
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
    const jsonStr = result.response.text().replace(/```json|```/g, "").trim();
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error("Failed to generate questions:", error);
    return null; 
  }
}

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

export async function savePlayerAnswer(matchId, userId, responseObj) {
  await connectDB();
  try {
    const match = await Match.findById(matchId);
    if (!match) return;
    
    const isPlayer1 = match.player1.userId === userId;
    const playerKey = isPlayer1 ? "player1" : "player2";

    match[playerKey].responses.push({
      questionIndex: responseObj.questionIndex,
      selectedOption: responseObj.selectedOption,
      timeTaken: responseObj.timeTaken,
      pointsEarned: responseObj.pointsEarned || 0,
      isCorrect: responseObj.pointsEarned > 0
    });

    match.markModified(playerKey);
    await match.save();
  } catch (error) {
    console.error("Error saving answer:", error);
  }
}

// NEW FUNCTION: Added to fix Vercel Build Error
export async function handleSuddenDeathAnswer(matchId, userId, responseObj) {
  await connectDB();
  try {
    const match = await Match.findById(matchId);
    if (!match) return { success: false };
    
    const isPlayer1 = match.player1.userId === userId;
    const playerKey = isPlayer1 ? "player1" : "player2";

    match[playerKey].responses.push({
      questionIndex: responseObj.questionIndex || 7, // Index 7 is the 8th question (Tie-Breaker)
      selectedOption: responseObj.selectedOption,
      timeTaken: responseObj.timeTaken,
      pointsEarned: responseObj.pointsEarned || 0,
      isCorrect: responseObj.pointsEarned > 0,
      isSuddenDeath: true 
    });

    match.markModified(playerKey);
    await match.save();
    return { success: true };
  } catch (error) {
    console.error("Error saving sudden death answer:", error);
    return { success: false };
  }
}

export async function submitMatchResults(matchId, userId, clientReportedScore) {
  await connectDB();
  try {
    const tempMatch = await Match.findById(matchId).select("player1.userId");
    if (!tempMatch) return { success: false };

    const isPlayer1 = tempMatch.player1.userId === userId;
    const playerKey = isPlayer1 ? "player1" : "player2";

    const match = await Match.findOneAndUpdate(
      { _id: matchId },
      {
        $set: {
          [`${playerKey}.finished`]: true,
          [`${playerKey}.score`]: clientReportedScore
        }
      },
      { new: true } 
    );

    if (match.player1.finished && match.player2.finished && match.status !== "completed") {
      
      const finalMatch = await Match.findOneAndUpdate(
        { _id: matchId, status: { $ne: "completed" } },
        { $set: { status: "completed" } },
        { new: true }
      );

      if (finalMatch) {
        let p1Score = 0; let p2Score = 0;

        // Tally scores directly from the pointsEarned property. 
        // This implicitly handles Combos, Double Jeopardy, and Sudden Death penalties without complex server logic.
        finalMatch.player1.responses.forEach(res => { p1Score += res.pointsEarned || 0; });
        finalMatch.player2.responses.forEach(res => { p2Score += res.pointsEarned || 0; });

        finalMatch.player1.score = p1Score;
        finalMatch.player2.score = p2Score;

        if (p1Score > p2Score) finalMatch.winner = finalMatch.player1.userId;
        else if (p2Score > p1Score) finalMatch.winner = finalMatch.player2.userId;
        else finalMatch.winner = "draw";

        // Mark paths as modified just in case embedded sub-documents didn't trigger
        finalMatch.markModified('player1');
        finalMatch.markModified('player2');
        await finalMatch.save();
        
        await awardMatchPoints(finalMatch, p1Score, p2Score);

        return { success: true, isComplete: true, match: JSON.parse(JSON.stringify(finalMatch)) };
      } else {
        const completedMatch = await Match.findById(matchId);
        return { success: true, isComplete: true, match: JSON.parse(JSON.stringify(completedMatch)) };
      }
    }

    return { success: true, isComplete: false };
    
  } catch (error) {
    console.error("Failed to submit match results:", error);
    return { success: false };
  }
}

export async function cancelMatch(matchId) {
  await connectDB();
  try {
    const match = await Match.findById(matchId);
    if (match && match.status === "waiting") {
      match.status = "cancelled"; 
      await match.save();
      return { success: true, message: "Match cancelled." };
    }
    return { success: false, message: "Match could not be cancelled." };
  } catch (error) { 
    console.error("Error cancelling match:", error);
    return { success: false }; 
  }
}

async function awardMatchPoints(match, p1Score, p2Score) {
  try {
    if (match.pointsAwarded) return;

    const winPoints = 50; const lossPoints = 10; const drawPoints = 25;
    let p1Points = drawPoints; let p2Points = drawPoints;
    let p1Result = "draws"; let p2Result = "draws";

    if (match.winner === match.player1.userId) {
      p1Points = winPoints; p2Points = lossPoints;
      p1Result = "wins"; p2Result = "losses";
    } else if (match.winner === match.player2.userId) {
      p1Points = lossPoints; p2Points = winPoints;
      p1Result = "losses"; p2Result = "wins";
    }

    await Player.findOneAndUpdate(
      { userId: match.player1.userId },
      { 
        $set: { name: match.player1.name },
        $inc: { totalPoints: p1Points, [p1Result]: 1 }
      },
      { upsert: true, new: true }
    );

    if (match.player2.userId) {
      await Player.findOneAndUpdate(
        { userId: match.player2.userId },
        { 
          $set: { name: match.player2.name },
          $inc: { totalPoints: p2Points, [p2Result]: 1 }
        },
        { upsert: true, new: true }
      );
    }

    match.pointsAwarded = true;
    await match.save();
  } catch (error) {
    console.error("Failed to award points:", error);
  }
}

export async function getLeaderboard(limit = 10) {
  await connectDB();
  try {
    const players = await Player.find()
      .sort({ totalPoints: -1 })
      .limit(limit)
      .lean();
    
    return { success: true, data: JSON.parse(JSON.stringify(players)) };
  } catch (error) {
    console.error("Failed to fetch leaderboard:", error);
    return { success: false, data: [] };
  }
}