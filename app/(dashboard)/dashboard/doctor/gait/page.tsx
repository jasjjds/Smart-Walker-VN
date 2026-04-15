"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

const MAX_FORCE = 30; // Max lực 30kg
const HISTORY_LENGTH = 100; // Số điểm dữ liệu
const UPDATE_INTERVAL = 100; // Tốc độ cập nhật 10Hz

// Hàm tạo điểm sóng ban đầu
const generateInitialWave = () => {
  return Array.from({ length: HISTORY_LENGTH }, (_, i) => {
    const t = (i - HISTORY_LENGTH) * 0.1;
    const baseLeft = Math.max(0, Math.sin(t * 3)) * 15;
    const baseRight = Math.max(0, Math.sin(t * 3 - Math.PI)) * 15;
    return {
      left: baseLeft > 0 ? baseLeft + 5 : 5,
      right: baseRight > 0 ? baseRight + 5 : 5
    };
  });
};

export default function GaitCyclePage() {
  const [isSimulating, setIsSimulating] = useState(false);
  const [timeStep, setTimeStep] = useState(0);

  const [history, setHistory] = useState<{ left: number; right: number }[]>(
    generateInitialWave()
  );

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isSimulating) {
      timerRef.current = setInterval(() => {
        setTimeStep((prev) => {
          const t = prev + 0.1;

          const baseLeft = Math.max(0, Math.sin(t * 3)) * 15;
          const baseRight = Math.max(0, Math.sin(t * 3 - Math.PI)) * 15;

          const noiseL = Math.random() * 2;
          const noiseR = Math.random() * 2;

          const newLeft = baseLeft > 0 ? baseLeft + 5 + noiseL : 5 + noiseL;
          const newRight = baseRight > 0 ? baseRight + 5 + noiseR : 5 + noiseR;

          setHistory(currentHistory => [
            ...currentHistory.slice(1),
            { left: newLeft, right: newRight }
          ]);

          return t;
        });
      }, UPDATE_INTERVAL);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isSimulating]);

  const createSvgPath = (key: 'left' | 'right') => {
    return history.map((data, index) => {
      const x = (index / (HISTORY_LENGTH - 1)) * 100;
      const y = 100 - (data[key] / MAX_FORCE) * 100;
      return `${x},${y}`;
    }).join(' L ');
  };

  return (
    <div className="w-full h-full flex flex-col gap-4 text-[#0c4a6e] overflow-hidden">

      {/* 0. NÚT QUAY LẠI */}
      <Link
        href="/dashboard/doctor"
        className="flex items-center gap-2 text-[#0ea5e9] hover:text-[#0c4a6e] font-bold w-fit transition-colors text-sm shrink-0"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Quay lại tổng quan
      </Link>

      {/* 1. HEADER */}
      <div className="flex justify-between items-center shrink-0">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Phân tích Chu kỳ dáng đi (Gait)</h1>
          <p className="text-[#0c4a6e]/70 mt-0.5 text-sm font-medium italic">
            Biểu diễn lực tỳ theo thời gian trên hệ trục tọa độ chuẩn.
          </p>
        </div>
        <button
          onClick={() => setIsSimulating(!isSimulating)}
          className={`px-5 py-2 text-sm font-bold rounded-xl shadow-md transition-all flex items-center gap-2 ${isSimulating ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-[#0ea5e9] hover:bg-[#0c4a6e] text-white'
            }`}
        >
          {isSimulating ? 'Dừng theo dõi' : 'Bắt đầu theo dõi'}
        </button>
      </div>

      {/* 2. MAIN CONTENT AREA */}
      <div className="flex-1 min-h-0 flex flex-col gap-4">

        {/* KHU VỰC BIỂU ĐỒ */}
        <div className="flex-1 min-h-0 bg-white rounded-2xl p-5 border border-gray-300 shadow-sm flex flex-col relative">

          <div className="flex justify-between items-center mb-4 shrink-0 z-10">
            <h3 className="text-base font-bold text-gray-800">Biểu đồ Lực F(t)</h3>
            <div className="flex gap-6 text-sm font-bold">
              <div className="flex items-center gap-2"><span className="w-6 h-0.5 bg-[#0ea5e9]"></span> Tay Trái</div>
              <div className="flex items-center gap-2"><span className="w-6 h-0.5 bg-[#0c4a6e]"></span> Tay Phải</div>
            </div>
          </div>

          {/* VÙNG CHỨA SVG (Đã được bọc lồng ép cứng chiều cao) */}
          <div className="flex-1 w-full relative min-h-0">

            {/* 1. Lớp nền kẻ ngang */}
            <div className="absolute inset-0 pl-8 pb-6 flex flex-col justify-between pointer-events-none z-0">
              {[30, 20, 10, 0].map((val) => (
                <div key={val} className="w-full flex items-center relative h-0">
                  <div className={`w-full absolute ${val === 0 ? 'border-b-2 border-gray-800' : 'border-b border-gray-200'}`}></div>
                  <span className="absolute -left-8 text-[10px] font-mono text-gray-500 bg-white pr-1 -translate-y-1/2">{val}</span>
                </div>
              ))}
            </div>

            {/* 2. Trục dọc */}
            <div className="absolute top-0 bottom-6 left-8 border-l-2 border-gray-800 pointer-events-none z-10"></div>

            {/* Nhãn hệ trục */}
            <span className="absolute top-0 left-0 text-xs font-bold italic text-gray-600 -translate-y-2">F(kg)</span>
            <span className="absolute bottom-0 right-0 text-xs font-bold italic text-gray-600 translate-y-2">t(s)</span>

            {/* 3. Lớp đồ thị sóng (Ép cứng trong padding) */}
            <div className="absolute inset-0 pl-8 pb-6">
              <svg className="w-full h-full block overflow-hidden" preserveAspectRatio="none" viewBox="0 0 100 100">
                <path
                  d={`M 0,${100 - (history[0].left / MAX_FORCE) * 100} L ${createSvgPath('left')}`}
                  fill="none"
                  stroke="#0ea5e9"
                  strokeWidth="2.5"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  vectorEffect="non-scaling-stroke"
                />
                <path
                  d={`M 0,${100 - (history[0].right / MAX_FORCE) * 100} L ${createSvgPath('right')}`}
                  fill="none"
                  stroke="#0c4a6e"
                  strokeWidth="2.5"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  vectorEffect="non-scaling-stroke"
                />
              </svg>
            </div>

          </div>
        </div>

        {/* 3. KHỐI CHỈ SỐ ĐỘNG HỌC (Thu gọn dạng lưới ngang) */}
        <div className="h-28 shrink-0 grid grid-cols-1 md:grid-cols-3 gap-4">

          <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm flex items-center justify-between">
            <div>
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Nhịp độ (Cadence)</h3>
              <p className="text-xs font-medium text-gray-600">Tần số bước đi.</p>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-2xl font-black text-[#0c4a6e]">{isSimulating ? "58" : "--"}</span>
              <span className="text-[10px] font-bold text-gray-400">bước/phút</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm flex items-center justify-between">
            <div>
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Stance / Swing</h3>
              <p className="text-xs font-medium text-gray-600">Tỷ lệ Tỳ / Lăng.</p>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-2xl font-black text-[#0c4a6e]">{isSimulating ? "62" : "--"}</span>
              <span className="text-lg font-bold text-gray-300">/</span>
              <span className="text-2xl font-black text-[#0ea5e9]">{isSimulating ? "38" : "--"}</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm flex items-center justify-between">
            <div>
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Lực đỉnh (Peak)</h3>
              <p className="text-xs font-medium text-gray-600">Lực tối đa ghi nhận.</p>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-2xl font-black text-[#0ea5e9]">{isSimulating ? "22.4" : "--"}</span>
              <span className="text-[10px] font-bold text-gray-400">kg</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}