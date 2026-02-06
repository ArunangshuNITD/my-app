"use client";

import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useRef } from "react";

export default function VideoCallPage() {
  const { roomid } = useParams(); // ✅ FIX: must match folder name
  const roomId = roomid;

  const { data: session, status } = useSession();
  const router = useRouter();
  const containerRef = useRef(null);

  const userId =
    session?.user?.email || `guest-${Math.floor(Math.random() * 100000)}`;
  const userName = session?.user?.name || "Guest User";

  useEffect(() => {
    if (
      status === "loading" || // ⛔ wait for session
      !roomId ||
      !containerRef.current
    ) {
      return;
    }

    let zp;

    const startCall = async () => {
      try {
        const res = await fetch("/api/zego/token", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ roomId, userId, userName }),
        });

        if (!res.ok) throw new Error("Token fetch failed");

        const { token } = await res.json();

        if (!token) throw new Error("Invalid Zego token");

        zp = ZegoUIKitPrebuilt.create(token);

        zp.joinRoom({
          container: containerRef.current,
          scenario: {
            mode: ZegoUIKitPrebuilt.OneONOneCall,
          },
          showScreenSharingButton: true,
          showPreJoinView: false,
          onLeaveRoom: () => router.push("/dashboard"),
        });
      } catch (err) {
        console.error("Video call error:", err);
        router.push("/booking-error");
      }
    };

    startCall();

    return () => {
      if (zp) {
        zp.destroy();
      }
    };
  }, [roomId, status]); // ✅ minimal dependencies

  return (
    <div className="w-full h-[calc(100vh-80px)] bg-zinc-900">
      <div ref={containerRef} className="w-full h-full" />
    </div>
  );
}