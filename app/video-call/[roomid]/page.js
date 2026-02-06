"use client";

import dynamic from "next/dynamic";
import { useParams } from "next/navigation";

// This is the magic part: it disables Server-Side Rendering for the video component
const VideoCallInterface = dynamic(
  () => import("@/components/VideoCallInterface"), 
  { 
    ssr: false,
    loading: () => (
      <div className="h-screen bg-zinc-950 flex flex-col items-center justify-center gap-4 text-white">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-zinc-400 font-medium">Loading Video Engine...</p>
      </div>
    )
  }
);

export default function VideoPage() {
  const params = useParams();
  
  // Pass the roomid down to the client-only component
  return <VideoCallInterface roomid={params.roomid} />;
}