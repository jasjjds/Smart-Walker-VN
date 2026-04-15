"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

// Cấu hình tính toán SVG Donut
const RADIUS = 100; // Đã thu nhỏ radius một chút để fit màn hình tốt hơn
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function FallRiskPage() {
  const [isSimulating, setIsSimulating] = useState(false);
  const [score, setScore] = useState(88);

  // Các chỉ số phụ
  const [factors, setFactors] = useState({
    balance: 92,
    force: 85,
    gait: 88
  });

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Kịch bản tự động
  useEffect(() => {
    if (isSimulating) {
      let tick = 0;
      timerRef.current = setInterval(() => {
        tick++;
        if (tick > 5 && tick < 12) {
          setFactors({
            balance: Math.max(30, factors.balance - Math.random() * 15),
            force: Math.max(40, factors.force - Math.random() * 10),
            gait: Math.max(50, factors.gait - Math.random() * 5),
          });
        } else {
          setFactors(prev => ({
            balance: Math.min(95, prev.balance + Math.random() * 5),
            force: Math.min(90, prev.force + Math.random() * 4),
            gait: Math.min(92, prev.gait + Math.random() * 3),
          }));
        }
      }, 500);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isSimulating, factors]);

  // Cập nhật điểm tổng
  useEffect(() => {
    const total = (factors.balance * 0.5) + (factors.force * 0.3) + (factors.gait * 0.2);
    setScore(Math.round(total));
  }, [factors]);

  // Hàm ép "Ngã" lập tức
  const triggerImmediateFall = () => {
    setIsSimulating(false); // Dừng kịch bản tự động nếu đang chạy
    setFactors({
      balance: 15, // Mất thăng bằng nghiêm trọng
      force: 25,   // Trượt tay
      gait: 30     // Loạng choạng
    });
  };

  const getRiskLevel = (val: number) => {
    if (val >= 80) return { label: "AN TOÀN", color: "#10b981", bg: "bg-emerald-50", text: "text-emerald-600" };
    if (val >= 50) return { label: "CHÚ Ý", color: "#f59e0b", bg: "bg-amber-50", text: "text-amber-600" };
    return { label: "NGUY HIỂM", color: "#ef4444", bg: "bg-red-50", text: "text-red-600" };
  };

  const currentRisk = getRiskLevel(score);
  const strokeDashoffset = CIRCUMFERENCE - (score / 100) * CIRCUMFERENCE;

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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shrink-0">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Chỉ số Nguy cơ Té ngã</h1>
          <p className="text-[#0c4a6e]/70 mt-0.5 text-sm font-medium italic">
            Thuật toán tổng hợp đánh giá độ ổn định toàn diện của bệnh nhân.
          </p>
        </div>

        <div className="flex gap-3">
          {/* NÚT NGÃ LẬP TỨC */}
          <button
            onClick={triggerImmediateFall}
            className="px-5 py-2 text-sm font-bold rounded-xl shadow-md transition-all bg-red-600 hover:bg-red-700 text-white flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            Ngã lập tức!
          </button>

          {/* NÚT CHẠY KỊCH BẢN */}
          <button
            onClick={() => setIsSimulating(!isSimulating)}
            className={`px-5 py-2 text-sm font-bold rounded-xl shadow-md transition-all flex items-center gap-2 ${isSimulating ? 'bg-[#0c4a6e] hover:bg-[#0c4a6e]/80 text-white' : 'bg-[#0ea5e9] hover:bg-[#0284c7] text-white'
              }`}
          >
            {isSimulating ? 'Dừng kịch bản' : 'Kịch bản tự động'}
          </button>
        </div>
      </div>

      {/* 2. KHU VỰC ĐÁNH GIÁ CHÍNH */}
      <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* DONUT CHART TỔNG HỢP */}
        <div className="bg-[#e0f2fe] rounded-2xl p-6 border border-[#bae6fd] shadow-sm flex flex-col items-center justify-center relative overflow-hidden h-full">

          {score < 50 && (
            <div className="absolute inset-0 bg-red-500/15 animate-pulse pointer-events-none"></div>
          )}

          <h3 className="text-base font-bold mb-4 z-10">Điểm Ổn định Toàn diện</h3>

          <div className="relative flex items-center justify-center z-10 flex-1 min-h-0">
            <svg className="transform -rotate-90" width={RADIUS * 2 + 40} height={RADIUS * 2 + 40}>
              <circle
                cx={RADIUS + 20} cy={RADIUS + 20} r={RADIUS}
                stroke="currentColor" strokeWidth="20" fill="transparent"
                className="text-white/50"
              />
              <circle
                cx={RADIUS + 20} cy={RADIUS + 20} r={RADIUS}
                stroke={currentRisk.color} strokeWidth="20" fill="transparent"
                strokeDasharray={CIRCUMFERENCE}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="transition-all duration-500 ease-out drop-shadow-md"
              />
            </svg>

            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className={`text-5xl font-black transition-colors duration-500 ${currentRisk.text}`}>
                {score}
              </span>
              <span className="text-xs font-bold text-[#0c4a6e]/50 uppercase mt-1">/ 100</span>

              <div className={`mt-3 px-3 py-1 rounded-full font-black text-xs uppercase tracking-widest transition-colors duration-500 ${currentRisk.bg} ${currentRisk.text} border border-current`}>
                {currentRisk.label}
              </div>
            </div>
          </div>
        </div>

        {/* CÁC YẾU TỐ CẤU THÀNH (BREAKDOWN) */}
        <div className="flex flex-col gap-3 h-full overflow-y-auto pr-2">

          <div className="bg-white rounded-2xl p-4 border border-[#bae6fd] shadow-sm flex items-center gap-4">
            <div className={`p-2.5 rounded-xl ${getRiskLevel(factors.balance).bg} ${getRiskLevel(factors.balance).text} transition-colors duration-500`}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" /></svg>
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-end mb-1.5">
                <span className="text-sm font-bold text-[#0c4a6e]">Kiểm soát Trọng tâm (50%)</span>
                <span className={`font-black text-sm ${getRiskLevel(factors.balance).text} transition-colors duration-500`}>{Math.round(factors.balance)}</span>
              </div>
              <div className="w-full h-2 bg-[#f0f9ff] rounded-full overflow-hidden">
                <div className="h-full transition-all duration-500 rounded-full" style={{ width: `${factors.balance}%`, backgroundColor: getRiskLevel(factors.balance).color }}></div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-[#bae6fd] shadow-sm flex items-center gap-4">
            <div className={`p-2.5 rounded-xl ${getRiskLevel(factors.force).bg} ${getRiskLevel(factors.force).text} transition-colors duration-500`}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-end mb-1.5">
                <span className="text-sm font-bold text-[#0c4a6e]">Đối xứng Lực (30%)</span>
                <span className={`font-black text-sm ${getRiskLevel(factors.force).text} transition-colors duration-500`}>{Math.round(factors.force)}</span>
              </div>
              <div className="w-full h-2 bg-[#f0f9ff] rounded-full overflow-hidden">
                <div className="h-full transition-all duration-500 rounded-full" style={{ width: `${factors.force}%`, backgroundColor: getRiskLevel(factors.force).color }}></div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-[#bae6fd] shadow-sm flex items-center gap-4">
            <div className={`p-2.5 rounded-xl ${getRiskLevel(factors.gait).bg} ${getRiskLevel(factors.gait).text} transition-colors duration-500`}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-end mb-1.5">
                <span className="text-sm font-bold text-[#0c4a6e]">Nhịp độ bước đi (20%)</span>
                <span className={`font-black text-sm ${getRiskLevel(factors.gait).text} transition-colors duration-500`}>{Math.round(factors.gait)}</span>
              </div>
              <div className="w-full h-2 bg-[#f0f9ff] rounded-full overflow-hidden">
                <div className="h-full transition-all duration-500 rounded-full" style={{ width: `${factors.gait}%`, backgroundColor: getRiskLevel(factors.gait).color }}></div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* 3. NHẬT KÝ CẢNH BÁO TỰ ĐỘNG */}
      <div className="bg-white rounded-2xl p-5 border border-[#bae6fd] shadow-sm shrink-0">
        <h3 className="text-base font-bold mb-3 flex items-center gap-2">
          <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
          Sự kiện cần chú ý
        </h3>

        <div className="space-y-2">
          {score < 50 && (
            <div className="p-3 bg-red-50 border border-red-100 rounded-xl flex justify-between items-center animate-pulse">
              <div className="flex flex-col">
                <span className="font-bold text-red-700 text-sm">Nguy cơ ngã RẤT CAO!</span>
                <span className="text-xs text-red-600">Phát hiện mất thăng bằng đột ngột. Yêu cầu hỗ trợ ngay.</span>
              </div>
              <span className="text-[10px] font-bold text-red-500">Vừa xong</span>
            </div>
          )}

          <div className="p-3 bg-[#f0f9ff] rounded-xl flex justify-between items-center opacity-70">
            <div className="flex flex-col">
              <span className="font-bold text-[#0c4a6e] text-sm">Khởi động thiết bị</span>
              <span className="text-xs text-[#0c4a6e]/70">Hệ thống cảm biến cân bằng đã được hiệu chuẩn.</span>
            </div>
            <span className="text-[10px] font-bold text-[#0c4a6e]/50">12 phút trước</span>
          </div>
        </div>
      </div>

    </div>
  );
}