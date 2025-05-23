import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: 'swap',
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Neolithic",
  description: "Revolutionizing semiconductor manufacturing",
  icons: {
    icon: '/favicon-32x32.png', // Points to public/favicon-32x32.png
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${geistMono.variable} antialiased transition-colors duration-500`}
      >
        {children}
      </body>
    </html>
  );
}
