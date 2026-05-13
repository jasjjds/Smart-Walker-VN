"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

const MAX_FORCE_KG = 30;
const HISTORY_LENGTH = 40;

// Thay bằng địa chỉ MAC hoặc UUID của mạch ESP32 bạn đang dùng
const DEVICE_ID = '14:33:5C:02:39:98';
// Thay bằng URL Backend của bạn (nếu chạy bed riêng thì đổi sang http://localhost:3020)
const API_URL = 'http://localhost:3020';

export default function ForceBalancePage() {
  // Đổi tên state cho hợp với việc lấy dữ liệu thật
  const [isLive, setIsLive] = useState(false);
  const [currentForce, setCurrentForce] = useState({ left: 0, right: 0 });
  const [history, setHistory] = useState(
    Array(HISTORY_LENGTH).fill({ left: 0, right: 0 })
  );
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Hook lấy dữ liệu từ Backend
  useEffect(() => {
    if (isLive) {
      const fetchForceData = async () => {
        try {
          // Gọi API bạn đã viết trong file routes/analytics.js
          const response = await fetch(`${API_URL}/api/analytics/force?device_id=${DEVICE_ID}&limit=${HISTORY_LENGTH}`);
          const data = await response.json();

          if (data.success && data.chartData && data.chartData.length > 0) {
            const fetchedHistory = data.chartData;

            // 1. Cập nhật trạng thái hiện tại (Lấy phần tử cuối cùng của mảng)
            const latest = fetchedHistory[fetchedHistory.length - 1];
            setCurrentForce({
              left: latest.left || 0,
              right: latest.right || 0
            });

            // 2. Cập nhật lịch sử vẽ biểu đồ
            // Nếu Database chưa đủ 40 bản ghi, ta đệm thêm các giá trị 0 vào đầu cho đủ mảng
            let paddedHistory = [...fetchedHistory];
            while (paddedHistory.length < HISTORY_LENGTH) {
              paddedHistory.unshift({ left: 0, right: 0 });
            }
            // Đảm bảo không vượt quá HISTORY_LENGTH nếu DB trả về nhiều hơn
            setHistory(paddedHistory.slice(-HISTORY_LENGTH));
          }
        } catch (error) {
          console.error("❌ Lỗi lấy dữ liệu Force:", error);
        }
      };

      // Gọi ngay lập tức khi vừa bấm nút
      fetchForceData();
      // Sau đó cứ mỗi 1 giây (1000ms) thì gọi lại 1 lần để cập nhật data mới
      timerRef.current = setInterval(fetchForceData, 1000);

    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    // Cleanup function khi rời khỏi trang
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isLive]);

  const totalForce = currentForce.left + currentForce.right;
  const leftPercent = totalForce > 0 ? (currentForce.left / totalForce) * 100 : 50;
  const rightPercent = totalForce > 0 ? (currentForce.right / totalForce) * 100 : 50;
  const asymmetryIndex = Math.abs(leftPercent - rightPercent);

  const createSvgPath = (key: 'left' | 'right') => {
    const points = history.map((data, index) => {
      const x = (index / (HISTORY_LENGTH - 1)) * 100;
      // Tránh việc data[key] bị null/undefined gây lỗi vẽ biểu đồ
      const forceValue = data[key] || 0;
      const y = 100 - (forceValue / MAX_FORCE_KG) * 100;
      return `${x},${y}`;
    });
    return points.join(' ');
  };

  return (
    <div className="w-full h-full flex flex-col gap-4 text-[#0c4a6e] overflow-hidden">

      {/* 0. NÚT QUAY LẠI */}
      <Link
        href="/dashboard/doctor"
        className="flex items-center gap-2 text-[#0ea5e9] hover:text-[#0c4a6e] font-bold w-fit transition-colors text-sm"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Quay lại tổng quan
      </Link>

      {/* 1. HEADER */}
      <div className="flex justify-between items-center shrink-0">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Cân bằng lực tỳ tay</h1>
          <p className="text-[#0c4a6e]/70 mt-0.5 text-sm font-medium italic">
            Theo dõi sự phân bố trọng lượng lên hai tay cầm của xe tập đi.
          </p>
        </div>
        <button
          onClick={() => setIsLive(!isLive)}
          className={`px-5 py-2 text-sm font-bold rounded-xl shadow-md transition-all flex items-center gap-2 ${isLive ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-[#0ea5e9] hover:bg-[#0c4a6e] text-white'
            }`}
        >
          {/* Đổi nhãn nút bấm cho ngầu */}
          {isLive ? '🔴 Dừng lấy dữ liệu' : '▶️ Bắt đầu Live Data'}
        </button>
      </div>

      {/* 2. MAIN CONTENT */}
      <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-4 gap-4">

        {/* KHỐI TRÁI: GAUGES */}
        <div className="col-span-1 bg-[#e0f2fe] rounded-2xl p-5 border border-[#bae6fd] shadow-sm flex flex-col items-center relative h-full">
          <h3 className="text-xs font-bold uppercase tracking-widest opacity-70 mb-4 shrink-0">Trạng thái hiện tại</h3>

          <div className="flex-1 w-full flex items-end justify-center gap-8 min-h-0 pb-2">

            {/* Thanh Tay Trái */}
            <div className="flex flex-col items-center h-full max-h-[300px]">
              <div className="text-lg font-black text-[#0ea5e9] mb-2 shrink-0">{currentForce.left.toFixed(1)} <span className="text-xs">kg</span></div>
              <div className="w-14 flex-1 min-h-[100px] bg-white rounded-full p-1.5 shadow-inner flex items-end relative overflow-hidden">
                <div className="absolute inset-0 flex flex-col justify-between py-4 opacity-10">
                  {[...Array(6)].map((_, i) => <div key={i} className="w-full h-px bg-[#0c4a6e]"></div>)}
                </div>
                <div
                  className="w-full bg-gradient-to-t from-[#bae6fd] to-[#0ea5e9] rounded-full transition-all duration-300 ease-out"
                  style={{ height: `${(currentForce.left / MAX_FORCE_KG) * 100}%` }}
                ></div>
              </div>
              <div className="font-bold text-[#0c4a6e] text-xs mt-3 shrink-0">TRÁI</div>
              <div className="px-2 py-0.5 mt-1 bg-white rounded text-xs font-bold shadow-sm shrink-0">{leftPercent.toFixed(1)}%</div>
            </div>

            {/* Thanh Tay Phải */}
            <div className="flex flex-col items-center h-full max-h-[300px]">
              <div className="text-lg font-black text-[#0c4a6e] mb-2 shrink-0">{currentForce.right.toFixed(1)} <span className="text-xs">kg</span></div>
              <div className="w-14 flex-1 min-h-[100px] bg-white rounded-full p-1.5 shadow-inner flex items-end relative overflow-hidden">
                <div className="absolute inset-0 flex flex-col justify-between py-4 opacity-10">
                  {[...Array(6)].map((_, i) => <div key={i} className="w-full h-px bg-[#0c4a6e]"></div>)}
                </div>
                <div
                  className="w-full bg-gradient-to-t from-[#7dd3fc] to-[#0c4a6e] rounded-full transition-all duration-300 ease-out"
                  style={{ height: `${(currentForce.right / MAX_FORCE_KG) * 100}%` }}
                ></div>
              </div>
              <div className="font-bold text-[#0c4a6e] text-xs mt-3 shrink-0">PHẢI</div>
              <div className="px-2 py-0.5 mt-1 bg-white rounded text-xs font-bold shadow-sm shrink-0">{rightPercent.toFixed(1)}%</div>
            </div>

          </div>
        </div>

        {/* KHỐI PHẢI: CHART & METRICS */}
        <div className="col-span-3 flex flex-col gap-4 h-full min-h-0">

          {/* Chart */}
          <div className="flex-1 min-h-0 bg-white rounded-2xl p-5 border border-[#bae6fd] shadow-sm flex flex-col">
            <div className="flex justify-between items-center mb-2 shrink-0">
              <h3 className="text-base font-bold">Biến thiên lực (30s qua)</h3>
              <div className="flex gap-4 text-xs font-bold">
                <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#0ea5e9]"></span> Tay Trái</div>
                <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#0c4a6e]"></span> Tay Phải</div>
              </div>
            </div>

            <div className="flex-1 min-h-0 w-full bg-[#f0f9ff]/50 rounded-xl border border-[#bae6fd]/50 relative">
              <div className="absolute inset-0 flex flex-col justify-between py-4 px-2 opacity-20 pointer-events-none">
                {[30, 20, 10, 0].map(val => (
                  <div key={val} className="w-full border-b border-[#0c4a6e] border-dashed flex justify-start">
                    <span className="text-[10px] -mt-2.5 bg-[#f0f9ff] pr-1">{val}kg</span>
                  </div>
                ))}
              </div>
              <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
                <polyline
                  points={createSvgPath('left')}
                  fill="none" stroke="#0ea5e9" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round"
                  className="transition-all duration-300"
                />
                <polyline
                  points={createSvgPath('right')}
                  fill="none" stroke="#0c4a6e" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round"
                  className="transition-all duration-300"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}