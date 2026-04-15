"use client";

import React, { useState } from 'react';
import Link from 'next/link';

export default function ExerciseSchedulePage() {
  // --- CHATBOX STATE ---
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [activeChat, setActiveChat] = useState<string | null>(null);

  // --- DATA GIẢ LẬP ---
  const dailyExercises = [
    { id: 1, name: "Tập giữ thăng bằng tại chỗ", duration: "10 phút", status: "completed", instruction: "Đứng vững, tay vịn nhẹ vào Smart Walker." },
    { id: 2, name: "Tập bước đi thẳng (Gait Training)", duration: "15 phút", status: "today", instruction: "Đi thẳng 20m, chú ý dồn lực đều 2 tay." },
    { id: 3, name: "Tập xoay người 180 độ", duration: "5 phút", status: "upcoming", instruction: "Xoay chậm, giữ trọng tâm ở giữa." }
  ];

  const contacts = [
    { id: 'bs_b', name: 'Bác sĩ Trần Văn B', role: 'Khoa PHCN', online: true, unread: 1, avatar: 'BS' },
    { id: 'support', name: 'Hỗ trợ kỹ thuật', role: 'CSKH', online: true, unread: 0, avatar: 'HT' }
  ];

  return (
    <div className="w-full h-full flex flex-col gap-4 text-[#0c4a6e] overflow-hidden relative">

      {/* 0. NÚT QUAY LẠI */}
      <Link
        href="/dashboard/patient"
        className="flex items-center gap-2 text-[#0ea5e9] hover:text-[#0c4a6e] font-bold w-fit transition-colors text-sm shrink-0"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Quay lại tổng quan
      </Link>

      {/* 1. HEADER */}
      <div className="flex justify-between items-center shrink-0">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Lộ trình tập luyện</h1>
          <p className="text-[#0c4a6e]/70 text-sm font-medium italic">Tuần 4: Giai đoạn tăng cường thăng bằng</p>
        </div>
        <div className="bg-white px-4 py-2 rounded-xl border border-[#bae6fd] shadow-sm">
          <span className="text-xs font-bold text-gray-400 uppercase">Tiến độ tuần:</span>
          <span className="ml-2 font-black text-[#0ea5e9]">65%</span>
        </div>
      </div>

      {/* 2. MAIN CONTENT (1 Màn hình) */}
      <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* CỘT TRÁI: DANH SÁCH BÀI TẬP HÔM NAY (2 Cột) */}
        <div className="lg:col-span-2 flex flex-col gap-4 min-h-0">
          <div className="bg-white rounded-2xl p-6 border border-[#bae6fd] shadow-sm flex-1 flex flex-col min-h-0">
            <h3 className="text-lg font-bold mb-4 shrink-0">Bài tập hôm nay</h3>

            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-4">
              {dailyExercises.map((ex) => (
                <div
                  key={ex.id}
                  className={`p-5 rounded-2xl border-2 transition-all ${ex.status === 'today' ? 'border-[#0ea5e9] bg-[#f0f9ff]' : 'border-gray-100 opacity-60'
                    }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${ex.status === 'completed' ? 'bg-emerald-100 text-emerald-600' : 'bg-[#0ea5e9] text-white'}`}>
                        {ex.status === 'completed' ? (
                          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                        ) : <span className="font-bold">{ex.id}</span>}
                      </div>
                      <h4 className="font-black text-lg">{ex.name}</h4>
                    </div>
                    <span className="text-sm font-bold bg-white px-3 py-1 rounded-lg shadow-sm">{ex.duration}</span>
                  </div>
                  <p className="text-sm text-gray-500 ml-13 pl-1">{ex.instruction}</p>

                  {ex.status === 'today' && (
                    <button className="mt-4 ml-13 w-full sm:w-auto px-6 py-2 bg-[#0c4a6e] text-white font-bold rounded-xl hover:bg-[#0ea5e9] transition-colors">
                      Bắt đầu ngay
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CỘT PHẢI: TIẾN ĐỘ & HUY HIỆU (1 Cột) */}
        <div className="flex flex-col gap-4 min-h-0">

          {/* Lịch tập tóm gọn */}
          <div className="bg-white rounded-2xl p-5 border border-[#bae6fd] shadow-sm shrink-0">
            <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-4">Lịch tuần này</h3>
            <div className="flex justify-between">
              {['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map((day, i) => (
                <div key={day} className="flex flex-col items-center gap-2">
                  <span className="text-[10px] font-bold text-gray-400">{day}</span>
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${i === 4 ? 'bg-[#0ea5e9] text-white' : i < 4 ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-50 text-gray-300'
                    }`}>
                    {i < 4 ? '✓' : i + 12}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Huy hiệu */}
          <div className="bg-[#0c4a6e] rounded-2xl p-6 text-white flex-1 min-h-0 flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mb-4 border-2 border-[#0ea5e9] animate-bounce">
              <svg className="w-12 h-12 text-[#0ea5e9]" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" /></svg>
            </div>
            <h3 className="text-lg font-bold">Chiến binh bền bỉ</h3>
            <p className="text-xs text-[#f0f9ff]/60 mt-2 leading-relaxed">Bạn chỉ còn 2 buổi tập nữa để nhận huy hiệu "Kỷ luật thép". Cố gắng lên!</p>
          </div>

        </div>
      </div>

      {/* ========================================================= */}
      {/* FLOATING CHATBOX (Facebook Style) */}
      {/* ========================================================= */}
      <div className="fixed bottom-6 right-8 z-50 flex flex-col items-end">
        {/* Cửa sổ Chat */}
        <div className={`transition-all duration-300 origin-bottom-right ease-out ${isChatOpen ? 'scale-100 opacity-100 mb-4' : 'scale-0 opacity-0 h-0 w-0 m-0 pointer-events-none'}`}>
          <div className="w-[340px] h-[480px] bg-white rounded-2xl shadow-2xl border border-[#bae6fd] flex flex-col overflow-hidden">

            {activeChat === null ? (
              <div className="flex-1 flex flex-col h-full bg-white">
                <div className="bg-[#0c4a6e] p-4 flex justify-between items-center text-white">
                  <h3 className="font-bold text-lg">Tin nhắn</h3>
                  <button onClick={() => setIsChatOpen(false)} className="p-1 hover:bg-white/20 rounded-full transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto">
                  {contacts.map((c) => (
                    <div key={c.id} onClick={() => setActiveChat(c.id)} className="flex items-center gap-3 p-4 hover:bg-[#f0f9ff] cursor-pointer transition-colors border-b border-gray-50">
                      <div className="relative">
                        <div className="w-12 h-12 bg-[#e0f2fe] text-[#0ea5e9] rounded-full flex items-center justify-center font-black">{c.avatar}</div>
                        {c.online && <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-white rounded-full"></span>}
                      </div>
                      <div className="flex-1"><p className="text-sm font-bold text-[#0c4a6e]">{c.name}</p><p className="text-xs text-gray-500">{c.role}</p></div>
                      {c.unread > 0 && <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-[10px] font-bold">{c.unread}</div>}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col h-full bg-[#f8fafc]">
                <div className="bg-gradient-to-r from-[#0c4a6e] to-[#0ea5e9] p-3 flex justify-between items-center text-white">
                  <div className="flex items-center gap-2">
                    <button onClick={() => setActiveChat(null)} className="p-1.5 hover:bg-white/20 rounded-full transition-colors"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" /></svg></button>
                    <p className="font-bold text-sm">Bác sĩ Trần Văn B</p>
                  </div>
                  <button onClick={() => setIsChatOpen(false)} className="p-1.5 hover:bg-white/20 rounded-full transition-colors"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg></button>
                </div>
                <div className="flex-1 p-4 overflow-y-auto text-xs text-gray-400 text-center">Bắt đầu trò chuyện...</div>
                <div className="p-3 bg-white border-t border-gray-100 flex items-center gap-2">
                  <input type="text" placeholder="Nhập tin nhắn..." className="flex-1 bg-gray-100 text-sm px-4 py-2 rounded-full outline-none" />
                  <button className="text-[#0ea5e9]"><svg className="w-5 h-5 transform rotate-90" fill="currentColor" viewBox="0 0 20 20"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" /></svg></button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* FAB Button */}
        <button onClick={() => setIsChatOpen(!isChatOpen)} className={`relative w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all ${isChatOpen ? 'bg-white text-gray-400' : 'bg-[#0ea5e9] text-white'}`}>
          {isChatOpen ? <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg> : <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 20 20"><path d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" /></svg>}
          {!isChatOpen && <span className="absolute top-0 right-0 flex h-4 w-4"><span className="animate-ping absolute h-full w-full rounded-full bg-red-400 opacity-75"></span><span className="relative rounded-full h-4 w-4 bg-red-500 border-2 border-white text-[8px] flex items-center justify-center">1</span></span>}
        </button>
      </div>

    </div>
  );
}