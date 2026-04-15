// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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