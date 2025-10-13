/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**.hanoia.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
       {
        protocol: 'https',
        hostname: '**.fbcdn.net',       // ví dụ: scontent-*.fbcdn.net
      },
      {
        protocol: 'https',
        hostname: 'scontent.*.fna.fbcdn.net', // match theo cụm fna
      },
    ]
  },
  
};
export default nextConfig;
