"use server";

import dbConnect from "@/lib/db";
import Product from "@/models/Product";
import { auth } from "@/lib/auth"; // Import 'auth' directly
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createProduct(formData) {
  // 1. Check Authentication
  const session = await auth(); // v5 way
  if (!session?.user) {
    throw new Error("Unauthorized: You must be logged in.");
  }

  await dbConnect();

  // 2. Extract Data
  const name = formData.get("name");
  const description = formData.get("description");
  const price = Number(formData.get("price"));
  const stock = Number(formData.get("stock"));
  const subjectsString = formData.get("subjects");
  
  // URLs from Cloudinary (or local upload)
  const pdfUrl = formData.get("pdfUrl");
  const coverImage = formData.get("coverImage");

  if (!name || !price || !pdfUrl || !coverImage) {
    throw new Error("Missing required fields");
  }

  // 3. Create Product
  await Product.create({
    name,
    description,
    price,
    stock,
    subjects: subjectsString ? subjectsString.split(",").map(s => s.trim()) : [],
    pdfUrl,
    coverImage,
    createdBy: session.user.email,
  });

  revalidatePath("/store");
  revalidatePath("/profile");
  redirect("/store");
}