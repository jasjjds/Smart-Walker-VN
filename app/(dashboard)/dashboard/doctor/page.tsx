"use client";

import Link from "next/link";

const clinicalMetrics = [
  {
    title: "Phân tích Trọng tâm",
    description: "Theo dõi độ lệch tư thế và khả năng giữ thăng bằng.",
    path: "/dashboard/doctor/cog",
    icon: "M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zm0-2a8 8 0 100-16 8 8 0 000 16z M12 8v8m-4-4h8",
    status: "Bình thường",
    color: "text-green-500"
  },
  {
    title: "Cân bằng lực tỳ tay",
    description: "Đo lường sự bất đối xứng giữa tay trái và tay phải.",
    path: "/dashboard/doctor/force",
    icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
    status: "Lệch trái nhẹ",
    color: "text-orange-500"
  },
  {
    title: "Chu kỳ dáng đi",
    description: "Phân tích nhịp điệu và tốc độ bước chân của bệnh nhân.",
    path: "/dashboard/doctor/gait",
    icon: "M13 10V3L4 14h7v7l9-11h-7z",
    status: "Đều đặn",
    color: "text-green-500"
  },
  {
    title: "Chỉ số nguy cơ té ngã",
    description: "Cảnh báo sớm dựa trên độ ổn định của dữ liệu cảm biến.",
    path: "/dashboard/doctor/risk",
    icon: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z",
    status: "Nguy cơ thấp",
    color: "text-blue-500"
  }
];

export default function DoctorDashboardPage() {
  return (
    <div className="w-full h-full flex flex-col gap-8 text-[#0c4a6e]">


      {/* Lưới các thẻ điều hướng */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {clinicalMetrics.map((metric) => (
          <Link
            key={metric.title}
            href={metric.path}
            className="group bg-white p-8 rounded-3xl border border-[#bae6fd] shadow-sm hover:shadow-xl hover:border-[#0ea5e9] transition-all duration-300 flex flex-col gap-4 relative overflow-hidden"
          >
            {/* Background trang trí */}
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-[#0ea5e9]/5 rounded-full group-hover:scale-150 transition-transform duration-500"></div>

            <div className="flex items-center gap-4">
              <div className="p-3 bg-[#f0f9ff] rounded-2xl text-[#0ea5e9] group-hover:bg-[#0ea5e9] group-hover:text-white transition-colors duration-300">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={metric.icon} />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold">{metric.title}</h3>
                <span className={`text-xs font-bold uppercase tracking-widest ${metric.color}`}>
                  ● {metric.status}
                </span>
              </div>
            </div>

            <p className="text-[#0c4a6e]/70 leading-relaxed font-medium">
              {metric.description}
            </p>

            <div className="mt-4 flex items-center text-[#0ea5e9] font-bold text-sm">
              Xem chi tiết
              <svg className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </div>
          </Link>
        ))}
      </div>

      {/* Thông báo cập nhật nhanh */}
      <div className="mt-auto p-6 bg-[#0c4a6e] rounded-2xl text-[#f0f9ff] flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center animate-pulse">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          </div>
          <div>
            <p className="font-bold">Dữ liệu thời gian thực đang hoạt động</p>
            <p className="text-sm opacity-70">Nhận dữ liệu từ 12 thiết bị Smart Walker trong khu vực.</p>
          </div>
        </div>
        <button className="px-6 py-2 bg-[#0ea5e9] hover:bg-white hover:text-[#0c4a6e] rounded-xl font-bold transition-all">
          Xem thông báo
        </button>
      </div>
    </div>
  );
}