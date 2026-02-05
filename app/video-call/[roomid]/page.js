"use client";

import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';
import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation'; 
import { useEffect, useRef } from 'react';

export default function VideoCallPage() {
  const params = useParams();
  const roomId = params?.roomId; 
  
  const { data: session } = useSession();
  const router = useRouter();
  const containerRef = useRef(null); 

  // Generate unique user info based on login
  const userId = session?.user?.email || `guest-${Math.floor(Math.random() * 10000)}`;
  const userName = session?.user?.name || "Guest User";

  useEffect(() => {
    // Safety Check
    if (!roomId || !containerRef.current) return;

    // 1. Declare the instance variable OUTSIDE the async function
    // so the cleanup function can access it.
    let zp; 

    const myMeeting = async () => {
      // ---------------------------------------------------------
      // REPLACE THESE WITH YOUR ACTUAL KEYS
      // ---------------------------------------------------------
      const appID = 123456789; 
      const serverSecret = "YOUR_SERVER_SECRET_HERE"; 

      const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
        appID,
        serverSecret,
        roomId, 
        userId,
        userName
      );

      // 2. Assign the instance to the outer variable
      zp = ZegoUIKitPrebuilt.create(kitToken);

      zp.joinRoom({
        container: containerRef.current,
        scenario: {
          mode: ZegoUIKitPrebuilt.OneONOneCall, // Or .GroupCall if needed
        },
        showScreenSharingButton: true,
        showPreJoinView: false,
        onLeaveRoom: () => {
          router.push('/dashboard');
        }
      });
    };

    myMeeting();

    // 3. CLEANUP FUNCTION: Destroys the old instance when React re-renders.
    // This fixes the black screen issue in Strict Mode.
    return () => {
      if (zp) {
        zp.destroy();
      }
    };

  }, [roomId, userId, userName, router, session]); 

  return (
    // 4. CSS Fix: usage of h-[calc(100vh-80px)] ensures the video fits 
    // exactly under your navbar without creating a double scrollbar.
    <div className="w-full h-[calc(100vh-80px)] bg-zinc-900 flex flex-col items-center justify-center">
      <div ref={containerRef} className="w-full h-full" />
    </div>
  );
}