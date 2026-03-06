import { v2 as cloudinary } from 'cloudinary';

// Configure with the keys you just added to .env
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadImage(file) {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = new Uint8Array(arrayBuffer);

  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      { folder: "mentor-connect" }, // This creates a folder in Cloudinary
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(result.secure_url);
      }
    ).end(buffer);
  });
}
export async function uploadPDF(file) {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      {
        folder: "mentor-connect/pdfs",
        resource_type: "raw", // 🔥 REQUIRED for PDFs
        format: "pdf",
      },
      (error, result) => {
        if (error) return reject(error);
        resolve({
          url: result.secure_url,
          public_id: result.public_id,
          pages: result.pages || null,
          bytes: result.bytes,
        });
      }
    ).end(buffer);
  });
}
// Add this below your existing uploadPDF function in lib/cloudinary.js

// Add this below your existing uploadPDF function in lib/cloudinary.js

export async function uploadChatFile(file) {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  // Determine the correct resource type for Cloudinary
  let resourceType = "auto"; // "auto" works perfectly for images, videos, and audio
  
  // If it's a PDF, DOCX, ZIP, etc., Cloudinary REQUIRES the resource_type to be "raw"
  if (
    file.type === "application/pdf" || 
    (!file.type.startsWith("image/") && !file.type.startsWith("video/") && !file.type.startsWith("audio/"))
  ) {
    resourceType = "raw"; 
  }

  // Create a safe version of the filename (replaces spaces with underscores)
  const safeFilename = file.name ? file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_") : `attachment_${Date.now()}`;

  // Configure the upload options dynamically
  const uploadOptions = {
    folder: "mentor-connect/chat",
    resource_type: resourceType,
  };

  // 🔥 THE FIX: For raw documents, we MUST append the filename to the public_id 
  // so the URL actually ends in ".pdf", ".docx", etc.
  if (resourceType === "raw") {
    uploadOptions.public_id = `${Date.now()}_${safeFilename}`;
  } else {
    // Images and videos handle extensions fine automatically
    uploadOptions.use_filename = true; 
    uploadOptions.unique_filename = true;
  }

  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      uploadOptions, 
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }
        // For the chat, we just return the URL so we can save it to MongoDB
        resolve(result.secure_url);
      }
    ).end(buffer);
  });
}