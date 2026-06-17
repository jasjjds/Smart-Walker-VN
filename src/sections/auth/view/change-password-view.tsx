"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { BackButton } from "@/components/custom/back-button";
import { BRAND_CONFIG } from "@/config/brand";
import { CustomInput } from "@/components/custom/custom-input";
import { CustomButton } from "@/components/custom/custom-button";
import { Layout } from "antd";

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
    <Layout className="min-h-screen w-full !bg-primary-50 flex !items-center !justify-center p-4 sm:p-6 !text-primary-900">
      <Layout.Content className="w-full max-w-[420px] flex flex-col items-center justify-center">
        {/* Tiêu đề */}
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-center bg-gradient-to-r from-primary-500 to-primary-900 bg-clip-text text-transparent uppercase tracking-wider">
          Đổi mật khẩu
        </h2>

        {/* Form nhập liệu */}
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4 sm:gap-5">
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

          <div className="flex flex-col gap-1.5 w-full">
            <label className="text-xs font-bold text-primary-900/70 px-1">Mật khẩu cũ</label>
            <CustomInput
              isPassword
              placeholder="Nhập mật khẩu hiện tại"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              required
            />
          </div>

          <div className="flex flex-col gap-1.5 w-full">
            <label className="text-xs font-bold text-primary-900/70 px-1">Mật khẩu mới</label>
            <CustomInput
              isPassword
              placeholder="Tối thiểu 6 ký tự"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>

          <div className="flex flex-col gap-1.5 w-full">
            <label className="text-xs font-bold text-primary-900/70 px-1">Xác nhận mật khẩu mới</label>
            <CustomInput
              isPassword
              placeholder="Nhập lại mật khẩu mới"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <CustomButton
            htmlType="submit"
            loading={submitting}
            disabled={!!success}
            loadingText="ĐANG THỰC HIỆN..."
            className="mt-2"
          >
            XÁC NHẬN ĐỔI MẬT KHẨU
          </CustomButton>
        </form>

        {/* Nút quay lại */}
        <BackButton onClick={() => router.back()} className="mt-6" />
      </Layout.Content>
    </Layout>
  );
}
