// src/components/patient/session-modal.tsx

import React from 'react';
import dynamic from 'next/dynamic';
import { MetricCard } from '@/components/common/metric-card';

const ForceRealtimeChart = dynamic(
  () => import('@/components/custom/force-realtime-chart').then(m => m.ForceRealtimeChart),
  { ssr: false, loading: () => <div className="h-44 w-full bg-slate-50 animate-pulse rounded-2xl" /> }
);

const VelocityChart = dynamic(
  () => import('@/components/custom/velocity-chart').then(m => m.VelocityChart),
  { ssr: false, loading: () => <div className="h-44 w-full bg-slate-50 animate-pulse rounded-2xl" /> }
);

interface SessionModalProps {
  pageId: number | null;
  page: any;
  loading: boolean;
  onClose: () => void;
}

export function SessionModal({
  pageId,
  page,
  loading,
  onClose
}: SessionModalProps) {
  
  if (!pageId) return null;

  const leftForce = page?.avg_force_left ?? 0;
  const rightForce = page?.avg_force_right ?? 0;
  const totalForce = leftForce + rightForce;
  const totalDistance = page?.total_distance ?? 0;
  const durationSeconds = page?.duration_seconds ?? 0;

  const forceChartData = (page?.sensor_data || []).map((d: any) => ({
    left: d.force_left || 0,
    right: d.force_right || 0
  }));

  const velocityChartData = (page?.sensor_data || []).map((d: any) => ({
    velocity: d.velocity || 0
  }));

  return (
    <div className="fixed inset-0 z-55 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-primary-900/40 backdrop-blur-xs transition-opacity" onClick={onClose}></div>
      <div className="relative w-full max-w-xl bg-white rounded-[2rem] shadow-2xl p-6 sm:p-8 z-10 max-h-[90vh] overflow-y-auto custom-scrollbar flex flex-col gap-6 animate-fade-in border border-primary-200">
        
        {/* Modal Header */}
        <div className="flex justify-between items-start shrink-0 border-b border-primary-900/10 pb-4">
          <div>
            <h3 className="text-lg sm:text-xl font-black text-primary-900">Chi tiết phiên tập phục hồi</h3>
            <p className="text-xs text-slate-400 font-bold mt-1 uppercase tracking-wider font-mono">
              Mã phiên: PAGE-{pageId}
            </p>
          </div>
          <button onClick={onClose} className="text-primary-900/50 hover:text-red-500 p-1.5 hover:bg-slate-100 rounded-full transition-all">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-2 text-slate-400">
            <svg className="w-8 h-8 animate-spin text-primary-500" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <span className="text-xs font-semibold">Đang truy xuất thông số từ thiết bị...</span>
          </div>
        ) : page && (
          <div className="flex flex-col gap-6">
            
            {/* Time & Device Info */}
            <div className="flex flex-wrap gap-4 text-xs font-semibold text-primary-900/70 border-b border-primary-900/5 pb-4">
              <span>📅 Bắt đầu: {new Date(page.start_time).toLocaleString("vi-VN")}</span>
              {page.end_time && (
                <span>🏁 Kết thúc: {new Date(page.end_time).toLocaleString("vi-VN")}</span>
              )}
              <span>🤖 Thiết bị: <span className="font-mono text-primary-500">{page.device_id || "Không gán"}</span></span>
            </div>

            {/* Metric Summary Grid (Using MetricCard LEGO blocks) */}
            <div className="grid grid-cols-3 gap-3">
              <MetricCard variant="minimal" title="Quãng đường" value={totalDistance.toFixed(1)} unit="m" />
              <MetricCard variant="minimal" title="Thời gian tập" value={`${Math.floor(durationSeconds / 60)}m ${durationSeconds % 60}s`} unit="" />
              <MetricCard variant="minimal" title="Vận tốc trung bình" value={(page?.avg_velocity ?? 0).toFixed(1)} unit="m/s" />
            </div>

            {/* Balance & Distribution Bar */}
            <div className="bg-neutral-50 border border-slate-100 rounded-2xl p-4">
              <div className="flex justify-between text-xs font-black mb-2">
                <span className="text-primary-500">Trái: {leftForce.toFixed(1)} kg</span>
                <span className="text-primary-900">Phải: {rightForce.toFixed(1)} kg</span>
              </div>
              
              <div className="w-full h-2.5 bg-slate-200 rounded-full flex overflow-hidden shadow-inner">
                {totalForce > 0 ? (
                  <>
                    <div 
                      className="bg-primary-500 transition-all duration-300"
                      style={{ width: `${(leftForce / totalForce) * 100}%` }}
                    ></div>
                    <div 
                      className="bg-primary-900 transition-all duration-300"
                      style={{ width: `${(rightForce / totalForce) * 100}%` }}
                    ></div>
                  </>
                ) : (
                  <div className="w-full bg-slate-300"></div>
                )}
              </div>
              <p className="text-[9px] text-gray-400 text-center font-bold tracking-wider uppercase mt-2">
                Cân đối hai bên chịu lực
              </p>
            </div>

            {/* Biểu đồ cảm biến Lực & Vận tốc */}
            {page.sensor_data && page.sensor_data.length > 0 ? (
              <div className="flex flex-col gap-4 mt-2">
                <ForceRealtimeChart history={forceChartData} className="h-44 w-full" />
                <VelocityChart history={velocityChartData} className="h-44 w-full" />
              </div>
            ) : (
              <div className="bg-white border border-primary-200 rounded-2xl p-4 flex items-center justify-center">
                <p className="text-xs text-gray-400 italic text-center py-6">
                  Không có thông số cảm biến chi tiết được ghi lại cho phiên này.
                </p>
              </div>
            )}

            {/* Medical Assessment Note */}
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-xs font-medium leading-relaxed">
              <div className="flex items-center gap-1.5 text-amber-700 font-extrabold mb-1.5">
                <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
                CHẨN ĐOÁN LÂM SÀNG CỦA BÁC SĨ PHỤ TRÁCH
              </div>
              <p className="text-slate-600 bg-white/65 p-3 rounded-xl border border-amber-200/50 min-h-[50px] shadow-2xs font-semibold">
                {page.doctor_notes || "Chưa ghi nhận đánh giá lâm sàng cho phiên này. Bác sĩ điều trị có thể cập nhật nhận xét từ trang quản lý."}
              </p>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
