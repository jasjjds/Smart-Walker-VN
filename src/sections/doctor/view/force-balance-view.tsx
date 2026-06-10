// src/sections/doctor/view/force-balance-view.tsx

"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useParams, usePathname } from 'next/navigation';
import dynamic from 'next/dynamic';
import { useAuth } from '@/lib/auth-context';
import { BackButton } from '@/components/custom/back-button';
import { useForceRealtime } from '@/hooks/useForceRealtime';
import { CHART_CONFIG } from '@/config/constants';

const ForceRealtimeChart = dynamic(
  () => import('@/components/custom/force-realtime-chart').then(m => m.ForceRealtimeChart),
  { ssr: false, loading: () => <div className="h-44 w-full bg-slate-55 animate-pulse rounded-2xl" /> }
);

export function ForceBalanceView() {
  const params = useParams();
  const pathname = usePathname();
  const { user } = useAuth();

  // Lấy patientID từ URL nếu là bác sĩ, hoặc từ chính user nếu là bệnh nhân
  const patientID = Array.isArray(params.id) ? params.id[0] : (params.id || user?.patient_id || '');
  const isPatientView = pathname.includes('/dashboard/patient/metrics');
  const backLink = isPatientView ? '/dashboard/patient/metrics' : `/dashboard/doctor/patients/${patientID}`;

  const {
    isLive,
    setIsLive,
    currentForce,
    history,
  } = useForceRealtime(patientID);

  const [leftWidth, setLeftWidth] = useState(30);
  const [isMobile, setIsMobile] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  // Phát hiện kích thước màn hình để điều khiển Responsive Layout
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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

  const totalForce = currentForce.left + currentForce.right;
  const leftPercent = totalForce > 0 ? (currentForce.left / totalForce) * 100 : 50;
  const rightPercent = totalForce > 0 ? (currentForce.right / totalForce) * 100 : 50;

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
                <div className="w-full bg-[#0ea5e9] rounded-full transition-all duration-300 ease-out relative shadow-md" style={{ height: `${(Math.min(currentForce.left, CHART_CONFIG.MAX_FORCE_KG) / CHART_CONFIG.MAX_FORCE_KG) * 100}%` }}>
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
                <div className="w-full bg-[#0c4a6e] rounded-full transition-all duration-300 ease-out relative shadow-md" style={{ height: `${(Math.min(currentForce.right, CHART_CONFIG.MAX_FORCE_KG) / CHART_CONFIG.MAX_FORCE_KG) * 100}%` }}>
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

        {/* CỘT PHẢI - REAL-TIME */}
        <div
          style={{
            width: isMobile ? '100%' : `${100 - leftWidth}%`,
            height: isMobile ? 'auto' : '100%'
          }}
          className="flex flex-col min-w-0 shrink-0 lg:shrink-1 lg:min-h-0"
        >
          {/* BIỂU ĐỒ 1: REAL-TIME */}
          <ForceRealtimeChart history={history} className="h-[400px] lg:h-full" />
        </div>
      </div>
    </div>
  );
}
