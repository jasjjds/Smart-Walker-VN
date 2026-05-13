"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { fetchDistanceData } from '@/services/analyticsService';

const DEVICE_ID = '14:33:5C:02:39:98';

interface ProcessedData {
  date_bucket: string;
  label: string;
  subLabel: string;
  total_distance: number;
}

export default function DistanceAnalyticsPage() {
  const [intervalType, setIntervalType] = useState<'minute' | 'hour' | 'day'>('day');
  const [data, setData] = useState<ProcessedData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Gọi API mỗi khi người dùng đổi bộ lọc thời gian
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        // Backend giờ đã trả data chuẩn 100%
        const result = await fetchDistanceData(DEVICE_ID, intervalType);

        if (!result || result.length === 0) {
          setData([]);
          return;
        }

        // FE chỉ việc bóc data ra và format lại cái text hiển thị (nhãn trục X)
        const formattedData = result.map((item: any) => {
          const dateObj = new Date(item.date_bucket);
          const pad = (n: number) => n.toString().padStart(2, '0');

          const timeStr = `${pad(dateObj.getHours())}:${pad(dateObj.getMinutes())}`;
          const dateStr = `${pad(dateObj.getDate())}/${pad(dateObj.getMonth() + 1)}`;

          return {
            date_bucket: item.date_bucket,
            label: intervalType === 'day' ? dateStr : timeStr,
            subLabel: intervalType !== 'day' ? dateStr : '',
            total_distance: Number(item.total_distance)
          };
        });

        setData(formattedData);
      } catch (error) {
        console.error("Lỗi tải dữ liệu", error);
        setData([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [intervalType]);

  const maxDistance = data.length > 0 ? Math.max(...data.map(d => d.total_distance)) : 1;
  const totalDistance = data.reduce((sum, item) => sum + item.total_distance, 0);
  const avgDistance = data.length > 0 ? (totalDistance / data.length).toFixed(2) : "0.00";

  return (
    <div className="w-full h-full flex flex-col gap-4 text-[#0c4a6e] overflow-hidden">

      {/* 0. NÚT QUAY LẠI */}
      <Link href="/dashboard/doctor" className="flex items-center gap-2 text-[#0ea5e9] hover:text-[#0c4a6e] font-bold w-fit transition-colors text-sm shrink-0">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Quay lại tổng quan
      </Link>

      {/* 1. HEADER & BỘ LỌC */}
      <div className="flex justify-between items-center shrink-0">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Thống kê Quãng đường</h1>
          <p className="text-[#0c4a6e]/70 mt-0.5 text-sm font-medium italic">Theo dõi mức độ vận động của bệnh nhân qua các mốc thời gian.</p>
        </div>

        <div className="flex bg-white rounded-xl shadow-sm border border-gray-200 p-1">
          {(['minute', 'hour', 'day'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setIntervalType(type)}
              className={`px-4 py-1.5 text-sm font-bold rounded-lg transition-all ${intervalType === type ? 'bg-[#0ea5e9] text-white shadow-md' : 'text-gray-500 hover:bg-gray-100'
                }`}
            >
              {type === 'minute' ? 'Theo Phút' : type === 'hour' ? 'Theo Giờ' : 'Theo Ngày'}
            </button>
          ))}
        </div>
      </div>

      {/* 2. MAIN CONTENT AREA */}
      <div className="flex-1 min-h-0 flex flex-col gap-4">

        <div className="flex-1 min-h-0 bg-white rounded-2xl p-5 border border-gray-300 shadow-sm flex flex-col relative">
          <div className="flex justify-between items-center mb-6 shrink-0 z-10">
            <h3 className="text-base font-bold text-gray-800">Biểu đồ Vận động (m)</h3>
          </div>

          <div className="flex-1 w-full relative min-h-0">

            {/* Lớp nền chia vạch Y-axis (Dịch không gian pb-10 để nhường chỗ cho nhãn) */}
            <div className="absolute inset-0 pl-10 pb-10 flex flex-col justify-between pointer-events-none z-0">
              {[1, 0.75, 0.5, 0.25, 0].map((ratio) => {
                const val = (maxDistance * ratio).toFixed(2);
                return (
                  <div key={ratio} className="w-full flex items-center relative h-0">
                    <div className={`w-full absolute ${ratio === 0 ? 'border-b-2 border-gray-800' : 'border-b border-dashed border-gray-200'}`}></div>
                    <span className="absolute -left-10 text-[10px] font-mono text-gray-500 bg-white pr-2 -translate-y-1/2">{val}m</span>
                  </div>
                );
              })}
            </div>

            {/* Trục dọc */}
            <div className="absolute top-0 bottom-10 left-10 border-l-2 border-gray-800 pointer-events-none z-10"></div>

            {/* LỚP VẼ CỘT DIV FLEXBOX */}
            <div className="absolute inset-0 pl-10 flex">
              {isLoading ? (
                <div className="w-full h-full flex items-center justify-center text-gray-400 font-bold pb-10">Đang tải dữ liệu...</div>
              ) : data.length === 0 ? (
                <div className="w-full h-full flex items-center justify-center text-gray-400 font-bold pb-10">Chưa có dữ liệu.</div>
              ) : (
                data.map((item) => {
                  const heightPercent = (item.total_distance / maxDistance) * 85;

                  return (
                    // Vùng chứa 1 cột (Giữ cố định pb-10 làm đáy an toàn)
                    <div key={item.date_bucket} className="flex-1 flex flex-col items-center justify-end h-full pb-10 relative group px-1">

                      {/* SỐ TRÊN ĐỈNH CỘT */}
                      <span className="text-[10px] sm:text-[11px] font-black text-[#0ea5e9] mb-1 opacity-90 group-hover:opacity-100 group-hover:-translate-y-1 transition-all">
                        {item.total_distance.toFixed(2)}
                      </span>

                      {/* KHỐI CỘT MÀU XANH */}
                      <div
                        className="bg-[#0ea5e9] w-full max-w-[48px] rounded-t-md shadow-sm transition-all duration-300 group-hover:bg-[#0c4a6e]"
                        style={{ height: `${Math.max(heightPercent, 1)}%` }}
                      ></div>

                      {/* NHÃN THỜI GIAN TRỤC X (Nằm trọn trong vùng pb-10 của đáy) */}
                      <div className="absolute bottom-1 w-full flex flex-col items-center justify-center">
                        <span className="text-[10px] sm:text-xs font-bold text-gray-600 whitespace-nowrap">
                          {item.label}
                        </span>
                        {item.subLabel && (
                          <span className="text-[8px] sm:text-[9px] font-medium text-gray-400 mt-[1px]">
                            {item.subLabel}
                          </span>
                        )}
                      </div>

                    </div>
                  );
                })
              )}
            </div>

          </div>
        </div>

        {/* 3. KHỐI CHỈ SỐ */}
        <div className="h-28 shrink-0 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm flex items-center justify-between">
            <div>
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Tổng quãng đường</h3>
              <p className="text-xs font-medium text-gray-600">Lũy kế theo bộ lọc.</p>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-2xl font-black text-[#0ea5e9]">{totalDistance.toFixed(2)}</span>
              <span className="text-[10px] font-bold text-gray-400">mét</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm flex items-center justify-between">
            <div>
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Thành tích cao nhất</h3>
              <p className="text-xs font-medium text-gray-600">Trong một chu kỳ.</p>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-2xl font-black text-[#0c4a6e]">{maxDistance === 1 && totalDistance === 0 ? "0.00" : maxDistance.toFixed(2)}</span>
              <span className="text-[10px] font-bold text-gray-400">mét</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm flex items-center justify-between">
            <div>
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Trung bình</h3>
              <p className="text-xs font-medium text-gray-600">Mỗi {intervalType === 'day' ? 'ngày' : intervalType === 'hour' ? 'giờ' : 'phút'}.</p>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-2xl font-black text-emerald-600">{avgDistance}</span>
              <span className="text-[10px] font-bold text-gray-400">mét</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}