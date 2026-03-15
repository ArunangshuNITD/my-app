import { createBounty } from "@/app/actions/bountyActions";
import BountyCard from "@/components/BountyCard";
import Bounty from "@/models/Bounty";
import dbConnect from "@/lib/db";
import { auth } from "@/lib/auth"; 

export default async function BountyBoard() {
  await dbConnect();
  const session = await auth(); 
  const currentUserId = session?.user?.id; 

  const bounties = await Bounty.find({ status: 'open' }).sort({ createdAt: -1 });

  // Calculate some fun fake/real stats for the Hero section
  const totalPool = bounties.reduce((sum, b) => sum + (b.amount || 0), 0);
  const activeBountiesCount = bounties.length;

  return (
    <div className="min-h-screen relative bg-slate-950 overflow-hidden font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      
      {/* --- CRAZY BACKGROUND EFFECTS --- */}
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-indigo-600/20 rounded-full mix-blend-screen filter blur-[120px] animate-blob"></div>
      <div className="absolute top-[20%] right-[-10%] w-[40vw] h-[40vw] bg-fuchsia-600/20 rounded-full mix-blend-screen filter blur-[120px] animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-[-20%] left-[20%] w-[60vw] h-[60vw] bg-cyan-600/20 rounded-full mix-blend-screen filter blur-[120px] animate-blob animation-delay-4000"></div>
      
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30 pointer-events-none"></div>

      {/* --- MAIN CONTENT CONTAINER --- */}
      <div className="max-w-7xl mx-auto p-4 md:p-8 relative z-10 pt-16 md:pt-24 flex flex-col lg:flex-row gap-8">
        
        {/* LEFT COLUMN: Hero & Form (Sticky) */}
        <div className="w-full lg:w-5/12 flex flex-col gap-8 lg:sticky lg:top-24 h-fit">
          
          {/* Hero Section */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 via-indigo-500 to-fuchsia-500 rounded-3xl blur-md opacity-25 group-hover:opacity-50 transition duration-700"></div>
            <div className="relative bg-slate-900/80 backdrop-blur-2xl border border-white/10 p-8 rounded-3xl shadow-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold uppercase tracking-widest mb-6">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                </span>
                Live Network
              </div>
              
              <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white via-slate-200 to-slate-500 mb-4 leading-tight">
                Solve. <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-500">Earn.</span> <br/>
                Learn.
              </h1>
              
              <p className="text-slate-400 text-lg font-medium leading-relaxed mb-8">
                Drop your toughest doubts into the ether. Let top-tier mentors solve them for crypto-speed cash.
              </p>

              {/* Dynamic Stats Row */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-800/50 rounded-2xl p-4 border border-white/5">
                  <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Active Bounties</p>
                  <p className="text-3xl font-mono font-black text-white">{activeBountiesCount}</p>
                </div>
                <div className="bg-slate-800/50 rounded-2xl p-4 border border-white/5">
                  <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Total Prize Pool</p>
                  <p className="text-3xl font-mono font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600">₹{totalPool}</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Post Bounty Form */}
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-br from-fuchsia-600 to-cyan-600 rounded-3xl blur opacity-30 group-hover:opacity-60 transition duration-500"></div>
            <form action={createBounty} className="relative bg-slate-900/90 backdrop-blur-xl p-6 rounded-3xl border border-white/10 flex flex-col gap-5 shadow-2xl">
              <h3 className="text-xl font-extrabold text-white flex items-center gap-2">
                <svg className="w-5 h-5 text-fuchsia-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                Post a New Bounty
              </h3>
              
              <div className="relative">
                <textarea 
                  name="question" 
                  placeholder="Describe your complex doubt..." 
                  className="w-full p-4 bg-slate-950/50 border border-slate-700/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all resize-none shadow-inner text-slate-200 placeholder-slate-600 min-h-[120px]" 
                  required 
                />
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 relative">
                  <input 
                    name="subject" 
                    placeholder="Subject (e.g. Physics)" 
                    className="w-full bg-slate-950/50 border border-slate-700/50 p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all text-slate-200 placeholder-slate-600" 
                    required 
                  />
                </div>
                <div className="flex-1 relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500 font-bold text-lg">₹</span>
                  <input 
                    name="amount" 
                    type="number" 
                    placeholder="Base Amount" 
                    className="w-full bg-slate-950/50 border border-emerald-900/30 p-4 pl-9 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-emerald-400 font-mono font-bold placeholder-emerald-900/50" 
                    required 
                  />
                </div>
              </div>

              {/* NEW: SURGE PRICING INPUTS */}
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 flex flex-col gap-1">
                  <label className="text-xs text-slate-400 font-bold ml-1">Deadline (Optional)</label>
                  <input 
                    name="deadline" 
                    type="datetime-local" 
                    className="w-full bg-slate-950/50 border border-slate-700/50 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all text-slate-200 placeholder-slate-600 text-sm" 
                  />
                </div>
                <div className="flex-1 flex flex-col gap-1">
                  <label className="text-xs text-slate-400 font-bold ml-1">Max Budget (Optional)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-red-500 font-bold">₹</span>
                    <input 
                      name="maxBudget" 
                      type="number" 
                      placeholder="Surge Max" 
                      className="w-full bg-slate-950/50 border border-red-900/30 p-3 pl-8 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 transition-all text-red-400 font-mono font-bold placeholder-red-900/50 text-sm" 
                    />
                  </div>
                </div>
              </div>
              
              <button className="w-full bg-gradient-to-r from-cyan-600 hover:from-cyan-500 to-indigo-600 hover:to-indigo-500 text-white font-black text-lg py-4 rounded-xl shadow-[0_0_20px_rgba(8,145,178,0.4)] transform hover:scale-[1.02] transition-all active:scale-95 uppercase tracking-widest mt-2">
                Initialize Bounty
              </button>
            </form>
          </div>
        </div>

        {/* RIGHT COLUMN: The Feed */}
        <div className="w-full lg:w-7/12 flex flex-col gap-6">
          
          {/* Aesthetic Filters */}
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <button className="px-4 py-2 rounded-full bg-white/10 border border-white/5 text-white text-sm font-bold shadow-sm backdrop-blur-md">🔥 Hot</button>
            <button className="px-4 py-2 rounded-full bg-transparent hover:bg-white/5 border border-transparent hover:border-white/5 text-slate-400 hover:text-white transition-colors text-sm font-bold">Latest</button>
            <button className="px-4 py-2 rounded-full bg-transparent hover:bg-white/5 border border-transparent hover:border-white/5 text-slate-400 hover:text-white transition-colors text-sm font-bold">Highest Bounty</button>
          </div>

          {/* Bounties List */}
          <div className="flex flex-col gap-6 relative z-20">
            {bounties.map((b) => (
              <BountyCard 
                key={b._id} 
                bounty={JSON.parse(JSON.stringify(b))} 
                currentUserId={currentUserId} 
              />
            ))}
            
            {bounties.length === 0 && (
              <div className="relative group overflow-hidden rounded-3xl border border-dashed border-slate-700 bg-slate-900/50 p-16 text-center backdrop-blur-md">
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent pointer-events-none"></div>
                <div className="relative z-10 flex flex-col items-center gap-4">
                  <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center border border-slate-700 mb-2">
                    <span className="text-4xl">🕳️</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white">The board is empty</h3>
                  <p className="text-slate-400 max-w-sm">No one has dared to post a challenge yet. Be the first to drop a bounty into the network.</p>
                </div>
              </div>
            )}
          </div>
          
        </div>
      </div>
    </div>
  );
}