"use server";

import Mentor from "@/models/Mentor"; // Adjust path to your Mentor model
import Blog from "@/models/Blog";     // Adjust path to your Blog model
import { GoogleGenerativeAI } from "@google/generative-ai";
import connectDB from "@/lib/db";     // Adjust path to your DB connection

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function getSmartResults(userQuery) {
  await connectDB();

  try {
    // --- 1. AI ANALYSIS STEP ---
    // We ask AI to convert "I suck at rotation mechanics for JEE" 
    // into structured data: { domain: "JEE", keywords: ["Physics", "Rotation", "Mechanics"] }
    
    let aiFilter = {
      domain: null,
      keywords: userQuery.split(" "), // Fallback
    };

    if (process.env.GEMINI_API_KEY) {
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
      const prompt = `
        Analyze this student query: "${userQuery}".
        Return ONLY a JSON object with these fields:
        - "domain": The exam name if mentioned or implied (e.g., JEE, NEET, GATE, UPSC, CAT). If unclear, use null.
        - "keywords": An array of 3-5 technical keywords related to the subject/topic (e.g., "Physics", "Thermodynamics").
        - "intent": "mentorship" or "learning".
      `;

      try {
        const result = await model.generateContent(prompt);
        const responseText = result.response.text();
        // Clean markdown code blocks if AI adds them
        const jsonStr = responseText.replace(/```json|```/g, "").trim();
        aiFilter = JSON.parse(jsonStr);
      } catch (error) {
        console.error("AI Parsing failed, falling back to basic search", error);
      }
    }

    // --- 2. BUILD DB QUERIES ---
    
    const mentorQuery = {};
    const blogQuery = {};

    // Filter Mentors by Domain (if AI found one)
    if (aiFilter.domain) {
      mentorQuery.domain = { $regex: aiFilter.domain, $options: "i" };
      blogQuery.category = { $regex: aiFilter.domain, $options: "i" };
    }

    // Filter by Keywords (Search in Bio/Name/Tags)
    // We create an $or array to match ANY of the keywords
    if (aiFilter.keywords && aiFilter.keywords.length > 0) {
      const keywordRegex = aiFilter.keywords.map(k => ({ 
        $regex: k, 
        $options: "i" 
      }));
      
      mentorQuery.$or = [
        { bio: { $in: keywordRegex } },
        { expertise: { $in: keywordRegex } }, // Assuming you have an expertise array
        { name: { $in: keywordRegex } }
      ];

      blogQuery.$or = [
        { title: { $in: keywordRegex } },
        { content: { $in: keywordRegex } },
        { tags: { $in: keywordRegex } }
      ];
    }

    // --- 3. FETCH DATA ---
    // Fetch Mentors (prioritize high ratings)
    const mentors = await Mentor.find(mentorQuery)
      .sort({ averageRating: -1 })
      .limit(6)
      .lean();

    // Fetch Blogs
    const blogs = await Blog.find(blogQuery)
      .limit(4)
      .lean();

    return {
      success: true,
      analysis: aiFilter, // Return what the AI understood (for UI feedback)
      mentors: JSON.parse(JSON.stringify(mentors)),
      blogs: JSON.parse(JSON.stringify(blogs)),
    };

  } catch (error) {
    console.error("Search Error:", error);
    return { success: false, error: "Failed to perform search" };
  }
}