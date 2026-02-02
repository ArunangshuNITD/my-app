"use client";

import { ThemeProvider } from "next-themes";
import { SessionProvider } from "next-auth/react";

export default function Providers({ children }) {
  return (
    <SessionProvider>
      {/* attribute="class" is REQUIRED for Tailwind dark mode to work.
        defaultTheme="system" matches OS settings.
        enableSystem enables the system preference detection.
      */}
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        {children}
      </ThemeProvider>
    </SessionProvider>
  );
}