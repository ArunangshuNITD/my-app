"use client";

import { ThemeProvider } from "next-themes";
import { SessionProvider } from "next-auth/react";

export default function Providers({ children }) {
  return (
    <SessionProvider>
      {/* attribute="class" is REQUIRED for Tailwind to work.
        defaultTheme="system" allows it to match the user's OS settings first.
      */}
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        {children}
      </ThemeProvider>
    </SessionProvider>
  );
}