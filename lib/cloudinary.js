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