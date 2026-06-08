"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { patientService } from '@/services/patientService';
import { useAuth } from '@/lib/auth-context';

export function PatientOverviewView() {
  const { user } = useAuth();
  
  // Trạng thái mở/đóng toàn bộ Chatbox
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Trạng thái xem đang chat với ai (null = đang ở Danh sách liên hệ)
  const [activeChat, setActiveChat] = useState<string | null>(null);

  // Sổ sức khỏe & Trạng thái tải
  const [booklet, setBooklet] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Modal xem chi tiết trang sổ / phiên tập
  const [selectedPageId, setSelectedPageId] = useState<number | null>(null);
  const [selectedPage, setSelectedPage] = useState<any>(null);
  const [loadingPage, setLoadingPage] = useState(false);

  const leftForce = selectedPage?.avg_force_left ?? 0;
  const rightForce = selectedPage?.avg_force_right ?? 0;
  const totalForce = leftForce + rightForce;
  const totalDistance = selectedPage?.total_distance ?? 0;
  const durationSeconds = selectedPage?.duration_seconds ?? 0;

  // Tải dữ liệu Sổ y bạ của bệnh nhân
  useEffect(() => {
    const fetchBooklet = async () => {
      try {
        setLoading(true);
        const response = await patientService.getBooklet() as any;
        if (response.success && response.data) {
          setBooklet(response.data);
        }
      } catch (err) {
        console.error("Lỗi khi tải sổ sức khỏe:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBooklet();
  }, []);

  // Mở modal chi tiết trang sổ
  const handleOpenPageDetail = async (pageId: number) => {
    setSelectedPageId(pageId);
    setLoadingPage(true);
    try {
      const response = await patientService.getBookletPage(pageId) as any;
      if (response.success && response.data) {
        setSelectedPage(response.data);
      }
    } catch (err) {
      console.error("Lỗi khi tải chi tiết phiên tập:", err);
    } finally {
      setLoadingPage(false);
    }
  };

  const handleClosePageDetail = () => {
    setSelectedPageId(null);
    setSelectedPage(null);
  };

  // Tính toán chỉ số tổng quan từ các trang sổ
  const pages = booklet?.pages || [];
  const totalWorkouts = pages.length;

  // Tính quãng đường trung bình và độ ổn định trung bình
  const calculatedStats = (() => {
    if (pages.length === 0) {
      return { streak: 0, totalWorkouts: 0, avgStability: 100, totalDistance: 0 };
    }

    let totalStability = 0;
    let validStabilityCount = 0;
    let totalDist = 0;

    pages.forEach((p: any) => {
      totalDist += p.total_distance || 0;
      const left = p.avg_force_left || 0;
      const right = p.avg_force_right || 0;
      const totalForce = left + right;

      if (totalForce > 0) {
        // Độ ổn định tỉ lệ nghịch với độ lệch giữa hai bên
        const diff = Math.abs(left - right);
        const stability = Math.round(100 - (diff / totalForce) * 100);
        totalStability += stability;
        validStabilityCount++;
      }
    });

    return {
      streak: 5, // streak giả lập
      totalWorkouts: pages.length,
      avgStability: validStabilityCount > 0 ? Math.round(totalStability / validStabilityCount) : 100,
      totalDistance: Math.round(totalDist * 10) / 10
    };
  })();

  const formatDuration = (totalSeconds: number | null) => {
    if (!totalSeconds) return "0 giây";
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    if (mins > 0) {
      return `${mins} phút ${secs > 0 ? `${secs} giây` : ""}`;
    }
    return `${secs} giây`;
  };

  // Danh sách liên hệ giả lập
  const contacts = [
    { id: 'bs_b', name: 'Bác sĩ Trần Văn B', role: 'Khoa Phục hồi chức năng', online: true, unread: 1, avatar: 'BS' },
    { id: 'bs_c', name: 'Bác sĩ Lê Thị C', role: 'Khoa Cơ xương khớp', online: false, unread: 0, avatar: 'LC' },
    { id: 'support', name: 'Hỗ trợ kỹ thuật', role: 'CSKH', online: true, unread: 0, avatar: 'HT' }
  ];

  // Tính tổng tin nhắn chưa đọc để hiện chấm đỏ ngoài nút chính
  const totalUnread = contacts.reduce((sum, contact) => sum + contact.unread, 0);

  // Lấy thông tin người đang chat hiện tại
  const currentContact = contacts.find(c => c.id === activeChat);

  // Hàm xử lý đóng chat
  const handleCloseChat = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsChatOpen(false);
  };

  // Tính toán biểu đồ SVG nếu có chi tiết trang sổ
  const getSvgPoints = (key: 'force_left' | 'force_right') => {
    if (!selectedPage || !selectedPage.sensor_data || selectedPage.sensor_data.length === 0) return "";
    
    const data = selectedPage.sensor_data;
    const maxVal = Math.max(
      12,
      ...data.map((d: any) => Math.max(d.force_left || 0, d.force_right || 0))
    );

    return data.map((d: any, i: number) => {
      const x = (i / (data.length - 1)) * 400;
      const val = d[key] || 0;
      const y = 110 - (val / maxVal) * 90; // chừa khoảng trống trên và dưới
      return `${x},${y}`;
    }).join(" ");
  };

  return (
    <div className="w-full h-full flex flex-col gap-6 text-[#0c4a6e] relative pr-0 lg:pr-2">

      {/* 1. KHỐI CHÀO MỪNG */}
      <div className="bg-gradient-to-r from-[#0c4a6e] to-[#0ea5e9] rounded-3xl p-6 sm:p-8 text-white shadow-lg flex flex-col md:flex-row justify-between items-center gap-6 shrink-0 text-center md:text-left">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl sm:text-3xl font-bold">Chào buổi sáng, {user?.full_name || booklet?.patient_info?.full_name || "Bệnh nhân"}! 👋</h1>
          <p className="text-[#f0f9ff]/80 font-medium text-sm sm:text-base">
            Bạn đã giữ vững phong độ tập luyện <span className="font-bold text-white bg-white/20 px-2 py-0.5 rounded-md">{calculatedStats.streak} ngày liên tiếp</span>. Hãy tiếp tục phát huy nhé!
          </p>
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-2 text-xs sm:text-sm font-semibold">
            <span className="bg-white/10 px-3.5 py-1.5 rounded-xl border border-white/20 flex items-center gap-1.5">
              📁 Mã số sổ y tế: <span className="font-mono font-black">{booklet?.booklet_number || "Đang tải..."}</span>
            </span>
            {booklet?.patient_info?.identity_card && (
              <span className="bg-white/10 px-3.5 py-1.5 rounded-xl border border-white/20 flex items-center gap-1.5">
                🪪 CCCD/CMND: <span className="font-mono font-black">{booklet.patient_info.identity_card}</span>
              </span>
            )}
          </div>
        </div>
        <Link href="/dashboard/patient/progress" className="px-6 py-3 sm:px-8 sm:py-3 bg-white text-[#0c4a6e] font-black rounded-xl shadow-md hover:scale-105 transition-transform flex items-center justify-center gap-2 shrink-0 text-sm sm:text-base w-full md:w-auto">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          BẮT ĐẦU BÀI TẬP
        </Link>
      </div>

      {/* 2. CHỈ SỐ TÓM TẮT */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 shrink-0">
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#bae6fd] shadow-sm flex items-center gap-5 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
            <svg className="w-6 h-6 sm:w-7 sm:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <div>
            <h3 className="text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-widest leading-tight">Độ ổn định trung bình</h3>
            <div className="flex items-end gap-1 mt-1">
              <span className="text-2xl sm:text-3xl font-black text-[#0c4a6e]">{calculatedStats.avgStability}</span>
              <span className="text-xs sm:text-sm font-bold text-gray-400 pb-0.5">/100</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#bae6fd] shadow-sm flex items-center gap-5 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#e0f2fe] flex items-center justify-center text-[#0ea5e9] shrink-0">
            <svg className="w-6 h-6 sm:w-7 sm:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
          </div>
          <div>
            <h3 className="text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-widest leading-tight">Tổng số buổi đã tập</h3>
            <div className="flex items-end gap-1 mt-1">
              <span className="text-2xl sm:text-3xl font-black text-[#0c4a6e]">{calculatedStats.totalWorkouts}</span>
              <span className="text-xs sm:text-sm font-bold text-gray-400 pb-0.5">buổi</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#bae6fd] shadow-sm flex items-center gap-5 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 shrink-0">
            <svg className="w-6 h-6 sm:w-7 sm:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <div>
            <h3 className="text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-widest leading-tight">Tổng quãng đường</h3>
            <div className="flex items-end gap-1 mt-1">
              <span className="text-2xl sm:text-3xl font-black text-[#0c4a6e]">{calculatedStats.totalDistance}</span>
              <span className="text-xs sm:text-sm font-bold text-gray-400 pb-0.5">mét</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. HOẠT ĐỘNG GẦN NHẤT */}
      <div className="flex-1 min-h-0 bg-white rounded-2xl p-5 sm:p-6 border border-[#bae6fd] shadow-sm flex flex-col">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-6 shrink-0">
          <h3 className="text-lg font-bold">Sổ y tế điện tử - Lịch sử tập luyện</h3>
          <Link href="/dashboard/patient/progress" className="text-sm font-bold text-[#0ea5e9] hover:underline">Xem lịch tập chi tiết</Link>
        </div>

        <div className="flex flex-col gap-4 overflow-y-auto pr-2 custom-scrollbar">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 gap-2 text-slate-400">
              <svg className="w-8 h-8 animate-spin text-[#0ea5e9]" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              <span className="text-xs font-semibold">Đang tải lịch sử từ sổ khám bệnh...</span>
            </div>
          ) : pages.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center text-gray-400 gap-3 border border-dashed border-[#bae6fd] rounded-2xl">
              <svg className="w-10 h-10 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-sm font-semibold">Chưa ghi nhận phiên tập luyện nào trong Sổ y tế.</p>
            </div>
          ) : (
            pages.map((page: any, index: number) => {
              const left = page.avg_force_left || 0;
              const right = page.avg_force_right || 0;
              const total = left + right;
              const stability = total > 0 ? Math.round(100 - (Math.abs(left - right) / total) * 100) : 100;
              
              const dateStr = new Date(page.start_time).toLocaleString("vi-VN", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit"
              });

              return (
                <div 
                  key={page.id} 
                  onClick={() => handleOpenPageDetail(page.id)}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-[#f0f9ff] border border-[#e0f2fe] hover:border-[#bae6fd] hover:bg-[#bae6fd]/15 transition-all cursor-pointer shadow-xs"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-base sm:text-lg font-black ${stability >= 80 ? 'bg-emerald-100 text-emerald-600' : 'bg-orange-100 text-orange-600'} shrink-0`}>
                      {stability}
                    </div>
                    <div>
                      <p className="font-bold text-sm sm:text-base text-[#0c4a6e] capitalize">{dateStr}</p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Thiết bị: <span className="font-mono text-[#0ea5e9]">{page.device_id || "Không gán"}</span> • Thời gian: {formatDuration(page.duration_seconds)}
                      </p>
                    </div>
                  </div>
                  <div className="text-left sm:text-right pl-15 sm:pl-0 flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2">
                    <span className="text-xs text-slate-400 font-bold">Dự lệch: {Math.abs(left - right).toFixed(1)} kg</span>
                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${stability >= 85 ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'bg-orange-50 text-orange-600 border border-orange-200'}`}>
                      {stability >= 85 ? "Ổn định tốt" : "Lệch lực tỳ"}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* DETAILED BOOKLET PAGE MODAL */}
      {selectedPageId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-[#0c4a6e]/40 backdrop-blur-xs transition-opacity" onClick={handleClosePageDetail}></div>
          <div className="relative w-full max-w-xl bg-white rounded-[2rem] shadow-2xl p-6 sm:p-8 z-10 max-h-[90vh] overflow-y-auto custom-scrollbar flex flex-col gap-6 animate-fade-in border border-[#bae6fd]">
            
            {/* Modal Header */}
            <div className="flex justify-between items-start shrink-0 border-b border-[#0c4a6e]/10 pb-4">
              <div>
                <h3 className="text-lg sm:text-xl font-black text-[#0c4a6e]">Chi tiết phiên tập phục hồi</h3>
                <p className="text-xs text-slate-400 font-bold mt-1 uppercase tracking-wider font-mono">
                  Mã phiên: PAGE-{selectedPageId}
                </p>
              </div>
              <button onClick={handleClosePageDetail} className="text-[#0c4a6e]/50 hover:text-red-500 p-1.5 hover:bg-slate-100 rounded-full transition-all">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {loadingPage ? (
              <div className="flex flex-col items-center justify-center py-20 gap-2 text-slate-400">
                <svg className="w-8 h-8 animate-spin text-[#0ea5e9]" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                <span className="text-xs font-semibold">Đang truy xuất thông số từ thiết bị...</span>
              </div>
            ) : selectedPage && (
                <div className="flex flex-col gap-6">
                  
                  {/* Time & Device Info */}
                  <div className="flex flex-wrap gap-4 text-xs font-semibold text-[#0c4a6e]/70 border-b border-[#0c4a6e]/5 pb-4">
                    <span>📅 Bắt đầu: {new Date(selectedPage.start_time).toLocaleString("vi-VN")}</span>
                    {selectedPage.end_time && (
                      <span>🏁 Kết thúc: {new Date(selectedPage.end_time).toLocaleString("vi-VN")}</span>
                    )}
                    <span>🤖 Thiết bị: <span className="font-mono text-[#0ea5e9]">{selectedPage.device_id || "Không gán"}</span></span>
                  </div>

                  {/* Metric Summary Grid */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-[#f0f9ff] border border-[#e0f2fe] p-3 rounded-2xl flex flex-col items-center text-center shadow-xs">
                      <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1 leading-none">Quãng đường</span>
                      <span className="text-base sm:text-lg font-black text-[#0c4a6e]">
                        {totalDistance.toFixed(1)} <span className="text-[10px] text-slate-400 font-bold">m</span>
                      </span>
                    </div>
                    <div className="bg-[#f0f9ff] border border-[#e0f2fe] p-3 rounded-2xl flex flex-col items-center text-center shadow-xs">
                      <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1 leading-none">Thời gian</span>
                      <span className="text-base sm:text-lg font-black text-[#0c4a6e]">
                        {Math.floor(durationSeconds / 60)}m {durationSeconds % 60}s
                      </span>
                    </div>
                    <div className="bg-[#f0f9ff] border border-[#e0f2fe] p-3 rounded-2xl flex flex-col items-center text-center shadow-xs">
                      <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1 leading-none">Tổng lực tỳ</span>
                      <span className="text-base sm:text-lg font-black text-[#0c4a6e]">
                        {totalForce.toFixed(1)} <span className="text-[10px] text-slate-400 font-bold">kg</span>
                      </span>
                    </div>
                  </div>

                  {/* Balance & Distribution Bar */}
                  <div className="bg-[#f8fafc] border border-slate-100 rounded-2xl p-4">
                    <div className="flex justify-between text-xs font-black mb-2">
                      <span className="text-[#0ea5e9]">Trái: {leftForce.toFixed(1)} kg</span>
                      <span className="text-[#0c4a6e]">Phải: {rightForce.toFixed(1)} kg</span>
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
                    <p className="text-[9px] text-gray-400 text-center font-bold tracking-wider uppercase mt-2">
                      Cân đối hai bên chịu lực
                    </p>
                  </div>

                {/* SVG Sensor Chart */}
                <div className="bg-white border border-[#bae6fd] rounded-2xl p-4 flex flex-col gap-3">
                  <div className="flex justify-between items-center">
                    <h4 className="text-xs font-black text-slate-700">Biểu đồ lực tỳ cảm biến thời gian thực</h4>
                    <div className="flex gap-3 text-[9px] font-bold text-slate-500">
                      <span className="flex items-center gap-1"><span className="w-2.5 h-[2px] bg-[#0ea5e9]"></span> Trái</span>
                      <span className="flex items-center gap-1"><span className="w-2.5 h-[2px] bg-[#0c4a6e]"></span> Phải</span>
                    </div>
                  </div>
                  
                  {selectedPage.sensor_data && selectedPage.sensor_data.length > 0 ? (
                    <div className="h-28 w-full relative pl-6 pb-2 mt-2">
                      {/* Grid overlay */}
                      <div className="absolute inset-0 pl-6 pb-2 flex flex-col justify-between opacity-25 pointer-events-none text-[8px] font-bold font-mono">
                        <span>12kg</span>
                        <span>6kg</span>
                        <span>0kg</span>
                      </div>
                      
                      {/* SVG line */}
                      <svg className="w-full h-full overflow-visible" viewBox="0 0 400 120" preserveAspectRatio="none">
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
                      Không có thông số cảm biến chi tiết được ghi lại cho phiên này.
                    </p>
                  )}
                </div>

                {/* Medical Assessment Note */}
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-xs font-medium leading-relaxed">
                  <div className="flex items-center gap-1.5 text-amber-700 font-extrabold mb-1.5">
                    <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                    </svg>
                    CHẨN ĐOÁN LÂM SÀNG CỦA BÁC SĨ PHỤ TRÁCH
                  </div>
                  <p className="text-slate-600 bg-white/65 p-3 rounded-xl border border-amber-200/50 min-h-[50px] shadow-2xs font-semibold">
                    {selectedPage.doctor_notes || "Chưa ghi nhận đánh giá lâm sàng cho phiên này. Bác sĩ điều trị có thể cập nhật nhận xét từ trang quản lý."}
                  </p>
                </div>

              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 4. FACEBOOK-STYLE FLOATING CHATBOX */}
      {/* ========================================================= */}
      <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-8 z-45 flex flex-col items-end">

        {/* Cửa sổ Chat */}
        <div
          className={`transition-all duration-300 origin-bottom-right ease-out ${isChatOpen ? 'scale-100 opacity-100 mb-4' : 'scale-0 opacity-0 h-0 w-0 m-0 pointer-events-none'}`}
        >
          <div className="w-[calc(100vw-32px)] sm:w-[340px] h-[450px] sm:h-[480px] bg-white rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.15)] border border-[#bae6fd] flex flex-col overflow-hidden">

            {/* VIEW 1: DANH SÁCH LIÊN HỆ */}
            {activeChat === null ? (
              <div className="flex-1 flex flex-col h-full bg-white">
                {/* Header Danh sách */}
                <div className="bg-[#0c4a6e] p-4 flex justify-between items-center text-white shrink-0">
                  <h3 className="font-bold text-lg">Tin nhắn</h3>
                  <button onClick={handleCloseChat} className="p-1 hover:bg-white/20 rounded-full transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>

                {/* Thanh tìm kiếm */}
                <div className="p-3 border-b border-gray-100 shrink-0">
                  <div className="bg-gray-100 rounded-full flex items-center px-3 py-2 text-gray-500">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                    <input type="text" placeholder="Tìm kiếm..." className="bg-transparent border-none outline-none w-full text-sm" />
                  </div>
                </div>

                {/* Danh sách người dùng */}
                <div className="flex-1 overflow-y-auto">
                  {contacts.map((contact) => (
                    <div
                      key={contact.id}
                      onClick={() => setActiveChat(contact.id)}
                      className="flex items-center gap-3 p-3 hover:bg-[#f0f9ff] cursor-pointer transition-colors border-b border-gray-55"
                    >
                      {/* Avatar */}
                      <div className="relative shrink-0">
                        <div className="w-11 h-11 sm:w-12 sm:h-12 bg-[#e0f2fe] text-[#0ea5e9] rounded-full flex items-center justify-center font-black text-base sm:text-lg border border-[#bae6fd]">
                          {contact.avatar}
                        </div>
                        {contact.online && (
                          <span className="absolute bottom-0 right-0 w-3 h-3 sm:w-3.5 sm:h-3.5 bg-emerald-400 border-2 border-white rounded-full"></span>
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm truncate ${contact.unread > 0 ? 'font-bold text-[#0c4a6e]' : 'font-medium text-gray-700'}`}>
                          {contact.name}
                        </p>
                        <p className={`text-xs truncate ${contact.unread > 0 ? 'font-bold text-[#0ea5e9]' : 'text-gray-500'}`}>
                          {contact.role}
                        </p>
                      </div>

                      {/* Unread Badge */}
                      {contact.unread > 0 && (
                        <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-[10px] font-bold shrink-0 shadow-sm">
                          {contact.unread}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              /* VIEW 2: KHUNG CHAT CHI TIẾT */
              <div className="flex-1 flex flex-col h-full bg-[#f8fafc]">
                {/* Header Cửa sổ Chat */}
                <div className="bg-gradient-to-r from-[#0c4a6e] to-[#0ea5e9] p-3 flex justify-between items-center text-white shrink-0 shadow-sm">
                  <div className="flex items-center gap-2">
                    {/* Nút Quay lại */}
                    <button
                      onClick={() => setActiveChat(null)}
                      className="p-1.5 hover:bg-white/20 rounded-full transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" /></svg>
                    </button>
                    <div className="relative">
                      <div className="w-8.5 h-8.5 bg-white text-[#0ea5e9] rounded-full flex items-center justify-center font-black text-xs sm:text-sm shadow-inner">
                        {currentContact?.avatar}
                      </div>
                      {currentContact?.online && (
                        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 border-2 border-[#0ea5e9] rounded-full"></span>
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-xs sm:text-sm leading-tight truncate max-w-[120px] sm:max-w-none">{currentContact?.name}</p>
                      <p className="text-[9px] sm:text-[10px] text-[#e0f2fe] font-medium">{currentContact?.online ? 'Đang hoạt động' : 'Ngoại tuyến'}</p>
                    </div>
                  </div>
                  <button onClick={handleCloseChat} className="p-1.5 hover:bg-white/20 rounded-full transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>

                {/* Vùng Tin nhắn */}
                <div className="flex-1 p-3 sm:p-4 overflow-y-auto flex flex-col gap-4">
                  <div className="text-center">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Hôm nay, 08:45 AM</span>
                  </div>

                  {currentContact?.id === 'bs_b' ? (
                    <>
                      <div className="flex items-end gap-2 max-w-[85%]">
                        <div className="w-7 h-7 rounded-full bg-[#0c4a6e] flex items-center justify-center text-white text-[10px] font-bold shrink-0">{currentContact?.avatar}</div>
                        <div className="bg-[#e0f2fe] border border-[#bae6fd] text-[#0c4a6e] text-[12px] sm:text-[13px] p-2.5 sm:p-3 rounded-2xl rounded-bl-sm shadow-sm leading-relaxed">
                          Chào anh A, kết quả phân tích dáng đi tuần này cho thấy anh đang dồn lực hơi nhiều sang tay phải. <br /><br />
                          Trong buổi tập chiều nay, anh chú ý đứng thẳng người và cố gắng chia đều lực sang cả tay trái nhé.
                        </div>
                      </div>
                      <div className="flex items-end gap-2 max-w-[85%] self-end">
                        <div className="bg-[#0ea5e9] text-white text-[12px] sm:text-[13px] p-2.5 sm:p-3 rounded-2xl rounded-br-sm shadow-sm leading-relaxed">
                          Vâng thưa bác sĩ, tôi sẽ chú ý hơn vào buổi tập chiều nay ạ!
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-center text-gray-400">
                      <svg className="w-10 h-10 mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                      <p className="text-xs">Bắt đầu cuộc trò chuyện với<br /><span className="font-bold">{currentContact?.name}</span></p>
                    </div>
                  )}
                </div>

                {/* Input nhập tin nhắn */}
                <div className="p-3 bg-white border-t border-gray-100 flex items-center gap-2">
                  <button className="text-[#0ea5e9] hover:bg-[#f0f9ff] p-1.5 rounded-full transition-colors shrink-0">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg>
                  </button>
                  <input
                    type="text"
                    placeholder="Nhập tin nhắn..."
                    className="flex-1 bg-gray-100 text-xs sm:text-sm px-4 py-2 rounded-full outline-none focus:ring-2 focus:ring-[#0ea5e9]/30 transition-all min-w-0"
                  />
                  <button className="text-[#0ea5e9] hover:bg-[#f0f9ff] p-1.5 rounded-full transition-colors shrink-0">
                    <svg className="w-5 h-5 transform rotate-90" fill="currentColor" viewBox="0 0 20 20"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" /></svg>
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Nút FAB (Icon Tin nhắn) */}
        <button
          onClick={() => setIsChatOpen(!isChatOpen)}
          className={`relative w-12 h-12 sm:w-14 sm:h-14 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 z-45 ${isChatOpen ? 'bg-white text-gray-400 border border-gray-200' : 'bg-[#0ea5e9] text-white hover:bg-[#0c4a6e]'}`}
        >
          {isChatOpen ? (
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
          ) : (
            <svg className="w-6 h-6 sm:w-7 sm:h-7" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" /></svg>
          )}

          {/* Chấm đỏ thông báo */}
          {!isChatOpen && totalUnread > 0 && (
            <span className="absolute top-0 right-0 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 border-2 border-white flex items-center justify-center text-[8px] font-bold text-white">
                {totalUnread}
              </span>
            </span>
          )}
        </button>
      </div>

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in {
          animation: fadeIn 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
}
