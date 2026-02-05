"use client";

import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';
import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation'; // <--- 1. Import useParams
import { useEffect, useRef } from 'react';

export default function VideoCallPage() {
  // 2. Use the hook instead of props
  const params = useParams();
  const roomId = params?.roomId; // Safely access roomId
  
  const { data: session } = useSession();
  const router = useRouter();
  const containerRef = useRef(null); // Use ref for the container

  // Generate unique user info based on login
  const userId = session?.user?.email || `guest-${Math.floor(Math.random() * 10000)}`;
  const userName = session?.user?.name || "Guest User";

  useEffect(() => {
    // 3. Safety Check: Wait until we have a room ID and a container
    if (!roomId || !containerRef.current) return;

    const myMeeting = async () => {
      // ---------------------------------------------------------
      // REPLACE THESE WITH YOUR ACTUAL KEYS
      // ---------------------------------------------------------
      const appID = 123456789; // Replace with your numeric App ID
      const serverSecret = "YOUR_SERVER_SECRET_HERE"; // Replace with your string Secret

      const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
        appID,
        serverSecret,
        roomId, // <--- Now guaranteed to exist
        userId,
        userName
      );

      const zp = ZegoUIKitPrebuilt.create(kitToken);

      zp.joinRoom({
        container: containerRef.current,
        scenario: {
          mode: ZegoUIKitPrebuilt.OneONOneCall,
        },
        showScreenSharingButton: true,
        showPreJoinView: false,
        onLeaveRoom: () => {
          router.push('/dashboard');
        }
      });
    };

    myMeeting();

  }, [roomId, userId, userName, router, session]); // Re-run if these change

  return (
    <div className="w-full h-screen bg-zinc-900 flex flex-col items-center justify-center">
      {/* 4. Attach ref here */}
      <div ref={containerRef} className="w-full h-full" />
    </div>
  );
}