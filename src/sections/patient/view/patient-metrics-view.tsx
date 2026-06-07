"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth-context";

const clinicalMetrics = [
  {
    title: "Cân bằng lực tỳ tay",
    description: "Theo dõi phân bố trọng lượng lên tay cầm của xe tập đi.",
    path: "force",
    icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
    color: "text-orange-500"
  },
  {
    title: "Quãng đường di chuyển",
    description: "Đo lường và theo dõi quãng đường tập luyện của bạn.",
    path: "gait",
    icon: "M13 10V3L4 14h7v7l9-11h-7z",
    color: "text-green-500"
  }
];

export function PatientMetricsView() {
  const { user } = useAuth();

  return (
    <div className="w-full h-full flex flex-col gap-6 text-[#0c4a6e]">

      <div>
        <p className="text-[#0c4a6e]/70 mt-1 text-xs sm:text-sm font-medium">Theo dõi các chỉ số sức khỏe của bạn thông qua thiết bị Smart Walker.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
        {clinicalMetrics.map((metric) => (
          <Link
            key={metric.title}
            href={`/dashboard/patient/metrics/${metric.path}`}
            className="group bg-white p-6 sm:p-8 rounded-3xl border border-[#bae6fd] shadow-sm hover:shadow-xl hover:border-[#0ea5e9] transition-all duration-300 flex flex-col gap-4 relative overflow-hidden"
          >
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-[#0ea5e9]/5 rounded-full group-hover:scale-150 transition-transform duration-500"></div>

            <div className="flex items-center gap-4">
              <div className="p-3 bg-[#f0f9ff] rounded-2xl text-[#0ea5e9] group-hover:bg-[#0ea5e9] group-hover:text-white transition-colors duration-300 shrink-0">
                <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={metric.icon} />
                </svg>
              </div>
              <div className="min-w-0">
                <h3 className="text-lg sm:text-xl font-bold truncate">{metric.title}</h3>
              </div>
            </div>

            <p className="text-sm sm:text-base text-[#0c4a6e]/70 leading-relaxed font-medium">
              {metric.description}
            </p>

            <div className="mt-2 flex items-center text-[#0ea5e9] font-bold text-sm">
              Mở giao diện đo lường
              <svg className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </div>
          </Link>
        ))}
      </div>

    </div>
  );
}
