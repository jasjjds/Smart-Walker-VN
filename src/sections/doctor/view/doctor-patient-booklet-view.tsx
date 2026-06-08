"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { patientService } from '@/services/patientService';
import { BackButton } from '@/components/custom/back-button';

export function DoctorPatientBookletView() {
  const params = useParams();
  const patientId = Array.isArray(params.id) ? params.id[0] : (params.id || "");

  const [booklet, setBooklet] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal chi tiết trang sổ & chẩn đoán
  const [selectedPageId, setSelectedPageId] = useState<number | null>(null);
  const [selectedPage, setSelectedPage] = useState<any>(null);
  const [loadingPage, setLoadingPage] = useState(false);

  // Form ghi chú chẩn đoán
  const [doctorNotes, setDoctorNotes] = useState("");
  const [savingNotes, setSavingNotes] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const leftForce = selectedPage?.avg_force_left ?? 0;
  const rightForce = selectedPage?.avg_force_right ?? 0;
  const totalForce = leftForce + rightForce;
  const totalDistance = selectedPage?.total_distance ?? 0;
  const durationSeconds = selectedPage?.duration_seconds ?? 0;

  const backLink = `/dashboard/doctor/patients/${patientId}`;

  // Tải dữ liệu sổ khám bệnh của bệnh nhân này
  const loadBooklet = async () => {
    if (!patientId) return;
    try {
      setLoading(true);
      setError(null);
      const res = await patientService.getBookletById(patientId) as any;
      if (res.success && res.data) {
        setBooklet(res.data);
      } else {
        setError(res.message || "Không thể lấy sổ khám bệnh của bệnh nhân.");
      }
    } catch (err: any) {
      console.error("Lỗi lấy sổ y tế:", err);
      setError(err.response?.data?.message || "Lỗi kết nối máy chủ khi lấy sổ khám bệnh.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBooklet();
  }, [patientId]);

  // Xem chi tiết trang sổ & tải dữ liệu cảm biến thô
  const handleOpenPageDetail = async (pageId: number) => {
    setSelectedPageId(pageId);
    setLoadingPage(true);
    setSaveSuccess(false);
    try {
      const res = await patientService.getBookletPage(pageId) as any;
      if (res.success && res.data) {
        setSelectedPage(res.data);
        setDoctorNotes(res.data.doctor_notes || "");
      }
    } catch (err) {
      console.error("Lỗi chi tiết trang sổ:", err);
    } finally {
      setLoadingPage(false);
    }
  };

  const handleClosePageDetail = () => {
    setSelectedPageId(null);
    setSelectedPage(null);
    setDoctorNotes("");
  };

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
        setTimeout(() => setSaveSuccess(false), 3000);
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

  // Tính toán vẽ biểu đồ SVG cảm biến
  const getSvgPoints = (key: 'force_left' | 'force_right') => {
    if (!selectedPage || !selectedPage.sensor_data || selectedPage.sensor_data.length === 0) return "";

    const data = selectedPage.sensor_data;
    const maxVal = Math.max(
      12,
      ...data.map((d: any) => Math.max(d.force_left || 0, d.force_right || 0))
    );

    return data.map((d: any, i: number) => {
      const x = (i / (data.length - 1)) * 420;
      const val = d[key] || 0;
      const y = 110 - (val / maxVal) * 90;
      return `${x},${y}`;
    }).join(" ");
  };

  if (!patientId) {
    return (
      <div className="w-full h-full flex items-center justify-center text-slate-500 text-sm">
        <p>⚠️ Không tìm thấy ID bệnh nhân. Vui lòng thử lại từ danh sách.</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col gap-6 text-[#0c4a6e] relative">

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shrink-0">
        <div>
          <BackButton href={backLink} className="mb-2" />
          <h2 className="text-xl sm:text-2xl font-black">Sổ y tế điện tử</h2>
        </div>

        {/* Info badges */}
        {booklet && (
          <div className="flex flex-wrap gap-2 text-xs font-bold">
            <span className="bg-white border border-[#bae6fd] px-3 py-1.5 rounded-xl text-slate-500">
              Số sổ: <span className="font-mono text-[#0ea5e9] font-black">{booklet.booklet_number}</span>
            </span>
            {booklet.patient_info?.identity_card && (
              <span className="bg-white border border-[#bae6fd] px-3 py-1.5 rounded-xl text-slate-500">
                CCCD/CMND: <span className="font-mono text-[#0ea5e9] font-black">{booklet.patient_info.identity_card}</span>
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
      <div className="flex-1 bg-white rounded-3xl border border-[#bae6fd] p-5 sm:p-6 shadow-sm flex flex-col min-h-[400px]">
        {loading ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-2 text-slate-400">
            <svg className="w-8 h-8 animate-spin text-[#0ea5e9]" fill="none" viewBox="0 0 24 24">
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
                <tr className="border-b border-[#bae6fd] text-[#0c4a6e]/50 font-bold uppercase tracking-wider text-[10px] sm:text-xs">
                  <th className="py-3 px-4">Ngày bắt đầu</th>
                  <th className="py-3 px-4">Thời gian</th>
                  <th className="py-3 px-4">Quãng đường</th>
                  <th className="py-3 px-4">Lực tỳ (Trái/Phải)</th>
                  <th className="py-3 px-4">Trạng thái ghi chú</th>
                  <th className="py-3 px-4 text-center">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#bae6fd]/50">
                {booklet.pages.map((page: any) => {
                  const hasNotes = !!page.doctor_notes;
                  const dateStr = new Date(page.start_time).toLocaleString("vi-VN", {
                    dateStyle: "medium",
                    timeStyle: "short"
                  });

                  return (
                    <tr key={page.id} className="hover:bg-[#f0f9ff]/50 transition-colors">
                      <td className="py-4 px-4 font-bold">{dateStr}</td>
                      <td className="py-4 px-4 font-semibold text-slate-600">{formatDuration(page.duration_seconds)}</td>
                      <td className="py-4 px-4 font-semibold text-slate-600">{(page.total_distance ?? 0).toFixed(1)} m</td>
                      <td className="py-4 px-4">
                        <span className="font-mono text-xs font-bold text-[#0ea5e9]">{(page.avg_force_left ?? 0).toFixed(1)}kg</span>
                        <span className="text-slate-300 mx-1.5">•</span>
                        <span className="font-mono text-xs font-bold text-[#0c4a6e]">{(page.avg_force_right ?? 0).toFixed(1)}kg</span>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`px-2.5 py-1 rounded-md text-[10px] font-black inline-block ${hasNotes ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                          {hasNotes ? 'ĐÃ ĐÁNH GIÁ' : 'CHƯA ĐÁNH GIÁ'}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <button
                          onClick={() => handleOpenPageDetail(page.id)}
                          className="px-4 py-1.5 bg-[#f0f9ff] border border-[#bae6fd] hover:bg-[#0ea5e9] hover:text-white transition-colors text-xs font-bold rounded-lg shadow-2xs"
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
          <div className="absolute inset-0 bg-[#0c4a6e]/40 backdrop-blur-xs transition-opacity" onClick={handleClosePageDetail}></div>
          <div className="relative w-full max-w-2xl bg-white rounded-[2rem] shadow-2xl p-6 sm:p-8 z-10 max-h-[90vh] overflow-y-auto custom-scrollbar flex flex-col gap-6 border border-[#bae6fd] animate-fade-in">

            {/* Header */}
            <div className="flex justify-between items-start shrink-0 border-b border-[#0c4a6e]/10 pb-4">
              <div>
                <h3 className="text-lg sm:text-xl font-black text-[#0c4a6e]">Bệnh án điện tử - Phân tích phiên tập</h3>
                <p className="text-xs text-slate-400 font-bold mt-1 font-mono uppercase">Mã buổi tập: PAGE-{selectedPageId}</p>
              </div>
              <button onClick={handleClosePageDetail} className="text-[#0c4a6e]/50 hover:text-red-500 p-1.5 hover:bg-slate-100 rounded-full transition-all">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            {loadingPage ? (
              <div className="flex flex-col items-center justify-center py-20 gap-2 text-slate-400">
                <svg className="w-8 h-8 animate-spin text-[#0ea5e9]" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                <span className="text-xs font-bold">Đang truy vấn dữ liệu thô cảm biến...</span>
              </div>
            ) : selectedPage && (
              <div className="flex flex-col gap-6">

                {/* Details line */}
                <div className="flex flex-wrap gap-4 text-xs font-semibold text-[#0c4a6e]/70 border-b border-[#0c4a6e]/5 pb-4">
                  <span>📅 Bắt đầu: {new Date(selectedPage.start_time).toLocaleString("vi-VN")}</span>
                  {selectedPage.end_time && (
                    <span>🏁 Kết thúc: {new Date(selectedPage.end_time).toLocaleString("vi-VN")}</span>
                  )}
                  <span>🤖 Mã xe: <span className="font-mono text-[#0ea5e9]">{selectedPage.device_id || "N/A"}</span></span>
                </div>

                {/* Performance stats row */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-[#f0f9ff] border border-[#e0f2fe] p-3 rounded-2xl text-center shadow-2xs">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 leading-none">Quãng đường</p>
                    <p className="text-base sm:text-lg font-black text-[#0c4a6e]">{totalDistance.toFixed(1)} <span className="text-[10px] text-slate-400 font-black">m</span></p>
                  </div>
                  <div className="bg-[#f0f9ff] border border-[#e0f2fe] p-3 rounded-2xl text-center shadow-2xs">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 leading-none">Thời gian</p>
                    <p className="text-base sm:text-lg font-black text-[#0c4a6e]">{Math.floor(durationSeconds / 60)}m {durationSeconds % 60}s</p>
                  </div>
                  <div className="bg-[#f0f9ff] border border-[#e0f2fe] p-3 rounded-2xl text-center shadow-2xs">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 leading-none">Trung bình lực</p>
                    <p className="text-base sm:text-lg font-black text-[#0c4a6e]">{totalForce.toFixed(1)} <span className="text-[10px] text-slate-400 font-black">kg</span></p>
                  </div>
                </div>

                {/* Balance & Distribution Bar */}
                <div className="bg-[#f8fafc] border border-slate-100 rounded-2xl p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Phân bố cân bằng lực</span>
                    <span className="text-xs font-black text-[#0ea5e9]">
                      Chênh lệch: {Math.abs(leftForce - rightForce).toFixed(1)} kg
                    </span>
                  </div>
                  <div className="flex justify-between text-xs font-bold mb-3">
                    <span className="text-[#0ea5e9]">{leftForce.toFixed(1)} kg (Trái)</span>
                    <span className="text-[#0c4a6e]">{rightForce.toFixed(1)} kg (Phải)</span>
                  </div>

                  {/* Balance bar display */}
                  <div className="w-full h-2.5 bg-slate-200 rounded-full flex overflow-hidden shadow-inner">
                    {totalForce > 0 ? (
                      <>
                        <div
                          className="bg-[#0ea5e9] transition-all duration-300"
                          style={{ width: `${(leftForce / totalForce) * 100}%` }}
                        ></div>
                        <div
                          className="bg-[#0c4a6e] transition-all duration-300"
                          style={{ width: `${(rightForce / totalForce) * 100}%` }}
                        ></div>
                      </>
                    ) : (
                      <div className="w-full bg-slate-300"></div>
                    )}
                  </div>
                </div>

                {/* SVG Sensor Chart */}
                <div className="bg-white border border-[#bae6fd] rounded-2xl p-4 flex flex-col gap-3">
                  <div className="flex justify-between items-center">
                    <h4 className="text-xs font-black text-slate-700">Đồ thị biến thiên lực tay cầm (Cảm biến lực)</h4>
                    <div className="flex gap-3 text-[9px] font-bold text-slate-500">
                      <span className="flex items-center gap-1"><span className="w-2.5 h-[2px] bg-[#0ea5e9]"></span> Tay Trái</span>
                      <span className="flex items-center gap-1"><span className="w-2.5 h-[2px] bg-[#0c4a6e]"></span> Tay Phải</span>
                    </div>
                  </div>

                  {selectedPage.sensor_data && selectedPage.sensor_data.length > 0 ? (
                    <div className="h-28 w-full relative pl-6 pb-2 mt-2">
                      <div className="absolute inset-0 pl-6 pb-2 flex flex-col justify-between opacity-25 pointer-events-none text-[8px] font-bold font-mono">
                        <span>12kg</span>
                        <span>6kg</span>
                        <span>0kg</span>
                      </div>
                      <svg className="w-full h-full overflow-visible" viewBox="0 0 420 120" preserveAspectRatio="none">
                        <polyline
                          points={getSvgPoints("force_left")}
                          fill="none"
                          stroke="#0ea5e9"
                          strokeWidth="1.5"
                          vectorEffect="non-scaling-stroke"
                        />
                        <polyline
                          points={getSvgPoints("force_right")}
                          fill="none"
                          stroke="#0c4a6e"
                          strokeWidth="1.5"
                          vectorEffect="non-scaling-stroke"
                        />
                      </svg>
                    </div>
                  ) : (
                    <p className="text-xs text-gray-400 italic text-center py-6">
                      Không có thông số cảm biến thô từ xe tập đi.
                    </p>
                  )}
                </div>

                {/* Doctor Diagnostic Input Form */}
                <form onSubmit={handleSaveNotes} className="flex flex-col gap-3 mt-2">
                  <label className="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                    <svg className="w-4 h-4 text-[#0ea5e9]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                    Chẩn đoán lâm sàng & Ghi chú điều trị
                  </label>

                  <textarea
                    value={doctorNotes}
                    onChange={(e) => setDoctorNotes(e.target.value)}
                    rows={4}
                    placeholder="Vui lòng nhập đánh giá chẩn đoán y tế, chỉ định chịu lực, hoặc chỉnh sửa dáng đi cho bệnh nhân tại đây..."
                    className="w-full p-4 rounded-2xl border border-[#bae6fd] bg-[#f0f9ff]/20 text-[#0c4a6e] font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-[#0ea5e9] placeholder-slate-400 focus:bg-white transition-all shadow-2xs"
                  />

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
                      className="px-5 py-2.5 bg-[#0ea5e9] hover:bg-[#0c4a6e] text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-sm disabled:opacity-50 transition-colors"
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
