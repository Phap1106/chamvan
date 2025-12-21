// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   eslint: { ignoreDuringBuilds: true },
//   typescript: { ignoreBuildErrors: true },

//   async rewrites() {
//     return [
//       {
//         source: "/api/:path*",
//         destination: "https://api.chamvan.com/api/:path*",
//       },
//     ];
//   },

//   images: {
//     domains: ["api.chamvan.com", "cdn.vntrip.vn", "images.pexels.com"],
//     formats: ["image/avif", "image/webp"],
//     remotePatterns: [
//       { protocol: "http", hostname: "localhost", port: "4000", pathname: "/uploads/**" },
//       { protocol: "https", hostname: "noithatkdt.vn", pathname: "/**" },
//       { protocol: "https", hostname: "hanoia.com", pathname: "/**" },
//       { protocol: "https", hostname: "*.hanoia.com", pathname: "/**" },
//       { protocol: "https", hostname: "encrypted-tbn0.gstatic.com", pathname: "/**" },
//       { protocol: "https", hostname: "drive.google.com", pathname: "/**" },
//       { protocol: "https", hostname: "www.savor.vn", pathname: "/**" },
//       { protocol: "https", hostname: "images.unsplash.com", pathname: "/**" },
//       { protocol: "https", hostname: "*.fbcdn.net", pathname: "/**" },
//       { protocol: "https", hostname: "*.fna.fbcdn.net", pathname: "/**" },
//     ],
//     deviceSizes: [640, 750, 828, 1080, 1200, 1440, 1680, 1920],
//     imageSizes: [400, 430, 451, 512, 768],
//   },
// };

// export default nextConfig;



/** @type {import('next').NextConfig} */
const nextConfig = {
    eslint: {
    ignoreDuringBuilds: true,
  },

  // ✅ 2) (Tuỳ chọn) Bỏ qua lỗi TypeScript khi build
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
      domains: ['api.chamvan.com', 'cdn.vntrip.vn', 'images.pexels.com'],
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      // Ảnh BE local (nếu có)
      { protocol: 'http',  hostname: 'localhost', port: '4000', pathname: '/uploads/**' },

      // Domain bạn đang lỗi
      { protocol: 'https', hostname: 'noithatkdt.vn', pathname: '/**' },

      // Hanoia (hỗ trợ cả root và mọi subdomain)
      { protocol: 'https', hostname: 'hanoia.com', pathname: '/**' },
      { protocol: 'https', hostname: '*.hanoia.com', pathname: '/**' },
      { protocol: 'https', hostname: 'encrypted-tbn0.gstatic.com', pathname: '/**' },
      // Unsplash
      { protocol: 'https', hostname: 'drive.google.com', pathname: '/**' },
      { protocol: 'https', hostname: 'www.savor.vn', pathname: '/**' },
      { protocol: 'https', hostname: 'images.unsplash.com', pathname: '/**' },
      { protocol: 'https', hostname: 'noithatdangkhoa.com' },
      // Facebook CDN – dùng wildcard hợp lệ: *.fbcdn.net (bao phủ scontent-*.fbcdn.net, …)
      { protocol: 'https', hostname: '*.fbcdn.net', pathname: '/**' },
      // (Nếu cần chi tiết mạng con fna)
      { protocol: 'https', hostname: '*.fna.fbcdn.net', pathname: '/**' },
    ],
      deviceSizes: [640, 750, 828, 1080, 1200, 1440, 1680, 1920],
    imageSizes: [400, 430, 451, 512, 768],
  },
};

export default nextConfig;
