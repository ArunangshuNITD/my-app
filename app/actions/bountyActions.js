"use server"
import dbConnect from "@/lib/db";
import Bounty from "@/models/Bounty";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { calculateSurgePrice } from "@/lib/surgePricing"; // NEW: Import helper

export async function createBounty(formData) {
  await dbConnect();
  
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("You must be logged in to post a bounty.");
  }

  const amount = Number(formData.get('amount'));
  
  // NEW: Get surge parameters from the form
  const deadlineInput = formData.get('deadline'); 
  const maxBudgetInput = Number(formData.get('maxBudget'));

  const rawFormData = {
    question: formData.get('question'),
    subject: formData.get('subject'),
    amount: amount,
    // NEW: Save the surge fields
    maxBudget: maxBudgetInput || amount, // Fallback to amount if no budget provided
    deadline: deadlineInput ? new Date(deadlineInput) : null,
    student: session.user.id, 
    contributors: [{ user: session.user.id, amount: amount }],
    upvotes: [session.user.id] // Automatically upvote your own post
  };
  
  await Bounty.create(rawFormData);
  revalidatePath('/bounty-board');
}

export async function boostBounty(formData) {
  await dbConnect();
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const bountyId = formData.get('bountyId');
  const boostAmount = Number(formData.get('boostAmount'));

  if (boostAmount <= 0) throw new Error("Invalid boost amount");

  // ---> IMPORTANT: Wallet Deduction Logic Goes Here <---
  // e.g., await UserProfile.findByIdAndUpdate(session.user.id, { $inc: { wallet: -boostAmount } })

  // Find the bounty, increase amount, push contributor, AND automatically upvote
  await Bounty.findByIdAndUpdate(bountyId, {
    $inc: { amount: boostAmount, maxBudget: boostAmount }, // NEW: Increase maxBudget to match the boost
    $push: { contributors: { user: session.user.id, amount: boostAmount } },
    $addToSet: { upvotes: session.user.id } // SCENARIO 1 FIX: Automatically add upvote when boosting
  });

  revalidatePath(`/bounty-board/${bountyId}`);
  revalidatePath('/bounty-board');
}

export async function claimBounty(bountyId) {
  await dbConnect();
  
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("You must be logged in to claim a bounty.");
  }

  // UPDATED: Securely calculate and lock the final price
  const bounty = await Bounty.findById(bountyId);
  if (!bounty) throw new Error("Bounty not found");
  if (bounty.status !== 'open') throw new Error("Bounty is already claimed");

  let actualPayout = bounty.amount;
  if (bounty.deadline && bounty.maxBudget) {
    actualPayout = calculateSurgePrice(bounty.amount, bounty.maxBudget, bounty.createdAt, bounty.deadline);
  }

  // Lock in the final price so the student isn't charged more later
  await Bounty.findByIdAndUpdate(bountyId, { 
    solver: session.user.id, 
    status: 'claimed',
    finalPrice: actualPayout // NEW: Save the exact amount the solver earned
  });
  
  revalidatePath('/bounty-board');
  redirect(`/bounty-board/${bountyId}`); 
}

export async function submitSolution(formData) {
  await dbConnect();
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const bountyId = formData.get('bountyId');
  const solutionText = formData.get('solutionText');
  const solutionLink = formData.get('solutionLink');

  await Bounty.findOneAndUpdate(
    { _id: bountyId, solver: session.user.id }, 
    {
      solutionText,
      solutionLink,
      status: 'solved'
    }
  );

  revalidatePath(`/bounty-board/${bountyId}`);
  revalidatePath('/bounty-board');
}

export async function toggleUpvote(formData) {
  await dbConnect();
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const bountyId = formData.get('bountyId');
  const userId = session.user.id;

  const bounty = await Bounty.findById(bountyId);
  if (!bounty) return;

  const hasUpvoted = (bounty.upvotes || []).includes(userId);

  if (hasUpvoted) {
    await Bounty.findByIdAndUpdate(bountyId, { $pull: { upvotes: userId } });
  } else {
    await Bounty.findByIdAndUpdate(bountyId, { $addToSet: { upvotes: userId } });
  }

  revalidatePath(`/bounty-board/${bountyId}`);
  revalidatePath('/bounty-board');
}