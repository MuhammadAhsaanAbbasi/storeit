import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "100MB",
    },
  },
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
