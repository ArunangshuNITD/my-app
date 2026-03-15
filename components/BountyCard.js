import Link from "next/link";
import { claimBounty } from "@/app/actions/bountyActions";
import UpvoteWithTip from "@/components/UpvoteWithTip"; 
import { calculateSurgePrice } from "@/lib/surgePricing"; 
import LiveSurgeTicker from "@/components/LiveSurgeTicker";

export default function BountyCard({ bounty, currentUserId }) {
  const isBoosted = bounty.contributors?.length > 1;
  const hasUpvoted = (bounty.upvotes || []).includes(currentUserId);

  // --- HEAT LEVEL LOGIC ---
  const now = new Date();
  const deadlineDate = bounty.deadline ? new Date(bounty.deadline) : null;
  const isExpired = deadlineDate && now > deadlineDate;
  
  // Calculate time remaining in minutes
  const minsRemaining = deadlineDate ? (deadlineDate - now) / (1000 * 60) : null;
  
  // "Heat" triggers if it's open and less than 60 minutes remain
  const isHot = bounty.status === 'open' && minsRemaining !== null && minsRemaining > 0 && minsRemaining < 60;

  // Calculate the initial display price for server-side styling
  const initialDisplayPrice = (bounty.status === 'open' && bounty.deadline) 
    ? calculateSurgePrice(bounty.amount, bounty.maxBudget, bounty.createdAt, bounty.deadline)
    : (bounty.finalPrice || bounty.amount);

  const isSurging = initialDisplayPrice > bounty.amount && bounty.status === 'open';

  return (
    <div className={`p-5 rounded-xl border shadow-sm flex items-start justify-between gap-4 transition-all duration-500 hover:shadow-md 
      ${isHot ? 'border-orange-500 bg-orange-50/30 ring-2 ring-orange-500/20 animate-pulse' : 
        isSurging ? 'border-red-300 bg-red-50/20' : 'bg-white'} 
      ${isExpired && bounty.status === 'open' ? 'opacity-60 grayscale-[0.5]' : ''}`}>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3 mb-2 flex-wrap">
          
          <UpvoteWithTip 
            bountyId={bounty._id.toString()} 
            upvotesCount={bounty.upvotes?.length || 0}
            hasUpvoted={hasUpvoted}
          />

          <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider">
            {bounty.subject}
          </span>
          
          {isBoosted && (
            <span className="text-xs font-bold text-orange-600 flex items-center gap-1 bg-orange-50 px-2 py-0.5 rounded-full border border-orange-100">
              ⚡ Boosted ({bounty.contributors.length})
            </span>
          )}

          {/* DYNAMIC STATUS BADGES */}
          {isHot ? (
            <span className="text-xs font-bold text-white flex items-center gap-1 bg-gradient-to-r from-orange-600 to-red-600 px-2 py-0.5 rounded-full border border-orange-400 shadow-sm">
              🚀 CRITICAL HEAT
            </span>
          ) : isSurging ? (
            <span className="text-xs font-bold text-red-600 flex items-center gap-1 bg-red-100 px-2 py-0.5 rounded-full border border-red-200">
              🔥 SURGE ACTIVE
            </span>
          ) : null}

          {isExpired && bounty.status === 'open' && (
             <span className="text-xs font-bold text-gray-500 bg-gray-200 px-2 py-0.5 rounded-full">
               ⌛ EXPIRED
             </span>
          )}
        </div>
        
        <p className="text-gray-900 font-medium truncate">{bounty.question}</p>
        
        <div className="flex gap-4 mt-2">
          <p className="text-gray-400 text-xs">Posted {new Date(bounty.createdAt).toLocaleDateString()}</p>
          
          {bounty.deadline && (
             <p className={`text-xs ${isHot ? 'text-orange-600 font-black' : isSurging ? 'text-red-500 font-semibold' : 'text-gray-400'}`}>
               {isExpired ? 'Deadline Passed' : `Ends: ${new Date(bounty.deadline).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
             </p>
          )}
        </div>
      </div>
      
      <div className="flex flex-col items-end gap-3 flex-shrink-0">
        
        <LiveSurgeTicker 
          baseAmount={bounty.amount}
          maxBudget={bounty.maxBudget}
          createdAt={bounty.createdAt}
          deadline={bounty.deadline}
          status={bounty.status}
          finalPrice={bounty.finalPrice}
        />

        {bounty.status === 'open' && !isExpired && (
          <form action={claimBounty.bind(null, bounty._id.toString())}>
            <button type="submit" className={`text-white text-sm font-bold py-1.5 px-4 rounded transition-all transform active:scale-95 
              ${isHot ? 'bg-orange-600 hover:bg-orange-700 hover:scale-105 shadow-orange-200 shadow-lg' : 
                isSurging ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'}`}>
              Claim Now
            </button>
          </form>
        )}
        
        {(bounty.status !== 'open' || isExpired) && (
           <Link href={`/bounty-board/${bounty._id}`} className="text-blue-500 text-sm font-semibold hover:underline">
            View Details &rarr;
          </Link>
        )}
      </div>
    </div>
  );
}