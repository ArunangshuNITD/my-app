import dbConnect from "@/lib/db";
import Product from "@/models/Product";

export async function POST(req, { params }) {
  try {
    const { id } = await params;
    const { user, rating, comment } = await req.json();

    if (!rating || !comment || !user) {
      return Response.json({ error: "Missing fields" }, { status: 400 });
    }

    await dbConnect();
    const product = await Product.findById(id);

    if (!product) {
      return Response.json({ error: "Product not found" }, { status: 404 });
    }

    // Add new review to the array
    const newReview = {
      user,
      rating: Number(rating),
      comment,
      createdAt: new Date(),
    };

    product.reviews.push(newReview);

    // Update aggregate totals
    product.totalRatings = product.reviews.length;
    
    // Calculate new average: (Sum of all ratings) / (Number of reviews)
    const totalSum = product.reviews.reduce((acc, item) => item.rating + acc, 0);
    product.rating = (totalSum / product.reviews.length).toFixed(1);

    await product.save();

    return Response.json({ message: "Review added successfully" }, { status: 201 });
  } catch (error) {
    console.error("Review Error:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}