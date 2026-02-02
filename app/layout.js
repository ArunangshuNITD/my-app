import "./globals.css";
// Adjust these import paths if your components are in a different folder
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer"; 
import Providers from "@/components/Providers"; 
import { Analytics } from "@vercel/analytics/next"

export const metadata = {
  title: "Mentor Connect",
  description: "Find the best mentors",
};

export default function RootLayout({ children }) {
  return (
    // suppressHydrationWarning is required when using next-themes
    <html lang="en" suppressHydrationWarning>
      <body className="bg-zinc-50 dark:bg-black text-zinc-900 dark:text-zinc-100 antialiased">
        <Providers>
          <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-grow">
              {children}
            </main>
            <Footer />
          </div>
        </Providers>
        
        {/* Add the Analytics component here, usually just before the closing body tag */}
        <Analytics />
      </body>
    </html>
  );
}