"use client";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function AuthLayout() {
  const [isLogin, setIsLogin] = useState(true);
  const [isSolid, setIsSolid] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const toggleMode = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setIsSolid(true);

    setTimeout(() => {
      setIsLogin(prev => !prev);

      setTimeout(() => {
        setIsSolid(false);
        setIsAnimating(false);
      }, 700);
    }, 300);
  };

  useEffect(() => {
    setTimeout(() => {
      setIsSolid(false);
    }, 100);
  }, []);

  return (
    <div className="h-screen w-full bg-[#f0f9ff] flex relative overflow-hidden text-[#0c4a6e]">

      {/* =========================================
          KHU VỰC FORM ĐĂNG KÝ (BÊN TRÁI)
          ========================================= */}
      <div className="w-1/2 h-screen flex flex-col items-center justify-center p-8 md:p-12 lg:p-16">

        {/* Tiêu đề Đăng ký (Tăng kích thước, thêm Gradient Text) */}
        <h2 className="text-2xl md:text-3xl font-semibold mb-8 text-center leading-snug tracking-wide">
          Chào mừng bạn đến với <br />
          <span className="bg-gradient-to-r from-[#0ea5e9] to-[#0c4a6e] bg-clip-text text-transparent text-4xl md:text-5xl font-bold uppercase block mt-2 pb-1">
            SMART WALKER VN
          </span>
          <span className="text-3xl md:text-4xl font-bold uppercase block mt-3">ĐĂNG KÝ</span>
        </h2>

        {/* Form nhập liệu Đăng ký (Chiếm 80% chiều rộng, tối đa 500px) */}
        <form className="w-[80%] max-w-[500px] flex flex-col gap-5">
          <input
            type="text"
            placeholder="Tài khoản"
            className="w-full px-5 py-4 text-lg rounded-xl border-2 border-[#0c4a6e]/50 bg-transparent text-[#0c4a6e] placeholder-[#0c4a6e]/60 focus:outline-none focus:border-[#0ea5e9] focus:ring-4 focus:ring-[#0ea5e9]/20 transition-all font-medium"
          />
          <input
            type="password"
            placeholder="Mật khẩu"
            className="w-full px-5 py-4 text-lg rounded-xl border-2 border-[#0c4a6e]/50 bg-transparent text-[#0c4a6e] placeholder-[#0c4a6e]/60 focus:outline-none focus:border-[#0ea5e9] focus:ring-4 focus:ring-[#0ea5e9]/20 transition-all font-medium"
          />
          <input
            type="password"
            placeholder="Nhập lại mật khẩu"
            className="w-full px-5 py-4 text-lg rounded-xl border-2 border-[#0c4a6e]/50 bg-transparent text-[#0c4a6e] placeholder-[#0c4a6e]/60 focus:outline-none focus:border-[#0ea5e9] focus:ring-4 focus:ring-[#0ea5e9]/20 transition-all font-medium"
          />

          {/* Nút Submit (Dùng màu Gradient cho đồng bộ) */}
          <button
            type="button"
            className="w-full mt-4 py-4 bg-gradient-to-r from-[#0ea5e9] to-[#0c4a6e] text-white text-lg font-bold rounded-xl hover:opacity-90 hover:shadow-lg transition-all duration-300
            "
          >
            ĐĂNG KÝ
          </button>
        </form>

        {/* Chuyển trang (Thêm Gradient Text cho link) */}
        <p className="mt-8 text-base md:text-lg font-semibold text-[#0c4a6e]">
          Bạn đã có tài khoản ?{" "}
          <button
            onClick={toggleMode}
            className="bg-gradient-to-r from-[#0ea5e9] to-[#0c4a6e] bg-clip-text text-transparent hover:opacity-70 transition-opacity"
          >
            Đăng nhập ngay
          </button>
        </p>
      </div>

      {/* =========================================
          KHU VỰC FORM ĐĂNG NHẬP (BÊN PHẢI)
          ========================================= */}
      <div className="w-1/2 h-screen flex flex-col items-center justify-center p-8 md:p-12 lg:p-16">

        {/* Tiêu đề Đăng nhập */}
        <h2 className="text-2xl md:text-3xl font-semibold mb-8 text-center leading-snug tracking-wide">
          Chào mừng bạn đến với <br />
          <span className="bg-gradient-to-r from-[#0ea5e9] to-[#0c4a6e] bg-clip-text text-transparent text-4xl md:text-5xl font-bold uppercase block mt-2 pb-1">
            SMART WALKER VN
          </span>
          <span className="text-3xl md:text-4xl font-bold uppercase block mt-3">ĐĂNG NHẬP</span>
        </h2>

        {/* Form nhập liệu Đăng nhập */}
        <form className="w-[80%] max-w-[500px] flex flex-col gap-5">
          <input
            type="text"
            placeholder="Tài khoản"
            className="w-full px-5 py-4 text-lg rounded-xl border-2 border-[#0c4a6e]/50 bg-transparent text-[#0c4a6e] placeholder-[#0c4a6e]/60 focus:outline-none focus:border-[#0ea5e9] focus:ring-4 focus:ring-[#0ea5e9]/20 transition-all font-medium"
          />
          <input
            type="password"
            placeholder="Mật khẩu"
            className="w-full px-5 py-4 text-lg rounded-xl border-2 border-[#0c4a6e]/50 bg-transparent text-[#0c4a6e] placeholder-[#0c4a6e]/60 focus:outline-none focus:border-[#0ea5e9] focus:ring-4 focus:ring-[#0ea5e9]/20 transition-all font-medium"
          />

          <Link
            href="/dashboard"
            className="w-full mt-4 py-4 bg-gradient-to-r from-[#0ea5e9] to-[#0c4a6e] text-white text-lg font-bold rounded-xl hover:opacity-90 hover:shadow-lg transition-all duration-300 block text-center"
          >
            ĐĂNG NHẬP
          </Link>
        </form>

        <p className="mt-8 text-base md:text-lg font-semibold text-[#0c4a6e]">
          Bạn chưa có tài khoản ?{" "}
          <button
            onClick={toggleMode}
            className="bg-gradient-to-r from-[#0ea5e9] to-[#0c4a6e] bg-clip-text text-transparent hover:opacity-70 transition-opacity"
          >
            Đăng ký ngay
          </button>
        </p>
      </div>

      {/* =========================================
          KHỐI SLIDING (KHỐI CHỨA ẢNH CHUYỂN ĐỘNG)
          ========================================= */}
      <div
        className={`absolute top-0 w-1/2 h-screen z-10 transition-transform duration-700 ease-in-out shadow-2xl ${isLogin ? "translate-x-0" : "translate-x-full"
          }`}
      >
        <div className="relative w-full h-full bg-[#0c4a6e]">

          {/* ẢNH ĐĂNG NHẬP */}
          <div
            className={`absolute inset-0 bg-contain bg-bottom bg-no-repeat transition-opacity duration-500 h-screen ${isLogin ? 'opacity-100' : 'opacity-0'}`}
            style={{
              backgroundImage: "url('/auth_pic1.svg')",
              backgroundColor: "#eef1f5"
            }}
          ></div>

          {/* ẢNH ĐĂNG KÝ */}
          <div
            className={`absolute inset-0 bg-contain bg-center bg-no-repeat transition-opacity duration-500 h-screen ${!isLogin ? 'opacity-100' : 'opacity-0'}`}
            style={{
              backgroundImage: "url('/auth_pic2.svg')",
              backgroundColor: "#eef1f5"
            }}
          ></div>

          <div className="absolute inset-0 h-screen bg-gradient-to-t from-[#0c4a6e]/30 to-transparent"></div>

          <div
            className={`absolute inset-0 h-screen bg-[#0c4a6e] transition-opacity duration-300 ease-in-out ${isSolid ? "opacity-100" : "opacity-0"
              }`}
          ></div>

        </div>
      </div>

    </div>
  );
}