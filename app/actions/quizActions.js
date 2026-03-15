'use server'
import { GoogleGenerativeAI } from "@google/generative-ai";

// Re-use the same API key you are using for your chatbot
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function generateQuiz(topic, numQuestions = 3) {
  try {
    // We'll use a fast model for generation. 
    // You can also implement your model cascade here if you want!
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash", // Fallback to "gemini-1.5-flash" if 2.5 throws an error
      generationConfig: {
        responseMimeType: "application/json", // This forces Gemini to return strict JSON!
        temperature: 0.7,
      }
    });

    const prompt = `You are a strict physics/math mentor. Generate a ${numQuestions}-question multiple choice quiz about "${topic}".
    
    The JSON must contain a single key "questions" which holds an array of objects.
    Each object must have this exact structure:
    {
      "id": 1,
      "text": "Question text here?",
      "options": [
        { "id": "a", "text": "Option A" },
        { "id": "b", "text": "Option B" },
        { "id": "c", "text": "Option C" },
        { "id": "d", "text": "Option D" }
      ],
      "correctAnswer": "a"
    }`;

    console.log(`🤖 Summoning Gemini to generate quiz for: ${topic}...`);
    
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    // Parse the JSON string returned by Gemini
    const parsedData = JSON.parse(responseText);
    
    return { success: true, questions: parsedData.questions };
  } catch (error) {
    console.error("❌ Gemini Quiz Generation Error:", error);
    return { success: false, message: "Failed to summon the AI mentor. Try again." };
  }
}