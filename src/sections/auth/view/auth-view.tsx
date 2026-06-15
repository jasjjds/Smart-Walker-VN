"use client";

import Link from "next/link";
import Script from "next/script";
import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { BRAND_CONFIG } from "@/config/brand";

export function AuthView() {
  const { login, register, loginWithGoogle } = useAuth();

  const [isLogin, setIsLogin] = useState(true);

  // Capture redirect path from URL query parameters
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const redirectParam = params.get("redirect");
      if (redirectParam) {
        localStorage.setItem("authRedirectPath", redirectParam);
      }
    }
  }, []);
  const [isSolid, setIsSolid] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // Form states
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const toggleMode = () => {
    if (isAnimating) return;
    setError(null);
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

  // Initialize Google Login SDK
  const initGoogleLogin = () => {
    if (typeof window !== "undefined" && (window as any).google) {
      try {
        const client_id = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "523914533424-kv1an4oqhh8cs5ot8nkuh058i615m174.apps.googleusercontent.com";
        (window as any).google.accounts.id.initialize({
          client_id,
          callback: handleGoogleCredentialResponse,
        });

        const btnContainer = document.getElementById("google-login-btn");
        if (btnContainer) {
          (window as any).google.accounts.id.renderButton(btnContainer, {
            theme: "outline",
            size: "large",
            width: 300,
            text: "signin_with",
          });
        }
      } catch (err) {
        console.error("Lỗi khởi tạo nút Google Login:", err);
      }
    }
  };

  // Re-run button render when mode changes back to login
  useEffect(() => {
    if (isLogin) {
      // Small timeout to ensure DOM has updated
      setTimeout(() => {
        initGoogleLogin();
      }, 100);
    }
  }, [isLogin]);

  const handleGoogleCredentialResponse = async (response: any) => {
    setSubmitting(true);
    setError(null);
    try {
      await loginWithGoogle(response.credential);
    } catch (err: any) {
      console.error("Lỗi xác thực Google:", err);
      setError(err.response?.data?.message || err.message || "Đăng nhập Google thất bại!");
    } finally {
      setSubmitting(false);
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) {
      setError("Vui lòng nhập đầy đủ email và mật khẩu!");
      return;
    }

    // Kiểm tra định dạng email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(loginEmail)) {
      setError("Định dạng email không hợp lệ (ví dụ: name@domain.com)!");
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      await login(loginEmail, loginPassword);
    } catch (err: any) {
      console.error("Lỗi đăng nhập:", err);
      setError(err.response?.data?.message || err.message || "Đăng nhập thất bại!");
    } finally {
      setSubmitting(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!registerEmail || !registerPassword || !registerConfirmPassword) {
      setError("Vui lòng điền đầy đủ các thông tin!");
      return;
    }

    // Kiểm tra định dạng email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(registerEmail)) {
      setError("Định dạng email không hợp lệ (ví dụ: name@domain.com)!");
      return;
    }

    if (registerPassword !== registerConfirmPassword) {
      setError("Mật khẩu xác nhận không khớp!");
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      await register(registerEmail, registerPassword, registerConfirmPassword);
    } catch (err: any) {
      console.error("Lỗi đăng ký:", err);
      setError(err.response?.data?.message || err.message || "Đăng ký thất bại!");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen lg:h-screen lg:overflow-hidden w-full bg-primary-50 flex relative overflow-hidden text-primary-900">
      {/* Script load Google client library */}
      <Script
        src="https://accounts.google.com/gsi/client"
        strategy="lazyOnload"
        onLoad={initGoogleLogin}
      />

      {/* =========================================
          KHU VỰC FORM ĐĂNG KÝ (BÊN TRÁI)
          ========================================= */}
      <div className={`w-full lg:w-1/2 min-h-screen lg:h-screen lg:overflow-y-auto flex flex-col items-center justify-center p-4 sm:p-6 md:p-6 lg:p-4 z-0 ${!isLogin ? 'relative opacity-100' : 'absolute lg:relative opacity-0 lg:opacity-100 pointer-events-none lg:pointer-events-auto'}`}>
        {/* Tiêu đề Đăng ký */}
        <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-5 text-center leading-snug tracking-wide">
          {BRAND_CONFIG.auth.welcome} <br />
          <span className="bg-gradient-to-r from-primary-500 to-primary-900 bg-clip-text text-transparent text-2xl sm:text-3xl md:text-4xl font-bold uppercase block mt-1.5 pb-0.5">
            {BRAND_CONFIG.brand.fullName}
          </span>
          <span className="text-xl sm:text-2xl md:text-3xl font-bold uppercase block mt-2">{BRAND_CONFIG.auth.registerTitle}</span>
        </h2>

        {/* Form nhập liệu Đăng ký */}
        <form onSubmit={handleRegisterSubmit} className="w-full max-w-[360px] flex flex-col gap-3.5 sm:gap-4">
          {!isLogin && error && (
            <div className="w-full px-4 py-2.5 bg-red-50 border border-red-200 text-red-600 font-semibold rounded-xl text-xs sm:text-sm transition-all">
              ⚠️ {error}
            </div>
          )}

          <input
            type="email"
            placeholder="Email (Tài khoản)"
            value={registerEmail}
            onChange={(e) => setRegisterEmail(e.target.value)}
            required
            className="w-full px-4 py-2.5 sm:px-5 sm:py-3.5 text-sm sm:text-base rounded-xl border-2 border-primary-900/50 bg-transparent text-primary-900 placeholder-primary-900/60 focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20 transition-all font-medium"
          />
          <input
            type="password"
            placeholder="Mật khẩu"
            value={registerPassword}
            onChange={(e) => setRegisterPassword(e.target.value)}
            required
            className="w-full px-4 py-2.5 sm:px-5 sm:py-3.5 text-sm sm:text-base rounded-xl border-2 border-primary-900/50 bg-transparent text-primary-900 placeholder-primary-900/60 focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20 transition-all font-medium"
          />
          <input
            type="password"
            placeholder="Nhập lại mật khẩu"
            value={registerConfirmPassword}
            onChange={(e) => setRegisterConfirmPassword(e.target.value)}
            required
            className="w-full px-4 py-2.5 sm:px-5 sm:py-3.5 text-sm sm:text-base rounded-xl border-2 border-primary-900/50 bg-transparent text-primary-900 placeholder-primary-900/60 focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20 transition-all font-medium"
          />

          <button
            type="submit"
            disabled={submitting}
            className="w-full mt-1 py-2.5 sm:py-3.5 bg-gradient-to-r from-primary-500 to-primary-900 text-white text-sm sm:text-base font-bold rounded-xl hover:opacity-90 hover:shadow-lg transition-all duration-300 disabled:opacity-50"
          >
            {submitting ? "ĐANG ĐĂNG KÝ..." : "ĐĂNG KÝ"}
          </button>
        </form>

        {/* Chuyển trang */}
        <p className="mt-4 sm:mt-6 text-xs sm:text-sm font-semibold text-primary-900">
          Bạn đã có tài khoản ?{" "}
          <button
            onClick={toggleMode}
            className="bg-gradient-to-r from-primary-500 to-primary-900 bg-clip-text text-transparent hover:opacity-70 transition-opacity font-bold cursor-pointer"
          >
            Đăng nhập ngay
          </button>
        </p>
      </div>

      {/* =========================================
          KHU VỰC FORM ĐĂNG NHẬP (BÊN PHẢI)
          ========================================= */}
      <div className={`w-full lg:w-1/2 min-h-screen lg:h-screen lg:overflow-y-auto flex flex-col items-center justify-center p-4 sm:p-6 md:p-6 lg:p-4 z-0 ${isLogin ? 'relative opacity-100' : 'absolute lg:relative opacity-0 lg:opacity-100 pointer-events-none lg:pointer-events-auto'}`}>
        {/* Tiêu đề Đăng nhập */}
        <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-5 text-center leading-snug tracking-wide">
          {BRAND_CONFIG.auth.welcome} <br />
          <span className="bg-gradient-to-r from-primary-500 to-primary-900 bg-clip-text text-transparent text-2xl sm:text-3xl md:text-4xl font-bold uppercase block mt-1.5 pb-0.5">
            {BRAND_CONFIG.brand.fullName}
          </span>
          <span className="text-xl sm:text-2xl md:text-3xl font-bold uppercase block mt-2">{BRAND_CONFIG.auth.loginTitle}</span>
        </h2>

        {/* Form nhập liệu Đăng nhập */}
        <form onSubmit={handleLoginSubmit} className="w-full max-w-[360px] flex flex-col gap-3.5 sm:gap-4">
          {isLogin && error && (
            <div className="w-full px-4 py-2.5 bg-red-50 border border-red-200 text-red-600 font-semibold rounded-xl text-xs sm:text-sm transition-all animate-shake">
              ⚠️ {error}
            </div>
          )}

          <input
            type="email"
            placeholder="Email (Tài khoản)"
            value={loginEmail}
            onChange={(e) => setLoginEmail(e.target.value)}
            required
            className="w-full px-4 py-2.5 sm:px-5 sm:py-3.5 text-sm sm:text-base rounded-xl border-2 border-primary-900/50 bg-transparent text-primary-900 placeholder-primary-900/60 focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20 transition-all font-medium"
          />
          <input
            type="password"
            placeholder="Mật khẩu"
            value={loginPassword}
            onChange={(e) => setLoginPassword(e.target.value)}
            required
            className="w-full px-4 py-2.5 sm:px-5 sm:py-3.5 text-sm sm:text-base rounded-xl border-2 border-primary-900/50 bg-transparent text-primary-900 placeholder-primary-900/60 focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20 transition-all font-medium"
          />

          <button
            type="submit"
            disabled={submitting}
            className="w-full mt-1 py-2.5 sm:py-3.5 bg-gradient-to-r from-primary-500 to-primary-900 text-white text-sm sm:text-base font-bold rounded-xl hover:opacity-90 hover:shadow-lg transition-all duration-300 block text-center disabled:opacity-50"
          >
            {submitting ? "ĐANG ĐĂNG NHẬP..." : "ĐĂNG NHẬP"}
          </button>

          {/* Ngăn cách Hoặc */}
          <div className="flex items-center w-full justify-between gap-3.5 mt-1">
            <div className="flex-1 border-t border-primary-900/20"></div>
            <span className="text-[10px] sm:text-xs font-bold text-primary-900/40 uppercase tracking-widest">Hoặc</span>
            <div className="flex-1 border-t border-primary-900/20"></div>
          </div>

          {/* Nút đăng nhập Google */}
          <div className="w-full flex justify-center mt-0.5">
            <div id="google-login-btn" className="w-full flex justify-center min-h-[40px]"></div>
          </div>
        </form>

        <p className="mt-4 sm:mt-6 text-xs sm:text-sm font-semibold text-primary-900">
          Bạn chưa có tài khoản ?{" "}
          <button
            onClick={toggleMode}
            className="bg-gradient-to-r from-primary-500 to-primary-900 bg-clip-text text-transparent hover:opacity-70 transition-opacity font-bold cursor-pointer"
          >
            Đăng ký ngay
          </button>
        </p>
      </div>

      {/* =========================================
          KHỐI SLIDING (KHỐI CHỨA ẢNH CHUYỂN ĐỘNG - CHỈ HIỂN THỊ TRÊN DESKTOP)
          ========================================= */}
      <div
        className={`hidden lg:block absolute inset-y-0 w-1/2 z-10 transition-transform duration-700 ease-in-out shadow-2xl ${isLogin ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="relative w-full h-full bg-[#eef1f5]">
          {/* ẢNH ĐĂNG NHẬP */}
          <div
            className={`absolute inset-0 bg-contain bg-center bg-no-repeat transition-opacity duration-500 w-full h-full p-8 lg:p-12 ${isLogin ? 'opacity-100' : 'opacity-0'}`}
            style={{
              backgroundImage: "url('/auth_pic1.svg')",
              backgroundColor: "#eef1f5",
              backgroundOrigin: "content-box"
            }}
          ></div>

          {/* ẢNH ĐĂNG KÝ */}
          <div
            className={`absolute inset-0 bg-contain bg-center bg-no-repeat transition-opacity duration-500 w-full h-full p-8 lg:p-12 ${!isLogin ? 'opacity-100' : 'opacity-0'}`}
            style={{
              backgroundImage: "url('/auth_pic2.svg')",
              backgroundColor: "#eef1f5",
              backgroundOrigin: "content-box"
            }}
          ></div>

          <div className="absolute inset-0 h-full bg-gradient-to-t from-primary-900/10 to-transparent pointer-events-none"></div>

          <div
            className={`absolute inset-0 h-full bg-primary-900 transition-opacity duration-300 ease-in-out ${isSolid ? "opacity-100" : "opacity-0"}`}
          ></div>
        </div>
      </div>
    </div>
  );
}
