"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { analyticsService } from '@/services/analyticsService';

interface ProcessedData {
  date_bucket: string;
  label: string;
  subLabel: string;
  total_distance: number;
}

export function GaitAnalysisView() {
  const params = useParams();
  const patientID = Array.isArray(params.id) ? params.id[0] : (params.id || '');

  const [intervalType, setIntervalType] = useState<'minute' | 'hour' | 'day' | 'month' | 'custom'>('day');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const [data, setData] = useState<ProcessedData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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

  return (
    <div className="w-full h-full flex flex-col gap-6 text-[#0c4a6e] p-2 md:p-4 rounded-xl bg-slate-50">

      {/* 0. NÚT QUAY LẠI */}
      <Link href={`/dashboard/doctor/patients/${patientID}`} className="flex items-center gap-2 text-[#0ea5e9] hover:text-[#0c4a6e] font-bold w-fit transition-colors text-sm shrink-0">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Quay lại tổng quan
      </Link>

      {/* 1. HEADER & BỘ LỌC CHU KỲ */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shrink-0">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Thống kê Quãng đường (Chu kỳ dáng đi)</h1>
          <p className="text-[#0c4a6e]/70 mt-0.5 text-xs sm:text-sm font-medium italic">Theo dõi mức độ vận động của bệnh nhân qua các mốc thời gian.</p>
        </div>

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
      </div>

      {/* 1.1 PANEL DATE PICKER */}
      {intervalType === 'custom' && (
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
      <div className="flex-1 min-h-[350px] flex flex-col gap-6">

        {/* BIỂU ĐỒ QUÃNG ĐƯỜNG */}
        <div className="flex-1 min-h-0 bg-white rounded-2xl p-5 border border-gray-200 shadow-sm flex flex-col relative">
          <div className="flex justify-between items-center mb-6 shrink-0 z-10">
            <h3 className="text-xs sm:text-sm font-bold text-gray-800">Biểu đồ Vận động (m)</h3>
          </div>

          <div className="flex-1 w-full relative min-h-0">
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
          </div>
        </div>

        {/* 3. KHỐI CHỈ SỐ (Fixed responsive wrapper height to prevent squish) */}
        <div className="shrink-0 grid grid-cols-1 md:grid-cols-3 gap-4 h-auto">
          <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm flex items-center justify-between">
            <div>
              <h3 className="text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Tổng quãng đường</h3>
              <p className="text-[10px] sm:text-xs font-medium text-gray-600">Lũy kế theo bộ lọc.</p>
            </div>
            <div className="flex flex-col items-end shrink-0">
              <span className="text-xl sm:text-2xl font-black text-[#0ea5e9]">{totalDistance.toFixed(2)}</span>
              <span className="text-[9px] sm:text-[10px] font-bold text-gray-400">mét</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm flex items-center justify-between">
            <div>
              <h3 className="text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Thành tích cao nhất</h3>
              <p className="text-[10px] sm:text-xs font-medium text-gray-600">Trong một chu kỳ.</p>
            </div>
            <div className="flex flex-col items-end shrink-0">
              <span className="text-xl sm:text-2xl font-black text-[#0c4a6e]">{maxDistance === 1 && totalDistance === 0 ? "0.00" : maxDistance.toFixed(2)}</span>
              <span className="text-[9px] sm:text-[10px] font-bold text-gray-400">mét</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm flex items-center justify-between">
            <div>
              <h3 className="text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Trung bình</h3>
              <p className="text-[10px] sm:text-xs font-medium text-gray-600">Mỗi {intervalType === 'day' ? 'ngày' : intervalType === 'hour' ? 'giờ' : intervalType === 'minute' ? 'phút' : intervalType === 'month' ? 'tháng' : 'chu kỳ'}.</p>
            </div>
            <div className="flex flex-col items-end shrink-0">
              <span className="text-xl sm:text-2xl font-black text-emerald-600">{avgDistance}</span>
              <span className="text-[9px] sm:text-[10px] font-bold text-gray-400">mét</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
