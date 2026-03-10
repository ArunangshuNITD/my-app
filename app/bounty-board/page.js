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

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Physics & UPSC Bounty Board</h1>
      
      <form action={createBounty} className="mb-10 bg-gray-50 p-4 rounded-lg border">
        <textarea name="question" placeholder="Stuck on a problem? Post it here..." className="w-full p-2 border rounded mb-2" required />
        <div className="flex gap-4">
          <input name="subject" placeholder="Subject (e.g. Physics)" className="border p-2 rounded" required />
          <input name="amount" type="number" placeholder="Bounty (₹)" className="border p-2 rounded w-24" required />
          <button className="bg-blue-600 text-white px-4 py-2 rounded">Post Bounty</button>
        </div>
      </form>

      <div className="grid gap-4">
        {bounties.map((b) => (
          <BountyCard 
            key={b._id} 
            bounty={JSON.parse(JSON.stringify(b))} 
            currentUserId={currentUserId} 
          />
        ))}
      </div>
    </div>
  );
}