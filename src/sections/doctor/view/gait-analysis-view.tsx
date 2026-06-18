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
import { CustomDatePicker } from '@/components/custom/custom-datepicker';

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
    <div className="w-full flex flex-col gap-6 text-primary-900 p-2 md:p-4 rounded-xl bg-slate-50 lg:h-[calc(100vh-170px)] lg:min-h-[600px] lg:max-h-[900px]">

      <BackButton href={backLink} />

      {/* 1. HEADER & BỘ LỌC CHU KỲ / NÚT REAL-TIME */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shrink-0">
        <div>
          <p className="text-primary-900/70 mt-0.5 text-xs sm:text-sm font-medium italic">
            Theo dõi vận tốc tập luyện thời gian thực từ thiết bị StepAid - LBK.
          </p>
        </div>

        <button
          onClick={() => setIsLive(!isLive)}
          className={`w-full sm:w-auto px-5 py-2.5 text-xs sm:text-sm font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 ${isLive ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-primary-500 hover:bg-primary-900 text-white'
            }`}
        >
          {isLive ? 'Dừng lấy dữ liệu' : 'Bắt đầu thu dữ liệu'}
        </button>
      </div>

      {/* 2. MAIN CONTENT AREA */}
      <div className="flex-grow flex flex-col gap-6 lg:min-h-0">

        {/* BIỂU ĐỒ VẬN TỐC REAL-TIME */}
        <div className="w-full bg-white rounded-2xl p-5 border border-gray-200 shadow-sm flex flex-col relative h-[350px] lg:h-auto lg:flex-grow lg:min-h-0">
          <div className="flex justify-between items-center mb-6 shrink-0 z-10">
            <h3 className="text-xs sm:text-sm font-bold text-gray-800">
              Biểu đồ Vận tốc Real-time (m/s)
            </h3>
            {isLive && (
              <span className="flex h-3 w-3 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
            )}
          </div>

          <div className="flex-grow w-full relative min-h-0">
            <div className="w-full h-full pb-10">
              <VelocityChart history={velocityHistory} className="h-full w-full" />
            </div>
          </div>
        </div>

        <div className="shrink-0 grid grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            variant="horizontal"
            title="Vận tốc hiện tại"
            description="Đang nhận trực tiếp."
            value={currentVelocity.toFixed(2)}
            unit="m/s"
            valueColorClass="text-primary-500"
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
            valueColorClass="text-primary-900"
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

      </div>
    </div>
  );
}
