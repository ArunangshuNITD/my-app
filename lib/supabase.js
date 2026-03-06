// lib/supabase.js
import { createClient } from "@supabase/supabase-js";

// Initialize the Supabase client using the Secret Service Role Key
// This allows your Next.js server to upload files without needing complex security policies
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

export async function uploadChatFile(file) {
  try {
    // 1. Convert the Web File to a raw ArrayBuffer
    const bytes = await file.arrayBuffer();

    // 2. Create a safe, unique file name
    const uniqueFileName = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`;

    // 3. Upload to the "chat-files" bucket
    const { data, error } = await supabase.storage
      .from("chat-files") // Make sure this matches your bucket name!
      .upload(uniqueFileName, bytes, {
        contentType: file.type,
        upsert: false,
      });

    if (error) {
      console.error("Supabase Upload Error:", error.message);
      throw new Error(error.message);
    }

    // 4. Get the public, clickable URL
    const { data: publicUrlData } = supabase.storage
      .from("chat-files")
      .getPublicUrl(uniqueFileName);

    return publicUrlData.publicUrl;
  } catch (error) {
    console.error("Failed to upload file to Supabase:", error);
    throw error;
  }
}