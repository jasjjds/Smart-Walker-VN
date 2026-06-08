"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { DeviceScanView } from "../../sections/patient/view/device-scan-view";
import { BackButton } from "@/components/custom/back-button";

export default function DeviceScanPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [deviceId, setDeviceId] = useState<string | null>(null);

  useEffect(() => {
    // Lấy device_id từ URL query params an toàn trên Client
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      setDeviceId(params.get("device_id"));
    }
  }, []);

  useEffect(() => {
    if (!loading && !user && deviceId) {
      // Lưu lại đường dẫn để tự động quay lại sau khi đăng nhập thành công
      localStorage.setItem("authRedirectPath", `/device-scan?device_id=${deviceId}`);
      router.push(`/auth?redirect=/device-scan?device_id=${deviceId}`);
    }
  }, [loading, user, deviceId, router]);

  if (loading || !deviceId) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#f0f9ff] text-[#0c4a6e]">
        <svg className="w-10 h-10 animate-spin text-[#0ea5e9]" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
        <p className="mt-4 font-semibold text-sm">Đang tải cấu hình thiết bị...</p>
      </div>
    );
  }

  if (user && user.role_id !== 2) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#f0f9ff] text-[#0c4a6e] p-6 text-center">
        <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-6">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h2 className="text-xl font-bold mb-2">Quyền truy cập không hợp lệ</h2>
        <p className="max-w-md text-gray-500 mb-6 text-sm">
          Thiết bị xe tập đi chỉ có thể được kết nối và kích hoạt bởi tài khoản của **Bệnh nhân**. Tài khoản của bạn đang có vai trò khác.
        </p>
        <BackButton
          onClick={() => router.push(user.role_id === 3 ? "/dashboard/doctor/patients" : "/dashboard/admin/users")}
        />
      </div>
    );
  }

  // Nếu đã đăng nhập thành công và đúng là bệnh nhân
  return <DeviceScanView deviceId={deviceId} />;
}
