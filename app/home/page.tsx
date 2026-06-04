// app/page.tsx (hoặc nơi bạn đặt file HomePage)
import HeroSlider from '@/components/dashboard/hero-slider';
import NewsSection from '@/components/dashboard/news-section'
import Link from 'next/link';

export default function HomePage() {
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
    <div className="flex flex-col gap-16 md:gap-24 pb-20 w-full">
      <HeroSlider />
      {/* 1. HERO SECTION */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 pt-12 md:pt-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Khối Text */}
        <div className="flex flex-col gap-6 z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#0ea5e9]/10 text-[#075985] font-semibold rounded-full w-fit text-sm border border-[#0ea5e9]/20">
            <span className="w-2 h-2 rounded-full bg-[#0ea5e9] animate-pulse"></span>
            Phần mềm tích hợp phần cứng
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#075985] leading-[1.15]">
            Khung tập đi <br className="hidden md:block" /> thông minh <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0ea5e9] to-[#075985]">
              StepAid-LBK
            </span>
          </h1>

          <p className="text-slate-600 text-lg leading-relaxed max-w-xl font-medium">
            Giải pháp công nghệ y tế tiên tiến tích hợp cảm biến và ESP32, giúp theo dõi, lưu trữ dữ liệu và hỗ trợ đánh giá phục hồi chức năng chi dưới một cách toàn diện.
          </p>

          <div className="flex flex-wrap gap-4 mt-2">
            <Link
              href="#features"
              className="bg-white text-[#075985] border-2 border-[#075985]/20 px-8 py-3.5 rounded-lg font-bold tracking-wide hover:bg-[#0ea5e9]/5 hover:border-[#075985]/40 transition-all"
            >
              TÌM HIỂU THÊM
            </Link>
          </div>
        </div>

        {/* Khối Hình ảnh minh họa (Placeholder) */}
        <div className="relative w-full aspect-square md:aspect-[4/3] bg-white rounded-3xl shadow-2xl border border-[#075985]/10 overflow-hidden group">
          {/* Background Gradient Effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#f0f9ff] via-white to-[#e0f2fe] z-0"></div>

          {/* Cấu trúc trang trí mô phỏng thiết bị y tế / IoT */}
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <div className="relative w-48 h-48 md:w-64 md:h-64 rounded-full border-[8px] border-[#0ea5e9]/10 flex items-center justify-center animate-[spin_20s_linear_infinite]">
              <div className="absolute top-0 w-4 h-4 bg-[#0ea5e9] rounded-full -translate-y-2 shadow-[0_0_15px_#0ea5e9]"></div>
            </div>
            <div className="absolute w-32 h-32 md:w-40 md:h-40 rounded-full border-[4px] border-[#075985]/20 border-dashed flex items-center justify-center animate-[spin_15s_linear_infinite_reverse]"></div>

            {/* Icon Y tế ở giữa */}
            <div className="absolute text-[#075985] bg-white p-6 rounded-2xl shadow-xl group-hover:scale-110 transition-transform duration-500">
              <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* 2. FEATURES SECTION */}
      <section id="features" className="max-w-7xl mx-auto px-6 lg:px-12 w-full pt-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-[#075985] mb-4">
            Đột phá trong Phục hồi chức năng
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto text-lg">
            Sự kết hợp hoàn hảo giữa thiết bị cơ khí thông minh và thuật toán phần mềm, mang lại hiệu quả đo lường và theo dõi chính xác nhất.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-2xl shadow-lg border border-[#075985]/5 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
            >
              <div className="w-16 h-16 bg-[#f0f9ff] text-[#0ea5e9] rounded-xl flex items-center justify-center mb-6 group-hover:bg-[#075985] group-hover:text-white transition-colors duration-300">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-[#075985] mb-3">
                {feature.title}
              </h3>
              <p className="text-slate-600 leading-relaxed">
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