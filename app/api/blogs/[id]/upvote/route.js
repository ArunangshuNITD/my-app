import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Blog from "@/models/Blog";

export async function POST(req, { params }) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await dbConnect();

    // Await params for Next.js 15+ compatibility
    const { id } = await params;
    const userEmail = session.user.email;

    // 1. Check if user already liked
    const blog = await Blog.findById(id);
    if (!blog) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const isUpvoted = blog.upvotes.includes(userEmail);

    let updatedBlog;

    if (isUpvoted) {
      // 2. Remove Upvote (PULL from array)
      updatedBlog = await Blog.findByIdAndUpdate(
        id,
        { $pull: { upvotes: userEmail } }, // $pull removes item
        { new: true }
      );
    } else {
      // 3. Add Upvote (ADD TO SET ensures no duplicates)
      updatedBlog = await Blog.findByIdAndUpdate(
        id,
        { $addToSet: { upvotes: userEmail } }, // $addToSet adds unique only
        { new: true }
      );
    }

    return NextResponse.json({ upvotes: updatedBlog.upvotes }, { status: 200 });

  } catch (error) {
    console.error("Upvote Error:", error);
    return NextResponse.json({ error: "Error voting" }, { status: 500 });
  }
}