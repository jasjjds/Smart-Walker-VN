"use client";

import React, { useState } from 'react';
import Link from 'next/link'; // Bổ sung import Link

// Cấu hình biểu đồ
const MAX_RANGE_CM = 10; // Giới hạn hiển thị +/- 10cm
const SVG_SIZE = 400; // Kích thước khung vẽ (px)
const CENTER = SVG_SIZE / 2;
const SCALE = CENTER / MAX_RANGE_CM; // Tỷ lệ quy đổi từ cm sang px

export default function CoGAnalysisPage() {
  // Dữ liệu tọa độ giả lập (x: trái-phải, y: trước-sau)
  const [points, setPoints] = useState([
    { x: 1.2, y: -0.5, id: 1 },
    { x: -0.8, y: 2.1, id: 2 },
    { x: 2.5, y: -1.8, id: 3 },
    { x: -3.2, y: -2.5, id: 4 },
    { x: 0.5, y: 0.8, id: 5 },
  ]);

  const [currentPoint, setCurrentPoint] = useState({ x: 0.5, y: 0.8 });

  // Hàm mô phỏng dữ liệu di chuyển từ cảm biến
  const simulateMovement = () => {
    const newX = (Math.random() * 12 - 6).toFixed(1);
    const newY = (Math.random() * 12 - 6).toFixed(1);
    const newPoint = { x: parseFloat(newX), y: parseFloat(newY) };

    setCurrentPoint(newPoint);
    setPoints(prev => [...prev.slice(-14), { ...newPoint, id: Date.now() }]);
  };

  // Tính điểm số thăng bằng (Stability Score)
  // Điểm càng cao khi tọa độ càng gần tâm (0,0)
  const calculateStability = () => {
    const distance = Math.sqrt(currentPoint.x ** 2 + currentPoint.y ** 2);
    const score = Math.max(0, 100 - (distance / MAX_RANGE_CM) * 100);
    return Math.round(score);
  };

  const stabilityScore = calculateStability();

  return (
    <div className="w-full h-full flex flex-col gap-6 text-[#0c4a6e]">

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

      {/* 1. HEADER & ACTIONS */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Phân tích Trọng tâm (CoG)</h1>
          <p className="text-[#0c4a6e]/70 mt-1 font-medium italic">
            Mô phỏng sự dịch chuyển trọng tâm của bệnh nhân trong không gian 2D.
          </p>
        </div>
        <button
          onClick={simulateMovement}
          className="px-6 py-2.5 bg-[#0ea5e9] hover:bg-[#0c4a6e] text-white font-bold rounded-xl shadow-lg transition-all"
        >
          Mô phỏng bước đi
        </button>
      </div>

      {/* 2. MAIN CONTENT: CHART & METRICS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* KHỐI BIỂU ĐỒ HỒNG TÂM (TARGET CHART) */}
        <div className="lg:col-span-2 bg-[#e0f2fe] rounded-3xl p-8 border border-[#bae6fd] shadow-sm flex flex-col items-center">
          <div className="relative">
            {/* Nhãn hướng */}
            <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-black uppercase text-[#0c4a6e]/40">Trước (Forward)</span>
            <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs font-black uppercase text-[#0c4a6e]/40">Sau (Backward)</span>
            <span className="absolute top-1/2 -left-12 -translate-y-1/2 text-xs font-black uppercase text-[#0c4a6e]/40">Trái</span>
            <span className="absolute top-1/2 -right-12 -translate-y-1/2 text-xs font-black uppercase text-[#0c4a6e]/40">Phải</span>

            {/* Vẽ SVG Target */}
            <svg width={SVG_SIZE} height={SVG_SIZE} className="bg-white rounded-full shadow-inner border border-[#bae6fd]">
              {/* Vẽ các vòng tròn đồng tâm (Zones) */}
              {[2, 4, 6, 8, 10].map((radius) => (
                <circle
                  key={radius}
                  cx={CENTER}
                  cy={CENTER}
                  r={radius * SCALE}
                  fill="none"
                  stroke="#0c4a6e"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                  className="opacity-20"
                />
              ))}

              {/* Vùng an toàn (Safe Zone - 3cm) */}
              <circle
                cx={CENTER}
                cy={CENTER}
                r={3 * SCALE}
                fill="#0ea5e9"
                className="opacity-5"
              />

              {/* Trục tọa độ (Crosshairs) */}
              <line x1={CENTER} y1="0" x2={CENTER} y2={SVG_SIZE} stroke="#0c4a6e" strokeWidth="1" className="opacity-30" />
              <line x1="0" y1={CENTER} x2={SVG_SIZE} y2={CENTER} stroke="#0c4a6e" strokeWidth="1" className="opacity-30" />

              {/* Vẽ đám mây điểm lịch sử (Trail) */}
              {points.map((p, i) => (
                <circle
                  key={p.id}
                  cx={CENTER + p.x * SCALE}
                  cy={CENTER - p.y * SCALE} // Trục Y trong SVG đảo ngược
                  r="4"
                  fill="#0ea5e9"
                  style={{ opacity: (i + 1) / points.length }}
                />
              ))}

              {/* Điểm hiện tại (Current CoG) */}
              <circle
                cx={CENTER + currentPoint.x * SCALE}
                cy={CENTER - currentPoint.y * SCALE}
                r="8"
                fill="#0c4a6e"
                className="animate-pulse shadow-lg"
              />
            </svg>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-12 w-full max-w-sm">
            <div className="text-center">
              <p className="text-xs font-bold text-[#0c4a6e]/50 uppercase">Tọa độ X (cm)</p>
              <p className="text-2xl font-black">{currentPoint.x > 0 ? `+${currentPoint.x}` : currentPoint.x}</p>
            </div>
            <div className="text-center">
              <p className="text-xs font-bold text-[#0c4a6e]/50 uppercase">Tọa độ Y (cm)</p>
              <p className="text-2xl font-black">{currentPoint.y > 0 ? `+${currentPoint.y}` : currentPoint.y}</p>
            </div>
          </div>
        </div>

        {/* KHỐI CHỈ SỐ LÂM SÀNG */}
        <div className="flex flex-col gap-6">
          {/* Stability Score Card */}
          <div className="bg-[#0c4a6e] rounded-3xl p-8 text-white flex flex-col items-center shadow-xl">
            <h3 className="text-sm font-bold uppercase tracking-widest opacity-70 mb-4">Chỉ số thăng bằng</h3>
            <div className="relative flex items-center justify-center">
              <svg className="w-32 h-32 transform -rotate-90">
                <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="10" fill="transparent" className="text-white/10" />
                <circle
                  cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="10" fill="transparent"
                  strokeDasharray={364.4}
                  strokeDashoffset={364.4 - (364.4 * stabilityScore) / 100}
                  className="text-[#0ea5e9] transition-all duration-1000 ease-out"
                />
              </svg>
              <span className="absolute text-4xl font-black">{stabilityScore}%</span>
            </div>
            <p className="mt-6 text-center text-sm font-medium opacity-80 leading-relaxed">
              {stabilityScore > 70
                ? "Bệnh nhân đang duy trì thăng bằng rất tốt trong vùng an toàn."
                : "Cảnh báo: Trọng tâm dao động mạnh. Bệnh nhân có xu hướng mất kiểm soát thăng bằng."}
            </p>
          </div>

          {/* Phân tích xu hướng */}
          <div className="bg-white rounded-3xl p-6 border border-[#bae6fd] shadow-sm flex-1">
            <h3 className="text-lg font-bold mb-4">Chẩn đoán sơ bộ</h3>
            <div className="space-y-4">
              <div className="p-4 bg-[#f0f9ff] rounded-2xl">
                <p className="text-xs font-bold text-[#0ea5e9] uppercase mb-1">Xu hướng lệch</p>
                <p className="font-bold">
                  {currentPoint.x > 2 ? "Nghiêng sang Phải" : currentPoint.x < -2 ? "Nghiêng sang Trái" : "Cân bằng ngang"}
                </p>
              </div>
              <div className="p-4 bg-[#f0f9ff] rounded-2xl">
                <p className="text-xs font-bold text-[#0ea5e9] uppercase mb-1">Tư thế đứng</p>
                <p className="font-bold">
                  {currentPoint.y > 2 ? "Ngả người về trước" : currentPoint.y < -2 ? "Ngả người ra sau" : "Tư thế thẳng"}
                </p>
              </div>
            </div>
            <button className="w-full mt-6 py-3 border-2 border-[#bae6fd] text-[#0c4a6e] font-bold rounded-xl hover:bg-[#bae6fd]/30 transition-colors">
              Xuất báo cáo PDF
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}