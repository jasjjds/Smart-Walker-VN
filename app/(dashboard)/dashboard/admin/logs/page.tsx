import React from 'react';

// Dữ liệu mẫu cho Nhật ký (Logs)
const mockLogs = [
  { id: "LOG-001", time: "09:04:22 - 09/04/2026", level: "ERROR", source: "Auth Service", message: "Đăng nhập thất bại - Sai mật khẩu quá 5 lần", ip: "192.168.1.45" },
  { id: "LOG-002", time: "08:55:10 - 09/04/2026", level: "INFO", source: "Device IoT", message: "Đồng bộ dữ liệu thiết bị SW-204 thành công", ip: "10.0.0.22" },
  { id: "LOG-003", time: "08:42:05 - 09/04/2026", level: "WARN", source: "Database", message: "Thời gian phản hồi query vượt quá 500ms", ip: "Internal" },
  { id: "LOG-004", time: "08:15:30 - 09/04/2026", level: "INFO", source: "Admin Panel", message: "Bác sĩ Nguyễn Văn A đã cập nhật hồ sơ bệnh nhân", ip: "113.190.23.1" },
  { id: "LOG-005", time: "07:30:00 - 09/04/2026", level: "INFO", source: "System Backup", message: "Sao lưu dữ liệu tự động hoàn tất", ip: "Server-1" },
];

// Dữ liệu mẫu cho Biểu đồ cột (7 ngày qua)
const activityData = [
  { day: 'T4', count: 45, height: '40%' },
  { day: 'T5', count: 70, height: '60%' },
  { day: 'T6', count: 30, height: '30%' },
  { day: 'T7', count: 90, height: '80%' },
  { day: 'CN', count: 20, height: '20%' },
  { day: 'T2', count: 110, height: '95%' },
  { day: 'T3', count: 65, height: '55%' },
];

export default function SystemLogsPage() {
  return (
    <div className="w-full h-full flex flex-col gap-6 text-[#0c4a6e]">

      {/* =========================================
          1. HEADER TRANG
          ========================================= */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Nhật ký hệ thống</h1>
          <p className="text-[#0c4a6e]/70 mt-1 font-medium">Theo dõi và phân tích các hoạt động của hệ thống theo thời gian thực.</p>
        </div>

        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border-2 border-[#bae6fd] hover:bg-[#bae6fd]/30 text-[#0c4a6e] font-semibold rounded-lg transition-colors shadow-sm">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
            Làm mới
          </button>
          <button className="flex items-center gap-2 px-5 py-2 bg-[#0ea5e9] hover:bg-[#0284c7] text-white font-semibold rounded-lg transition-colors shadow-md">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
            Xuất báo cáo
          </button>
        </div>
      </div>

      {/* =========================================
          2. KHU VỰC THỐNG KÊ & BIỂU ĐỒ
          ========================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Khối Thống kê chung */}
        <div className="bg-[#e0f2fe] rounded-2xl p-6 border border-[#bae6fd] shadow-sm flex flex-col justify-between">
          <h3 className="text-lg font-bold mb-4">Tổng quan hôm nay</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-[#0c4a6e]/10">
              <span className="font-medium text-[#0c4a6e]/80">Tổng số Log:</span>
              <span className="text-2xl font-black">2,451</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-[#0c4a6e]/10">
              <span className="font-medium text-orange-500"> Cảnh báo:</span>
              <span className="text-xl font-bold text-orange-500">34</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium text-red-500">Lỗi nghiêm trọng:</span>
              <span className="text-xl font-bold text-red-500">12</span>
            </div>
          </div>
        </div>

        {/* Biểu đồ Cột - Lưu lượng Log */}
        <div className="bg-[#e0f2fe] rounded-2xl p-6 border border-[#bae6fd] shadow-sm lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold">Lưu lượng truy cập (7 ngày qua)</h3>
          </div>

          {/* Vẽ biểu đồ cột bằng Flexbox */}
          <div className="h-32 w-full flex items-end justify-between gap-2 md:gap-4 px-2">
            {activityData.map((data, index) => (
              <div key={index} className="flex flex-col items-center flex-1 group">
                {/* Tooltip ảo khi hover */}
                <span className="opacity-0 group-hover:opacity-100 transition-opacity text-xs font-bold mb-1 text-[#0ea5e9]">{data.count}</span>
                {/* Cột dữ liệu */}
                <div
                  className="w-full max-w-[40px] bg-gradient-to-t from-[#0ea5e9] to-[#7dd3fc] rounded-t-md transition-all duration-500 group-hover:from-[#0284c7] group-hover:to-[#0ea5e9]"
                  style={{ height: data.height }}
                ></div>
                {/* Nhãn trục X */}
                <span className="text-xs font-semibold mt-2 text-[#0c4a6e]/70">{data.day}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* =========================================
          3. BẢNG DỮ LIỆU NHẬT KÝ CHI TIẾT
          ========================================= */}
      <div className="bg-[#e0f2fe] rounded-2xl shadow-sm border border-[#bae6fd] flex flex-col flex-1 overflow-hidden mt-2">

        {/* Bộ lọc bảng */}
        <div className="px-6 py-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-[#0c4a6e]/10">
          <h2 className="text-xl md:text-2xl font-bold">Lịch sử sự kiện</h2>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            {/* Filter Loại */}
            <select className="px-4 py-2.5 bg-white rounded-lg border border-[#bae6fd] focus:outline-none focus:ring-2 focus:ring-[#0ea5e9] text-[#0c4a6e] font-medium shadow-sm cursor-pointer">
              <option value="ALL">Tất cả cấp độ</option>
              <option value="INFO">Thông tin</option>
              <option value="WARN">Cảnh báo</option>
              <option value="ERROR">Lỗi</option>
            </select>

            {/* Search bar */}
            <div className="relative w-full sm:w-64">
              <input
                type="text"
                placeholder="Tìm mã lỗi, IP..."
                className="w-full pl-10 pr-4 py-2.5 bg-white rounded-lg border border-[#bae6fd] focus:outline-none focus:ring-2 focus:ring-[#0ea5e9] text-[#0c4a6e] placeholder-[#0c4a6e]/50 font-medium shadow-sm transition-shadow"
              />
              <svg className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#0c4a6e]/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Bảng (Table) */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-[#e0f2fe] text-[#0c4a6e] text-sm md:text-base border-b border-[#0c4a6e]/20">
                <th className="py-4 px-6 font-bold whitespace-nowrap">Thời gian</th>
                <th className="py-4 px-6 font-bold whitespace-nowrap">Mức độ</th>
                <th className="py-4 px-6 font-bold whitespace-nowrap">Nguồn / Dịch vụ</th>
                <th className="py-4 px-6 font-bold w-1/2">Nội dung chi tiết</th>
                <th className="py-4 px-6 font-bold whitespace-nowrap">IP / Máy khách</th>
              </tr>
            </thead>
            <tbody>
              {mockLogs.map((log) => (
                <tr key={log.id} className="border-b border-[#f0f9ff]/50 hover:bg-[#bae6fd]/30 transition-colors">

                  <td className="py-4 px-6 font-semibold text-sm">
                    {log.time}
                  </td>

                  <td className="py-4 px-6">
                    {/* Badge màu cho Level */}
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${log.level === 'ERROR' ? 'bg-red-100 text-red-600 border-red-200' :
                      log.level === 'WARN' ? 'bg-orange-100 text-orange-600 border-orange-200' :
                        'bg-blue-100 text-blue-600 border-blue-200'
                      }`}>
                      {log.level}
                    </span>
                  </td>

                  <td className="py-4 px-6 font-bold text-[#0c4a6e]/80 text-sm">
                    {log.source}
                  </td>

                  <td className="py-4 px-6 font-medium text-sm">
                    {log.message}
                  </td>

                  <td className="py-4 px-6 font-mono text-xs text-[#0c4a6e]/60">
                    {log.ip}
                  </td>

                </tr>
              ))}

              {/* Căn dòng lấp đầy */}
              {Array.from({ length: 3 }).map((_, idx) => (
                <tr key={`empty-${idx}`} className="border-b border-[#f0f9ff]/50 h-16">
                  <td></td><td></td><td></td><td></td><td></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Phân trang (Pagination) */}
        <div className="px-6 py-4 flex items-center justify-between border-t border-[#0c4a6e]/10 bg-[#e0f2fe]/50">
          <span className="text-sm font-medium text-[#0c4a6e]/70">Hiển thị 1 - 5 của 2,451 kết quả</span>
          <div className="flex gap-1">
            <button className="px-3 py-1 rounded bg-white border border-[#bae6fd] text-[#0c4a6e] hover:bg-[#bae6fd]/50 transition-colors disabled:opacity-50" disabled>Trước</button>
            <button className="px-3 py-1 rounded bg-[#0ea5e9] text-white font-bold shadow-sm">1</button>
            <button className="px-3 py-1 rounded bg-white border border-[#bae6fd] text-[#0c4a6e] hover:bg-[#bae6fd]/50 transition-colors">2</button>
            <button className="px-3 py-1 rounded bg-white border border-[#bae6fd] text-[#0c4a6e] hover:bg-[#bae6fd]/50 transition-colors">3</button>
            <span className="px-2 py-1 text-[#0c4a6e]/50">...</span>
            <button className="px-3 py-1 rounded bg-white border border-[#bae6fd] text-[#0c4a6e] hover:bg-[#bae6fd]/50 transition-colors">Tiếp</button>
          </div>
        </div>

      </div>
    </div>
  );
}