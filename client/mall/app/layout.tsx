import { Fraunces, Inter, IBM_Plex_Mono } from "next/font/google";

import "./globals.css";
import type { Metadata } from "next";
import UserProvider from "./_lib/provider/UserProvider";
import Script from "next/script";
import QueryProvider from "./_lib/provider/QueryProvider";

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
    <html lang="ko">
      <body>
        <QueryProvider>
          <UserProvider>{children}</UserProvider>
        </QueryProvider>

        <Script
          src="//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js"
          strategy="beforeInteractive"
        />
      </body>
    </html>
  );
}
