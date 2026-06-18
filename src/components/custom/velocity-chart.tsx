"use client";

import React, { useState, useMemo } from 'react';

interface SensorDataItem {
  velocity: number;
}

interface VelocityChartProps {
  history: SensorDataItem[];
  className?: string;
}

export function VelocityChart({ history, className = "" }: VelocityChartProps) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const historyLength = history.length;

  // Tự động co dãn theo vận tốc tối đa (tối thiểu là 2m/s để trục Y không bị quá nhạy ở tốc độ cực thấp)
  const maxVal = useMemo(() => {
    return Math.max(2, ...history.map(d => d.velocity || 0));
  }, [history]);

  // Ghi nhớ tọa độ vẽ đường vận tốc
  const pathD = useMemo(() => {
    if (historyLength <= 1) return "";
    return history.map((item, index) => {
      const x = (index / (historyLength - 1)) * 100;
      const y = 100 - ((item.velocity || 0) / maxVal) * 100;
      return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
    }).join(' ');
  }, [history, maxVal, historyLength]);

  return (
    <div className={`bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col min-h-0 relative ${className}`}>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start sm:items-center gap-3 mb-4 shrink-0">
        <h3 className="text-xs sm:text-sm font-bold text-slate-800">Biến thiên Vận tốc</h3>

        {/* Chú thích màu vận tốc */}
        <div className="flex flex-wrap gap-3 text-[10px] sm:text-xs font-bold">
          <div className="flex items-center gap-1.5 text-emerald-600">
            <span className="w-3 h-3 bg-[#10b981] rounded-full shrink-0"></span>
            Vận tốc (m/s)
          </div>
        </div>
      </div>

      <div className="flex-grow min-h-0 w-full relative pl-10 pb-4">
        {/* Lưới Y-axis động */}
        <div className="absolute inset-0 pl-10 pb-4 flex flex-col justify-between opacity-35 pointer-events-none text-[8px] sm:text-[9px]">
          {[maxVal, (maxVal * 3) / 4, maxVal / 2, maxVal / 4, 0].map((val, idx) => {
            const label = `${val.toFixed(1)}m/s`;

            return (
              <div key={idx} className="w-full border-b border-slate-300 border-dashed flex items-center relative h-0">
                <span className="absolute -left-10 text-slate-500 font-mono font-bold -translate-y-1/2 pr-2 bg-white whitespace-nowrap">
                  {label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Vẽ đồ thị SVG */}
        <svg className="w-full h-full overflow-visible relative z-10" preserveAspectRatio="none" viewBox="0 0 100 100">
          {/* Trục Ox nằm ở dưới cùng */}
          <line x1="0" y1="100" x2="100" y2="100" stroke="#cbd5e1" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />

          {/* Vẽ đường vận tốc */}
          {historyLength > 1 && (
            <path
              d={pathD}
              fill="none"
              stroke="#10b981"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
            />
          )}

          {/* Đường dóng đứng dọc & điểm tròn hovered */}
          {hoveredIdx !== null && history[hoveredIdx] && (
            <>
              <line
                x1={(hoveredIdx / Math.max(1, historyLength - 1)) * 100}
                y1={0}
                x2={(hoveredIdx / Math.max(1, historyLength - 1)) * 100}
                y2={100}
                stroke="#94a3b8"
                strokeWidth="1"
                strokeDasharray="2 2"
                vectorEffect="non-scaling-stroke"
              />
              <circle
                cx={(hoveredIdx / Math.max(1, historyLength - 1)) * 100}
                cy={100 - (((history[hoveredIdx].velocity || 0) / maxVal) * 100)}
                r="4.5"
                fill="#10b981"
                stroke="white"
                strokeWidth="1.5"
              />
            </>
          )}

          {/* Các cột cảm ứng vô hình phục vụ Hover */}
          {history.map((_, i) => {
            const w = 100 / Math.max(1, historyLength - 1);
            const x = (i / Math.max(1, historyLength - 1)) * 100 - w / 2;
            return (
              <rect
                key={i}
                x={x}
                y={0}
                width={w}
                height={100}
                fill="transparent"
                className="cursor-pointer"
                onMouseEnter={() => setHoveredIdx(i)}
                onMouseLeave={() => setHoveredIdx(null)}
              />
            );
          })}
        </svg>

        {/* Tooltip hiển thị số liệu chi tiết */}
        {hoveredIdx !== null && history[hoveredIdx] && (() => {
          const yPercent = 100 - (((history[hoveredIdx].velocity || 0) / maxVal) * 100);
          const isUpperHalf = yPercent < 45;
          return (
            <div
              className="absolute bg-slate-900/95 text-white text-[10px] sm:text-xs p-3 rounded-2xl shadow-xl pointer-events-none z-20 flex flex-col gap-1 backdrop-blur-md border border-white/10 transition-all duration-150"
              style={{
                left: `${Math.min(
                  Math.max((hoveredIdx / Math.max(1, historyLength - 1)) * 100, 15),
                  85
                )}%`,
                top: isUpperHalf ? `calc(${yPercent}% + 15px)` : `calc(${yPercent}% - 65px)`,
                transform: "translateX(-50%)",
              }}
            >
              <div className="font-bold border-b border-white/20 pb-1 mb-1 text-slate-300 text-[10px]">
                Điểm mẫu {hoveredIdx + 1}
              </div>
              <div className="flex justify-between gap-4">
                <span className="font-medium text-emerald-400">Vận tốc:</span>
                <span className="font-mono font-bold">{(history[hoveredIdx].velocity || 0).toFixed(2)} m/s</span>
              </div>
            </div>
          );
        })()}
      </div>
    </div>
  );
}
