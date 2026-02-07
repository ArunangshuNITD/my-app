import dbConnect from "@/lib/db";
import Product from "@/models/Product";

// Add this line to ensure you always get fresh data from the DB
export const dynamic = "force-dynamic"; 

export async function GET() {
  try {
    await dbConnect();
    const products = await Product.find().sort({ createdAt: -1 });
    return Response.json(products);
  } catch (error) {
    return Response.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}