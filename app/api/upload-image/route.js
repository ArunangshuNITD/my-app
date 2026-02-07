import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

// 1. Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req) {
  try {
    // 2. Get the file from the request
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // 3. Convert file to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 4. Upload to Cloudinary using a Stream
    // We use a Promise wrapper because cloudinary.uploader.upload_stream is callback-based
    const uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "mentor-connect-products", // Optional: Organize in a folder
          resource_type: "image", // Force it to be an image
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      // Write the buffer to the stream
      uploadStream.end(buffer);
    });

    // 5. Return the Cloudinary URL
    return NextResponse.json({ url: uploadResult.secure_url }, { status: 200 });

  } catch (error) {
    console.error("Cloudinary Upload Error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}