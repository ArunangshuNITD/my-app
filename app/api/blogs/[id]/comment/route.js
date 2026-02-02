import Blog from "@/models/Blog"; 
import { NextResponse } from "next/server";
import dbConnect from "@/lib/db"; 

// Recursive Helper
const addReplyRecursively = (comments, parentId, newReply) => {
    for (let comment of comments) {
        if (comment._id.toString() === parentId) {
            if (!comment.replies) comment.replies = [];
            comment.replies.push(newReply);
            return true; 
        }
        if (comment.replies?.length > 0) {
            const found = addReplyRecursively(comment.replies, parentId, newReply);
            if (found) return true; 
        }
    }
    return false; 
};

export const POST = async (req, { params }) => {
    try {
        await dbConnect();
        
        // 1. Await Params & Parse Body INSIDE try/catch for safety
        const { id } = await params;
        const body = await req.json();
        const { text, parentCommentId, name, email, image } = body;

        // 2. Validate ID
        if (!id) {
            return NextResponse.json({ message: "Blog ID is missing" }, { status: 400 });
        }

        const blog = await Blog.findById(id);
        if (!blog) {
            return NextResponse.json({ message: "Blog not found" }, { status: 404 });
        }

        const newComment = {
            name: name || "Anonymous",
            email,
            image,
            text,
            createdAt: new Date(),
            replies: [] 
        };

        // 3. Add Comment or Reply
        if (!parentCommentId) {
            // Root comment
            blog.comments.push(newComment);
        } else {
            // Nested reply
            const isAdded = addReplyRecursively(blog.comments, parentCommentId, newComment);
            
            if (!isAdded) {
                return NextResponse.json({ message: "Parent comment not found" }, { status: 404 });
            }
            
            // Mark as modified so Mongoose knows to save the nested array
            blog.markModified('comments'); 
        }

        // 4. Save
        await blog.save();
        
        return NextResponse.json(blog.comments, { status: 201 });

    } catch (error) {
        console.error("❌ Comment API Error:", error);
        // Return JSON error so frontend doesn't crash with "Unexpected end of JSON"
        return NextResponse.json(
            { message: "Server Error", error: error.message }, 
            { status: 500 }
        );
    }
};