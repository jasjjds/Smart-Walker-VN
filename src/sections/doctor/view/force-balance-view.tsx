"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { analyticsService } from '@/services/analyticsService';
import { BackButton } from '@/components/custom/back-button';

const MAX_FORCE_KG = 15;
const HISTORY_LENGTH = 40;

interface ForceHistoryItem {
  day: string;
  left: number;
  right: number;
}

export function ForceBalanceView() {
  const params = useParams();
  const pathname = usePathname();
  const { user } = useAuth();

  // Lấy patientID từ URL nếu là bác sĩ, hoặc từ chính user nếu là bệnh nhân
  const patientID = Array.isArray(params.id) ? params.id[0] : (params.id || user?.patient_id || '');
  const isPatientView = pathname.includes('/dashboard/patient/metrics');
  const backLink = isPatientView ? '/dashboard/patient/metrics' : `/dashboard/doctor/patients/${patientID}`;

  const [isLive, setIsLive] = useState(false);
  const [currentForce, setCurrentForce] = useState({ left: 0, right: 0 });
  const [history, setHistory] = useState(
    Array(HISTORY_LENGTH).fill({ left: 0, right: 0 })
  );

  const [intervalType, setIntervalType] = useState<'minute' | 'hour' | 'day' | 'month' | 'custom'>('day');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [forceHistory, setForceHistory] = useState<ForceHistoryItem[]>([]);

  const [leftWidth, setLeftWidth] = useState(30);
  const [topHeight, setTopHeight] = useState(50);
  const [isMobile, setIsMobile] = useState(false);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const rightPanelRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Phát hiện kích thước màn hình để điều khiển Responsive Layout
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Gọi API Real-time
  useEffect(() => {
    if (!patientID) return;

    if (isLive) {
      const fetchForceData = async () => {
        try {
          const data: any = await analyticsService.getForce({
            patient_id: patientID,
            limit: HISTORY_LENGTH
          });
          if (data.success && data.chartData && data.chartData.length > 0) {
            const fetchedHistory = data.chartData;
            const latest = fetchedHistory[fetchedHistory.length - 1];

            setCurrentForce({ left: latest.left || 0, right: latest.right || 0 });
            setHistory(prev => [...prev.slice(1), { left: latest.left || 0, right: latest.right || 0 }]);
          }
        } catch (error) {
          console.error("❌ Lỗi lấy dữ liệu Force Real-time:", error);
        }
      };

      fetchForceData();
      timerRef.current = setInterval(fetchForceData, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isLive, patientID]);

  // Gọi API Lịch sử
  const loadHistoryData = async (type: string, start?: string, end?: string) => {
    if (!patientID) return;

    try {
      const params: any = {
        patient_id: patientID,
        interval: type
      };

      if (type === 'custom' && start && end) {
        params.start_date = start;
        params.end_date = end;
      }

      const data: any = await analyticsService.getForce(params);

      if (data.success) {
        setForceHistory(data.chartData || []);
      }
    } catch (error) {
      console.error("❌ Lỗi lấy dữ liệu lịch sử lực tỳ:", error);
      setForceHistory([]);
    }
  };

  useEffect(() => {
    if (intervalType === 'custom') return;
    loadHistoryData(intervalType);
  }, [intervalType, patientID]);

  const handleApplyCustomTime = async () => {
    if (!startDate || !endDate) return alert("Vui lòng chọn đầy đủ ngày bắt đầu và ngày kết thúc!");
    loadHistoryData('custom', startDate, endDate);
  };

  // Kéo thả thay đổi kích cỡ (Chỉ áp dụng trên Desktop)
  const startResizeX = (e: React.MouseEvent) => {
    e.preventDefault();
    const onMouseMove = (moveEvent: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const newWidth = ((moveEvent.clientX - rect.left) / rect.width) * 100;
      if (newWidth > 15 && newWidth < 60) setLeftWidth(newWidth);
    };
    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  const startResizeY = (e: React.MouseEvent) => {
    e.preventDefault();
    const onMouseMove = (moveEvent: MouseEvent) => {
      if (!rightPanelRef.current) return;
      const rect = rightPanelRef.current.getBoundingClientRect();
      const newHeight = ((moveEvent.clientY - rect.top) / rect.height) * 100;
      if (newHeight > 20 && newHeight < 80) setTopHeight(newHeight);
    };
    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  const totalForce = currentForce.left + currentForce.right;
  const leftPercent = totalForce > 0 ? (currentForce.left / totalForce) * 100 : 50;
  const rightPercent = totalForce > 0 ? (currentForce.right / totalForce) * 100 : 50;

  // Tự động co dãn theo lực tối đa hiện tại (tối thiểu là 5kg để tránh nhạy quá mức ở lực nhỏ)
  const maxVal = Math.max(5, ...history.map(d => Math.max(d.left || 0, d.right || 0)));

  if (!patientID) {
    return (
      <div className="w-full h-full flex items-center justify-center text-slate-500 text-sm">
        <p>⚠️ Không tìm thấy ID Bệnh nhân. Vui lòng truy cập lại từ danh sách.</p>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-6 text-[#0c4a6e] p-2 md:p-4 rounded-xl lg:h-[calc(100vh-170px)] lg:min-h-[600px] lg:max-h-[900px]">

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shrink-0">
        <div>
          <BackButton href={backLink} className="mb-2" />
          <p className="text-[#0c4a6e]/70 mt-0.5 text-xs sm:text-sm font-medium italic">Theo dõi sự phân bố trọng lượng lên hai tay cầm của xe tập đi.</p>
        </div>
        <button onClick={() => setIsLive(!isLive)} className={`w-full sm:w-auto px-5 py-2.5 text-xs sm:text-sm font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 ${isLive ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-[#0ea5e9] hover:bg-[#0c4a6e] text-white'}`}>
          {isLive ? 'Dừng lấy dữ liệu' : 'Bắt đầu thu dữ liệu'}
        </button>
      </div>

      {/* CONTAINER CHIA PANELS */}
      <div ref={containerRef} className="flex-grow flex flex-col lg:flex-row gap-6 relative lg:min-h-0">

        {/* CỘT TRÁI - GAUGE CHI TIẾT (Responsive width & height) */}
        <div
          style={{
            width: isMobile ? '100%' : `${leftWidth}%`,
            height: isMobile ? '380px' : '100%'
          }}
          className="flex flex-col bg-white rounded-2xl p-6 border border-slate-200 shadow-sm relative shrink-0 lg:shrink-1 lg:min-h-0"
        >
          <h3 className="text-xs sm:text-sm font-bold uppercase tracking-widest text-slate-500 mb-6 shrink-0 text-center">Trạng thái hiện tại</h3>

          <div className="flex-1 w-full flex items-end justify-center gap-6 sm:gap-12 min-h-0 pb-6">
            {/* Tay Trái */}
            <div className="flex flex-col items-center h-full max-h-[85%] w-[40%] max-w-[140px]">
              <div className="text-2xl sm:text-3xl xl:text-4xl font-black text-[#0ea5e9] mb-4 shrink-0 transition-all">{currentForce.left.toFixed(1)} <span className="text-xs text-slate-400 font-bold">kg</span></div>
              <div className="w-full flex-1 bg-slate-100 rounded-full p-2 shadow-inner flex items-end relative overflow-hidden">
                <div className="absolute inset-0 flex flex-col justify-between py-6 opacity-20 pointer-events-none">
                  {[...Array(6)].map((_, i) => <div key={i} className="w-full h-[2px] bg-slate-400"></div>)}
                </div>
                <div className="w-full bg-[#0ea5e9] rounded-full transition-all duration-300 ease-out relative shadow-md" style={{ height: `${(Math.min(currentForce.left, MAX_FORCE_KG) / MAX_FORCE_KG) * 100}%` }}>
                  <div className="absolute top-2 left-2 right-2 h-3 bg-white/30 rounded-full"></div>
                </div>
              </div>
              <div className="font-black text-slate-600 text-xs sm:text-sm mt-4 sm:mt-6 shrink-0 tracking-widest">TRÁI</div>
              <div className="px-3 py-1.5 mt-2 bg-slate-100 text-[#0ea5e9] rounded-lg text-xs sm:text-sm font-black shrink-0 border border-slate-200">{leftPercent.toFixed(1)}%</div>
            </div>

            {/* Tay Phải */}
            <div className="flex flex-col items-center h-full max-h-[85%] w-[40%] max-w-[140px]">
              <div className="text-2xl sm:text-3xl xl:text-4xl font-black text-[#0c4a6e] mb-4 shrink-0 transition-all">{currentForce.right.toFixed(1)} <span className="text-xs text-slate-400 font-bold">kg</span></div>
              <div className="w-full flex-1 bg-slate-100 rounded-full p-2 shadow-inner flex items-end relative overflow-hidden">
                <div className="absolute inset-0 flex flex-col justify-between py-6 opacity-20 pointer-events-none">
                  {[...Array(6)].map((_, i) => <div key={i} className="w-full h-[2px] bg-slate-400"></div>)}
                </div>
                <div className="w-full bg-[#0c4a6e] rounded-full transition-all duration-300 ease-out relative shadow-md" style={{ height: `${(Math.min(currentForce.right, MAX_FORCE_KG) / MAX_FORCE_KG) * 100}%` }}>
                  <div className="absolute top-2 left-2 right-2 h-3 bg-white/20 rounded-full"></div>
                </div>
              </div>
              <div className="font-black text-slate-600 text-xs sm:text-sm mt-4 sm:mt-6 shrink-0 tracking-widest">PHẢI</div>
              <div className="px-3 py-1.5 mt-2 bg-slate-100 text-[#0c4a6e] rounded-lg text-xs sm:text-sm font-black shrink-0 border border-slate-200">{rightPercent.toFixed(1)}%</div>
            </div>
          </div>
        </div>

        {/* RESIZER X (Chỉ hiển thị trên Desktop) */}
        <div onMouseDown={startResizeX} className="w-4 -ml-2 -mr-2 z-10 cursor-col-resize flex flex-col items-center justify-center group hidden lg:flex">
          <div className="w-[3px] h-16 bg-slate-300 rounded-full group-hover:bg-[#0ea5e9] group-hover:w-[5px] group-hover:h-24 transition-all shadow-sm"></div>
        </div>

        {/* CỘT PHẢI - REAL-TIME & HISTORY */}
        <div
          ref={rightPanelRef}
          style={{
            width: isMobile ? '100%' : `${100 - leftWidth}%`,
            height: isMobile ? 'auto' : '100%'
          }}
          className="flex flex-col gap-6 lg:gap-0 min-w-0 shrink-0 lg:shrink-1 lg:min-h-0"
        >
          {/* BIỂU ĐỒ 1: REAL-TIME */}
          <div
            style={{ height: isMobile ? '320px' : `${topHeight}%` }}
            className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col shrink-0 lg:shrink-1 min-h-[220px] lg:min-h-0 relative"
          >
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start sm:items-center gap-3 mb-4 shrink-0">
              <h3 className="text-xs sm:text-sm font-bold text-slate-800">Biến thiên lực Real-time</h3>

              {/* Chú thích màu tương ứng với lệch bên */}
              <div className="flex flex-wrap gap-3 text-[10px] sm:text-xs font-bold">
                <div className="flex items-center gap-1.5 text-blue-600">
                  <span className="w-3 h-3 bg-[#3b82f6] rounded-full shrink-0"></span>
                  Lệch Trái
                </div>
                <div className="flex items-center gap-1.5 text-orange-600">
                  <span className="w-3 h-3 bg-[#f97316] rounded-full shrink-0"></span>
                  Lệch Phải
                </div>
                <div className="flex items-center gap-1.5 text-slate-400">
                  <span className="w-3 h-1 bg-slate-300 rounded-sm shrink-0"></span>
                  Cân bằng
                </div>
              </div>
            </div>

            <div className="flex-grow min-h-0 w-full relative pl-10 pb-4">
              {/* Trực Ox giữa & lưới Y-axis động */}
              <div className="absolute inset-0 pl-10 pb-4 flex flex-col justify-between opacity-35 pointer-events-none text-[8px] sm:text-[9px]">
                {[maxVal, maxVal / 2, 0, maxVal / 2, maxVal].map((val, idx) => {
                  const label = val === 0 ? "0kg" : `${val.toFixed(1)}kg`;

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
                {/* Trục Ox nằm ở giữa */}
                <line x1="0" y1="50" x2="100" y2="50" stroke="#cbd5e1" strokeWidth="1.5" strokeDasharray="2 2" vectorEffect="non-scaling-stroke" />

                {/* Vẽ các phân đoạn của đường biểu diễn duy nhất */}
                {history.slice(0, -1).map((item, index) => {
                  const nextItem = history[index + 1];
                  const x1 = (index / (HISTORY_LENGTH - 1)) * 100;
                  const x2 = ((index + 1) / (HISTORY_LENGTH - 1)) * 100;

                  const diff1 = (item.left || 0) - (item.right || 0);
                  const y1 = 50 - (diff1 / maxVal) * 50;

                  const diff2 = (nextItem.left || 0) - (nextItem.right || 0);
                  const y2 = 50 - (diff2 / maxVal) * 50;

                  const avgDiff = (diff1 + diff2) / 2;

                  // Lệch trái (>0.15): xanh dương; Lệch phải (<-0.15): cam; Cân bằng: xám
                  const strokeColor = avgDiff > 0.15 ? "#3b82f6" : avgDiff < -0.15 ? "#f97316" : "#cbd5e1";

                  return (
                    <line
                      key={index}
                      x1={x1}
                      y1={y1}
                      x2={x2}
                      y2={y2}
                      stroke={strokeColor}
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      vectorEffect="non-scaling-stroke"
                    />
                  );
                })}

                {/* Đường dóng đứng dọc & điểm tròn hovered */}
                {hoveredIdx !== null && (
                  <>
                    <line
                      x1={hoveredIdx / (HISTORY_LENGTH - 1) * 100}
                      y1={0}
                      x2={hoveredIdx / (HISTORY_LENGTH - 1) * 100}
                      y2={100}
                      stroke="#94a3b8"
                      strokeWidth="1"
                      strokeDasharray="2 2"
                      vectorEffect="non-scaling-stroke"
                    />
                    <circle
                      cx={hoveredIdx / (HISTORY_LENGTH - 1) * 100}
                      cy={50 - (((history[hoveredIdx].left || 0) - (history[hoveredIdx].right || 0)) / maxVal) * 50}
                      r="4.5"
                      fill={
                        ((history[hoveredIdx].left || 0) - (history[hoveredIdx].right || 0)) > 0.15
                          ? "#3b82f6"
                          : ((history[hoveredIdx].left || 0) - (history[hoveredIdx].right || 0)) < -0.15
                            ? "#f97316"
                            : "#94a3b8"
                      }
                      stroke="white"
                      strokeWidth="1.5"
                    />
                  </>
                )}

                {/* Các cột cảm ứng vô hình phục vụ Hover */}
                {history.map((_, i) => {
                  const w = 100 / (HISTORY_LENGTH - 1);
                  const x = (i / (HISTORY_LENGTH - 1)) * 100 - w / 2;
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
              {hoveredIdx !== null && (
                <div
                  className="absolute bg-slate-900/95 text-white text-[10px] sm:text-xs p-3 rounded-2xl shadow-xl pointer-events-none z-20 flex flex-col gap-1 backdrop-blur-md border border-white/10"
                  style={{
                    left: `${Math.min(
                      Math.max((hoveredIdx / (HISTORY_LENGTH - 1)) * 100, 15),
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

          {/* RESIZER Y (Chỉ hiển thị trên Desktop) */}
          <div onMouseDown={startResizeY} className="h-4 -mt-2 -mb-2 z-10 cursor-row-resize flex items-center justify-center group hidden lg:flex">
            <div className="h-[3px] w-16 bg-slate-300 rounded-full group-hover:bg-[#0ea5e9] group-hover:h-[5px] group-hover:w-24 transition-all shadow-sm"></div>
          </div>

          {/* BIỂU ĐỒ 2: LỊCH SỬ PHÂN BỔ TÍCH LŨY */}
          <div
            style={{ height: isMobile ? '380px' : `${100 - topHeight}%` }}
            className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col shrink-0 lg:shrink-1 min-h-[220px] lg:min-h-0"
          >
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3 mb-4 shrink-0">
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-slate-800">Phân bổ lực tỳ tích lũy</h3>
                <p className="text-[10px] text-slate-500">Xem dữ liệu lực phân bổ trung bình dựa theo chu kỳ thời gian.</p>
              </div>
              <div className="flex bg-slate-100 rounded-xl p-1 border border-slate-200 gap-0.5 overflow-x-auto self-start md:self-auto max-w-full">
                {(['minute', 'hour', 'day', 'month', 'custom'] as const).map((type) => (
                  <button key={type} onClick={() => setIntervalType(type)} className={`px-2 py-1 sm:px-2.5 sm:py-1 text-[9px] sm:text-[11px] font-bold rounded-lg transition-all whitespace-nowrap ${intervalType === type ? 'bg-[#0ea5e9] text-white shadow-sm' : 'text-slate-500 hover:bg-slate-200'}`}>
                    {type === 'minute' ? 'Theo Phút' : type === 'hour' ? 'Theo Giờ' : type === 'day' ? 'Theo Ngày' : type === 'month' ? 'Theo Tháng' : 'Tự chọn'}
                  </button>
                ))}
              </div>
            </div>

            {intervalType === 'custom' && (
              <div className="flex flex-wrap items-center gap-2 mb-4 p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs shrink-0 transition-all">
                <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="border border-slate-300 rounded-lg px-2 py-1 text-xs" />
                <span className="text-slate-400">đến</span>
                <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="border border-slate-300 rounded-lg px-2 py-1 text-xs" />
                <button onClick={handleApplyCustomTime} className="bg-[#0ea5e9] text-white font-bold px-3 py-1 rounded-lg text-xs">Áp dụng</button>
              </div>
            )}

            {forceHistory.length === 0 ? (
              <div className="flex-1 flex items-center justify-center border border-dashed border-slate-200 rounded-xl">
                <span className="text-xs text-slate-400 font-medium italic">Chưa có dữ liệu lịch sử cho mốc thời gian này.</span>
              </div>
            ) : (
              <div className="flex-1 flex items-end justify-around w-full mt-2 relative min-h-0 pb-2">
                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20">
                  <div className="w-full border-t border-slate-400"></div>
                  <div className="w-full border-t border-slate-400"></div>
                  <div className="w-full border-t border-slate-400"></div>
                </div>

                {forceHistory.map((dayData, idx) => {
                  const total = dayData.left + dayData.right;
                  const heightPercent = Math.min((total / 30) * 100, 100);
                  const leftRatio = total > 0 ? (dayData.left / total) * 100 : 0;
                  const rightRatio = total > 0 ? (dayData.right / total) * 100 : 0;

                  return (
                    <div key={idx} className="flex flex-col items-center justify-end h-full w-6 sm:w-8 md:w-12 group relative">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity mb-1 bg-slate-800 text-white text-[9px] px-2 py-1 rounded absolute bottom-full pb-2 pointer-events-none z-10 whitespace-nowrap shadow-md">
                        Trái: {dayData.left.toFixed(1)}kg | Phải: {dayData.right.toFixed(1)}kg
                      </div>

                      <div className="w-full rounded-t-sm flex flex-col-reverse overflow-hidden shadow-sm transition-all" style={{ height: `${heightPercent}%` }}>
                        <div className="w-full bg-[#0ea5e9] hover:brightness-110 transition-all" style={{ height: `${leftRatio}%` }}></div>
                        <div className="w-full bg-[#0c4a6e] hover:brightness-110 transition-all border-b border-white/20" style={{ height: `${rightRatio}%` }}></div>
                      </div>

                      <span className="text-[8px] sm:text-[10px] font-bold text-slate-500 mt-2 whitespace-nowrap">{dayData.day}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
