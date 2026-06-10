// src/components/patient/training-history.tsx

import React from 'react';

interface BookletPage {
  id: number;
  start_time: string;
  duration_seconds: number;
  avg_force_left: number;
  avg_force_right: number;
  doctor_notes?: string;
  total_distance: number;
}

interface TrainingHistoryProps {
  pages: BookletPage[];
  searchQuery: string;
  onSearchChange: (val: string) => void;
  onSelectPage: (id: number) => void;
  loading: boolean;
}

export function TrainingHistory({
  pages,
  searchQuery,
  onSearchChange,
  onSelectPage,
  loading
}: TrainingHistoryProps) {
  
  const formatDuration = (totalSeconds: number | null) => {
    if (!totalSeconds) return "0 giây";
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    if (mins > 0) {
      return `${mins} phút ${secs > 0 ? `${secs} giây` : ""}`;
    }
    return `${secs} giây`;
  };

  const filteredPages = pages.filter((page) => {
    if (!searchQuery) return true;
    const dateObj = new Date(page.start_time);
    const day = String(dateObj.getDate()).padStart(2, '0');
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const year = dateObj.getFullYear();
    const formattedDate = `${day}/${month}/${year}`;
    return formattedDate.includes(searchQuery.trim());
  });

  return (
    <div className="flex-grow min-h-0 bg-white rounded-2xl p-5 sm:p-6 border border-[#bae6fd] shadow-sm flex flex-col">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6 shrink-0">
        <h3 className="text-lg font-bold">Sổ y tế điện tử - Lịch sử tập luyện</h3>
        
        <div className="flex flex-wrap items-center gap-3">
          {/* Thanh tìm kiếm theo ngày */}
          <div className="bg-slate-100 rounded-xl flex items-center px-3 py-1.5 text-gray-500 border border-slate-200">
            <svg className="w-4 h-4 mr-2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Tìm theo ngày (DD/MM/YYYY)..." 
              className="bg-transparent border-none outline-none w-48 text-xs font-semibold placeholder-slate-400" 
            />
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar max-h-[340px] flex flex-col gap-4">
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
        ) : filteredPages.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center text-gray-400 gap-3 border border-dashed border-[#bae6fd] rounded-2xl">
            <svg className="w-8 h-8 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <p className="text-xs font-semibold">Không tìm thấy phiên tập nào trùng khớp ngày đã chọn.</p>
          </div>
        ) : (
          filteredPages.map((page) => {
            const left = page.avg_force_left || 0;
            const right = page.avg_force_right || 0;
            const total = left + right;
            const stability = total > 0 ? Math.round(100 - (Math.abs(left - right) / total) * 100) : 100;
            
            const dateObj = new Date(page.start_time);
            const day = String(dateObj.getDate()).padStart(2, '0');
            const month = String(dateObj.getMonth() + 1).padStart(2, '0');
            const year = dateObj.getFullYear();
            const hours = String(dateObj.getHours()).padStart(2, '0');
            const minutes = String(dateObj.getMinutes()).padStart(2, '0');
            const weekday = dateObj.toLocaleDateString("vi-VN", { weekday: "long" });
            const dateStr = `${weekday}, ${day}/${month}/${year} lúc ${hours}:${minutes}`;

            return (
              <div 
                key={page.id} 
                onClick={() => onSelectPage(page.id)}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-[#f0f9ff] border border-[#e0f2fe] hover:border-[#bae6fd] hover:bg-[#bae6fd]/15 transition-all cursor-pointer shadow-xs"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-base sm:text-lg font-black ${stability >= 80 ? 'bg-emerald-100 text-emerald-600' : 'bg-orange-100 text-orange-600'} shrink-0`}>
                    {stability}
                  </div>
                  <div>
                    <p className="font-bold text-sm sm:text-base text-[#0c4a6e] capitalize">{dateStr}</p>
                    <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                      Ghi chú bác sĩ: <span className="text-slate-700 font-semibold">{page.doctor_notes || "Chưa có nhận xét"}</span> <br className="hidden sm:inline" /> • Thời gian tập: {formatDuration(page.duration_seconds)}
                    </p>
                  </div>
                </div>
                <div className="text-left sm:text-right pl-15 sm:pl-0 flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 shrink-0">
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
  );
}
