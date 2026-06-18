"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { DeviceScanView } from "../../sections/patient/view/device-scan-view";
import { BackButton } from "@/components/custom/back-button";
import { patientService } from "@/services/patientService";

export default function DeviceScanPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [deviceId, setDeviceId] = useState<string | null>(null);
  const [checkingDevice, setCheckingDevice] = useState(false);

  useEffect(() => {
    // Lấy device_id từ URL query params an toàn trên Client
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const id = params.get("device_id");
      setDeviceId(id);
      if (!id) {
        setCheckingDevice(true);
      }
    }
  }, []);

  useEffect(() => {
    if (!loading && !user) {
      if (deviceId) {
        // Lưu lại đường dẫn để tự động quay lại sau khi đăng nhập thành công
        localStorage.setItem("authRedirectPath", `/device-scan?device_id=${deviceId}`);
        router.push(`/auth?redirect=/device-scan?device_id=${deviceId}`);
      } else {
        localStorage.setItem("authRedirectPath", `/device-scan`);
        router.push(`/auth?redirect=/device-scan`);
      }
    }
  }, [loading, user, deviceId, router]);

  useEffect(() => {
    if (checkingDevice && !loading && user) {
      if (user.role_id === 2) {
        const checkAssignedDevice = async () => {
          try {
            const res = await patientService.getBooklet() as any;
            if (res.success && res.data && res.data.device_id) {
              const assignedId = res.data.device_id;
              setDeviceId(assignedId);
              router.replace(`/device-scan?device_id=${assignedId}`);
            }
          } catch (error) {
            console.error("Lỗi khi kiểm tra thiết bị cố định:", error);
          } finally {
            setCheckingDevice(false);
          }
        };
        checkAssignedDevice();
      } else {
        // Không phải role bệnh nhân, không cần kiểm tra thiết bị cố định
        setCheckingDevice(false);
      }
    }
  }, [checkingDevice, loading, user, router]);

  if (loading || (checkingDevice && !deviceId)) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-primary-50 text-primary-900">
        <svg className="w-10 h-10 animate-spin text-primary-500" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
        <p className="mt-4 font-semibold text-sm">Đang tải...</p>
      </div>
    );
  }

  if (!deviceId) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-primary-50 text-primary-900 p-6 text-center">
        <div className="w-20 h-20 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mb-6">
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
          </svg>
        </div>
        <h2 className="text-xl font-bold mb-2">Chưa kết nối thiết bị</h2>
        <p className="max-w-md text-gray-500 mb-6 text-sm">
          Vui lòng quét mã QR được dán trên khung xe tập đi bằng camera điện thoại để bắt đầu bài tập luyện của bạn.
        </p>
        <BackButton onClick={() => router.push("/dashboard")} />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-primary-50 text-primary-900">
        <svg className="w-10 h-10 animate-spin text-primary-500" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
        <p className="mt-4 font-semibold text-sm">Đang xác thực thông tin...</p>
      </div>
    );
  }

  if (user.role_id !== 2) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-primary-50 text-primary-900 p-6 text-center">
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
