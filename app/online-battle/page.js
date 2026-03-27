"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { findOrStartMatch, getLeaderboard } from "@/app/actions/pvpActions";
import { Swords, Globe, Loader2, Trophy, Medal } from "lucide-react";

export default function OnlineBattleLobby() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("battle"); // "battle" or "leaderboard"
  
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState("subject"); 
  const [category, setCategory] = useState("JEE Physics");
  
  const [userName, setUserName] = useState("");
  const [userId, setUserId] = useState("");

  const [leaderboard, setLeaderboard] = useState([]);
  const [loadingLeaderboard, setLoadingLeaderboard] = useState(false);

  // Initialize and persist User ID and Name
  useEffect(() => {
    let storedId = localStorage.getItem("pvp_userId");
    let storedName = localStorage.getItem("pvp_userName");

    if (!storedId) {
      storedId = "user_" + Math.random().toString(36).substr(2, 9);
      localStorage.setItem("pvp_userId", storedId);
    }
    
    setUserId(storedId);
    if (storedName) setUserName(storedName);
  }, []);

  // Fetch Leaderboard when tab changes
  useEffect(() => {
    if (activeTab === "leaderboard") {
      fetchLeaderboardData();
    }
  }, [activeTab]);

  const fetchLeaderboardData = async () => {
    setLoadingLeaderboard(true);
    const res = await getLeaderboard(10); // Get top 10
    if (res.success) setLeaderboard(res.data);
    setLoadingLeaderboard(false);
  };

  const handleFindMatch = async () => {
    if (!userName.trim()) return alert("Please enter your battle name!");

    // Save name for future visits
    localStorage.setItem("pvp_userName", userName);

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
      
      {/* Tab Navigation */}
      <div className="flex gap-4 mb-8 bg-slate-900 p-2 rounded-2xl border border-slate-800">
        <button 
          onClick={() => setActiveTab("battle")}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${activeTab === "battle" ? "bg-blue-600 text-white shadow-lg" : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"}`}
        >
          <Swords size={20} /> Arena
        </button>
        <button 
          onClick={() => setActiveTab("leaderboard")}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${activeTab === "leaderboard" ? "bg-amber-500 text-slate-900 shadow-lg" : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"}`}
        >
          <Trophy size={20} /> Leaderboard
        </button>
      </div>

      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        
        {/* Left Side: Context/Text */}
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

        {/* Right Side: Dynamic Content Panel */}
        <div className="bg-slate-900 border border-slate-700 p-8 rounded-3xl shadow-2xl relative overflow-hidden min-h-[450px]">
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-blue-600/20 rounded-full blur-3xl pointer-events-none"></div>

          {activeTab === "battle" ? (
            // ================= ARENA TAB =================
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
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
          ) : (
            // ================= LEADERBOARD TAB =================
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 h-full flex flex-col">
              <h2 className="text-2xl font-bold text-white text-center mb-6 flex items-center justify-center gap-2">
                <Trophy className="text-amber-500" /> Hall of Fame
              </h2>

              {loadingLeaderboard ? (
                <div className="flex-1 flex justify-center items-center">
                  <Loader2 className="animate-spin text-blue-500" size={32} />
                </div>
              ) : leaderboard.length === 0 ? (
                <div className="flex-1 flex justify-center items-center text-slate-500 text-center">
                  No battles fought yet.<br/>Be the first to claim the top spot!
                </div>
              ) : (
                <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar max-h-[350px]">
                  {leaderboard.map((player, index) => (
                    <div 
                      key={player.userId} 
                      className={`flex items-center justify-between p-4 rounded-xl border ${userId === player.userId ? 'bg-blue-900/20 border-blue-500/50' : 'bg-slate-950 border-slate-800'}`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${index === 0 ? 'bg-amber-500 text-slate-900' : index === 1 ? 'bg-slate-300 text-slate-900' : index === 2 ? 'bg-amber-700 text-white' : 'bg-slate-800 text-slate-400'}`}>
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-bold text-slate-200">
                            {player.name} {userId === player.userId && <span className="text-xs text-blue-400 ml-1">(You)</span>}
                          </p>
                          <p className="text-xs text-slate-500 font-medium tracking-wide">
                            W:{player.wins} L:{player.losses} D:{player.draws}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
                          {player.totalPoints}
                        </p>
                        <p className="text-[10px] text-slate-500 uppercase tracking-widest">PTS</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}