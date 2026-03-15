"use client";

import { JitsiMeeting } from '@jitsi/react-sdk';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react'; 

export default function MeetingRoom({ params }) {
  const router = useRouter();
  const { data: session } = useSession();

  // Unwrap params safely if using Next.js 14/15
  const roomID = params?.roomId || params?.roomID || "default-room"; 

  // Dynamically set the user's name from their session, fallback to a guest name
  const userName = session?.user?.name || `Guest_${Math.random().toString(36).substring(7)}`;
  const userEmail = session?.user?.email || '';

  return (
    <div className="flex h-screen w-full items-center justify-center bg-gray-900">
      <JitsiMeeting
        domain="meet.jit.si"
        // We add a prefix just to ensure the room is completely unique on Jitsi's public servers
        roomName={`MentorAppSession_${roomID}`} 
        configOverwrite={{
          startWithAudioMuted: false,
          startWithVideoMuted: false,
          disableModeratorIndicator: true,
          prejoinPageEnabled: false, // Set to true if you want them to see a preview screen before joining
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
          // Ensures the Jitsi iframe takes up the full container
          iframeRef.style.height = '100%';
          iframeRef.style.width = '100%';
        }}
        onReadyToClose={() => {
          // When the user clicks the red "Leave" button, redirect them back to the dashboard/profile
          router.push('/profile'); 
        }}
      />
    </div>
  );
}