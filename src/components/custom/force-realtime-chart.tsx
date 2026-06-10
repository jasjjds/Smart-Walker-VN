"use client";

import React, { useState, useMemo } from 'react';

interface ForceHistoryItem {
  left: number;
  right: number;
}

interface ForceRealtimeChartProps {
  history: ForceHistoryItem[];
  className?: string;
}

export function ForceRealtimeChart({ history, className = "" }: ForceRealtimeChartProps) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const historyLength = history.length;

  // Tự động co dãn theo lực tối đa hiện tại (tối thiểu là 5kg để tránh nhạy quá mức ở lực nhỏ)
  const maxVal = useMemo(() => {
    return Math.max(5, ...history.map(d => Math.max(d.left || 0, d.right || 0)));
  }, [history]);

  // Ghi nhớ tọa độ vẽ đường Lực Trái
  const leftPathD = useMemo(() => {
    if (historyLength <= 1) return "";
    return history.map((item, index) => {
      const x = (index / (historyLength - 1)) * 100;
      const y = 100 - ((item.left || 0) / maxVal) * 100;
      return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
    }).join(' ');
  }, [history, maxVal, historyLength]);

  // Ghi nhớ tọa độ vẽ đường Lực Phải
  const rightPathD = useMemo(() => {
    if (historyLength <= 1) return "";
    return history.map((item, index) => {
      const x = (index / (historyLength - 1)) * 100;
      const y = 100 - ((item.right || 0) / maxVal) * 100;
      return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
    }).join(' ');
  }, [history, maxVal, historyLength]);

  return (
    <div className={`bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col min-h-0 relative ${className}`}>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start sm:items-center gap-3 mb-4 shrink-0">
        <h3 className="text-xs sm:text-sm font-bold text-slate-800">Biến thiên lực Real-time</h3>

        {/* Chú thích màu tương ứng với từng bên */}
        <div className="flex flex-wrap gap-3 text-[10px] sm:text-xs font-bold">
          <div className="flex items-center gap-1.5 text-blue-600">
            <span className="w-3 h-3 bg-[#3b82f6] rounded-full shrink-0"></span>
            Lực Trái (Left)
          </div>
          <div className="flex items-center gap-1.5 text-orange-600">
            <span className="w-3 h-3 bg-[#f97316] rounded-full shrink-0"></span>
            Lực Phải (Right)
          </div>
        </div>
      </div>

      <div className="flex-grow min-h-0 w-full relative pl-10 pb-4">
        {/* Lưới Y-axis động */}
        <div className="absolute inset-0 pl-10 pb-4 flex flex-col justify-between opacity-35 pointer-events-none text-[8px] sm:text-[9px]">
          {[maxVal, (maxVal * 3) / 4, maxVal / 2, maxVal / 4, 0].map((val, idx) => {
            const label = `${val.toFixed(1)}kg`;

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

          {/* Vẽ 2 đường cho lực Trái và lực Phải */}
          {historyLength > 1 && (
            <>
              <path
                d={leftPathD}
                fill="none"
                stroke="#3b82f6"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                vectorEffect="non-scaling-stroke"
              />
              <path
                d={rightPathD}
                fill="none"
                stroke="#f97316"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                vectorEffect="non-scaling-stroke"
              />
            </>
          )}

          {/* Đường dóng đứng dọc & 2 điểm tròn hovered cho 2 đường */}
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
                cy={100 - (((history[hoveredIdx].left || 0) / maxVal) * 100)}
                r="4.5"
                fill="#3b82f6"
                stroke="white"
                strokeWidth="1.5"
              />
              <circle
                cx={(hoveredIdx / Math.max(1, historyLength - 1)) * 100}
                cy={100 - (((history[hoveredIdx].right || 0) / maxVal) * 100)}
                r="4.5"
                fill="#f97316"
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

        {/* Tooltip hiển thị số liệu chi tiết dạng hộp */}
        {hoveredIdx !== null && history[hoveredIdx] && (
          <div
            className="absolute bg-slate-900/95 text-white text-[10px] sm:text-xs p-3 rounded-2xl shadow-xl pointer-events-none z-20 flex flex-col gap-1 backdrop-blur-md border border-white/10"
            style={{
              left: `${Math.min(
                Math.max((hoveredIdx / Math.max(1, historyLength - 1)) * 100, 15),
                85
              )}%`,
              top: "10px",
              transform: "translateX(-50%)",
            }}
          >
            <div className="font-bold border-b border-white/20 pb-1 mb-1 text-slate-300 text-[10px]">
              Điểm mẫu {hoveredIdx + 1}
            </div>
            <div className="flex justify-between gap-4">
              <span className="font-medium text-sky-400">Lực Trái:</span>
              <span className="font-mono font-bold">{(history[hoveredIdx].left || 0).toFixed(1)} kg</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="font-medium text-orange-400">Lực Phải:</span>
              <span className="font-mono font-bold">{(history[hoveredIdx].right || 0).toFixed(1)} kg</span>
            </div>
            <div className="flex justify-between gap-4 border-t border-white/10 pt-1 mt-1 font-bold text-[9px] sm:text-[10px]">
              <span>Trạng thái:</span>
              <span className={
                (() => {
                  const diff = (history[hoveredIdx].left || 0) - (history[hoveredIdx].right || 0);
                  if (Math.abs(diff) < 0.2) return "text-slate-300";
                  return diff > 0 ? "text-[#3b82f6]" : "text-[#f97316]";
                })()
              }>
                {(() => {
                  const diff = (history[hoveredIdx].left || 0) - (history[hoveredIdx].right || 0);
                  if (Math.abs(diff) < 0.2) return "Cân bằng";
                  return diff > 0 ? "Lệch Trái" : "Lệch Phải";
                })()}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
