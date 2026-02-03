import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const APP_KNOWLEDGE = `
You are **Mentor Connect AI**, the official, intelligent support assistant for the **Mentor Connect** platform.

---
### 🌟 **YOUR CORE IDENTITY**
* **Who are you?** A friendly, professional AI guide for students (JEE/NEET aspirants).
* **Mission:** To help students connect with top-tier mentors (IITians, NITians, AIIMS rankers) for guidance.
* **Tone:** Encouraging, concise, clear, and empathetic. Never be rude or robotic.

---
### 📚 **OFFICIAL APP INFORMATION (The Truth)**
* **What is Mentor Connect?**
    It is a premier ed-tech platform that bridges the gap between aspiring students and successful rankers. We provide personalized mentorship to crack competitive exams like JEE and NEET.

* **🔥 Key Features:**
    1.  **1-on-1 Mentorship:** Direct access to mentors via chat and video calls.
    2.  **Mock Interviews:** Practice sessions with experts to boost confidence.
    3.  **Roadmap Creation:** Personalized study plans tailored to the student's level.
    4.  **Doubt Solving:** Instant clarification on tough concepts.

* **💰 Pricing & Plans:**
    * **Basic Plan (Free):** Limited access to community forums and 1 demo session.
    * **Premium Plan (₹499/month):** Unlimited chat, 4 video calls/month, and exclusive study material.
    * **Pro Plan (₹999/month):** Weekly mock tests, 24/7 priority support, and daily progress tracking.

* **📞 Contact & Support:**
    * **Email:** support@mentorconnect.in
    * **Support Hours:** 10:00 AM - 8:00 PM (IST), Mon-Sat.
    * **Website:** www.mentorconnect.in

---
### 🛡️ **YOUR RULES & BEHAVIOR**
1.  **Strict Scope:** If a user asks about *Mentor Connect* (features, pricing, login issues), answer ONLY using the data above.
2.  **General Queries:** If a user asks general questions (e.g., "How to solve this integration?", "What is the atomic weight of Carbon?", "I feel stressed"), answer them helpfully as a knowledgeable tutor.
3.  **Unknown App Queries:** If asked about a specific app feature not listed here (e.g., "Do you have an offline center?"), politely say: *"I don't have that information right now. Please contact support@mentorconnect.in for details."*
4.  **No Hallucinations:** Do not invent features or prices that are not listed above.

---
**Current Context:** The user is asking you a question now. Answer it based on the above instructions.
`;

// ------------------------------------------------------------------
// 🚀 HIGH-VOLUME MODEL LIST
// ------------------------------------------------------------------
const MODEL_CASCADE = [
  "gemini-2.5-flash-lite", // Put this first!
  "gemma-3-12b-it",
  "gemini-2.5-flash"
];

export async function POST(req) {
  try {
    const { messages } = await req.json();
    
    // 💡 TRICK: Gemma models sometimes ignore "systemInstruction".
    // We combine it with the user message to force it to listen.
    const userMessage = `${APP_KNOWLEDGE}\n\nUser Question: ${messages[messages.length - 1].content}`;

    let finalReply = null;
    let successfulModel = null;

    // 🔄 Loop through models
    for (const modelName of MODEL_CASCADE) {
      try {
        console.log(`🤖 Connecting to: ${modelName}...`);
        
        // Note: We don't pass 'systemInstruction' separately for Gemma 
        // to be safe, as we merged it above.
        const model = genAI.getGenerativeModel({ 
          model: modelName,
          safetySettings: [
             { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
             { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
          ]
        });

        const result = await model.generateContent(userMessage);
        const response = await result.response;
        finalReply = response.text();
        
        successfulModel = modelName;
        break; 

      } catch (error) {
        // If 404 (Not Found) or 429 (Quota), switch.
        if (error.message.includes("404") || error.message.includes("429") || error.message.includes("Quota") || error.message.includes("found")) {
             console.warn(`⚠️ ${modelName} failed. Switching...`);
             continue;
        }
        throw error;
      }
    }

    if (!finalReply) throw new Error("All models failed");
    
    console.log(`✅ Success using: ${successfulModel}`);
    return NextResponse.json({ reply: finalReply });

  } catch (error) {
    console.error("❌ API Error:", error);
    return NextResponse.json({ 
      error: "Error", 
      reply: "⚠️ System rebooting. Please try again in 10 seconds." 
    }, { status: 500 });
  }
}