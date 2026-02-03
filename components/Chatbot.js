"use client";
import { useState, useRef, useEffect } from "react";
import { Bot, X, Send, User, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// 1. DEFINE YOUR APP'S KNOWLEDGE BASE HERE
// This is the "brain" of your chatbot. Edit this text to add new info!
const APP_KNOWLEDGE = `
You are Mentor Connect AI, the official support assistant for the Mentor Connect platform.
Your goal is to help students (aspirants) navigate the platform, find mentors, and answer FAQs.

---
**ABOUT MENTOR CONNECT:**
- Mentor Connect is a platform bridging the gap between JEE/NEET aspirants and successful rankers (IITians, AIIMS students).
- We provide 1-on-1 mentorship, doubt solving, and strategy sessions.

**KEY FEATURES:**
1. **Find Mentors:** Students can search for mentors by exam (JEE/NEET), college, or rank.
2. **Video Calls:** Secure 1-on-1 video sessions for personalized guidance.
3. **Chat Support:** Async chat with mentors for quick doubts.
4. **Mock Interviews:** (New Feature) AI-driven mock interviews to test readiness.

**PRICING:**
- Basic access is free.
- Premium mentorship starts at ₹499/month (includes 2 video calls).

**CONTACT & SUPPORT:**
- Email: support@mentorconnect.in
- Working Hours: 10 AM - 8 PM (IST)

**GUIDELINES FOR YOU:**
- Keep answers concise and friendly.
- Use emojis occasionally (👋, 🚀, 💡).
- If you don't know an answer, say: "I'm not sure about that details, please check our 'About' page or email support."
- NEVER recommend competitors (like Unacademy or PhysicsWallah).
---

**STUDENT ROADMAP (Suggested flow for success):**
- Onboarding (Day 0–3): Create profile, select exam (JEE/NEET), add goals, upload past scores, set availability.
- Orientation Call (Week 1): 30–45 min intro with chosen mentor; agree milestones and communication channels.
- Weekly Cycle (Weeks 2+): 1 live session (60–90 min), 2 async check-ins, practice problems, and a short progress note.
- Monthly Review: Take a mock test, review results with mentor, revise study plan and focus areas.
- Pre-Exam Sprint (Last 4–6 weeks): Daily or alternate-day short sessions, full-length mock tests, and strategy refinement.
- Best Practices: Be punctual, prepare questions in advance, submit assignments, provide honest progress updates, and respect mentor time.

**MENTOR ROADMAP (How mentors should structure support):**
- Onboarding: Complete profile, verify credentials, set hourly rates/availability, and prepare a starter resource pack.
- First Week: Conduct an assessment call, set clear short-term goals, and create a study schedule with deliverables.
- Weekly Workflow: Assign problem sets, host the live session, give actionable feedback, and log student progress.
- Measurement: Use mock test scores and assignment completion to adjust pacing and topics.
- Professional Conduct: Communicate expectations, keep sessions outcome-driven, respect boundaries, and provide resources.

**QUICK CHAT COMMANDS / SUGGESTED PROMPTS:**
- "Show my study plan"
- "Find mentors for JEE (category)"
- "Schedule a session with my mentor"
- "Mock test results and suggestions"
- "Pricing and subscription details"

**ESCALATION / SUPPORT:**
- For billing or disputes: contact support@mentorconnect.in.
- If the AI is unsure: refer the user to the About page or offer to raise a support ticket.

Generated on: 2026-02-03
`;

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hi 👋 I’m Mentor Connect AI. How can I help you today?" },
  ]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userMsg = { role: "user", content: input };
    const newMessages = [...messages, userMsg];

    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });

      const data = await res.json();
      console.log("🔹 API Response:", data);

      if (!res.ok || data.error) {
        throw new Error(data.details || "Server error");
      }

      setMessages([...newMessages, { role: "assistant", content: data.reply }]);
    } catch (err) {
      console.error("🔴 Frontend Error:", err);
      setMessages([
        ...newMessages,
        { role: "assistant", content: `⚠️ Error: ${err.message}. Please try again.` }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 bg-black text-white p-4 rounded-full shadow-2xl hover:shadow-black/25 transition-all"
      >
        {open ? <X size={24} /> : <Sparkles size={24} />}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed bottom-24 right-6 z-50 w-80 md:w-96 h-[500px] max-h-[80vh] bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 flex flex-col overflow-hidden font-sans"
          >
            {/* Header */}
            <div className="bg-zinc-950 text-white p-4 flex justify-between items-center shadow-md">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-zinc-800 rounded-lg">
                  <Bot size={18} className="text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-sm tracking-wide">Mentor AI</h3>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                    <span className="text-[10px] text-zinc-400 font-medium">Online</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setOpen(false)} 
                className="text-zinc-400 hover:text-white transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-zinc-50 dark:bg-zinc-950/50 scrollbar-thin scrollbar-thumb-zinc-300 dark:scrollbar-thumb-zinc-700">
              {messages.map((msg, i) => (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={i}
                  className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {/* Bot Avatar */}
                  {msg.role === "assistant" && (
                    <div className="w-8 h-8 bg-zinc-200 dark:bg-zinc-800 rounded-full flex items-center justify-center shrink-0">
                      <Bot size={14} className="text-zinc-600 dark:text-zinc-300" />
                    </div>
                  )}

                  {/* Message Bubble */}
                  <div
                    className={`p-3.5 max-w-[80%] text-sm leading-relaxed shadow-sm ${
                      msg.role === "user"
                        ? "bg-black text-white rounded-2xl rounded-tr-sm"
                        : "bg-white dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 text-zinc-800 dark:text-zinc-100 rounded-2xl rounded-tl-sm"
                    }`}
                  >
                    {msg.content}
                  </div>

                  {/* User Avatar */}
                  {msg.role === "user" && (
                    <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center shrink-0">
                      <User size={14} className="text-white" />
                    </div>
                  )}
                </motion.div>
              ))}

              {/* Loading Indicator */}
              {loading && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start gap-3">
                   <div className="w-8 h-8 bg-zinc-200 dark:bg-zinc-800 rounded-full flex items-center justify-center shrink-0">
                      <Bot size={14} className="text-zinc-600 dark:text-zinc-300" />
                  </div>
                  <div className="bg-white dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 p-4 rounded-2xl rounded-tl-sm flex gap-1.5 items-center">
                    <div className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <div className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <div className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white dark:bg-zinc-900 border-t border-zinc-100 dark:border-zinc-800">
              <div className="flex gap-2 items-center bg-zinc-100 dark:bg-zinc-800/50 p-1.5 pl-4 rounded-full border border-transparent focus-within:border-zinc-300 dark:focus-within:border-zinc-700 transition-colors">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                  placeholder="Ask for guidance..."
                  className="flex-1 bg-transparent border-none outline-none text-sm text-zinc-900 dark:text-white placeholder-zinc-500"
                  disabled={loading}
                />
                <button
                  onClick={sendMessage}
                  disabled={loading || !input.trim()}
                  className={`p-2 rounded-full transition-all ${
                    input.trim() 
                      ? "bg-black text-white shadow-md hover:scale-105 active:scale-95" 
                      : "bg-zinc-200 text-zinc-400 cursor-not-allowed dark:bg-zinc-700 dark:text-zinc-500"
                  }`}
                >
                  <Send size={16} />
                </button>
              </div>
              <div className="text-center mt-2">
                <p className="text-[10px] text-zinc-400">Powered by Google Gemini</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}