import Link from "next/link";
import { claimBounty } from "@/app/actions/bountyActions";
import UpvoteWithTip from "@/components/UpvoteWithTip"; // <-- IMPORT THE NEW COMPONENT

export default function BountyCard({ bounty, currentUserId }) {
  const isBoosted = bounty.contributors?.length > 1;
  const hasUpvoted = (bounty.upvotes || []).includes(currentUserId);

  return (
    <div className="bg-white p-5 rounded-xl border shadow-sm flex items-start justify-between gap-4 transition-all hover:shadow-md">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3 mb-2">
          
          {/* --- REPLACED: Interactive Upvote & Tip Menu --- */}
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
              🔥 Trending ({bounty.contributors.length} students)
            </span>
          )}
        </div>
        <p className="text-gray-900 font-medium truncate">{bounty.question}</p>
        <p className="text-gray-400 text-xs mt-2">Posted {new Date(bounty.createdAt).toLocaleDateString()}</p>
      </div>
      
      <div className="flex flex-col items-end gap-3 flex-shrink-0">
        <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full font-mono font-bold text-lg">
          ₹{bounty.amount}
        </span>
        {bounty.status === 'open' && (
          <form action={claimBounty.bind(null, bounty._id.toString())}>
            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold py-1.5 px-4 rounded transition-colors">
              Claim
            </button>
          </form>
        )}
        {bounty.status !== 'open' && (
           <Link href={`/bounty-board/${bounty._id}`} className="text-blue-500 text-sm font-semibold hover:underline">
            View &rarr;
          </Link>
        )}
      </div>
    </div>
  );
}