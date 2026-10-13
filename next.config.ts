import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  async rewrites() {
    return [
      { source: '/cameras', destination: '/category/cameras' },
      { source: '/audio', destination: '/category/audio' },
      { source: '/lighting', destination: '/category/lighting' },
      { source: '/studio-sets', destination: '/category/studio-sets' },
      { source: '/video-production', destination: '/category/video-production' },
    ];
  },
};

export default nextConfig;
