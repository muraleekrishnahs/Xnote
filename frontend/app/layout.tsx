import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import { ThemeProvider } from "./components/ThemeProvider";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Xnote - AI-Powered Notes",
  description: "A modern note-taking app with intelligent sentiment analysis",
  keywords: ["notes", "ai", "sentiment analysis", "productivity"],
  authors: [{ name: "Xnote Team" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="min-h-screen flex flex-col">
            {/* Navbar is now included in individual pages instead of in the layout */}
            <main className="flex-1">
              <div className="animate-fadeIn">
                {children}
              </div>
            </main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
