/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },

  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://api.chamvan.com/api/:path*",
      },
    ];
  },

  images: {
    domains: ["api.chamvan.com", "cdn.vntrip.vn", "images.pexels.com"],
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "http", hostname: "localhost", port: "4000", pathname: "/uploads/**" },
      { protocol: "https", hostname: "noithatkdt.vn", pathname: "/**" },
      { protocol: "https", hostname: "hanoia.com", pathname: "/**" },
      { protocol: "https", hostname: "*.hanoia.com", pathname: "/**" },
      { protocol: "https", hostname: "encrypted-tbn0.gstatic.com", pathname: "/**" },
      { protocol: "https", hostname: "drive.google.com", pathname: "/**" },
      { protocol: "https", hostname: "www.savor.vn", pathname: "/**" },
      { protocol: "https", hostname: "images.unsplash.com", pathname: "/**" },
      { protocol: "https", hostname: "*.fbcdn.net", pathname: "/**" },
      { protocol: "https", hostname: "*.fna.fbcdn.net", pathname: "/**" },
    ],
    deviceSizes: [640, 750, 828, 1080, 1200, 1440, 1680, 1920],
    imageSizes: [400, 430, 451, 512, 768],
  },
};

export default nextConfig;
