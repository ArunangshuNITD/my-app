import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { getServerSession } from "next-auth/next"; // Adjust import based on your Auth setup
// import { authOptions } from "@/app/api/auth/[...nextauth]/route"; // Uncomment if using NextAuth v4

export async function GET() {
  try {
    // 1. Check for Authentication
    // const session = await getServerSession(authOptions); 
    // if (!session) {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    // }

    const API_KEY = process.env.VIDEOSDK_API_KEY;
    const SECRET = process.env.VIDEOSDK_SECRET;

    // 2. Validate Environment Variables
    if (!API_KEY || !SECRET) {
      console.error("Missing VideoSDK credentials in .env");
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
    }

    const options = { 
      expiresIn: "120m", 
      algorithm: "HS256" 
    };

    const payload = {
      apikey: API_KEY,
      permissions: ["ask_join", "allow_join", "allow_mod"], 
      // Optional: version: 2 (recommended by VideoSDK for newer features)
    };

    const token = jwt.sign(payload, SECRET, options);

    return NextResponse.json({ token });
  } catch (error) {
    console.error("JWT Generation Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}