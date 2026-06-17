import React from 'react';
import { BRAND_CONFIG } from "@/config/brand";
import { CustomInput } from '@/components/custom/custom-input';
import { SearchIcon, RefreshIcon, DownloadIcon } from '@/components/common/icons';

const mockLogs = [
  { id: "LOG-001", time: "09:04:22 - 09/04/2026", level: "ERROR", source: "Auth Service", message: "Đăng nhập thất bại - Sai mật khẩu quá 5 lần", ip: "192.168.1.45" },
  { id: "LOG-002", time: "08:55:10 - 09/04/2026", level: "INFO", source: "Device IoT", message: "Đồng bộ dữ liệu thiết bị SW-204 thành công", ip: "10.0.0.22" },
  { id: "LOG-003", time: "08:42:05 - 09/04/2026", level: "WARN", source: "Database", message: "Thời gian phản hồi query vượt quá 500ms", ip: "Internal" },
  { id: "LOG-004", time: "08:15:30 - 09/04/2026", level: "INFO", source: "Admin Panel", message: "Bác sĩ Nguyễn Văn A đã cập nhật hồ sơ bệnh nhân", ip: "113.190.23.1" },
  { id: "LOG-005", time: "07:30:00 - 09/04/2026", level: "INFO", source: "System Backup", message: "Sao lưu dữ liệu tự động hoàn tất", ip: "Server-1" },
];

const activityData = [
  { day: 'T4', count: 45, height: '40%' },
  { day: 'T5', count: 70, height: '60%' },
  { day: 'T6', count: 30, height: '30%' },
  { day: 'T7', count: 90, height: '80%' },
  { day: 'CN', count: 20, height: '20%' },
  { day: 'T2', count: 110, height: '95%' },
  { day: 'T3', count: 65, height: '55%' },
];

export function SystemLogsView() {
  return (
    <div className="w-full h-full flex flex-col gap-6 text-primary-900">

      {/* =========================================
          1. HEADER TRANG
          ========================================= */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shrink-0">
        <div>
          <p className="text-primary-900/70 mt-1 text-xs sm:text-sm font-medium">{BRAND_CONFIG.admin.systemLogsDesc}</p>
        </div>

        <div className="flex gap-3 w-full sm:w-auto">
          <button className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2 border-2 border-primary-200 hover:bg-primary-200/30 text-primary-900 font-semibold rounded-lg transition-colors shadow-sm text-xs sm:text-sm">
            <RefreshIcon className="text-base" />
            Làm mới
          </button>
          <button className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-lg transition-colors shadow-md text-xs sm:text-sm">
            <DownloadIcon className="text-base" />
            Xuất báo cáo
          </button>
        </div>
      </div>

      {/* =========================================
          2. KHU VỰC THỐNG KÊ & BIỂU ĐỒ
          ========================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 shrink-0">
        
        {/* Khối Thống kê chung */}
        <div className="bg-primary-100 rounded-2xl p-5 sm:p-6 border border-primary-200 shadow-sm flex flex-col justify-between">
          <h3 className="text-base sm:text-lg font-bold mb-4">Tổng quan hôm nay</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-primary-900/10 text-xs sm:text-sm">
              <span className="font-medium text-primary-900/80">Tổng số Log:</span>
              <span className="text-xl sm:text-2xl font-black">2,451</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-primary-900/10 text-xs sm:text-sm">
              <span className="font-medium text-orange-500">Cảnh báo:</span>
              <span className="text-lg sm:text-xl font-bold text-orange-500">34</span>
            </div>
            <div className="flex justify-between items-center text-xs sm:text-sm">
              <span className="font-medium text-red-500">Lỗi nghiêm trọng:</span>
              <span className="text-lg sm:text-xl font-bold text-red-500">12</span>
            </div>
          </div>
        </div>

        {/* Biểu đồ Cột */}
        <div className="bg-primary-100 rounded-2xl p-5 sm:p-6 border border-primary-200 shadow-sm lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-base sm:text-lg font-bold">Lưu lượng truy cập (7 ngày qua)</h3>
          </div>

          <div className="h-32 w-full flex items-end justify-between gap-2 md:gap-4 px-2">
            {activityData.map((data, index) => (
              <div key={index} className="flex flex-col items-center flex-1 group">
                <span className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] sm:text-xs font-bold mb-1 text-primary-500">{data.count}</span>
                <div
                  className="w-full max-w-[32px] sm:max-w-[40px] bg-gradient-to-t from-primary-500 to-primary-300 rounded-t-md transition-all duration-500 group-hover:from-primary-600 group-hover:to-primary-500"
                  style={{ height: data.height }}
                ></div>
                <span className="text-[10px] sm:text-xs font-semibold mt-2 text-primary-900/70">{data.day}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* =========================================
          3. BẢNG DỮ LIỆU NHẬT KÝ CHI TIẾT
          ========================================= */}
      <div className="bg-primary-100 rounded-2xl shadow-sm border border-primary-200 flex flex-col flex-1 overflow-hidden mt-2">
        
        {/* Bộ lọc bảng */}
        <div className="px-5 py-4 sm:px-6 sm:py-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-primary-900/10">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold">Lịch sử sự kiện</h2>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <select className="px-4 py-2.5 bg-white rounded-lg border border-primary-200 focus:outline-none focus:ring-2 focus:ring-primary-500 text-primary-900 font-medium shadow-sm cursor-pointer text-xs sm:text-sm">
              <option value="ALL">Tất cả cấp độ</option>
              <option value="INFO">Thông tin</option>
              <option value="WARN">Cảnh báo</option>
              <option value="ERROR">Lỗi</option>
            </select>

            <CustomInput
              placeholder="Tìm mã lỗi, IP..."
              prefix={<SearchIcon className="text-primary-900/50" />}
              variant="search"
              className="w-full sm:w-64"
            />
          </div>
        </div>

        {/* Bảng */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-primary-100 text-primary-900 text-xs sm:text-sm md:text-base border-b border-primary-900/20">
                <th className="py-4 px-6 font-bold whitespace-nowrap">Thời gian</th>
                <th className="py-4 px-6 font-bold whitespace-nowrap">Mức độ</th>
                <th className="py-4 px-6 font-bold whitespace-nowrap">Nguồn / Dịch vụ</th>
                <th className="py-4 px-6 font-bold w-1/2">Nội dung chi tiết</th>
                <th className="py-4 px-6 font-bold whitespace-nowrap">IP / Máy khách</th>
              </tr>
            </thead>
            <tbody>
              {mockLogs.map((log) => (
                <tr key={log.id} className="border-b border-primary-50/50 hover:bg-primary-200/30 transition-colors">
                  <td className="py-4 px-6 font-semibold text-xs sm:text-sm">
                    {log.time}
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-bold border ${
                      log.level === 'ERROR' ? 'bg-red-100 text-red-600 border-red-200' :
                      log.level === 'WARN' ? 'bg-orange-100 text-orange-600 border-orange-200' :
                      'bg-blue-100 text-blue-600 border-blue-200'
                    }`}>
                      {log.level}
                    </span>
                  </td>
                  <td className="py-4 px-6 font-bold text-primary-900/80 text-xs sm:text-sm">
                    {log.source}
                  </td>
                  <td className="py-4 px-6 font-medium text-xs sm:text-sm">
                    {log.message}
                  </td>
                  <td className="py-4 px-6 font-mono text-[10px] sm:text-xs text-primary-900/60">
                    {log.ip}
                  </td>
                </tr>
              ))}

              {Array.from({ length: 3 }).map((_, idx) => (
                <tr key={`empty-${idx}`} className="border-b border-primary-50/50 h-16">
                  <td></td><td></td><td></td><td></td><td></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Phân trang */}
        <div className="px-4 py-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between border-t border-primary-900/10 bg-primary-100/50 gap-3">
          <span className="text-xs sm:text-sm font-medium text-primary-900/70">Hiển thị 1 - 5 của 2,451 kết quả</span>
          <div className="flex gap-1 text-xs sm:text-sm">
            <button className="px-3 py-1 rounded bg-white border border-primary-200 text-primary-900 hover:bg-primary-200/50 transition-colors disabled:opacity-50" disabled>Trước</button>
            <button className="px-3 py-1 rounded bg-primary-500 text-white font-bold shadow-sm">1</button>
            <button className="px-3 py-1 rounded bg-white border border-primary-200 text-primary-900 hover:bg-primary-200/50 transition-colors">2</button>
            <button className="px-3 py-1 rounded bg-white border border-primary-200 text-primary-900 hover:bg-primary-200/50 transition-colors">3</button>
            <span className="px-2 py-1 text-primary-900/50">...</span>
            <button className="px-3 py-1 rounded bg-white border border-primary-200 text-primary-900 hover:bg-primary-200/50 transition-colors">Tiếp</button>
          </div>
        </div>

      </div>
    </div>
  );
}
