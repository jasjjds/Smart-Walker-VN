"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useParams, usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { analyticsService } from '@/services/analyticsService';
import { BackButton } from '@/components/custom/back-button';
import { MetricCard } from '@/components/common/metric-card';
import { useGaitRealtime } from '@/hooks/useGaitRealtime';

const VelocityChart = dynamic(
  () => import('@/components/custom/velocity-chart').then(m => m.VelocityChart),
  { ssr: false, loading: () => <div className="h-44 w-full bg-slate-55 animate-pulse rounded-2xl" /> }
);

interface ProcessedData {
  date_bucket: string;
  label: string;
  subLabel: string;
  total_distance: number;
}

export function GaitAnalysisView() {
  const params = useParams();
  const pathname = usePathname();
  const { user } = useAuth();
  
  // Lấy patientID từ URL nếu là bác sĩ, hoặc từ chính user nếu là bệnh nhân
  const patientID = Array.isArray(params.id) ? params.id[0] : (params.id || user?.patient_id || '');
  const isPatientView = pathname.includes('/dashboard/patient/metrics');
  const backLink = isPatientView ? '/dashboard/patient/metrics' : `/dashboard/doctor/patients/${patientID}`;

  const [intervalType, setIntervalType] = useState<'minute' | 'hour' | 'day' | 'month' | 'custom'>('day');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const [data, setData] = useState<ProcessedData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Real-time Velocity states using custom hook
  const {
    isLive,
    setIsLive,
    currentVelocity,
    velocityHistory,
    sessionDistance
  } = useGaitRealtime(patientID, isPatientView);

  const loadData = async (type: string, start?: string, end?: string) => {
    if (!patientID) return;

    setIsLoading(true);
    try {
      const params: any = {
        patient_id: patientID,
        interval: type
      };

      if (type === 'custom' && start && end) {
        params.start_date = start;
        params.end_date = end;
      }

      const response: any = await analyticsService.getDistance(params);
      const result = response.chartData;

      if (!result || result.length === 0) {
        setData([]);
        return;
      }

      const formattedData = result.map((item: any) => {
        return {
          date_bucket: item.date_bucket,
          label: item.date_bucket,
          subLabel: (type === 'minute' || type === 'hour') ? 'Hôm nay' : '',
          total_distance: Number(item.total_distance)
        };
      });

      setData(formattedData);
    } catch (error) {
      console.error("Lỗi tải dữ liệu quãng đường:", error);
      setData([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (intervalType === 'custom') return;
    loadData(intervalType);
  }, [intervalType, patientID]);

  const handleApplyCustomTime = () => {
    if (!startDate || !endDate) {
      alert("Vui lòng chọn đầy đủ ngày bắt đầu và ngày kết thúc!");
      return;
    }
    loadData('custom', startDate, endDate);
  };

  if (!patientID) {
    return (
      <div className="w-full h-full flex items-center justify-center text-slate-500 text-sm">
        <p>⚠️ Không tìm thấy ID Bệnh nhân. Vui lòng truy cập lại từ danh sách.</p>
      </div>
    );
  }

  const maxDistance = data.length > 0 ? Math.max(...data.map(d => d.total_distance)) : 1;
  const totalDistance = data.reduce((sum, item) => sum + item.total_distance, 0);
  const avgDistance = data.length > 0 ? (totalDistance / data.length).toFixed(2) : "0.00";

  // Vận tốc Real-time stats cho bệnh nhân
  const maxVelocity = velocityHistory.length > 0 
    ? Math.max(...velocityHistory.map(d => d.velocity)) 
    : 0;
  
  const validVelocityPoints = velocityHistory.filter(d => d.velocity > 0);
  const avgVelocity = validVelocityPoints.length > 0
    ? (validVelocityPoints.reduce((sum, item) => sum + item.velocity, 0) / validVelocityPoints.length).toFixed(2)
    : "0.00";

  return (
    <div className="w-full flex flex-col gap-6 text-[#0c4a6e] p-2 md:p-4 rounded-xl bg-slate-50 lg:h-[calc(100vh-170px)] lg:min-h-[600px] lg:max-h-[900px]">

      <BackButton href={backLink} />

      {/* 1. HEADER & BỘ LỌC CHU KỲ / NÚT REAL-TIME */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shrink-0">
        <div>
          <p className="text-[#0c4a6e]/70 mt-0.5 text-xs sm:text-sm font-medium italic">
            {isPatientView 
              ? "Theo dõi vận tốc tập luyện thời gian thực từ thiết bị Smart Walker." 
              : "Theo dõi mức độ vận động của bệnh nhân qua các mốc thời gian."}
          </p>
        </div>

        {isPatientView ? (
          <button 
            onClick={() => setIsLive(!isLive)} 
            className={`w-full sm:w-auto px-5 py-2.5 text-xs sm:text-sm font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 ${
              isLive ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-[#0ea5e9] hover:bg-[#0c4a6e] text-white'
            }`}
          >
            {isLive ? 'Dừng lấy dữ liệu' : 'Bắt đầu thu dữ liệu'}
          </button>
        ) : (
          <div className="flex bg-white rounded-xl shadow-sm border border-gray-200 p-1 gap-0.5 overflow-x-auto max-w-full">
            {(['minute', 'hour', 'day', 'month', 'custom'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setIntervalType(type)}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all whitespace-nowrap ${
                  intervalType === type ? 'bg-[#0ea5e9] text-white shadow-md' : 'text-gray-500 hover:bg-gray-100'
                }`}
              >
                {type === 'minute' ? 'Theo Phút' : type === 'hour' ? 'Theo Giờ' : type === 'day' ? 'Theo Ngày' : type === 'month' ? 'Theo Tháng' : 'Tự chọn'}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 1.1 PANEL DATE PICKER */}
      {!isPatientView && intervalType === 'custom' && (
        <div className="flex flex-wrap items-center gap-3 p-3 bg-white border border-gray-200 rounded-xl text-xs shrink-0 shadow-sm animate-fadeIn">
          <div className="flex items-center gap-1.5">
            <span className="text-gray-500 font-medium">Từ ngày:</span>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="border border-gray-300 rounded-lg px-2 py-1 outline-none focus:border-[#0ea5e9] text-gray-700 text-xs"
            />
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-gray-500 font-medium">Đến ngày:</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="border border-gray-300 rounded-lg px-2 py-1 outline-none focus:border-[#0ea5e9] text-gray-700 text-xs"
            />
          </div>
          <button
            onClick={handleApplyCustomTime}
            className="w-full sm:w-auto bg-[#0ea5e9] hover:bg-[#0c4a6e] text-white font-bold px-3 py-1.5 rounded-lg transition-colors text-xs"
          >
            Áp dụng bộ lọc
          </button>
        </div>
      )}

      {/* 2. MAIN CONTENT AREA */}
      <div className="flex-grow flex flex-col gap-6 lg:min-h-0">

        {/* BIỂU ĐỒ QUÃNG ĐƯỜNG HOẶC VẬN TỐC REAL-TIME */}
        <div className="w-full bg-white rounded-2xl p-5 border border-gray-200 shadow-sm flex flex-col relative h-[350px] lg:h-auto lg:flex-grow lg:min-h-0">
          <div className="flex justify-between items-center mb-6 shrink-0 z-10">
            <h3 className="text-xs sm:text-sm font-bold text-gray-800">
              {isPatientView ? "Biểu đồ Vận tốc Real-time (m/s)" : "Biểu đồ Vận động (m)"}
            </h3>
            {isPatientView && isLive && (
              <span className="flex h-3 w-3 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
            )}
          </div>

          <div className="flex-grow w-full relative min-h-0">
            {isPatientView ? (
              <div className="w-full h-full pb-10">
                <VelocityChart history={velocityHistory} className="h-full w-full" />
              </div>
            ) : (
              <>
                {/* Lớp nền chia vạch Y-axis */}
                <div className="absolute inset-0 pl-10 pb-10 flex flex-col justify-between pointer-events-none z-0">
                  {[1, 0.75, 0.5, 0.25, 0].map((ratio) => {
                    const val = (maxDistance * ratio).toFixed(2);
                    return (
                      <div key={ratio} className="w-full flex items-center relative h-0">
                        <div className={`w-full absolute ${ratio === 0 ? 'border-b-2 border-gray-800' : 'border-b border-dashed border-gray-200'}`}></div>
                        <span className="absolute -left-10 text-[9px] sm:text-[10px] font-mono text-gray-500 bg-white pr-2 -translate-y-1/2">{val}m</span>
                      </div>
                    );
                  })}
                </div>

                {/* Trục dọc */}
                <div className="absolute top-0 bottom-10 left-10 border-l-2 border-gray-800 pointer-events-none z-10"></div>

                {/* LỚP VẼ CỘT */}
                <div className="absolute inset-0 pl-10 flex overflow-x-auto custom-scrollbar">
                  {isLoading ? (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 font-bold pb-10 text-sm">Đang tải dữ liệu...</div>
                  ) : data.length === 0 ? (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 font-bold pb-10 text-sm">Chưa có dữ liệu cho mốc thời gian này.</div>
                  ) : (
                    data.map((item) => {
                      const heightPercent = (item.total_distance / maxDistance) * 85;

                      return (
                        <div key={item.date_bucket} className="flex-1 flex flex-col items-center justify-end h-full pb-10 relative group px-1 min-w-[32px] sm:min-w-[48px]">
                          {/* SỐ TRÊN ĐỈNH CỘT */}
                          <span className="text-[9px] sm:text-[10px] font-black text-[#0ea5e9] mb-1 opacity-95 group-hover:opacity-100 group-hover:-translate-y-1 transition-all">
                            {item.total_distance.toFixed(2)}
                          </span>

                          {/* CỘT MÀU XANH */}
                          <div
                            className="bg-[#0ea5e9] w-full max-w-[32px] sm:max-w-[48px] rounded-t-md shadow-sm transition-all duration-300 group-hover:bg-[#0c4a6e]"
                            style={{ height: `${Math.max(heightPercent, 1)}%` }}
                          ></div>

                          {/* NHÃN TRỤC X */}
                          <div className="absolute bottom-1 w-full flex flex-col items-center justify-center">
                            <span className="text-[8px] sm:text-[10px] font-bold text-gray-600 whitespace-nowrap">
                              {item.label}
                            </span>
                            {item.subLabel && (
                              <span className="text-[7px] sm:text-[8px] font-medium text-gray-400 mt-[1px]">
                                {item.subLabel}
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        {isPatientView ? (
          <div className="shrink-0 grid grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard
              variant="horizontal"
              title="Vận tốc hiện tại"
              description="Đang nhận trực tiếp."
              value={currentVelocity.toFixed(2)}
              unit="m/s"
              valueColorClass="text-[#0ea5e9]"
            />
            <MetricCard
              variant="horizontal"
              title="Quãng đường đã đi"
              description="Tích lũy phiên này."
              value={sessionDistance.toFixed(2)}
              unit="mét"
              valueColorClass="text-emerald-600"
            />
            <MetricCard
              variant="horizontal"
              title="Vận tốc cao nhất"
              description="Trong phiên này."
              value={maxVelocity.toFixed(2)}
              unit="m/s"
              valueColorClass="text-[#0c4a6e]"
            />
            <MetricCard
              variant="horizontal"
              title="Vận tốc trung bình"
              description="Khi di chuyển."
              value={avgVelocity}
              unit="m/s"
              valueColorClass="text-amber-600"
            />
          </div>
        ) : (
          <div className="shrink-0 grid grid-cols-1 md:grid-cols-3 gap-4">
            <MetricCard
              variant="horizontal"
              title="Tổng quãng đường"
              description="Lũy kế theo bộ lọc."
              value={totalDistance.toFixed(2)}
              unit="mét"
              valueColorClass="text-[#0ea5e9]"
            />
            <MetricCard
              variant="horizontal"
              title="Thành tích cao nhất"
              description="Trong một chu kỳ."
              value={maxDistance === 1 && totalDistance === 0 ? "0.00" : maxDistance.toFixed(2)}
              unit="mét"
              valueColorClass="text-[#0c4a6e]"
            />
            <MetricCard
              variant="horizontal"
              title="Trung bình"
              description={`Mỗi ${intervalType === 'day' ? 'ngày' : intervalType === 'hour' ? 'giờ' : intervalType === 'minute' ? 'phút' : intervalType === 'month' ? 'tháng' : 'chu kỳ'}.`}
              value={avgDistance}
              unit="mét"
              valueColorClass="text-emerald-600"
            />
          </div>
        )}

      </div>
    </div>
  );
}
