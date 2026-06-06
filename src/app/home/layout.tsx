// Bạn có thể tạo file này ở: app/(dashboard)/layout.tsx
// (Dấu ngoặc đơn () giúp Next.js tạo layout chung mà không làm thay đổi đường dẫn URL)

import { HomeHeader, HomeFooter } from '@/components/home'

export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // Dùng min-h-screen và flex-col để Footer luôn bị đẩy xuống đáy màn hình
    <div className="min-h-screen flex flex-col">
      {/* Header luôn ở trên cùng */}
      <HomeHeader />

      {/* Main content chiếm toàn bộ không gian ở giữa */}
      <main className="flex-1 w-full bg-[#f0f9ff]">
        {children}
      </main>

      {/* Footer luôn ở dưới cùng */}
      <HomeFooter />
    </div>
  );
}