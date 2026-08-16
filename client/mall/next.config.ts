import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */

  turbopack: {
    root: __dirname, // 현재 프로젝트 루트로 고정
  },

  images: {
    remotePatterns: [
      {
        // 로컬 이미지
        // protocol: "http",
        // hostname: "localhost",
        // port: "8080",

        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
};

export default nextConfig;
