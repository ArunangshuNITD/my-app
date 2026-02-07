"use server";

import connectDB from "@/lib/db";
import Product from "@/models/Product";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

/**
 * CREATE PRODUCT
 * Assumes PDF is ALREADY uploaded via /api/upload-pdf
 */
export async function createProduct(formData) {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  await connectDB();

  const pdfUrl = formData.get("pdfUrl");
  if (!pdfUrl) {
    throw new Error("PDF URL missing");
  }

  // Auto-generate cover image from PDF
  const coverImage = pdfUrl.replace(".pdf", ".jpg");

  await Product.create({
    name: formData.get("name"),
    description: formData.get("description"),
    price: Number(formData.get("price")),
    stock: Number(formData.get("stock")),
    subjects:
      formData
        .get("subjects")
        ?.split(",")
        .map(s => s.trim()) || [],
    pdfUrl,
    coverImage,
    createdBy: session.user.email,
  });

  revalidatePath("/store");
  revalidatePath("/profile");
}

/**
 * BUY PRODUCT
 */
export async function buyProduct(productId) {
  await connectDB();

  const product = await Product.findById(productId);

  if (!product || product.stock <= 0) {
    throw new Error("Out of stock");
  }

  product.stock -= 1;
  await product.save();

  revalidatePath("/store");
  revalidatePath(`/store/${productId}`);
}