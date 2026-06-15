"use client";

import HeroSlider from '@/components/dashboard/hero-slider';
import NewsSection from '@/components/dashboard/news-section';
import Link from 'next/link';

export function HomeView() {
  const features = [
    {
      title: 'Tích hợp phần cứng IoT',
      description: 'Sử dụng vi điều khiển ESP32 kết hợp hệ thống cảm biến độ nhạy cao, thu thập dữ liệu chuyển động theo thời gian thực.',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
        </svg>
      ),
    },
    {
      title: 'Theo dõi & Lưu trữ số liệu',
      description: 'Phần mềm đồng bộ liên tục với khung tập đi, tự động lưu trữ và phân tích các chỉ số vận động an toàn trên hệ thống.',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
        </svg>
      ),
    },
    {
      title: 'Đánh giá phục hồi chi dưới',
      description: 'Hỗ trợ đưa ra các báo cáo trực quan, giúp bác sĩ và bệnh nhân theo dõi sát sao tiến độ phục hồi chức năng chi dưới.',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
    }
  ];

  return (
    <div className="flex flex-col gap-12 md:gap-20 pb-20 w-full">
      <HeroSlider />
      
      {/* 1. HERO SECTION */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 pt-8 md:pt-16 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        {/* Khối Text */}
        <div className="flex flex-col gap-5 sm:gap-6 z-10 text-center lg:text-left items-center lg:items-start">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary-500/10 text-primary-800 font-semibold rounded-full w-fit text-sm border border-primary-500/20">
            <span className="w-2 h-2 rounded-full bg-primary-500 animate-pulse"></span>
            Phần mềm tích hợp phần cứng
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-primary-800 leading-[1.15]">
            Khung tập đi <br className="hidden lg:block" /> thông minh <br className="hidden lg:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-primary-800">
              StepAid-LBK
            </span>
          </h1>

          <p className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-xl font-medium">
            Giải pháp công nghệ y tế tiên tiến tích hợp cảm biến và ESP32, giúp theo dõi, lưu trữ dữ liệu và hỗ trợ đánh giá phục hồi chức năng chi dưới một cách toàn diện.
          </p>

          <div className="flex flex-wrap gap-4 mt-2 justify-center lg:justify-start">
            <Link
              href="#features"
              className="bg-white text-primary-800 border-2 border-primary-800/20 px-6 py-3 sm:px-8 sm:py-3.5 rounded-lg font-bold tracking-wide hover:bg-primary-500/5 hover:border-primary-800/40 transition-all text-sm sm:text-base"
            >
              TÌM HIỂU THÊM
            </Link>
          </div>
        </div>

        {/* Khối Hình ảnh minh họa */}
        <div className="relative w-full max-w-[500px] mx-auto aspect-square md:aspect-[4/3] bg-white rounded-3xl shadow-xl border border-primary-800/10 overflow-hidden group">
          {/* Background Gradient Effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-primary-100 z-0"></div>

          {/* Cấu trúc trang trí mô phỏng thiết bị y tế / IoT */}
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <div className="relative w-40 h-40 sm:w-48 sm:h-48 md:w-64 md:h-64 rounded-full border-[8px] border-primary-500/10 flex items-center justify-center animate-[spin_20s_linear_infinite]">
              <div className="absolute top-0 w-4 h-4 bg-primary-500 rounded-full -translate-y-2 shadow-[0_0_15px_#0ea5e9]"></div>
            </div>
            <div className="absolute w-28 h-28 sm:w-32 sm:h-32 md:w-40 md:h-40 rounded-full border-[4px] border-primary-800/20 border-dashed flex items-center justify-center animate-[spin_15s_linear_infinite_reverse]"></div>

            {/* Icon Y tế ở giữa */}
            <div className="absolute text-primary-800 bg-white p-5 sm:p-6 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-500">
              <svg className="w-12 h-12 sm:w-16 sm:h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* 2. FEATURES SECTION */}
      <section id="features" className="max-w-7xl mx-auto px-6 lg:px-12 w-full pt-6">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary-800 mb-3 sm:mb-4">
            Đột phá trong Phục hồi chức năng
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto text-sm sm:text-base md:text-lg">
            Sự kết hợp hoàn hảo giữa thiết bị cơ khí thông minh và thuật toán phần mềm, mang lại hiệu quả đo lường và theo dõi chính xác nhất.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white p-6 sm:p-8 rounded-2xl shadow-md border border-primary-800/5 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
            >
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-primary-50 text-primary-500 rounded-xl flex items-center justify-center mb-5 sm:mb-6 group-hover:bg-primary-800 group-hover:text-white transition-colors duration-300">
                {feature.icon}
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-primary-800 mb-2 sm:mb-3">
                {feature.title}
              </h3>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>
      
      <NewsSection />
    </div>
  );
}
