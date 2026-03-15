import dbConnect from "@/lib/db";
import Bounty from "@/models/Bounty";
import { auth } from "@/lib/auth";
import { submitSolution } from "@/app/actions/bountyActions";
import Link from "next/link";
import { notFound } from "next/navigation";
import UpvoteWithTip from "@/components/UpvoteWithTip"; 
import LiveSurgeTicker from "@/components/LiveSurgeTicker"; // NEW: Import Ticker
import { calculateSurgePrice } from "@/lib/surgePricing"; // NEW: Import Logic

export default async function BountyDetailPage({ params }) {
  await dbConnect();
  const session = await auth();
  const currentUserId = session?.user?.id;

  const { id } = await params;

  const bounty = await Bounty.findById(id);
  if (!bounty) return notFound();

  const isSolver = bounty.solver === currentUserId;
  const totalContributors = bounty.contributors?.length || 1;
  const hasUpvoted = (bounty.upvotes || []).includes(currentUserId);

  // NEW: Calculate initial surge for background effects
  const initialDisplayPrice = (bounty.status === 'open' && bounty.deadline) 
    ? calculateSurgePrice(bounty.amount, bounty.maxBudget, bounty.createdAt, bounty.deadline)
    : (bounty.finalPrice || bounty.amount);

  const isSurging = initialDisplayPrice > bounty.amount && bounty.status === 'open';

  return (
    <div className={`min-h-screen pt-10 pb-20 selection:bg-purple-200 transition-colors ${isSurging ? 'bg-red-50/30' : 'bg-slate-50'}`}>
      <div className="max-w-4xl mx-auto p-6">
        
        <Link href="/bounty-board" className="group inline-flex items-center gap-2 text-slate-500 hover:text-purple-600 font-medium mb-8 transition-colors">
          <span className="transform group-hover:-translate-x-1 transition-transform">&larr;</span> Back to Board
        </Link>

        {/* Main Doubt Card */}
        <div className={`bg-white rounded-3xl p-8 md:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] mb-10 relative overflow-hidden transition-all ${isSurging ? 'border-2 border-red-200' : 'border border-slate-100'}`}>
          
          {/* Decorative Background Glow */}
          {bounty.amount > 100 && !isSurging && (
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-gradient-to-br from-yellow-300 to-orange-400 rounded-full blur-3xl opacity-20 pointer-events-none"></div>
          )}
          {isSurging && (
             <div className="absolute -top-24 -right-24 w-64 h-64 bg-gradient-to-br from-red-400 to-rose-500 rounded-full blur-3xl opacity-20 pointer-events-none animate-pulse"></div>
          )}
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 relative z-10">
            <div className="flex flex-wrap items-center gap-4">
              <UpvoteWithTip 
                bountyId={bounty._id.toString()} 
                upvotesCount={bounty.upvotes?.length || 0}
                hasUpvoted={hasUpvoted}
              />
              <span className="bg-gradient-to-r from-blue-50 to-indigo-50 text-indigo-700 px-4 py-1.5 rounded-full text-xs font-black tracking-widest uppercase border border-indigo-100 shadow-sm">
                {bounty.subject}
              </span>
              
              {isSurging && (
                <span className="text-xs font-bold text-red-600 flex items-center gap-1 bg-red-100 px-3 py-1.5 rounded-full border border-red-200 animate-pulse">
                  🔥 SURGE ACTIVE
                </span>
              )}
            </div>

            {/* NEW: Replaced Static Prize with Live Ticker wrapped in Gamified UI */}
            <div className="flex flex-col items-end">
              <div className="relative group cursor-default">
                <div className={`absolute -inset-1 rounded-2xl blur opacity-30 transition duration-500 ${isSurging ? 'bg-red-500 group-hover:opacity-70 animate-pulse' : 'bg-gradient-to-r from-yellow-400 to-orange-500 group-hover:opacity-60'}`}></div>
                
                {/* We wrap the ticker inside the badge design */}
                <div className={`relative px-4 py-1 rounded-2xl flex items-center gap-2 shadow-sm ${isSurging ? 'bg-red-50 border border-red-200' : 'bg-gradient-to-br from-yellow-50 to-orange-50 border border-orange-200'}`}>
                  <span className="text-xl">🏆</span>
                  <LiveSurgeTicker 
                    baseAmount={bounty.amount}
                    maxBudget={bounty.maxBudget}
                    createdAt={bounty.createdAt}
                    deadline={bounty.deadline}
                    status={bounty.status}
                    finalPrice={bounty.finalPrice}
                  />
                </div>

              </div>
              {totalContributors > 1 && (
                <p className="text-xs text-orange-600 font-bold tracking-wide mt-2 flex items-center gap-1">
                  ⚡ Boosted by {totalContributors} students
                </p>
              )}
            </div>
          </div>
          
          <div className="relative z-10">
            <h1 className="text-3xl font-extrabold text-slate-900 mb-6">The Challenge</h1>
            <p className="text-slate-700 whitespace-pre-wrap text-lg leading-relaxed font-medium bg-slate-50 p-6 rounded-2xl border border-slate-100">
              {bounty.question}
            </p>
          </div>
        </div>

        {/* Claimed & Solving Module */}
        {bounty.status === 'claimed' && isSolver && (
          <div className="relative group mt-8">
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-cyan-400 rounded-3xl blur opacity-25"></div>
            <div className="relative bg-white border border-indigo-100 p-8 rounded-3xl shadow-xl">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-3xl">💡</span>
                <h2 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-cyan-600">
                  Submit Your Masterpiece
                </h2>
              </div>
              
              <form action={submitSolution} className="flex flex-col gap-6">
                <input type="hidden" name="bountyId" value={bounty._id.toString()} />
                
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wider">Detailed Explanation</label>
                  <textarea 
                    name="solutionText" 
                    rows="6"
                    placeholder="Break down the concept step-by-step..." 
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all shadow-inner text-slate-700 placeholder-slate-400 resize-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wider">Video/Image Evidence (Optional)</label>
                  <input 
                    name="solutionLink" 
                    type="url" 
                    placeholder="https://youtube.com/... or Google Drive link" 
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all shadow-inner text-slate-700 placeholder-slate-400"
                  />
                </div>

                {/* Uses finalPrice if locked, otherwise displays current amount */}
                <button type="submit" className="mt-2 w-full bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-700 hover:to-cyan-700 text-white font-black text-lg py-4 rounded-xl shadow-lg shadow-indigo-500/30 transform hover:-translate-y-1 transition-all active:scale-95">
                  Verify Solution & Collect ₹{bounty.finalPrice || bounty.amount}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Solved Module */}
        {bounty.status === 'solved' && (
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 p-8 rounded-3xl shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-400 rounded-full blur-3xl opacity-10 pointer-events-none"></div>
            
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 relative z-10">
              <h2 className="text-2xl font-extrabold text-emerald-900 flex items-center gap-2">
                <span className="text-emerald-500">✓</span> Verified Solution
              </h2>
              <span className="inline-flex items-center gap-1.5 bg-emerald-500 text-white px-4 py-1.5 rounded-full font-bold text-sm shadow-md shadow-emerald-500/20">
                💰 Bounty Paid (₹{bounty.finalPrice || bounty.amount})
              </span>
            </div>
            
            <div className="bg-white/60 backdrop-blur-sm p-6 rounded-2xl border border-emerald-100 relative z-10">
              <p className="text-slate-800 whitespace-pre-wrap text-lg leading-relaxed">{bounty.solutionText}</p>
            </div>
            
            {bounty.solutionLink && (
              <a href={bounty.solutionLink} target="_blank" rel="noreferrer" className="mt-6 inline-flex items-center gap-2 text-emerald-700 bg-emerald-100/50 hover:bg-emerald-100 px-5 py-3 rounded-xl font-bold transition-colors relative z-10 border border-emerald-200">
                View Attached Reference Material <span className="text-xl">&rarr;</span>
              </a>
            )}
          </div>
        )}

        {/* Waiting Status */}
        {bounty.status === 'claimed' && !isSolver && (
          <div className="bg-slate-100 p-8 rounded-3xl text-center border border-slate-200 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-full animate-[shimmer_2s_infinite]"></div>
            <p className="text-slate-600 font-bold text-lg flex items-center justify-center gap-3">
              <span className="animate-spin text-2xl">⏳</span>
              A master is currently crafting the solution...
            </p>
          </div>
        )}

      </div>
    </div>
  );
}