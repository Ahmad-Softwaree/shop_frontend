import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  //images

  images: {
    remotePatterns: [
      { protocol: "http", hostname: "localhost" },
      { protocol: "https", hostname: "api.example.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
};

export default nextConfig;
