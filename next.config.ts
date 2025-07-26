import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        hostname: "**",
        protocol: "https",
        port: "",
        pathname: "**",
      },
      {
        hostname: "**",
        protocol: "http",
        port: "",
        pathname: "**",
      }
    ]
  }
};

export default nextConfig;
