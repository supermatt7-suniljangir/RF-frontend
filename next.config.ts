import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Access-Control-Allow-Credentials",
            value: "true",
          },
          {
            key: "Access-Control-Allow-Origin",
            value: "http://localhost:5500", // Your local Express backend
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET,DELETE,PATCH,POST,PUT",
          },
          {
            key: "Access-Control-Allow-Headers",
            value:
              "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
          },
        ],
      },
    ];
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },

  typescript: {
    ignoreBuildErrors: true, // Ignore TypeScript errors during build
  },

  eslint: {
    ignoreDuringBuilds: true,
  },


  // Disable source maps in development to remove unnecessary 404 logs
  webpack: (config, { dev }) => {
    if (dev) {
      config.devtool = false; // Disable all source maps in development
      config.module.rules.push({
        test: /\.js$/,
        enforce: "pre",
        use: [
          {
            loader: "source-map-loader",
            options: {
              filterSourceMappingUrl: () => false, // Ignore all source map errors
            },
          },
        ],
      });
    }
    return config;
  },

  // Optional: Proxy API calls to your local backend
  // async rewrites() {
  //   return [
  //     {
  //       source: '/api/:path*',
  //       destination: 'http://localhost:5500/api/:path*'
  //     }
  //   ];
  // }
} satisfies NextConfig;

export default nextConfig;
