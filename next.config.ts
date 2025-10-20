import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: { // config image agar tidak error (author image terblokir)
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      }
    ]
  },
  // Handle Google Fonts issues
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
