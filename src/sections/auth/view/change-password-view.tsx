"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

export function ChangePasswordView() {
  const { changePassword } = useAuth();
  const router = useRouter();

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!oldPassword || !newPassword || !confirmPassword) {
      setError("Vui lòng nhập đầy đủ tất cả các trường mật khẩu!");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Mật khẩu mới và mật khẩu xác nhận không khớp!");
      return;
    }

    if (newPassword.length < 6) {
      setError("Mật khẩu mới phải có ít nhất 6 ký tự!");
      return;
    }

    setSubmitting(true);
    try {
      const res = await changePassword({
        oldPassword,
        newPassword,
        confirmPassword
      });
      if (res.success) {
        setSuccess("Đổi mật khẩu thành công!");
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setTimeout(() => {
          router.push("/dashboard");
        }, 1500);
      }
    } catch (err: any) {
      console.error("Lỗi đổi mật khẩu:", err);
      setError(err.response?.data?.message || err.message || "Đổi mật khẩu thất bại!");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#f0f9ff] flex relative overflow-hidden text-[#0c4a6e]">
      
      {/* KHU VỰC FORM ĐỔI MẬT KHẨU (BÊN TRÁI) */}
      <div className="w-full lg:w-1/2 min-h-screen flex flex-col items-center justify-center p-6 sm:p-10 md:p-16 z-20 relative">
        {/* Tiêu đề */}
        <h2 className="text-2xl sm:text-3xl font-semibold mb-6 sm:mb-8 text-center leading-snug tracking-wide">
          Chào mừng bạn đến với <br />
          <span className="bg-gradient-to-r from-[#0ea5e9] to-[#0c4a6e] bg-clip-text text-transparent text-3xl sm:text-4xl md:text-5xl font-bold uppercase block mt-2 pb-1">
            SMART WALKER VN
          </span>
          <span className="text-xl sm:text-2xl md:text-3xl font-bold uppercase block mt-3 text-[#0ea5e9]">ĐỔI MẬT KHẨU</span>
        </h2>

        {/* Form nhập liệu */}
        <form onSubmit={handleSubmit} className="w-full max-w-[420px] flex flex-col gap-4 sm:gap-5">
          {error && (
            <div className="w-full px-4 py-3 bg-red-50 border border-red-200 text-red-600 font-semibold rounded-xl text-sm transition-all animate-shake">
              ⚠️ {error}
            </div>
          )}

          {success && (
            <div className="w-full px-4 py-3 bg-green-50 border border-green-200 text-green-600 font-semibold rounded-xl text-sm transition-all">
              ✅ {success} đang chuyển hướng...
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-[#0c4a6e]/70 px-1">Mật khẩu cũ</label>
            <input
              type="password"
              placeholder="Nhập mật khẩu hiện tại"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              required
              className="w-full px-4 py-3 sm:px-5 sm:py-4 text-base sm:text-lg rounded-xl border-2 border-[#0c4a6e]/30 bg-white/50 text-[#0c4a6e] placeholder-[#0c4a6e]/40 focus:outline-none focus:border-[#0ea5e9] focus:ring-4 focus:ring-[#0ea5e9]/10 transition-all font-medium"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-[#0c4a6e]/70 px-1">Mật khẩu mới</label>
            <input
              type="password"
              placeholder="Tối thiểu 6 ký tự"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="w-full px-4 py-3 sm:px-5 sm:py-4 text-base sm:text-lg rounded-xl border-2 border-[#0c4a6e]/30 bg-white/50 text-[#0c4a6e] placeholder-[#0c4a6e]/40 focus:outline-none focus:border-[#0ea5e9] focus:ring-4 focus:ring-[#0ea5e9]/10 transition-all font-medium"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-[#0c4a6e]/70 px-1">Xác nhận mật khẩu mới</label>
            <input
              type="password"
              placeholder="Nhập lại mật khẩu mới"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full px-4 py-3 sm:px-5 sm:py-4 text-base sm:text-lg rounded-xl border-2 border-[#0c4a6e]/30 bg-white/50 text-[#0c4a6e] placeholder-[#0c4a6e]/40 focus:outline-none focus:border-[#0ea5e9] focus:ring-4 focus:ring-[#0ea5e9]/10 transition-all font-medium"
            />
          </div>

          <button
            type="submit"
            disabled={submitting || !!success}
            className="w-full mt-2 py-3 sm:py-4 bg-gradient-to-r from-[#0ea5e9] to-[#0c4a6e] text-white text-base sm:text-lg font-bold rounded-xl hover:opacity-90 hover:shadow-lg transition-all duration-300 disabled:opacity-50 cursor-pointer text-center"
          >
            {submitting ? "ĐANG THỰC HIỆN..." : "XÁC NHẬN ĐỔI MẬT KHẨU"}
          </button>
        </form>

        {/* Nút quay lại */}
        <button
          onClick={() => router.back()}
          className="mt-6 text-sm sm:text-base font-semibold text-[#0c4a6e]/70 hover:text-[#0ea5e9] transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Quay lại bảng điều khiển
        </button>
      </div>

      {/* KHỐI SLIDING CHỨA ẢNH (BÊN PHẢI) */}
      <div className="hidden lg:block absolute right-0 w-1/2 h-screen z-10 shadow-2xl">
        <div className="relative w-full h-full bg-[#0c4a6e]">
          <div
            className="absolute inset-0 bg-contain bg-bottom bg-no-repeat h-screen"
            style={{
              backgroundImage: "url('/auth_pic1.svg')",
              backgroundColor: "#eef1f5"
            }}
          ></div>
          <div className="absolute inset-0 h-screen bg-gradient-to-t from-[#0c4a6e]/30 to-transparent"></div>
        </div>
      </div>
    </div>
  );
}
