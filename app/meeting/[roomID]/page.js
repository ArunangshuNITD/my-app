"use client";

import { useEffect, useRef } from 'react';
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';
// import { useSession } from 'next-auth/react'; 

export default function MeetingRoom({ params }) {
  // Unwrap params safely if using Next.js 14/15
  const roomID = params?.roomId || params?.roomID || "default-room"; 
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const initMeeting = async () => {
      // 1. Generate User info
      const userID = Math.random().toString(36).substring(7);
      const userName = `Guest_${userID}`;

      // 2. Fetch your variables safely 
      // Ensure App ID is parsed as an integer!
      const appId = parseInt(process.env.NEXT_PUBLIC_ZEGO_APP_ID, 10);
      const serverSecret = process.env.NEXT_PUBLIC_ZEGO_SERVER_SECRET;

      if (!appId || !serverSecret) {
        console.error("Missing ZegoCloud variables. Check your .env or Vercel settings.");
        return;
      }

      // 3. Generate Kit Token internally (Using ForTest to sign with your own secret)
      const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
        appId,
        serverSecret,
        roomID,
        userID,
        userName
      );

      // 4. Create and join the room
      const zp = ZegoUIKitPrebuilt.create(kitToken);
      
      zp.joinRoom({
        container: containerRef.current,
        maxUsers: 2, // Perfect for 1-on-1 mentoring
        scenario: {
          mode: ZegoUIKitPrebuilt.OneONoneCall, 
        },
        sharedLinks: [
          {
            name: 'Personal link',
            url: `${window.location.origin}/meeting/${roomID}`,
          },
        ],
      });
    };

    initMeeting();
  }, [roomID]);

  return (
    <div className="flex h-screen w-full items-center justify-center bg-gray-900">
      <div ref={containerRef} className="h-full w-full" />
    </div>
  );
}