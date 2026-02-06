import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
// IMPORTANT: Update this path to where your lib/auth.js is located
import { auth } from "@/lib/auth"; 

export async function GET() {
  try {
    // 1. Verify Session with Auth.js v5
    const session = await auth(); 
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Load VideoSDK Credentials
    const API_KEY = process.env.VIDEOSDK_API_KEY;
    const SECRET = process.env.VIDEOSDK_SECRET;

    if (!API_KEY || !SECRET) {
      console.error("Missing VideoSDK credentials in Environment Variables");
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
    }

    // 3. Define Token Options
    const options = { 
      expiresIn: "120m", 
      algorithm: "HS256" 
    };

    // 4. Set Permissions based on role
    // Mentors/Admins get moderator rights; others just join
    const isMod = session.user.role === "mentor" || session.user.role === "admin";
    
    const payload = {
      apikey: API_KEY,
      permissions: isMod 
        ? ["ask_join", "allow_join", "allow_mod"] 
        : ["ask_join", "allow_join"],
      version: 2,
    };

    // 5. Sign and Return Token
    const token = jwt.sign(payload, SECRET, options);

    return NextResponse.json({ token });
    
  } catch (error) {
    console.error("JWT Generation Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}