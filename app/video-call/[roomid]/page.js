"use client";

import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function VideoCallPage({ params }) {
  const { roomId } = params;
  const { data: session } = useSession();
  const router = useRouter();

  // Generate unique user info based on login
  const userId = session?.user?.email || `guest-${Date.now()}`;
  const userName = session?.user?.name || "Guest User";

  const myMeeting = async (element) => {
    // ---------------------------------------------------------
    // REPLACE THESE WITH YOUR KEYS FROM ZEGOCLOUD CONSOLE
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

    const zp = ZegoUIKitPrebuilt.create(kitToken);

    zp.joinRoom({
      container: element,
      scenario: {
        mode: ZegoUIKitPrebuilt.OneONOneCall,
      },
      showScreenSharingButton: true,
      showPreJoinView: false, // Jump straight in
      onLeaveRoom: () => {
        // Return to dashboard when call ends
        router.push('/dashboard'); 
      }
    });
  };

  return (
    <div className="w-full h-screen bg-zinc-900 flex flex-col items-center justify-center">
      <div ref={myMeeting} className="w-full h-full" />
    </div>
  );
}