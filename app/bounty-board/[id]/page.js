import dbConnect from "@/lib/db";
import Bounty from "@/models/Bounty";
import { auth } from "@/lib/auth";
import { submitSolution } from "@/app/actions/bountyActions";
import Link from "next/link";
import { notFound } from "next/navigation";
import UpvoteWithTip from "@/components/UpvoteWithTip"; // <-- IMPORT THE NEW COMPONENT

export default async function BountyDetailPage({ params }) {
  await dbConnect();
  const session = await auth();
  const currentUserId = session?.user?.id;

  const { id } = await params;

  const bounty = await Bounty.findById(id);
  if (!bounty) return notFound();

  const isSolver = bounty.solver === currentUserId;
  const hasContributed = bounty.contributors?.some(c => c.user === currentUserId);
  const totalContributors = bounty.contributors?.length || 1;
  const hasUpvoted = (bounty.upvotes || []).includes(currentUserId);

  return (
    <div className="max-w-3xl mx-auto p-6 mt-10">
      <Link href="/bounty-board" className="text-blue-500 hover:underline mb-6 inline-block">
        &larr; Back to Board
      </Link>

      <div className="bg-white border p-6 rounded-xl shadow-sm mb-8 relative overflow-visible">
        {bounty.amount > 100 && (
          <div className="absolute top-0 right-0 w-32 h-32 bg-orange-100 rounded-full blur-3xl -z-10 opacity-60 pointer-events-none"></div>
        )}
        
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            
            {/* --- REPLACED: Interactive Upvote & Tip Menu --- */}
            <UpvoteWithTip 
              bountyId={bounty._id.toString()} 
              upvotesCount={bounty.upvotes?.length || 0}
              hasUpvoted={hasUpvoted}
            />

            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold uppercase">
              {bounty.subject}
            </span>
          </div>

          <div className="text-right">
            <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full font-mono font-bold text-lg inline-block mb-1 shadow-sm">
              Prize Pool: ₹{bounty.amount}
            </span>
            {totalContributors > 1 && (
              <p className="text-xs text-gray-500 font-medium tracking-wide">
                🔥 Boosted by {totalContributors} students!
              </p>
            )}
          </div>
        </div>
        <h1 className="text-2xl font-bold mb-4">The Doubt</h1>
        <p className="text-gray-700 whitespace-pre-wrap">{bounty.question}</p>
      </div>

      {/* NOTE: I removed the separate "bg-orange-50" Boost Module that used to be here, 
        because the +10 and +50 tipping buttons are now inside the Upvote menu! 
      */}

      {bounty.status === 'claimed' && isSolver && (
        <div className="bg-indigo-50 border border-indigo-100 p-6 rounded-xl">
          <h2 className="text-xl font-bold mb-4 text-indigo-900">Submit Your Solution</h2>
          <form action={submitSolution} className="flex flex-col gap-4">
            <input type="hidden" name="bountyId" value={bounty._id.toString()} />
            
            <div>
              <label className="block text-sm font-semibold mb-1">Explanation</label>
              <textarea 
                name="solutionText" 
                rows="5"
                placeholder="Explain the concept clearly..." 
                className="w-full p-3 border rounded-lg"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1">Video/Image Link (Optional)</label>
              <input 
                name="solutionLink" 
                type="url" 
                placeholder="https://youtube.com/..." 
                className="w-full p-3 border rounded-lg"
              />
            </div>

            <button type="submit" className="bg-indigo-600 text-white font-bold py-3 rounded-lg hover:bg-indigo-700 transition">
              Mark as Solved & Collect ₹{bounty.amount}
            </button>
          </form>
        </div>
      )}

      {bounty.status === 'solved' && (
        <div className="bg-green-50 border border-green-200 p-6 rounded-xl">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-green-900">Verified Solution</h2>
            <span className="text-xs text-green-700 bg-green-200 px-2 py-1 rounded-full font-medium">
              Bounty of ₹{bounty.amount} paid!
            </span>
          </div>
          
          <p className="text-gray-800 whitespace-pre-wrap mb-4">{bounty.solutionText}</p>
          
          {bounty.solutionLink && (
            <a href={bounty.solutionLink} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline font-semibold flex items-center gap-2">
              View Attached Reference/Video &rarr;
            </a>
          )}
        </div>
      )}

      {bounty.status === 'claimed' && !isSolver && (
        <div className="bg-gray-100 p-6 rounded-xl text-center border">
          <p className="text-gray-600 font-medium animate-pulse">
            A mentor is currently writing the solution... 
          </p>
        </div>
      )}
    </div>
  );
}