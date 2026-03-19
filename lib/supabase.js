import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// 1. PUBLIC CLIENT (Safe for the browser / "use client")
// This is what your LivePvPBoard will use for real-time matchmaking.
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 2. ADMIN CLIENT (Strictly for Server Actions & API Routes)
// This uses the Service Role Key to bypass security policies for file uploads.
export const supabaseAdmin = supabaseServiceKey 
  ? createClient(supabaseUrl, supabaseServiceKey) 
  : null;

// File Upload Logic
export async function uploadChatFile(file) {
  try {
    const bytes = await file.arrayBuffer();
    const uniqueFileName = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`;

    // NOTE: If you are calling this function from a browser component ("use client"),
    // you MUST use `supabase.storage` (the public client) instead of `supabaseAdmin.storage` 
    // and set up Storage Policies in your Supabase dashboard.
    // If you are calling this from a Server Action/API, `supabaseAdmin` is perfect.
    
    // Using supabaseAdmin here assuming you handle uploads via a server action:
    const activeClient = supabaseAdmin || supabase; 

    const { data, error } = await activeClient.storage
      .from("chat-files") 
      .upload(uniqueFileName, bytes, {
        contentType: file.type,
        upsert: false,
      });

    if (error) {
      console.error("Supabase Upload Error:", error.message);
      throw new Error(error.message);
    }

    const { data: publicUrlData } = activeClient.storage
      .from("chat-files")
      .getPublicUrl(uniqueFileName);

    return publicUrlData.publicUrl;
  } catch (error) {
    console.error("Failed to upload file to Supabase:", error);
    throw error;
  }
}