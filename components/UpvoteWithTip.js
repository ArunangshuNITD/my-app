"use client";
import { useState } from "react";
import { toggleUpvote, boostBounty } from "@/app/actions/bountyActions";

export default function UpvoteWithTip({ bountyId, upvotesCount, hasUpvoted }) {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className="relative">
      {/* The Main Upvote Button */}
      <button 
        type="button" 
        onClick={() => setShowMenu(!showMenu)}
        className={`flex items-center gap-1 px-3 py-1 rounded-full border text-sm font-bold transition-colors ${
          hasUpvoted 
            ? 'bg-blue-600 text-white border-blue-600' 
            : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-100'
        }`}
      >
        ▲ {upvotesCount}
      </button>

      {/* The Tipping Dropdown Menu */}
      {showMenu && (
        <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl p-3 flex flex-col gap-2 z-50 w-56">
          <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">
            Support this Doubt
          </p>
          
          {/* Option 1: Standard Free Upvote */}
          <form action={toggleUpvote} onSubmit={() => setShowMenu(false)}>
            <input type="hidden" name="bountyId" value={bountyId} />
            <button type="submit" className="w-full text-left px-3 py-2 text-sm font-medium hover:bg-gray-100 rounded-lg transition-colors text-gray-700">
              {hasUpvoted ? "Remove Upvote" : "▲ Free Upvote"}
            </button>
          </form>

          {/* Option 2: Upvote & Tip */}
          <div className="border-t pt-2 mt-1">
            <p className="text-xs text-gray-500 font-medium mb-2 px-1">Boost bounty to get answers faster:</p>
            <form action={boostBounty} className="flex gap-2" onSubmit={() => setShowMenu(false)}>
              <input type="hidden" name="bountyId" value={bountyId} />
              
              <button 
                type="submit" 
                name="boostAmount" 
                value="10" 
                className="flex-1 bg-orange-50 hover:bg-orange-100 text-orange-600 border border-orange-200 text-xs font-bold py-2 rounded-lg transition-colors"
              >
                +₹10 Tip
              </button>
              
              <button 
                type="submit" 
                name="boostAmount" 
                value="50" 
                className="flex-1 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold py-2 rounded-lg transition-colors shadow-sm"
              >
                +₹50 Tip
              </button>
            </form>
          </div>
        </div>
      )}
      
      {/* Invisible backdrop to close the menu when clicking outside */}
      {showMenu && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowMenu(false)}
        ></div>
      )}
    </div>
  );
}