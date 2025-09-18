import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { BASE_URL } from "@/lib/constants";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Tope Akinkuade | Software Engineer",
  description: "I’m Tope — a software engineer building clean, scalable apps with TypeScript & Node.js. Perfectionist at heart, always shipping with style.",
  keywords: [
    "Tope Akinkuade",
    "Tope",
    "React",
    "Software Engineer",
    "TypeScript",
    "Node.js",
    "Next.js",
    "Fullstack Developer",
    "Software Developer",
    "Portfolio",
  ],
  authors: [{ name: "Tope Akinkuade", url: BASE_URL }],
  openGraph: {
    title: "Tope Akinkuade | Software Engineer",
    description:
      "I’m Tope — a software engineer building clean, scalable apps with TypeScript & Node.js. Perfectionist at heart, always shipping with style.",
    url: BASE_URL,
    siteName: "Tope Akinkuade",
    images: [
      {
        url: `${BASE_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "Tope Akinkuade Portfolio",
      },
    ],
    locale: "en_NG", 
    alternateLocale: ["en_US", "en_GB"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tope Akinkuade | Software Engineer",
    description:
      "I’m Tope — a software engineer building clean, scalable apps with TypeScript & Node.js. Perfectionist at heart, always shipping with style.",
    images: [`${BASE_URL}/og-image.png`],
    creator: "@topeakinkuade",
  },
  metadataBase: new URL(BASE_URL),
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
  category: "Portfolio",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
