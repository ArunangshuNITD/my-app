import { NextResponse } from "next/server";
import { auth } from "@/lib/auth"; // Import 'auth' directly from your config
import dbConnect from "@/lib/db";
import Order from "@/models/Order";
import Product from "@/models/Product";

// 1. CREATE ORDER (POST)
export async function POST(req) {
  try {
    const session = await auth(); // v5 way to get session
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    
    const { items, totalAmount } = await req.json();

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    // A. Create Order
    const newOrder = await Order.create({
      userEmail: session.user.email,
      items: items.map((item) => ({
        productId: item._id,
        name: item.name,
        price: item.price,
        coverImage: item.coverImage || item.thumbnail || "/placeholder.jpg",
        quantity: item.quantity || 1,
      })),
      totalAmount,
    });

    // B. Decrease Stock
    for (const item of items) {
      await Product.findByIdAndUpdate(item._id, { $inc: { stock: -1 } });
    }

    return NextResponse.json({ message: "Order successful", order: newOrder }, { status: 201 });
  } catch (error) {
    console.error("Order Error:", error);
    return NextResponse.json({ error: "Failed to place order" }, { status: 500 });
  }
}

// 2. FETCH USER ORDERS (GET)
export async function GET(req) {
  try {
    const session = await auth(); // v5 way
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const orders = await Order.find({ userEmail: session.user.email }).sort({ createdAt: -1 });

    return NextResponse.json(orders, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}