import Blog from "@/models/Blog";
import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { auth } from "@/lib/auth"; // Ensure this path matches your project

export const dynamic = 'force-dynamic';

// GET: Fetch Blogs
export const GET = async (req) => {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const mode = searchParams.get("mode");

    let query = {};
    // If not admin mode, only show approved posts
    if (mode !== "admin") {
      query.status = "approved";
    }

    const blogs = await Blog.find(query).sort({ createdAt: -1 });
    return NextResponse.json(blogs, { status: 200 });
  } catch (err) {
    return NextResponse.json({ message: "Error", error: err.message }, { status: 500 });
  }
};

// POST: Create New Blog
export const POST = async (req) => {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await dbConnect();
    const body = await req.json();

    const newBlog = await Blog.create({
      title: body.title,
      content: body.content,
      excerpt: body.excerpt,
      category: body.category || "General",
      // 👈 FIX: Fallback if user has no display name
      authorName: session.user.name || session.user.email || "Anonymous",
      authorEmail: session.user.email,
      authorImage: session.user.image,
      status: "pending", 
    });

    return NextResponse.json(newBlog, { status: 201 });
  } catch (error) {
    console.error("Create Blog Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};