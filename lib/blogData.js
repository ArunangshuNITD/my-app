"use server"; // Mark as server action
import dbConnect from "@/lib/db";
import Blog from "@/models/Blog";

export async function getPosts() {
  try {
    await dbConnect();
    const posts = await Blog.find({}).sort({ createdAt: -1 }); // Sort by newest
    return JSON.parse(JSON.stringify(posts));
  } catch (error) {
    return [];
  }
}

export async function getPostBySlug(slug) {
  try {
    await dbConnect();
    const post = await Blog.findOne({ slug: slug });
    return JSON.parse(JSON.stringify(post));
  } catch (error) {
    return null;
  }
}