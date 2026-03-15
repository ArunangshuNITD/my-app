import Link from "next/link";

export default function PricingPage() {
  return (
    <div className="min-h-screen relative bg-slate-950 overflow-hidden font-sans selection:bg-fuchsia-500/30 selection:text-fuchsia-200 flex flex-col items-center justify-center py-20">
      
      {/* --- CRAZY BACKGROUND EFFECTS --- */}
      <div className="absolute top-[10%] left-[10%] w-[40vw] h-[40vw] bg-indigo-600/20 rounded-full mix-blend-screen filter blur-[100px] animate-blob"></div>
      <div className="absolute top-[30%] right-[10%] w-[30vw] h-[30vw] bg-cyan-600/20 rounded-full mix-blend-screen filter blur-[100px] animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-[10%] left-[30%] w-[50vw] h-[50vw] bg-fuchsia-600/20 rounded-full mix-blend-screen filter blur-[120px] animate-blob animation-delay-4000"></div>
      
      {/* Cyber Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 relative z-10 w-full">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-fuchsia-500/10 border border-fuchsia-500/20 text-fuchsia-400 text-sm font-bold uppercase tracking-widest mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-fuchsia-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-fuchsia-500"></span>
            </span>
            Upgrade Your Arsenal
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white via-slate-200 to-slate-500 mb-6">
            Choose Your <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-500 to-fuchsia-500">Power Level</span>
          </h1>
          <p className="text-slate-400 text-lg md:text-xl font-medium">
            Whether you're just asking a few doubts or grinding to be the top mentor, we have a tier for your ambition.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center max-w-6xl mx-auto">
          
          {/* TIER 1: Free / Initiate */}
          <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-3xl p-8 hover:-translate-y-2 transition-transform duration-300 shadow-2xl">
            <h3 className="text-slate-300 text-xl font-bold mb-2">Initiate</h3>
            <div className="flex items-baseline gap-1 mb-6">
              <span className="text-4xl font-black text-white">₹0</span>
              <span className="text-slate-500 font-medium">/ forever</span>
            </div>
            <p className="text-slate-400 text-sm mb-8">Perfect for students who occasionally get stuck.</p>
            
            <ul className="flex flex-col gap-4 mb-8">
              {[
                "Post up to 3 bounties/month",
                "Standard 15% platform fee",
                "Basic community support",
                "View solved bounties"
              ].map((feature, i) => (
                <li key={i} className="flex items-center gap-3 text-slate-300 text-sm font-medium">
                  <svg className="w-5 h-5 text-cyan-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  {feature}
                </li>
              ))}
            </ul>
            <button className="w-full py-4 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-white font-bold transition-colors">
              Current Plan
            </button>
          </div>

          {/* TIER 2: Pro / Scholar (Highlighted) */}
          <div className="relative group md:-mt-8 md:mb-8 z-20">
            <div className="absolute -inset-1 bg-gradient-to-b from-cyan-500 to-fuchsia-600 rounded-[2rem] blur opacity-50 group-hover:opacity-75 transition duration-500"></div>
            <div className="relative bg-slate-900 backdrop-blur-2xl border border-white/20 rounded-[2rem] p-8 shadow-2xl flex flex-col h-full">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-cyan-500 to-fuchsia-500 text-white px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest shadow-lg">
                Most Popular
              </div>
              
              <h3 className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400 text-2xl font-black mb-2">Scholar Pro</h3>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-5xl font-black text-white">₹499</span>
                <span className="text-slate-500 font-medium">/ month</span>
              </div>
              <p className="text-slate-400 text-sm mb-8">For serious learners and rising mentors.</p>
              
              <ul className="flex flex-col gap-4 mb-8 flex-grow">
                {[
                  "Unlimited bounty posts",
                  "Reduced 5% platform fee",
                  "Priority bounty placement",
                  "Pro badge on profile",
                  "Access to exclusive VIP bounties"
                ].map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-white text-sm font-medium">
                    <svg className="w-5 h-5 text-fuchsia-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    {feature}
                  </li>
                ))}
              </ul>
              <button className="w-full py-4 rounded-xl bg-gradient-to-r from-cyan-600 to-fuchsia-600 hover:from-cyan-500 hover:to-fuchsia-500 text-white font-black text-lg shadow-[0_0_20px_rgba(192,38,211,0.4)] transform hover:scale-[1.02] transition-all active:scale-95">
                Upgrade to Pro
              </button>
            </div>
          </div>

          {/* TIER 3: Elite / Master */}
          <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-3xl p-8 hover:-translate-y-2 transition-transform duration-300 shadow-2xl">
            <h3 className="text-emerald-400 text-xl font-bold mb-2">Master</h3>
            <div className="flex items-baseline gap-1 mb-6">
              <span className="text-4xl font-black text-white">₹1499</span>
              <span className="text-slate-500 font-medium">/ month</span>
            </div>
            <p className="text-slate-400 text-sm mb-8">For institutional users and top-1% solvers.</p>
            
            <ul className="flex flex-col gap-4 mb-8">
              {[
                "0% platform fee on solves",
                "Instant payouts",
                "Dedicated dispute manager",
                "API access for bulk posting",
                "Animated glowing username"
              ].map((feature, i) => (
                <li key={i} className="flex items-center gap-3 text-slate-300 text-sm font-medium">
                  <svg className="w-5 h-5 text-emerald-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  {feature}
                </li>
              ))}
            </ul>
            <button className="w-full py-4 rounded-xl border border-emerald-500/50 hover:bg-emerald-500/10 text-emerald-400 font-bold transition-colors">
              Go Master
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}