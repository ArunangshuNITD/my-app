import { NextResponse } from "next/server";
import { uploadPDF } from "@/lib/cloudinary";

export const runtime = "nodejs"; 
export const dynamic = "force-dynamic";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    if (file.type !== "application/pdf") {
      return NextResponse.json(
        { error: "Only PDF allowed" },
        { status: 400 }
      );
    }

    // Correctly wait for upload and extract the URL
    const uploadResult = await uploadPDF(file);

    // Return the URL string so the frontend can read { url: "..." }
    return NextResponse.json({ url: uploadResult.url });
    
  } catch (err) {
    console.error("UPLOAD ERROR:", err);
    return NextResponse.json(
      { error: "Upload failed" },
      { status: 500 }
    );
  }
}