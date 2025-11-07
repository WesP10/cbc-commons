import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Fix for Solana wallet adapter with Turbopack (Next.js 16+)
  turbopack: {},
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
    };
    return config;
  },
};

export default nextConfig;
