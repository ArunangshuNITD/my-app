import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Blog from "@/models/Blog";

// ⚠️ UPDATE THIS WITH YOUR REAL EMAIL
const ADMIN_EMAILS = ["arunangshud3@gmail.com"]; 

// 🔄 HELPER: Recursive Delete Function
// Scans the tree, finds the ID, checks permission, and deletes it.
function deleteCommentRecursive(commentsArray, targetId, userEmail, isAdmin) {
  // Loop through the current layer of comments
  for (let i = 0; i < commentsArray.length; i++) {
    const comment = commentsArray[i];

    // 1. Found the target comment/reply?
    if (comment._id.toString() === targetId) {
      // Check Permissions (Owner or Admin)
      if (comment.email !== userEmail && !isAdmin) {
        throw new Error("Forbidden: You are not authorized to delete this.");
      }
      
      // Remove it from the array
      commentsArray.splice(i, 1);
      return true; // Success! Stop searching.
    }

    // 2. If not found, look inside this comment's replies (Recursion)
    if (comment.replies && comment.replies.length > 0) {
      const isDeleted = deleteCommentRecursive(comment.replies, targetId, userEmail, isAdmin);
      if (isDeleted) return true; // Propagate success up
    }
  }
  return false; // Not found in this branch
}

export async function DELETE(req, { params }) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await dbConnect();

    // 1. Extract IDs
    const { id, commentId } = await params;
    
    // 2. Fetch the Blog
    const blog = await Blog.findById(id);
    if (!blog) return NextResponse.json({ error: "Blog not found" }, { status: 404 });

    const userEmail = session.user.email;
    const isAdmin = ADMIN_EMAILS.includes(userEmail);

    // 3. Perform Recursive Delete
    // We modify 'blog.comments' in-memory using the helper function
    try {
      const foundAndDeleted = deleteCommentRecursive(blog.comments, commentId, userEmail, isAdmin);

      if (!foundAndDeleted) {
        return NextResponse.json({ error: "Comment or Reply not found" }, { status: 404 });
      }

      // 4. Save Changes
      // Vital: Tell Mongoose that 'comments' was modified so it saves deep changes
      blog.markModified('comments'); 
      await blog.save();

      console.log(`✅ Successfully deleted comment/reply: ${commentId}`);
      return NextResponse.json(blog.comments, { status: 200 });

    } catch (err) {
      // Handle permission errors thrown by the helper
      if (err.message.includes("Forbidden")) {
        console.log(`⛔ Permission denied for user: ${userEmail}`);
        return NextResponse.json({ error: err.message }, { status: 403 });
      }
      throw err; // Rethrow unexpected errors
    }

  } catch (error) {
    console.error("🔥 SERVER DELETE ERROR:", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}