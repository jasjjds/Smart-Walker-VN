"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useParams } from 'next/navigation';
import { patientService } from '@/services/patientService';
import { BackButton } from '@/components/custom/back-button';
import { usePatientBooklet } from '@/hooks/usePatientBooklet';
import { MetricCard } from '@/components/common/metric-card';

const ForceRealtimeChart = dynamic(
  () => import('@/components/custom/force-realtime-chart').then(m => m.ForceRealtimeChart),
  { ssr: false, loading: () => <div className="h-44 w-full bg-slate-55 animate-pulse rounded-2xl" /> }
);

const VelocityChart = dynamic(
  () => import('@/components/custom/velocity-chart').then(m => m.VelocityChart),
  { ssr: false, loading: () => <div className="h-44 w-full bg-slate-55 animate-pulse rounded-2xl" /> }
);

export function DoctorPatientBookletView() {
  const params = useParams();
  const patientId = Array.isArray(params.id) ? params.id[0] : (params.id || "");

  const {
    booklet,
    setBooklet,
    loading,
    error,
    selectedPageId,
    selectedPage,
    setSelectedPage,
    loadingPage,
    handleOpenPageDetail,
    handleClosePageDetail,
  } = usePatientBooklet(patientId);

  // Form ghi chú chẩn đoán
  const [doctorNotes, setDoctorNotes] = useState("");
  const [savingNotes, setSavingNotes] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isEditingNotes, setIsEditingNotes] = useState(false);

  const textareaRef = React.useRef<HTMLTextAreaElement | null>(null);

  // Sync doctorNotes when selectedPage changes
  useEffect(() => {
    if (selectedPage) {
      setDoctorNotes(selectedPage.doctor_notes || "");
      setIsEditingNotes(!selectedPage.doctor_notes); // Nếu chưa có ghi chú, cho phép sửa luôn; nếu đã có ghi chú, bắt đầu bằng trạng thái khóa.
    } else {
      setDoctorNotes("");
      setIsEditingNotes(false);
    }
  }, [selectedPage]);

  // Tự động mở rộng chiều cao của textarea khi thay đổi nội dung
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [doctorNotes, selectedPageId]);

  const leftForce = selectedPage?.avg_force_left ?? 0;
  const rightForce = selectedPage?.avg_force_right ?? 0;
  const totalForce = leftForce + rightForce;
  const totalDistance = selectedPage?.total_distance ?? 0;
  const durationSeconds = selectedPage?.duration_seconds ?? 0;

  const forceChartData = (selectedPage?.sensor_data || []).map((d: any) => ({
    left: d.force_left || 0,
    right: d.force_right || 0
  }));

  const velocityChartData = (selectedPage?.sensor_data || []).map((d: any) => ({
    velocity: d.velocity || 0
  }));

  const backLink = `/dashboard/doctor/patients/${patientId}`;

  // Lưu chẩn đoán của bác sĩ
  const handleSaveNotes = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPageId) return;

    setSavingNotes(true);
    setSaveSuccess(false);
    try {
      const res = await patientService.updateBookletNotes(selectedPageId, doctorNotes) as any;
      if (res.success) {
        setSaveSuccess(true);
        // Cập nhật state tại chỗ để tránh phải load lại toàn bộ danh sách
        if (selectedPage) {
          setSelectedPage({ ...selectedPage, doctor_notes: doctorNotes });
        }
        if (booklet && booklet.pages) {
          setBooklet({
            ...booklet,
            pages: booklet.pages.map((p: any) =>
              p.id === selectedPageId ? { ...p, doctor_notes: doctorNotes } : p
            )
          });
        }

        // Tự động đóng modal
        handleClosePageDetail();
      }
    } catch (err: any) {
      console.error("Lỗi khi lưu chẩn đoán bác sĩ:", err);
      alert(err.response?.data?.message || "Không thể lưu chẩn đoán.");
    } finally {
      setSavingNotes(false);
    }
  };

  const formatDuration = (totalSeconds: number | null) => {
    if (!totalSeconds) return "0s";
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    if (mins > 0) return `${mins}m ${secs}s`;
    return `${secs}s`;
  };



  if (!patientId) {
    return (
      <div className="w-full h-full flex items-center justify-center text-slate-500 text-sm">
        <p>⚠️ Không tìm thấy ID bệnh nhân. Vui lòng thử lại từ danh sách.</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col gap-6 text-primary-900 relative">

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shrink-0">
        <div>
          <BackButton href={backLink} className="mb-2" />
          <h2 className="text-xl sm:text-2xl font-black">Sổ y tế điện tử</h2>
        </div>

        {/* Info badges */}
        {booklet && (
          <div className="flex flex-wrap gap-2 text-xs font-bold">
            <span className="bg-white border border-primary-200 px-3 py-1.5 rounded-xl text-slate-500">
              Số sổ: <span className="font-mono text-primary-500 font-black">{booklet.booklet_number}</span>
            </span>
            {booklet.patient_info?.identity_card && (
              <span className="bg-white border border-primary-200 px-3 py-1.5 rounded-xl text-slate-500">
                CCCD/CMND: <span className="font-mono text-primary-500 font-black">{booklet.patient_info.identity_card}</span>
              </span>
            )}
          </div>
        )}
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm font-semibold">
          {error}
        </div>
      )}

      {/* CORE CONTENT */}
      <div className="flex-1 bg-white rounded-3xl border border-primary-200 p-5 sm:p-6 shadow-sm flex flex-col min-h-[400px]">
        {loading ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-2 text-slate-400">
            <svg className="w-8 h-8 animate-spin text-primary-500" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <span className="text-xs font-bold">Đang tải hồ sơ bệnh án...</span>
          </div>
        ) : !booklet || !booklet.pages || booklet.pages.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center text-gray-400 py-16 gap-3">
            <svg className="w-12 h-12 opacity-35" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-sm font-bold">Bệnh nhân chưa thực hiện phiên tập nào trên xe tập đi.</p>
          </div>
        ) : (
          <div className="flex-grow overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-primary-200 text-primary-900/50 font-bold uppercase tracking-wider text-[10px] sm:text-xs">
                  <th className="py-3 px-4">Ngày bắt đầu</th>
                  <th className="py-3 px-4">Thời gian</th>
                  <th className="py-3 px-4">Quãng đường</th>
                  <th className="py-3 px-4">Lực tỳ (Trái/Phải)</th>
                  <th className="py-3 px-4">Trạng thái ghi chú</th>
                  <th className="py-3 px-4 text-center">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-primary-200/50">
                {booklet.pages.map((page: any) => {
                  const hasNotes = !!page.doctor_notes;
                  const dateStr = new Date(page.start_time).toLocaleString("vi-VN", {
                    dateStyle: "medium",
                    timeStyle: "short"
                  });

                  return (
                    <tr key={page.id} className="hover:bg-primary-50/50 transition-colors">
                      <td className="py-4 px-4 font-bold">{dateStr}</td>
                      <td className="py-4 px-4 font-semibold text-slate-600">{formatDuration(page.duration_seconds)}</td>
                      <td className="py-4 px-4 font-semibold text-slate-600">{(page.total_distance ?? 0).toFixed(1)} m</td>
                      <td className="py-4 px-4">
                        <span className="font-mono text-xs font-bold text-primary-500">{(page.avg_force_left ?? 0).toFixed(1)}kg</span>
                        <span className="text-slate-300 mx-1.5">•</span>
                        <span className="font-mono text-xs font-bold text-primary-900">{(page.avg_force_right ?? 0).toFixed(1)}kg</span>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`px-2.5 py-1 rounded-md text-[10px] font-black inline-block ${hasNotes ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                          {hasNotes ? 'ĐÃ ĐÁNH GIÁ' : 'CHƯA ĐÁNH GIÁ'}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <button
                          onClick={() => handleOpenPageDetail(page.id)}
                          className="px-4 py-1.5 bg-primary-50 border border-primary-200 hover:bg-primary-500 hover:text-white transition-colors text-xs font-bold rounded-lg shadow-2xs"
                        >
                          Phân tích & Chẩn đoán
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MODAL PHÂN TÍCH & GHI CHÚ BÁC SĨ */}
      {selectedPageId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-primary-900/40 backdrop-blur-xs transition-opacity" onClick={handleClosePageDetail}></div>
          <div className="relative w-full max-w-2xl bg-white rounded-[2rem] shadow-2xl p-6 sm:p-8 z-10 max-h-[90vh] overflow-y-auto custom-scrollbar flex flex-col gap-6 border border-primary-200 animate-fade-in">

            {/* Header */}
            <div className="flex justify-between items-start shrink-0 border-b border-primary-900/10 pb-4">
              <div>
                <h3 className="text-lg sm:text-xl font-black text-primary-900">Bệnh án điện tử - Phân tích phiên tập</h3>
                <p className="text-xs text-slate-400 font-bold mt-1 font-mono uppercase">Mã buổi tập: PAGE-{selectedPageId}</p>
              </div>
              <button onClick={handleClosePageDetail} className="text-primary-900/50 hover:text-red-500 p-1.5 hover:bg-slate-100 rounded-full transition-all">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            {loadingPage ? (
              <div className="flex flex-col items-center justify-center py-20 gap-2 text-slate-400">
                <svg className="w-8 h-8 animate-spin text-primary-500" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                <span className="text-xs font-bold">Đang truy vấn dữ liệu thô cảm biến...</span>
              </div>
            ) : selectedPage && (
              <div className="flex flex-col gap-6">

                {/* Details line */}
                <div className="flex flex-wrap gap-4 text-xs font-semibold text-primary-900/70 border-b border-primary-900/5 pb-4">
                  <span>Bắt đầu: {new Date(selectedPage.start_time).toLocaleString("vi-VN")}</span>
                  {selectedPage.end_time && (
                    <span>Kết thúc: {new Date(selectedPage.end_time).toLocaleString("vi-VN")}</span>
                  )}
                </div>

                {/* Performance stats row */}
                <div className="grid grid-cols-3 gap-4">
                  <MetricCard
                    variant="minimal"
                    title="Quãng đường"
                    value={totalDistance.toFixed(1)}
                    unit="m"
                  />
                  <MetricCard
                    variant="minimal"
                    title="Thời gian tập"
                    value={`${Math.floor(durationSeconds / 60)}m ${durationSeconds % 60}s`}
                    unit=""
                  />
                  <MetricCard
                    variant="minimal"
                    title="Vận tốc trung bình"
                    value={(selectedPage?.avg_velocity ?? 0).toFixed(1)}
                    unit="m/s"
                  />
                </div>

                {/* Balance & Distribution Bar */}
                <div className="bg-neutral-50 border border-slate-100 rounded-2xl p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Phân bố cân bằng lực</span>
                    <span className="text-xs font-black text-primary-500">
                      Chênh lệch: {Math.abs(leftForce - rightForce).toFixed(1)} kg
                    </span>
                  </div>
                  <div className="flex justify-between text-xs font-bold mb-3">
                    <span className="text-primary-500">{leftForce.toFixed(1)} kg (Trái)</span>
                    <span className="text-primary-900">{rightForce.toFixed(1)} kg (Phải)</span>
                  </div>

                  {/* Balance bar display */}
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
                </div>

                {/* Biểu đồ cảm biến Lực & Vận tốc */}
                {selectedPage.sensor_data && selectedPage.sensor_data.length > 0 ? (
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

                {/* Doctor Diagnostic Input Form */}
                <form onSubmit={handleSaveNotes} className="flex flex-col gap-3 mt-2">
                  <label className="text-xs font-black text-slate-700 uppercase tracking-wider">
                    Chẩn đoán lâm sàng & Ghi chú điều trị
                  </label>

                  <div className="relative w-full">
                    <textarea
                      ref={textareaRef}
                      readOnly={!isEditingNotes}
                      value={doctorNotes}
                      onChange={(e) => setDoctorNotes(e.target.value)}
                      placeholder="Vui lòng nhập đánh giá chẩn đoán y tế, chỉ định chịu lực, hoặc chỉnh sửa dáng đi cho bệnh nhân tại đây..."
                      className={`w-full p-4 pr-12 rounded-2xl border border-primary-200 bg-primary-50/20 text-primary-900 font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 placeholder-slate-400 focus:bg-white transition-all shadow-2xs resize-none overflow-hidden min-h-[100px] ${!isEditingNotes ? 'bg-slate-50 text-slate-500 cursor-not-allowed border-dashed' : ''
                        }`}
                    />

                    {/* Icon ở góc dưới bên phải để mở khóa chỉnh sửa */}
                    {selectedPage?.doctor_notes && (
                      <button
                        type="button"
                        onClick={() => setIsEditingNotes(true)}
                        disabled={isEditingNotes}
                        className={`absolute right-3.5 bottom-3.5 p-2 rounded-xl transition-all ${isEditingNotes
                          ? 'text-slate-300 cursor-default opacity-40'
                          : 'text-primary-500 hover:bg-primary-50 hover:scale-105 active:scale-95'
                          }`}
                        title="Nhấn để chỉnh sửa chẩn đoán"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                    )}
                  </div>

                  {saveSuccess && (
                    <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl text-xs font-black flex items-center gap-2 animate-pulse">
                      ✓ Đã lưu chẩn đoán thành công vào Sổ khám bệnh y tế!
                    </div>
                  )}

                  <div className="flex justify-end gap-3 mt-2 border-t border-slate-100 pt-4">
                    <button
                      type="button"
                      onClick={handleClosePageDetail}
                      className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-xl text-xs transition-colors"
                    >
                      Đóng lại
                    </button>
                    <button
                      type="submit"
                      disabled={savingNotes}
                      className="px-5 py-2.5 bg-primary-500 hover:bg-primary-900 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-sm disabled:opacity-50 transition-colors"
                    >
                      {savingNotes ? (
                        <>
                          <svg className="w-4 h-4 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                          Đang lưu...
                        </>
                      ) : 'Lưu chẩn đoán'}
                    </button>
                  </div>
                </form>

              </div>
            )}
          </div>
        </div>
      )}

      {/* CSS Animation helper */}
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.96); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in {
          animation: fadeIn 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
}
