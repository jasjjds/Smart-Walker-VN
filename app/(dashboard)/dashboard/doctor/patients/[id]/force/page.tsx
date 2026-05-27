"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import axios from 'axios';
// SỬ DỤNG useSearchParams THAY VÌ useParams
import { useParams } from 'next/navigation';

const MAX_FORCE_KG = 15;
const HISTORY_LENGTH = 40;
const API_URL = 'https://breeze-fencing-elaborate.ngrok-free.dev';

interface ForceHistoryItem {
  day: string;
  left: number;
  right: number;
}

export default function ForceBalancePage() {
  // 1. Bắt patient_id từ URL (VD: .../force?patient_id=1)
  const params = useParams();
  const patientID = params.id;

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

  const containerRef = useRef<HTMLDivElement>(null);
  const rightPanelRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // ---------------------------------------------------------------------------
  // 2. GỌI API REAL-TIME BẰNG PATIENT_ID
  // ---------------------------------------------------------------------------
  useEffect(() => {
    // Nếu không có patientID thì không gọi API để tránh lỗi
    if (!patientID) return;

    if (isLive) {
      const fetchForceData = async () => {
        try {
          const response = await axios.get(`${API_URL}/api/analytics/force`, {
            // Thay đổi device_id thành patient_id
            params: { patient_id: patientID, limit: HISTORY_LENGTH },
            headers: { 'ngrok-skip-browser-warning': 'true', 'Accept': 'application/json' }
          });

          const data = response.data;
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
  }, [isLive, patientID]); // Thêm patientID vào mảng phụ thuộc

  // ---------------------------------------------------------------------------
  // 3. GỌI API LỊCH SỬ BẰNG PATIENT_ID
  // ---------------------------------------------------------------------------
  const loadHistoryData = async (type: string, start?: string, end?: string) => {
    if (!patientID) return;

    try {
      const params: any = {
        patient_id: patientID, // Đổi từ device_id sang patient_id
        interval: type
      };

      if (type === 'custom' && start && end) {
        params.start_date = start;
        params.end_date = end;
      }

      const response = await axios.get(`${API_URL}/api/analytics/force`, {
        params,
        headers: { 'ngrok-skip-browser-warning': 'true', 'Accept': 'application/json' }
      });

      if (response.data.success) {
        setForceHistory(response.data.chartData || []);
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

  // ---- LOGIC XỬ LÝ KÉO THẢ (DRAG TO RESIZE) ----
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

  const createSvgPath = (key: 'left' | 'right') => {
    const points = history.map((data, index) => {
      const x = (index / (HISTORY_LENGTH - 1)) * 100;
      const forceValue = data[key] || 0;
      const safeValue = Math.min(forceValue, MAX_FORCE_KG);
      const y = 100 - (safeValue / MAX_FORCE_KG) * 100;
      return `${x},${y}`;
    });
    return points.join(' ');
  };

  // 4. KIỂM TRA NẾU THIẾU ID TRÊN URL
  if (!patientID) {
    return (
      <div className="w-full h-full flex items-center justify-center text-slate-500">
        <p>⚠️ Không tìm thấy ID Bệnh nhân. Vui lòng truy cập lại từ danh sách.</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col gap-4 text-[#0c4a6e] overflow-hidden bg-slate-50 p-2 md:p-4 rounded-xl">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shrink-0">
        <div>
          <Link href={`/dashboard/doctor/patients/${patientID}`} className="flex items-center gap-2 text-[#0ea5e9] hover:text-[#0c4a6e] font-bold w-fit transition-colors text-sm mb-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            Quay lại
          </Link>
          <h1 className="text-2xl font-bold tracking-tight">Cân bằng lực tỳ tay</h1>
          <p className="text-[#0c4a6e]/70 mt-0.5 text-sm font-medium italic">Theo dõi sự phân bố trọng lượng lên hai tay cầm của xe tập đi.</p>
        </div>
        <button onClick={() => setIsLive(!isLive)} className={`px-5 py-2.5 text-sm font-bold rounded-xl shadow-md transition-all flex items-center gap-2 ${isLive ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-[#0ea5e9] hover:bg-[#0c4a6e] text-white'}`}>
          {isLive ? 'Dừng lấy dữ liệu' : 'Bắt đầu thu dữ liệu'}
        </button>
      </div>

      {/* CONTAINER CHIA FILE PANE */}
      <div ref={containerRef} className="flex-1 min-h-0 flex flex-col lg:flex-row relative">

        {/* ---------------- CỘT TRÁI (GAUGES SCALE UP) ---------------- */}
        <div style={{ width: `${leftWidth}%` }} className="h-full flex flex-col bg-white rounded-2xl p-6 border border-slate-200 shadow-sm relative min-w-[250px]">
          <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-6 shrink-0 text-center">Trạng thái hiện tại</h3>

          <div className="flex-1 w-full flex items-end justify-center gap-6 xl:gap-12 min-h-0 pb-6">
            {/* Tay Trái */}
            <div className="flex flex-col items-center h-full max-h-[85%] w-[40%] max-w-[140px]">
              <div className="text-3xl xl:text-4xl font-black text-[#0ea5e9] mb-4 shrink-0 transition-all">{currentForce.left.toFixed(1)} <span className="text-xs text-slate-400 font-bold">kg</span></div>
              <div className="w-full flex-1 bg-slate-100 rounded-full p-2 shadow-inner flex items-end relative overflow-hidden">
                <div className="absolute inset-0 flex flex-col justify-between py-6 opacity-20 pointer-events-none">
                  {[...Array(6)].map((_, i) => <div key={i} className="w-full h-[2px] bg-slate-400"></div>)}
                </div>
                <div className="w-full bg-[#0ea5e9] rounded-full transition-all duration-300 ease-out relative shadow-md" style={{ height: `${(Math.min(currentForce.left, MAX_FORCE_KG) / MAX_FORCE_KG) * 100}%` }}>
                  <div className="absolute top-2 left-2 right-2 h-3 bg-white/30 rounded-full"></div>
                </div>
              </div>
              <div className="font-black text-slate-600 text-sm mt-6 shrink-0 tracking-widest">TRÁI</div>
              <div className="px-3 py-1.5 mt-2 bg-slate-100 text-[#0ea5e9] rounded-lg text-sm font-black shrink-0 border border-slate-200">{leftPercent.toFixed(1)}%</div>
            </div>

            {/* Tay Phải */}
            <div className="flex flex-col items-center h-full max-h-[85%] w-[40%] max-w-[140px]">
              <div className="text-3xl xl:text-4xl font-black text-[#0c4a6e] mb-4 shrink-0 transition-all">{currentForce.right.toFixed(1)} <span className="text-xs text-slate-400 font-bold">kg</span></div>
              <div className="w-full flex-1 bg-slate-100 rounded-full p-2 shadow-inner flex items-end relative overflow-hidden">
                <div className="absolute inset-0 flex flex-col justify-between py-6 opacity-20 pointer-events-none">
                  {[...Array(6)].map((_, i) => <div key={i} className="w-full h-[2px] bg-slate-400"></div>)}
                </div>
                <div className="w-full bg-[#0c4a6e] rounded-full transition-all duration-300 ease-out relative shadow-md" style={{ height: `${(Math.min(currentForce.right, MAX_FORCE_KG) / MAX_FORCE_KG) * 100}%` }}>
                  <div className="absolute top-2 left-2 right-2 h-3 bg-white/20 rounded-full"></div>
                </div>
              </div>
              <div className="font-black text-slate-600 text-sm mt-6 shrink-0 tracking-widest">PHẢI</div>
              <div className="px-3 py-1.5 mt-2 bg-slate-100 text-[#0c4a6e] rounded-lg text-sm font-black shrink-0 border border-slate-200">{rightPercent.toFixed(1)}%</div>
            </div>
          </div>
        </div>

        {/* --- DẢI KÉO DỌC --- */}
        <div onMouseDown={startResizeX} className="w-4 -ml-2 -mr-2 z-10 cursor-col-resize flex flex-col items-center justify-center group hidden lg:flex">
          <div className="w-[3px] h-16 bg-slate-300 rounded-full group-hover:bg-[#0ea5e9] group-hover:w-[5px] group-hover:h-24 transition-all shadow-sm"></div>
        </div>

        {/* ---------------- CỘT PHẢI (CHỨA 2 BIỂU ĐỒ CHIA 50/50) ---------------- */}
        <div ref={rightPanelRef} style={{ width: `${100 - leftWidth}%` }} className="h-full flex flex-col min-w-[400px]">

          {/* BIỂU ĐỒ 1: REAL-TIME */}
          <div style={{ height: `${topHeight}%` }} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col min-h-[150px]">
            <div className="flex justify-between items-center mb-4 shrink-0">
              <h3 className="text-sm font-bold text-slate-800">Biến thiên lực Real-time (Chu kỳ thức thời)</h3>
              <div className="flex gap-4 text-xs font-bold text-slate-600">
                <div className="flex items-center gap-1.5"><span className="w-3 h-[2px] bg-[#0ea5e9]"></span> Tay Trái</div>
                <div className="flex items-center gap-1.5"><span className="w-3 h-[2px] bg-[#0c4a6e]"></span> Tay Phải</div>
              </div>
            </div>
            <div className="flex-1 min-h-0 w-full relative pl-8 pb-4">
              <div className="absolute inset-0 pl-8 pb-4 flex flex-col justify-between opacity-30 pointer-events-none">
                {[15, 10, 5, 0].map(val => (
                  <div key={val} className="w-full border-b border-slate-400 border-dashed flex items-center relative h-0">
                    <span className="absolute -left-8 text-[10px] bg-white pr-2 text-slate-500 font-mono -translate-y-1/2">{val}kg</span>
                  </div>
                ))}
              </div>
              <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 100">
                <polyline points={createSvgPath('left')} fill="none" stroke="#0ea5e9" strokeWidth="1.5" vectorEffect="non-scaling-stroke" strokeLinejoin="round" className="transition-all duration-300" />
                <polyline points={createSvgPath('right')} fill="none" stroke="#0c4a6e" strokeWidth="1.5" vectorEffect="non-scaling-stroke" strokeLinejoin="round" className="transition-all duration-300" />
              </svg>
            </div>
          </div>

          {/* --- DẢI KÉO NGANG --- */}
          <div onMouseDown={startResizeY} className="h-4 -mt-2 -mb-2 z-10 cursor-row-resize flex items-center justify-center group">
            <div className="h-[3px] w-16 bg-slate-300 rounded-full group-hover:bg-[#0ea5e9] group-hover:h-[5px] group-hover:w-24 transition-all shadow-sm"></div>
          </div>

          {/* BIỂU ĐỒ 2: CỘT CHỒNG LỊCH SỬ DÙNG DATA THẬT */}
          <div style={{ height: `${100 - topHeight}%` }} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col min-h-[150px]">
            <div className="flex justify-between items-center mb-4 shrink-0">
              <div>
                <h3 className="text-sm font-bold text-slate-800">Phân bổ lực tỳ tích lũy</h3>
                <p className="text-[10px] text-slate-500">Xem dữ liệu lực phân bổ trung bình dựa theo chu kỳ thời gian.</p>
              </div>
              <div className="flex bg-slate-100 rounded-xl p-1 border border-slate-200 gap-0.5">
                {(['minute', 'hour', 'day', 'month', 'custom'] as const).map((type) => (
                  <button key={type} onClick={() => setIntervalType(type)} className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-all ${intervalType === type ? 'bg-[#0ea5e9] text-white shadow-sm' : 'text-slate-500 hover:bg-slate-200'}`}>
                    {type === 'minute' ? 'Theo Phút' : type === 'hour' ? 'Theo Giờ' : type === 'day' ? 'Theo Ngày' : type === 'month' ? 'Theo Tháng' : 'Tự chọn'}
                  </button>
                ))}
              </div>
            </div>

            {intervalType === 'custom' && (
              <div className="flex items-center gap-4 mb-4 p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs shrink-0 transition-all">
                <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="border border-slate-300 rounded-lg px-2 py-1" />
                <span className="text-slate-400">đến</span>
                <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="border border-slate-300 rounded-lg px-2 py-1" />
                <button onClick={handleApplyCustomTime} className="bg-[#0ea5e9] text-white font-bold px-3 py-1 rounded-lg">Áp dụng</button>
              </div>
            )}

            {forceHistory.length === 0 ? (
              <div className="flex-1 flex items-center justify-center border border-dashed border-slate-200 rounded-xl">
                <span className="text-xs text-slate-400 font-medium italic">Chưa có dữ liệu lịch sử cho mốc thời gian này.</span>
              </div>
            ) : (
              // VẼ ĐỒ THỊ CỘT CHỒNG THẬT TỪ DATA BACKEND
              <div className="flex-1 flex items-end justify-around w-full mt-2 relative min-h-0 pb-2">
                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20">
                  <div className="w-full border-t border-slate-400"></div>
                  <div className="w-full border-t border-slate-400"></div>
                  <div className="w-full border-t border-slate-400"></div>
                </div>

                {forceHistory.map((dayData, idx) => {
                  const total = dayData.left + dayData.right;
                  // Tổng trần định mức là 30kg (15kg mỗi bên)
                  const heightPercent = Math.min((total / 30) * 100, 100);
                  const leftRatio = total > 0 ? (dayData.left / total) * 100 : 0;
                  const rightRatio = total > 0 ? (dayData.right / total) * 100 : 0;

                  return (
                    <div key={idx} className="flex flex-col items-center justify-end h-full w-8 sm:w-12 group relative">
                      {/* Tooltip hiển thị số cân cụ thể */}
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity mb-1 bg-slate-800 text-white text-[9px] px-2 py-1 rounded absolute bottom-full pb-2 pointer-events-none z-10 whitespace-nowrap shadow-md">
                        Trái: {dayData.left.toFixed(1)}kg | Phải: {dayData.right.toFixed(1)}kg
                      </div>

                      {/* Cột chồng */}
                      <div className="w-full rounded-t-sm flex flex-col-reverse overflow-hidden shadow-sm transition-all" style={{ height: `${heightPercent}%` }}>
                        <div className="w-full bg-[#0ea5e9] hover:brightness-110 transition-all" style={{ height: `${leftRatio}%` }}></div>
                        <div className="w-full bg-[#0c4a6e] hover:brightness-110 transition-all border-b border-white/20" style={{ height: `${rightRatio}%` }}></div>
                      </div>

                      {/* Trục X hiển thị nhãn thời gian từ API */}
                      <span className="text-[10px] font-bold text-slate-500 mt-2 whitespace-nowrap">{dayData.day}</span>
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