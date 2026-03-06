// lib/uploadthing.js
import { UTApi } from "uploadthing/server";

// Initialize the UploadThing server API
export const utapi = new UTApi();

export async function uploadChatFile(file) {
  try {
    // UploadThing natively accepts the exact Web File object your FormData gives you!
    const response = await utapi.uploadFiles(file);

    // UploadThing returns an object with either 'data' or 'error'
    if (response.error) {
      console.error("UploadThing Error:", response.error.message);
      throw new Error(`Upload failed: ${response.error.message}`);
    }

    // Return the secure URL of the uploaded PDF/Image
    return response.data.url;
  } catch (error) {
    console.error("Failed to upload file to UploadThing:", error);
    throw error;
  }
}