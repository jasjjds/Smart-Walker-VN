'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function HeroSlider() {
  // DỮ LIỆU BANNER: Bạn chỉ cần thêm/sửa link ảnh và text ở đây
  const banners = [
    {
      id: 1,
      // Tạm dùng background gradient, bạn thay bằng link ảnh thực tế (ví dụ: '/images/banner1.jpg')
      image: 'linear-gradient(to right, #1e293b, #0f172a)',
      title: 'KĨ THUẬT Y SINH',
      highlight: 'HỌC CÙNG TRẢI NGHIỆM',
      ctaText: 'THÔNG TIN TUYỂN SINH',
      ctaLink: '#',
    },
    {
      id: 2,
      image: 'linear-gradient(to right, #075985, #082f49)',
      title: 'STEP AID - LBK',
      highlight: 'PHỤC HỒI CHỨC NĂNG',
      ctaText: 'XEM DASHBOARD',
      ctaLink: '/dashboard',
    },
    {
      id: 3,
      image: 'linear-gradient(to right, #0f766e, #134e4a)',
      title: 'KẾT NỐI ESP32',
      highlight: 'THEO DÕI THỜI GIAN THỰC',
      ctaText: 'HƯỚNG DẪN KẾT NỐI',
      ctaLink: '#',
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  // Hàm chuyển ảnh tiếp theo
  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === banners.length - 1 ? 0 : prevIndex + 1));
  };

  // Hàm lùi ảnh trước đó
  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? banners.length - 1 : prevIndex - 1));
  };

  // Tự động chuyển ảnh sau mỗi 5 giây
  useEffect(() => {
    const slideInterval = setInterval(nextSlide, 5000);
    // Xóa interval khi component unmount để tránh rò rỉ bộ nhớ
    return () => clearInterval(slideInterval);
  }, []);

  return (
    <div className="relative w-full h-[400px] md:h-[500px] lg:h-[600px] group overflow-hidden bg-slate-900">

      {/* 1. DANH SÁCH SLIDES */}
      {banners.map((banner, index) => (
        <div
          key={banner.id}
          className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          // Nếu bạn dùng link ảnh thật, hãy đổi style background thành: backgroundImage: `url(${banner.image})`, backgroundSize: 'cover'
          style={{ background: banner.image }}
        >
          {/* Lớp phủ (Overlay) làm tối ảnh một chút để chữ nổi bật hơn */}
          <div className="absolute inset-0 bg-black/30"></div>

          {/* Nội dung Text & Button */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 z-20">
            <h2 className="text-4xl md:text-6xl font-bold text-white tracking-wider mb-2 drop-shadow-lg">
              {banner.title}
            </h2>
            <h3 className="text-3xl md:text-5xl font-bold text-[#38bdf8] italic mb-10 drop-shadow-lg">
              {banner.highlight}
            </h3>
            <Link
              href={banner.ctaLink}
              // Nút màu đỏ đậm (#990000) giống trong hình thiết kế của bạn
              className="bg-[#990000] text-white px-8 py-3 rounded-sm font-semibold tracking-wider hover:bg-red-700 transition-colors shadow-lg"
            >
              {banner.ctaText}
            </Link>
          </div>
        </div>
      ))}

      {/* 2. NÚT ĐIỀU HƯỚNG TRÁI/PHẢI (Chỉ hiện khi Hover vào Banner) */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-2 bg-black/20 hover:bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 focus:outline-none"
      >
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-2 bg-black/20 hover:bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 focus:outline-none"
      >
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* 3. DẤU CHẤM ĐIỀU HƯỚNG BÊN DƯỚI (Dots) */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex gap-2">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`transition-all duration-300 ${index === currentIndex
                ? 'w-3 h-3 bg-white cursor-default' // Chấm đang Active
                : 'w-2 h-2 bg-white/50 hover:bg-white/80 cursor-pointer border border-white/20' // Chấm Inactive
              }`}
          ></button>
        ))}
      </div>

    </div>
  );
}