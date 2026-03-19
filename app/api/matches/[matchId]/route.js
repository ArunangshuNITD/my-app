import { NextResponse } from "next/server";
import dbConnect from "@/lib/db"; 
import Match from "@/models/Match";

export async function GET(request, { params }) {
  try {
    // 1. Ensure DB is connected
    await dbConnect(); 
    
    // 2. Next.js 16 requires awaiting params
    // Ensure the key here matches your folder name [matchId]
    const { matchId } = await params;
    
    if (!matchId) {
      return NextResponse.json({ success: false, error: "Missing match ID" }, { status: 400 });
    }

    // 3. Fetch match
    const match = await Match.findById(matchId).lean();
    
    if (!match) {
      return NextResponse.json({ success: false, error: "Arena not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true, match });
  } catch (error) {
    console.error("CRITICAL API ERROR:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error", details: error.message }, 
      { status: 500 }
    );
  }
}