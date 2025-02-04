import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Only keep CORS if you're actually using a separate backend in development
  async headers() {
    if (process.env.NODE_ENV === 'development') {
      return [
        {
          source: "/:path*",
          headers: [
            {
              key: "Access-Control-Allow-Origin",
              value: "http://localhost:5500",
            },
            {
              key: "Access-Control-Allow-Methods",
              value: "GET,DELETE,PATCH,POST,PUT",
            },
            {
              key: "Access-Control-Allow-Headers",
              value: "Content-Type, Authorization",
            },
          ],
        },
      ];
    }
    return [];
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },

  // Enable both strict mode and concurrent features
  reactStrictMode: true,
  
  // Remove development-only settings in production
  ...(process.env.NODE_ENV === 'production' && {
    typescript: {
      ignoreBuildErrors: true,
    },
    eslint: {
      ignoreDuringBuilds: true,
    },
  }),
};

export default nextConfig;