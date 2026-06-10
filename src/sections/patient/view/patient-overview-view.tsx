// src/sections/patient/view/patient-overview-view.tsx

"use client";

import React, { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { usePatientBooklet } from '@/hooks/usePatientBooklet';
import { useChat } from '@/hooks/useChat';
import { MOCK_PATIENT_STATS } from '@/config/mockData';
import { MetricCard } from '@/components/common/metric-card';
import { WelcomeBanner } from '@/components/patient/welcome-banner';
import { TrainingHistory } from '@/components/patient/training-history';
import { SessionModal } from '@/components/patient/session-modal';
import { Chatbox } from '@/components/common/chatbox';

export function PatientOverviewView() {
  const { user } = useAuth();
  
  const {
    booklet,
    loading,
    selectedPageId,
    selectedPage,
    loadingPage,
    handleOpenPageDetail,
    handleClosePageDetail,
  } = usePatientBooklet();

  const {
    isChatOpen,
    setIsChatOpen,
    activeChat,
    setActiveChat,
    contacts,
    currentContact,
    totalUnread,
    handleCloseChat,
  } = useChat();

  const [searchDateQuery, setSearchDateQuery] = useState("");

  const pages = booklet?.pages || [];

  const calculatedStats = (() => {
    if (pages.length === 0) {
      return { streak: MOCK_PATIENT_STATS.defaultStreak, totalWorkouts: 0, avgStability: 100, totalDistance: 0 };
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
        const diff = Math.abs(left - right);
        const stability = Math.round(100 - (diff / totalForce) * 100);
        totalStability += stability;
        validStabilityCount++;
      }
    });

    return {
      streak: MOCK_PATIENT_STATS.defaultStreak,
      totalWorkouts: pages.length,
      avgStability: validStabilityCount > 0 ? Math.round(totalStability / validStabilityCount) : 100,
      totalDistance: Math.round(totalDist * 10) / 10
    };
  })();

  return (
    <div className="w-full h-full flex flex-col gap-6 text-[#0c4a6e] relative pr-0 lg:pr-2">
      
      {/* 1. KHỐI CHÀO MỪNG */}
      <WelcomeBanner
        userName={user?.full_name || booklet?.patient_info?.full_name || "Bệnh nhân"}
        streak={calculatedStats.streak}
        bookletNumber={booklet?.booklet_number || "Đang tải..."}
        identityCard={booklet?.patient_info?.identity_card}
      />

      {/* 2. CHỈ SỐ TÓM TẮT */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 shrink-0">
        <MetricCard
          title="Độ ổn định trung bình"
          value={calculatedStats.avgStability}
          unit="/100"
          icon={<svg className="w-6 h-6 sm:w-7 sm:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
          iconBgColor="bg-emerald-100 text-emerald-600"
        />
        <MetricCard
          title="Tổng số buổi đã tập"
          value={calculatedStats.totalWorkouts}
          unit="buổi"
          icon={<svg className="w-6 h-6 sm:w-7 sm:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>}
          iconBgColor="bg-[#e0f2fe] text-[#0ea5e9]"
        />
        <MetricCard
          title="Tổng quãng đường"
          value={calculatedStats.totalDistance}
          unit="mét"
          icon={<svg className="w-6 h-6 sm:w-7 sm:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
          iconBgColor="bg-amber-100 text-amber-600"
        />
      </div>

      {/* 3. LỊCH SỬ TẬP LUYỆN */}
      <TrainingHistory
        pages={pages}
        searchQuery={searchDateQuery}
        onSearchChange={setSearchDateQuery}
        onSelectPage={handleOpenPageDetail}
        loading={loading}
      />

      {/* 4. MODAL CHI TIẾT PHIÊN TẬP */}
      <SessionModal
        pageId={selectedPageId}
        page={selectedPage}
        loading={loadingPage}
        onClose={handleClosePageDetail}
      />

      {/* 5. FLOATING CHATBOX */}
      <Chatbox
        isChatOpen={isChatOpen}
        setIsChatOpen={setIsChatOpen}
        activeChat={activeChat}
        setActiveChat={setActiveChat}
        contacts={contacts}
        currentContact={currentContact}
        totalUnread={totalUnread}
        handleCloseChat={handleCloseChat}
      />

    </div>
  );
}
