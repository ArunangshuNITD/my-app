"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { findOrStartMatch } from "@/app/actions/pvpActions";
import { Swords, Globe, Loader2 } from "lucide-react";

export default function OnlineBattleLobby() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState("subject"); 
  const [category, setCategory] = useState("JEE Physics");
  
  const [userName, setUserName] = useState("");
  const [userId] = useState(() => "user_" + Math.floor(Math.random() * 10000));

  const handleFindMatch = async () => {
    if (!userName.trim()) return alert("Please enter your battle name!");

    setLoading(true);
    const res = await findOrStartMatch(userId, userName, mode, category);
    
    if (res.success) {
      router.push(`/online-battle/${res.matchId}?userId=${userId}&userName=${encodeURIComponent(userName)}`);
    } else {
      alert("Matchmaking failed! Servers might be busy.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        
        <div className="text-left space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 font-medium text-sm">
            <Globe size={16} /> Live Multiplayer
          </div>
          <h1 className="text-5xl font-black text-white tracking-tight">
            Online <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">Battle</span>
          </h1>
          <p className="text-lg text-slate-400 leading-relaxed">
            Test your knowledge against real students across the country in real-time. Choose your battlefield, answer AI-generated questions under pressure, and climb the ranks.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-700 p-8 rounded-3xl shadow-2xl relative overflow-hidden">
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-blue-600/20 rounded-full blur-3xl pointer-events-none"></div>

          <div className="flex justify-center mb-6">
            <div className="p-4 bg-slate-800 rounded-2xl border border-slate-700 shadow-inner">
              <Swords size={40} className="text-blue-500" />
            </div>
          </div>
          
          <h2 className="text-2xl font-bold text-white text-center mb-6">Enter the Arena</h2>

          <div className="space-y-5 mb-8">
            <div>
              <label className="block text-sm font-semibold text-slate-400 mb-2 uppercase tracking-wider">Your Name</label>
              <input 
                type="text" 
                placeholder="Enter your battle name..."
                value={userName} 
                onChange={(e) => setUserName(e.target.value)}
                className="w-full bg-slate-950 text-white p-4 rounded-xl border border-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-400 mb-2 uppercase tracking-wider">Battle Mode</label>
              <select 
                value={mode} 
                onChange={(e) => setMode(e.target.value)}
                className="w-full bg-slate-950 text-white p-4 rounded-xl border border-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
              >
                <option value="subject">Subject Mastery (Targeted)</option>
                <option value="exam">Grand Mock (Full Syllabus)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-400 mb-2 uppercase tracking-wider">Select Category</label>
              {mode === "subject" ? (
                <select 
                  value={category} 
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-slate-950 text-white p-4 rounded-xl border border-slate-700 focus:border-blue-500 outline-none transition"
                >
                  <option value="JEE Physics">JEE Physics</option>
                  <option value="JEE Chemistry">JEE Chemistry</option>
                  <option value="JEE Mathematics">JEE Mathematics</option>
                  <option value="NEET Biology">NEET Biology</option>
                </select>
              ) : (
                <select 
                  value={category} 
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-slate-950 text-white p-4 rounded-xl border border-slate-700 focus:border-blue-500 outline-none transition"
                >
                  <option value="JEE">JEE Mains Full Mock</option>
                  <option value="NEET">NEET Full Mock</option>
                </select>
              )}
            </div>
          </div>

          <button 
            onClick={handleFindMatch}
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-4 rounded-xl transition shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_30px_rgba(37,99,235,0.5)] flex justify-center items-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? <><Loader2 className="animate-spin" size={24} /> Generating Match...</> : <><Swords size={20} /> Find Opponent</>}
          </button>
        </div>

      </div>
    </div>
  );
}