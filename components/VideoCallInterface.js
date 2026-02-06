"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
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
} from "react-icons/fa";

// 1. Participant View (Handles both Video and Audio)
function ParticipantView({ participantId }) {
  const { webcamStream, micStream, webcamOn, micOn, displayName, isLocal } = useParticipant(participantId);
  
  const videoRef = useRef(null);
  const audioRef = useRef(null);

  // Handle Video Stream
  useEffect(() => {
    if (videoRef.current) {
      if (webcamOn && webcamStream) {
        const mediaStream = new MediaStream();
        mediaStream.addTrack(webcamStream.track);
        videoRef.current.srcObject = mediaStream;
        videoRef.current.play().catch((err) => console.error("Video play error:", err));
      } else {
        videoRef.current.srcObject = null;
      }
    }
  }, [webcamStream, webcamOn]);

  // Handle Audio Stream (Crucial for hearing others!)
  useEffect(() => {
    if (audioRef.current) {
      if (micOn && micStream && !isLocal) {
        const mediaStream = new MediaStream();
        mediaStream.addTrack(micStream.track);
        audioRef.current.srcObject = mediaStream;
        audioRef.current.play().catch((err) => console.error("Audio play error:", err));
      } else {
        audioRef.current.srcObject = null;
      }
    }
  }, [micStream, micOn, isLocal]);

  return (
    <div className="relative aspect-video bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-800 shadow-2xl transition-all">
      {/* Audio element is hidden but necessary */}
      <audio ref={audioRef} autoPlay playsInline muted={isLocal} />
      
      {webcamOn ? (
        <video 
          ref={videoRef} 
          className={`w-full h-full object-cover ${isLocal ? 'scale-x-[-1]' : ''}`} 
          autoPlay 
          playsInline 
          muted={isLocal} 
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-zinc-800">
          <div className="w-20 h-20 rounded-full bg-indigo-600 flex items-center justify-center text-3xl font-bold uppercase text-white shadow-lg">
            {displayName?.charAt(0)}
          </div>
        </div>
      )}

      {/* Overlay Status */}
      <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg text-white text-xs font-medium border border-white/10">
        <div className={`w-2 h-2 rounded-full ${micOn ? 'bg-emerald-500' : 'bg-rose-500'}`} />
        {displayName} {isLocal && "(You)"}
      </div>
    </div>
  );
}

// 2. Controls Component
function Controls() {
  const { leave, toggleMic, toggleWebcam, localMicOn, localWebcamOn } = useMeeting();
  
  return (
    <div className="flex gap-4 p-6 justify-center bg-zinc-950/90 backdrop-blur-xl border-t border-zinc-800/50">
      <button 
        onClick={() => toggleMic()} 
        className={`p-4 rounded-full transition-all hover:scale-110 active:scale-90 ${localMicOn ? 'bg-zinc-800 text-white' : 'bg-rose-500 text-white'}`}
        title={localMicOn ? "Mute Mic" : "Unmute Mic"}
      >
        {localMicOn ? <FaMicrophone size={20} /> : <FaMicrophoneSlash size={20} />}
      </button>
      
      <button 
        onClick={() => toggleWebcam()} 
        className={`p-4 rounded-full transition-all hover:scale-110 active:scale-90 ${localWebcamOn ? 'bg-zinc-800 text-white' : 'bg-rose-500 text-white'}`}
        title={localWebcamOn ? "Turn Off Camera" : "Turn On Camera"}
      >
        {localWebcamOn ? <FaVideo size={20} /> : <FaVideoSlash size={20} />}
      </button>

      <button 
        onClick={() => leave()} 
        className="bg-rose-600 p-4 rounded-full hover:bg-rose-500 text-white px-8 flex items-center gap-2 font-bold transition-all hover:scale-105 active:scale-95 shadow-lg shadow-rose-500/20"
      >
        <FaPhoneSlash size={20} /> <span className="hidden sm:inline">End Session</span>
      </button>
    </div>
  );
}

// 3. Meeting Container
function MeetingView({ onLeave }) {
  const [joined, setJoined] = useState(null);
  const { join, participants } = useMeeting({
    onMeetingJoined: () => setJoined("JOINED"),
    onMeetingLeft: onLeave,
    onError: (error) => console.error("Meeting Error:", error),
  });

  // Get participant list as an array for easier mapping
  const participantIds = useMemo(() => [...participants.keys()], [participants]);

  return (
    <div className="flex flex-col h-full bg-zinc-950">
      {joined === "JOINED" ? (
        <div className="flex-1 flex flex-col">
          <div className={`flex-1 grid gap-6 p-6 content-center max-w-7xl mx-auto w-full 
            ${participantIds.length <= 1 ? 'grid-cols-1 max-w-4xl' : 'grid-cols-1 md:grid-cols-2'}`}>
            {participantIds.map((id) => (
              <ParticipantView key={id} participantId={id} />
            ))}
          </div>
          <Controls />
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center gap-6 text-white p-4 text-center">
          <div className="w-24 h-24 bg-indigo-500/10 rounded-3xl flex items-center justify-center mb-4 border border-indigo-500/20">
             <FaVideo className="text-indigo-400 text-4xl animate-pulse" />
          </div>
          <div className="space-y-2">
            <h2 className="text-4xl font-extrabold tracking-tight">Virtual Classroom</h2>
            <p className="text-zinc-400 max-w-md mx-auto">Ready to begin? Double-check your setup and join the session when you're prepared.</p>
          </div>
          <button
            onClick={join}
            className="mt-4 bg-indigo-600 hover:bg-indigo-500 text-white px-12 py-4 rounded-2xl font-black text-xl shadow-2xl shadow-indigo-500/40 transition-all hover:scale-105 active:scale-95 flex items-center gap-3"
          >
            Enter Classroom
          </button>
        </div>
      )}
    </div>
  );
}

// 4. Main Export Page
export default function VideoCallPage() {
  const params = useParams();
  const roomid = params?.roomid;
  const router = useRouter();
  const { data: session } = useSession();
  const [token, setToken] = useState(null);

  useEffect(() => {
    async function getToken() {
      try {
        const res = await fetch("/api/video/token");
        const data = await res.json();
        if (data.token) setToken(data.token);
      } catch (err) {
        console.error("Token fetch error:", err);
      }
    }
    getToken();
  }, []);

  if (!token || !roomid) return (
    <div className="h-screen bg-zinc-950 flex flex-col items-center justify-center gap-6 text-white">
      <div className="relative flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-indigo-500/20 rounded-full"></div>
        <div className="absolute w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
      <div className="text-center">
        <p className="text-white font-bold text-lg">Initializing Encryption</p>
        <p className="text-zinc-500 text-sm">Setting up your secure learning environment...</p>
      </div>
    </div>
  );

  return (
    <div className="w-full h-screen bg-zinc-950 overflow-hidden">
      <MeetingProvider
        config={{
          meetingId: roomid,
          micEnabled: true,
          webcamEnabled: true,
          name: session?.user?.name || "Member", 
        }}
        token={token}
      >
        <MeetingView onLeave={() => router.push("/profile")} />
      </MeetingProvider>
    </div>
  );
}