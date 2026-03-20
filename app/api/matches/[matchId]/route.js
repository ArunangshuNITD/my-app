// app/api/matches/[matchId]/route.js
import { NextResponse } from "next/server";
import dbConnect from "@/lib/db"; 
import Match from "@/models/Match";

export async function GET(request, { params }) {
  try {
    await dbConnect(); 
    
    // Await params for Next.js 15+ compatibility
    const { matchId } = await params;
    
    if (!matchId) {
      return NextResponse.json({ success: false, error: "Missing match ID" }, { status: 400 });
    }

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