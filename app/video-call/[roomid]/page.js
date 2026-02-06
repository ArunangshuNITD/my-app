"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  MeetingProvider, 
  useMeeting, 
  useParticipant 
} from "@videosdk.live/react-sdk";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { 
  FaMicrophone, 
  FaMicrophoneSlash, 
  FaVideo, 
  FaVideoSlash, 
  FaPhoneSlash,
  FaExpand
} from "react-icons/fa";

// 1. Participant View (Individual Video Feed)
function ParticipantView({ participantId }) {
  const { webcamStream, webcamOn, displayName, isLocal } = useParticipant(participantId);
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current && webcamStream && webcamOn) {
      const mediaStream = new MediaStream();
      mediaStream.addTrack(webcamStream.track);
      videoRef.current.srcObject = mediaStream;
      videoRef.current.play().catch((err) => console.error("Video play error:", err));
    }
  }, [webcamStream, webcamOn]);

  return (
    <div className="relative aspect-video bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-800 shadow-2xl">
      {webcamOn ? (
        <video ref={videoRef} className="w-full h-full object-cover mirror" autoPlay playsInline muted={isLocal} />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-zinc-800">
          <div className="w-20 h-20 rounded-full bg-indigo-600 flex items-center justify-center text-2xl font-bold uppercase">
            {displayName?.charAt(0)}
          </div>
        </div>
      )}
      <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg text-white text-xs font-medium border border-white/10">
        {displayName} {isLocal && "(You)"}
      </div>
    </div>
  );
}

// 2. Controls (Mic, Camera, Leave)
function Controls() {
  const { leave, toggleMic, toggleWebcam, localMicOn, localWebcamOn } = useMeeting();
  
  return (
    <div className="flex gap-4 p-6 justify-center bg-zinc-950/80 backdrop-blur-xl border-t border-zinc-800">
      <button 
        onClick={() => toggleMic()} 
        className={`p-4 rounded-full transition-all ${localMicOn ? 'bg-zinc-800 hover:bg-zinc-700 text-white' : 'bg-red-500 text-white'}`}
      >
        {localMicOn ? <FaMicrophone size={20} /> : <FaMicrophoneSlash size={20} />}
      </button>
      
      <button 
        onClick={() => toggleWebcam()} 
        className={`p-4 rounded-full transition-all ${localWebcamOn ? 'bg-zinc-800 hover:bg-zinc-700 text-white' : 'bg-red-500 text-white'}`}
      >
        {localWebcamOn ? <FaVideo size={20} /> : <FaVideoSlash size={20} />}
      </button>

      <button 
        onClick={() => leave()} 
        className="bg-rose-600 p-4 rounded-full hover:bg-rose-500 text-white px-8 flex items-center gap-2 font-bold transition-all hover:scale-105 active:scale-95"
      >
        <FaPhoneSlash size={20} /> <span className="hidden sm:inline">End Session</span>
      </button>
    </div>
  );
}

// 3. Main Meeting Container
function MeetingView({ onLeave }) {
  const [joined, setJoined] = useState(null);
  
  const { join, participants } = useMeeting({
    onMeetingJoined: () => setJoined("JOINED"),
    onMeetingLeft: onLeave,
  });

  return (
    <div className="flex flex-col h-full bg-zinc-950">
      {joined === "JOINED" ? (
        <div className="flex-1 flex flex-col">
          {/* Responsive Grid Layout */}
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 p-6 content-center max-w-6xl mx-auto w-full">
            {[...participants.keys()].map((participantId) => (
              <ParticipantView key={participantId} participantId={participantId} />
            ))}
          </div>
          <Controls />
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center gap-6 text-white p-4 text-center">
          <div className="w-20 h-20 bg-indigo-500/20 rounded-full flex items-center justify-center mb-4">
             <FaVideo className="text-indigo-400 text-4xl animate-pulse" />
          </div>
          <h2 className="text-3xl font-bold tracking-tight">Ready to start your session?</h2>
          <p className="text-zinc-400 max-w-md">Ensure your camera and microphone are working before joining the classroom.</p>
          <button
            onClick={join}
            className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white px-10 py-4 rounded-2xl font-extrabold text-lg shadow-2xl shadow-indigo-500/20 transition-all hover:scale-105 active:scale-95"
          >
            Join Classroom Now
          </button>
        </div>
      )}
    </div>
  );
}

// 4. Page Wrapper
export default function VideoCallPage() {
  const { roomid } = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const [token, setToken] = useState(null);

  useEffect(() => {
    // Calling your new API route
    fetch("/api/video/token")
      .then(res => res.json())
      .then(data => setToken(data.token))
      .catch(err => console.error("Token fetch error:", err));
  }, []);

  if (!token) return (
    <div className="h-screen bg-zinc-950 flex flex-col items-center justify-center gap-4 text-white">
      <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-zinc-400 font-medium">Securing connection...</p>
    </div>
  );

  return (
    <div className="w-full h-screen bg-zinc-950 overflow-hidden">
      <MeetingProvider
        config={{
          meetingId: roomid,
          micEnabled: true,
          webcamEnabled: true,
          name: session?.user?.name || "Student", 
        }}
        token={token}
      >
        <MeetingView onLeave={() => router.push("/dashboard")} />
      </MeetingProvider>
    </div>
  );
}