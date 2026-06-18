// src/sections/patient/view/patient-progress-view.tsx

"use client";

import React from 'react';
import dynamic from 'next/dynamic';
import { BackButton } from '@/components/custom/back-button';
import { useChat } from '@/hooks/useChat';
import { MOCK_DAILY_EXERCISES } from '@/config/mockData';

const Chatbox = dynamic(
  () => import('@/components/common/chatbox').then((mod) => mod.Chatbox),
  { ssr: false }
);

export function PatientProgressView() {
  const chatProps = useChat();

  const dailyExercises = MOCK_DAILY_EXERCISES;

  return (
    <div className="w-full h-full flex flex-col gap-4 text-primary-900 relative">

      {/* 0. NÚT QUAY LẠI */}
      <BackButton href="/dashboard/patient" />

      {/* 1. HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shrink-0">
        <div>
          <p className="text-primary-900/70 mt-0.5 text-sm font-medium">Theo dõi lịch sử tập luyện và tiến độ phục hồi của bạn.</p>
        </div>
        <div className="bg-white px-4 py-2 rounded-xl border border-primary-200 shadow-sm text-sm">
          <span className="text-xs font-bold text-gray-400 uppercase">Tiến độ tuần:</span>
          <span className="ml-2 font-black text-primary-500">65%</span>
        </div>
      </div>

      {/* 2. MAIN CONTENT (Responsive Layout) */}
      <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-3 gap-6 overflow-y-auto lg:overflow-hidden pr-0 lg:pr-2 custom-scrollbar">

        {/* CỘT TRÁI: DANH SÁCH BÀI TẬP HÔM NAY */}
        <div className="lg:col-span-2 flex flex-col gap-4 min-h-0">
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-primary-200 shadow-sm flex-1 flex flex-col min-h-0">
            <h3 className="text-base sm:text-lg font-bold mb-4 shrink-0">Bài tập hôm nay</h3>

            <div className="flex-1 space-y-4 lg:overflow-y-auto pr-0 lg:pr-2 custom-scrollbar">
              {dailyExercises.map((ex) => (
                <div
                  key={ex.id}
                  className={`p-4 sm:p-5 rounded-2xl border-2 transition-all ${
                    ex.status === 'today' ? 'border-primary-500 bg-primary-50' : 'border-gray-100 opacity-60'
                  }`}
                >
                  <div className="flex justify-between items-start gap-2 mb-2">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shrink-0 ${ex.status === 'completed' ? 'bg-emerald-100 text-emerald-600' : 'bg-primary-500 text-white'}`}>
                        {ex.status === 'completed' ? (
                          <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                        ) : <span className="font-bold text-sm sm:text-base">{ex.id}</span>}
                      </div>
                      <h4 className="font-black text-sm sm:text-base md:text-lg truncate">{ex.name}</h4>
                    </div>
                    <span className="text-xs sm:text-sm font-bold bg-white px-2.5 py-1 rounded-lg shadow-sm whitespace-nowrap shrink-0">{ex.duration}</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-500 pl-11 sm:pl-13">{ex.instruction}</p>

                  {ex.status === 'today' && (
                    <button className="mt-4 ml-11 sm:ml-13 w-full sm:w-auto px-6 py-2 bg-primary-900 text-white text-xs sm:text-sm font-bold rounded-xl hover:bg-primary-500 transition-colors">
                      Bắt đầu ngay
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CỘT PHẢI: TIẾN ĐỘ & HUY HIỆU */}
        <div className="flex flex-col gap-4 min-h-0 pb-4 lg:pb-0">

          {/* Lịch tập tóm gọn */}
          <div className="bg-white rounded-2xl p-5 border border-primary-200 shadow-sm shrink-0">
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Lịch tuần này</h3>
            <div className="flex justify-between gap-1 overflow-x-auto pb-1 sm:pb-0">
              {['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map((day, i) => (
                <div key={day} className="flex flex-col items-center gap-2 shrink-0">
                  <span className="text-[10px] font-bold text-slate-400">{day}</span>
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${
                    i === 4 ? 'bg-primary-500 text-white' : i < 4 ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-50 text-slate-300'
                  }`}>
                    {i < 4 ? '✓' : i + 12}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Huy hiệu */}
          <div className="bg-primary-900 rounded-2xl p-6 text-white flex-1 min-h-[220px] lg:min-h-0 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/10 rounded-full flex items-center justify-center mb-4 border-2 border-primary-500 animate-bounce">
              <svg className="w-10 h-10 sm:w-12 sm:h-12 text-primary-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" /></svg>
            </div>
            <h3 className="text-base sm:text-lg font-bold">Chiến binh bền bỉ</h3>
            <p className="text-xs text-primary-50/60 mt-2 leading-relaxed">Bạn chỉ còn 2 buổi tập nữa để nhận huy hiệu "Kỷ luật thép". Cố gắng lên!</p>
          </div>

        </div>
      </div>

      {/* FLOATING CHATBOX */}
      <Chatbox {...chatProps} />

    </div>
  );
}
