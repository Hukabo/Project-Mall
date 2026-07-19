import { Fraunces, Inter, IBM_Plex_Mono } from "next/font/google";

import type { Metadata } from "next";
import { Geist, Geist_Mono, Work_Sans } from "next/font/google";
import "./globals.css";
import UserProvider from "./_lib/context/UserProvider";

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

// const workSans = Work_Sans({
//   variable: "--font-work-sans",
//   subsets: ["latin"],
// });

const fraunces = Fraunces({ subsets: ["latin"], variable: "--font-display" });
const inter = Inter({ subsets: ["latin"], variable: "--font-body" });
const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "Project mall",
  description: "포트폴리오 제출용 프로젝트입니다.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      // className={`${workSans.className} ${geistSans.className} ${geistMono.className} antialiased `}
      className={`${fraunces.variable} ${inter.variable} ${mono.variable}`}
    >
      <body>
        <UserProvider>{children}</UserProvider>
      </body>
    </html>
  );
}
