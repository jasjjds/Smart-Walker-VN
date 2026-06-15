"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from "next/navigation";
import { BackButton } from '@/components/custom/back-button';

const MAX_RANGE_CM = 10;
const SVG_SIZE = 400;
const CENTER = SVG_SIZE / 2;
const SCALE = CENTER / MAX_RANGE_CM;

export function CoGAnalysisView() {
  const params = useParams();
  const patientId = params.id;

  const [points, setPoints] = useState([
    { x: 1.2, y: -0.5, id: 1 },
    { x: -0.8, y: 2.1, id: 2 },
    { x: 2.5, y: -1.8, id: 3 },
    { x: -3.2, y: -2.5, id: 4 },
    { x: 0.5, y: 0.8, id: 5 },
  ]);

  const [currentPoint, setCurrentPoint] = useState({ x: 0.5, y: 0.8 });

  const simulateMovement = () => {
    const newX = (Math.random() * 12 - 6).toFixed(1);
    const newY = (Math.random() * 12 - 6).toFixed(1);
    const newPoint = { x: parseFloat(newX), y: parseFloat(newY) };

    setCurrentPoint(newPoint);
    setPoints(prev => [...prev.slice(-14), { ...newPoint, id: Date.now() }]);
  };

  const calculateStability = () => {
    const distance = Math.sqrt(currentPoint.x ** 2 + currentPoint.y ** 2);
    const score = Math.max(0, 100 - (distance / MAX_RANGE_CM) * 100);
    return Math.round(score);
  };

  const stabilityScore = calculateStability();

  return (
    <div className="w-full h-full flex flex-col gap-6 text-primary-900">

      <BackButton href={`/dashboard/doctor/patients/${patientId}`} />

      {/* 1. HEADER & ACTIONS */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shrink-0">
        <div>
          <p className="text-primary-900/70 mt-1 text-xs sm:text-sm font-medium">Theo dõi độ lệch tư thế và khả năng giữ thăng bằng qua tâm áp lực (CoP).</p>
        </div>
        <button
          onClick={simulateMovement}
          className="w-full sm:w-auto px-6 py-2.5 bg-primary-500 hover:bg-primary-900 text-white font-bold rounded-xl shadow-md transition-all text-sm"
        >
          Mô phỏng bước đi
        </button>
      </div>

      {/* 2. MAIN CONTENT: CHART & METRICS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* KHỐI BIỂU ĐỒ HỒNG TÂM */}
        <div className="lg:col-span-2 bg-primary-100 rounded-3xl p-6 sm:p-8 border border-primary-200 shadow-sm flex flex-col items-center">
          <div className="relative w-full max-w-[320px] xs:max-w-[360px] sm:max-w-[400px] aspect-square flex items-center justify-center my-6">
            {/* Nhãn hướng */}
            <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] sm:text-xs font-black uppercase text-primary-900/40">Trước (Forward)</span>
            <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] sm:text-xs font-black uppercase text-primary-900/40">Sau (Backward)</span>
            <span className="absolute top-1/2 -left-8 sm:-left-12 -translate-y-1/2 text-[10px] sm:text-xs font-black uppercase text-primary-900/40">Trái</span>
            <span className="absolute top-1/2 -right-8 sm:-right-12 -translate-y-1/2 text-[10px] sm:text-xs font-black uppercase text-primary-900/40">Phải</span>

            {/* Vẽ SVG Target (Mềm dẻo và co giãn theo kích cỡ bình thường) */}
            <svg 
              viewBox={`0 0 ${SVG_SIZE} ${SVG_SIZE}`} 
              className="w-full h-full bg-white rounded-full shadow-inner border border-primary-200"
            >
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

              <circle
                cx={CENTER}
                cy={CENTER}
                r={3 * SCALE}
                fill="#0ea5e9"
                className="opacity-5"
              />

              <line x1={CENTER} y1="0" x2={CENTER} y2={SVG_SIZE} stroke="#0c4a6e" strokeWidth="1" className="opacity-30" />
              <line x1="0" y1={CENTER} x2={SVG_SIZE} y2={CENTER} stroke="#0c4a6e" strokeWidth="1" className="opacity-30" />

              {points.map((p, i) => (
                <circle
                  key={p.id}
                  cx={CENTER + p.x * SCALE}
                  cy={CENTER - p.y * SCALE}
                  r="4"
                  fill="#0ea5e9"
                  style={{ opacity: (i + 1) / points.length }}
                />
              ))}

              <circle
                cx={CENTER + currentPoint.x * SCALE}
                cy={CENTER - currentPoint.y * SCALE}
                r="8"
                fill="#0c4a6e"
                className="animate-pulse shadow-lg"
              />
            </svg>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-8 w-full max-w-sm">
            <div className="text-center">
              <p className="text-[10px] sm:text-xs font-bold text-primary-900/50 uppercase">Tọa độ X (cm)</p>
              <p className="text-xl sm:text-2xl font-black">{currentPoint.x > 0 ? `+${currentPoint.x}` : currentPoint.x}</p>
            </div>
            <div className="text-center">
              <p className="text-[10px] sm:text-xs font-bold text-primary-900/50 uppercase">Tọa độ Y (cm)</p>
              <p className="text-xl sm:text-2xl font-black">{currentPoint.y > 0 ? `+${currentPoint.y}` : currentPoint.y}</p>
            </div>
          </div>
        </div>

        {/* KHỐI CHỈ SỐ LÂM SÀNG */}
        <div className="flex flex-col gap-6">
          <div className="bg-primary-900 rounded-3xl p-6 sm:p-8 text-white flex flex-col items-center shadow-xl">
            <h3 className="text-xs sm:text-sm font-bold uppercase tracking-widest opacity-70 mb-4">Chỉ số thăng bằng</h3>
            <div className="relative flex items-center justify-center">
              <svg className="w-28 h-28 sm:w-32 sm:h-32 transform -rotate-90">
                <circle cx="56" cy="56" r="50" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-white/10" />
                <circle
                  cx="56" cy="56" r="50" stroke="currentColor" strokeWidth="8" fill="transparent"
                  strokeDasharray={314.16}
                  strokeDashoffset={314.16 - (314.16 * stabilityScore) / 100}
                  className="text-primary-500 transition-all duration-1000 ease-out"
                />
              </svg>
              <span className="absolute text-3xl sm:text-4xl font-black">{stabilityScore}%</span>
            </div>
            <p className="mt-6 text-center text-xs sm:text-sm font-medium opacity-80 leading-relaxed">
              {stabilityScore > 70
                ? "Bệnh nhân đang duy trì thăng bằng rất tốt trong vùng an toàn."
                : "Cảnh báo: Trọng tâm dao động mạnh. Bệnh nhân có xu hướng mất kiểm soát thăng bằng."}
            </p>
          </div>

          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-primary-200 shadow-sm flex-1">
            <h3 className="text-base sm:text-lg font-bold mb-4">Chẩn đoán sơ bộ</h3>
            <div className="space-y-4">
              <div className="p-3 sm:p-4 bg-primary-50 rounded-2xl">
                <p className="text-[10px] sm:text-xs font-bold text-primary-500 uppercase mb-1">Xu hướng lệch</p>
                <p className="font-bold text-sm sm:text-base">
                  {currentPoint.x > 2 ? "Nghiêng sang Phải" : currentPoint.x < -2 ? "Nghiêng sang Trái" : "Cân bằng ngang"}
                </p>
              </div>
              <div className="p-3 sm:p-4 bg-primary-50 rounded-2xl">
                <p className="text-[10px] sm:text-xs font-bold text-primary-500 uppercase mb-1">Tư thế đứng</p>
                <p className="font-bold text-sm sm:text-base">
                  {currentPoint.y > 2 ? "Ngả người về trước" : currentPoint.y < -2 ? "Ngả người ra sau" : "Tư thế thẳng"}
                </p>
              </div>
            </div>
            <button className="w-full mt-6 py-3 border-2 border-primary-200 text-primary-900 font-bold rounded-xl hover:bg-primary-200/30 transition-colors text-sm">
              Xuất báo cáo PDF
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
