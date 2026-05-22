import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/tanmay-portfolio",
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  env: {
    // Cloudflare Worker URL for the AI chatbot.
    // Set after `wrangler deploy` outputs the URL.
    // Override locally with: NEXT_PUBLIC_CHAT_API_URL=http://localhost:8787 npm run dev
    NEXT_PUBLIC_CHAT_API_URL:
      process.env.NEXT_PUBLIC_CHAT_API_URL ||
      "https://tanmay-portfolio-chatbot.tanmayraut.workers.dev",
  },
};

export default nextConfig;
