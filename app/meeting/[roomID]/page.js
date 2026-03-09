"use client";

import { use } from 'react'; // 1. Import 'use' from React
import { JitsiMeeting } from '@jitsi/react-sdk';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react'; 

export default function MeetingRoom({ params }) {
  const router = useRouter();
  const { data: session } = useSession();

  // 2. Unwrap the params Promise
  const resolvedParams = use(params);
  
  // 3. Extract the ID safely from the resolved object
  // (Make sure this matches your folder name, e.g., [roomId] or [id])
  const roomID = resolvedParams?.roomId || resolvedParams?.id || resolvedParams?.roomID || "default-room"; 

  // Dynamically set the user's name from their session, fallback to a guest name
  const userName = session?.user?.name || `Guest_${Math.random().toString(36).substring(7)}`;
  const userEmail = session?.user?.email || '';

  return (
    <div className="flex h-screen w-full items-center justify-center bg-gray-900">
      <JitsiMeeting
        domain="meet.jit.si"
        roomName={`MentorAppSession_${roomID}`} 
        configOverwrite={{
          startWithAudioMuted: false,
          startWithVideoMuted: false,
          disableModeratorIndicator: true,
          prejoinPageEnabled: false, 
        }}
        interfaceConfigOverwrite={{
          DISABLE_JOIN_LEAVE_NOTIFICATIONS: true,
          SHOW_CHROME_EXTENSION_BANNER: false,
        }}
        userInfo={{
          displayName: userName,
          email: userEmail,
        }}
        getIFrameRef={(iframeRef) => {
          iframeRef.style.height = '100%';
          iframeRef.style.width = '100%';
        }}
        onReadyToClose={() => {
          router.push('/profile'); 
        }}
      />
    </div>
  );
}