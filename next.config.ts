// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  compress: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? { exclude: ['error', 'warn'] } : false,
  },
  async redirects() {
    return [
      {
        source: '/',           // Khi người dùng vào trang chủ
        destination: '/home', // Đích đến là dashboard
        permanent: true,       // true: Trình duyệt sẽ nhớ mãi (tốt cho SEO)
      },
    ];
  },
};

export default nextConfig;