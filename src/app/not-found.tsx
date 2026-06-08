"use client";
import Link from 'next/link';
import { BackButton } from '@/components/custom/back-button';

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#f0f9ff] text-[#0c4a6e] p-4 relative overflow-hidden">

      {/* Vòng tròn trang trí mờ ảo ở background */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#0ea5e9]/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-[#38bdf8]/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="bg-white/80 backdrop-blur-xl p-8 md:p-12 rounded-[2rem] shadow-2xl flex flex-col items-center max-w-lg text-center border border-white relative z-10">

        {/* Khối Icon 404 nhấp nháy nhẹ */}
        <div className="relative mb-8">
          <div className="w-28 h-28 bg-[#e0f2fe] rounded-full flex items-center justify-center animate-pulse shadow-inner">
            <svg className="w-14 h-14 text-[#0ea5e9]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="absolute -bottom-2 -right-2 bg-red-500 text-white text-xs font-black px-3 py-1 rounded-full shadow-md border-2 border-white transform rotate-12">
            Lỗi 404
          </div>
        </div>

        {/* Nội dung thông báo */}
        <h1 className="text-4xl md:text-5xl font-black mb-3 text-[#0c4a6e] tracking-tight">Ôi không...</h1>
        <h2 className="text-xl font-bold mb-4 text-[#0ea5e9]">Đường dẫn này không tồn tại!</h2>

        <p className="text-[#0c4a6e]/70 mb-8 font-medium leading-relaxed">
          Có vẻ như trang bạn đang tìm kiếm đã bị di dời, xóa bỏ, hoặc bạn đã gõ nhầm địa chỉ. Đừng lo lắng, dữ liệu của bạn vẫn an toàn.
        </p>

        {/* Nút điều hướng quay về an toàn */}
        <Link
          href="/dashboard"
          className="bg-gradient-to-r from-[#0ea5e9] to-[#0284c7] hover:from-[#0c4a6e] hover:to-[#082f49] text-white px-8 py-3.5 rounded-xl font-bold transition-all duration-300 shadow-lg shadow-[#0ea5e9]/30 hover:shadow-xl hover:-translate-y-1 flex items-center gap-3 w-full sm:w-auto justify-center"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          Trở về Bảng điều khiển
        </Link>

        {/* Nút quay lại trang trước (Back) */}
        <BackButton onClick={() => window.history.back()} className="mt-4 text-sm font-bold" />

      </div>
    </div>
  );
}