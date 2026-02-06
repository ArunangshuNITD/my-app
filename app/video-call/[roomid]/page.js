"use client";

import React, { useState, useEffect } from "react";
import { MeetingProvider, MeetingConsumer, useMeeting, useParticipant } from "@videosdk.live/react-sdk";
import { useParams, useRouter } from "next/navigation";

// 1. Participant View (Individual Video Feed)
function ParticipantView({ participantId }) {
  const { webcamStream, webcamOn, displayName } = useParticipant(participantId);
  const videoRef = React.useRef(null);

  useEffect(() => {
    if (videoRef.current && webcamStream && webcamOn) {
      const mediaStream = new MediaStream();
      mediaStream.addTrack(webcamStream.track);
      videoRef.current.srcObject = mediaStream;
      videoRef.current.play().catch((v) => console.error("videoPlay error", v));
    }
  }, [webcamStream, webcamOn]);

  return (
    <div className="relative flex-1 bg-zinc-800 rounded-lg overflow-hidden min-h-[300px]">
      <video ref={videoRef} className="w-full h-full object-cover" autoPlay playsInline muted={false} />
      <div className="absolute bottom-2 left-2 bg-black/50 px-2 py-1 rounded text-white text-xs">
        {displayName}
      </div>
    </div>
  );
}

// 2. Controls (Mic, Camera, Leave)
function Controls() {
  const { leave, toggleMic, toggleWebcam } = useMeeting();
  return (
    <div className="flex gap-4 p-4 justify-center bg-zinc-900 border-t border-zinc-800">
      <button onClick={() => toggleMic()} className="bg-zinc-700 p-3 rounded-full hover:bg-zinc-600 text-white">Mic</button>
      <button onClick={() => toggleWebcam()} className="bg-zinc-700 p-3 rounded-full hover:bg-zinc-600 text-white">Camera</button>
      <button onClick={() => leave()} className="bg-red-600 p-3 rounded-full hover:bg-red-500 text-white px-6 font-bold">Leave</button>
    </div>
  );
}

// 3. Main Meeting Container
function MeetingView({ onLeave }) {
  const { participants, join } = useMeeting({ onMeetingLeft: onLeave });

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
        {[...participants.keys()].map((participantId) => (
          <ParticipantView key={participantId} participantId={participantId} />
        ))}
      </div>
      <Controls />
    </div>
  );
}

// 4. Page Wrapper
export default function VideoCallPage() {
  const { roomid } = useParams();
  const router = useRouter();
  const [token, setToken] = useState(null);

  useEffect(() => {
    fetch("/api/video/token").then(res => res.json()).then(data => setToken(data.token));
  }, []);

  if (!token) return <div className="h-screen bg-black text-white flex items-center justify-center">Loading Room...</div>;

  return (
    <div className="w-full h-[calc(100vh-80px)] bg-black">
      <MeetingProvider
        config={{
          meetingId: roomid,
          micEnabled: true,
          webcamEnabled: true,
          name: "User", // You can pass session.user.name here
        }}
        token={token}
      >
        <MeetingView onLeave={() => router.push("/dashboard")} />
      </MeetingProvider>
    </div>
  );
}