/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      // Ảnh BE local (nếu có)
      { protocol: 'http',  hostname: 'localhost', port: '4000', pathname: '/uploads/**' },

      // Domain bạn đang lỗi
      { protocol: 'https', hostname: 'noithatkdt.vn', pathname: '/**' },

      // Hanoia (hỗ trợ cả root và mọi subdomain)
      { protocol: 'https', hostname: 'hanoia.com', pathname: '/**' },
      { protocol: 'https', hostname: '*.hanoia.com', pathname: '/**' },

      // Unsplash
      { protocol: 'https', hostname: 'images.unsplash.com', pathname: '/**' },

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
