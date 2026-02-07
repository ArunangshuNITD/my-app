"use client";

import { useEffect, useState } from "react";

export default function DelayedRender({ children, delay = 4000 }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShow(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  if (!show) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-pulse text-zinc-500">Loading...</div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
