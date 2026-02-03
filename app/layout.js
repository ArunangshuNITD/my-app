import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Providers from "@/components/Providers";
import Chatbot from "@/components/Chatbot";
import { Analytics } from "@vercel/analytics/next";

export const metadata = {
  title: "Mentor Connect",
  description: "Find the best mentors",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-zinc-50 dark:bg-black text-zinc-900 dark:text-zinc-100 antialiased">
        <Providers>
          <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-grow">{children}</main>
            <Footer />
          </div>

          {/* 🔥 Floating AI Chatbot (GLOBAL) */}
          <Chatbot />
        </Providers>

        <Analytics />
      </body>
    </html>
  );
}
