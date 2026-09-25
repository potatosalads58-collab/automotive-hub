import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AskAI from "@/components/AskAI";
import { Analytics } from "@vercel/analytics/next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Automotive Hub",
  description: "Egypt's destination for exceptional automobiles.",
  openGraph: {
    title: "Automotive Hub",
    description: "Egypt's destination for exceptional automobiles.",
    url: "https://automotive-hub-phi.vercel.app",
    siteName: "Automotive Hub",
    type: "website",
    images: [
      {
        url: "https://automotive-hub-phi.vercel.app/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Automotive Hub",
      },
    ],
  },
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <AskAI />
        <Analytics />
      </body>
    </html>
  );
}
