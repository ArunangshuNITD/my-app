import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Blog from "@/models/Blog";

// ⚠️ REPLACE WITH YOUR REAL ADMIN EMAIL
const ADMIN_EMAILS = ["arunangshud3@gmail.com"]; 

// 0. GET: Fetch a single Blog
export async function GET(req, { params }) {
  try {
    await dbConnect();
    const { id } = await params;

    const blog = await Blog.findById(id);
    if (!blog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    return NextResponse.json(blog, { status: 200 });

  } catch (error) {
    console.error("Fetch Error:", error);
    return NextResponse.json({ error: "Failed to fetch blog" }, { status: 500 });
  }
}

// 1. PUT: Update Status (Approve/Reject) + Triggers Hashtag System
export async function PUT(req, { params }) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const userEmail = session.user.email;
    const isAdmin = ADMIN_EMAILS.includes(userEmail);

    // ✅ SECURITY CHECK: Only Admins can change status
    if (!isAdmin) {
       return NextResponse.json({ error: "Forbidden: Admins only" }, { status: 403 });
    }

    await dbConnect();
    const { id } = await params; 
    const body = await req.json();
    const { status } = body; 

    // ⚠️ CHANGED: Replaced findByIdAndUpdate with findById + save()
    // This ensures the Schema Pre-Save Hook runs to update hashtags if needed
    const blog = await Blog.findById(id);

    if (!blog) return NextResponse.json({ error: "Blog not found" }, { status: 404 });

    // Update the status
    blog.status = status;

    // Save triggers the 'pre' hook in your Schema (updating tags automatically)
    await blog.save();

    return NextResponse.json(blog, { status: 200 });

  } catch (error) {
    console.error("Update Error:", error);
    return NextResponse.json({ error: "Failed to update blog" }, { status: 500 });
  }
}

// 2. DELETE: Remove a Blog (No changes needed for hashtags here)
export async function DELETE(req, { params }) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await dbConnect();
    const { id } = await params;

    // 1. Find the blog first (to check ownership)
    const blog = await Blog.findById(id);
    if (!blog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    const userEmail = session.user.email;
    const isAdmin = ADMIN_EMAILS.includes(userEmail);
    const isAuthor = blog.authorEmail === userEmail;

    // ✅ SECURITY CHECK: Must be Author OR Admin
    if (!isAuthor && !isAdmin) {
      return NextResponse.json({ error: "Forbidden: You cannot delete this blog" }, { status: 403 });
    }

    // 2. Perform Delete
    await Blog.findByIdAndDelete(id);

    return NextResponse.json({ message: "Blog deleted successfully" }, { status: 200 });

  } catch (error) {
    console.error("Delete Error:", error);
    return NextResponse.json({ error: "Failed to delete blog" }, { status: 500 });
  }
}