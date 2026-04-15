// app/layout.tsx
import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";

// Cấu hình font Roboto chuẩn có tiếng Việt
const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ["latin", "vietnamese"],
  variable: "--font-roboto",
  display: 'swap',
});

// Tiêu đề mặc định cho toàn dự án
export const metadata: Metadata = {
  title: "Smart Walker VN",
  description: "Hệ thống quản lý và theo dõi xe tập đi thông minh",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="vi"
      // Áp dụng biến font Roboto và class font-sans để Tailwind nhận diện
      className={`${roboto.variable} font-sans h-full antialiased`}
    >
      {/* Background #f0f9ff và Text #075985 được áp dụng toàn cục ngay từ đây */}
      <body className="min-h-full flex flex-col">
        {children}
      </body>
    </html>
  );
}