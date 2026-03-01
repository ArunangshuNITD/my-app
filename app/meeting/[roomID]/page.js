"use client";

import { useEffect, useRef } from 'react';
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';
import { useSession } from 'next-auth/react'; 

export default function MeetingRoom({ params }) {
  const { roomID } = params;
  const containerRef = useRef(null);
  // const { data: session } = useSession();

  useEffect(() => {
    if (!containerRef.current) return;

    const initMeeting = async () => {
      // 1. Generate User info (Use real user data if available from session)
      const userID = /* session?.user?.id || */ Math.random().toString(36).substring(7);
      const userName = /* session?.user?.name || */ `Guest_${userID}`;
      const appId = 1484647939; // From your reference

      // 2. Fetch Token from your token server
      const response = await fetch(`https://nextjs-token.vercel.app/api/access_token?userID=${userID}&expired_ts=7200`);
      const { token } = await response.json();

      // 3. Generate Kit Token
      const KitToken = ZegoUIKitPrebuilt.generateKitTokenForProduction(
        appId,
        token,
        roomID,
        userID,
        userName
      );

      // 4. Create and join the room
      const zp = ZegoUIKitPrebuilt.create(KitToken);
      zp.joinRoom({
        container: containerRef.current,
        maxUsers: 4, // or 2 if it's strictly 1-on-1 mentoring
        scenario: {
          mode: ZegoUIKitPrebuilt.OneONoneCall, // Changed to OneONoneCall for mentoring (or keep GroupCall)
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
      {/* This div is where ZegoCloud will inject the video UI */}
      <div ref={containerRef} className="h-full w-full" />
    </div>
  );
}