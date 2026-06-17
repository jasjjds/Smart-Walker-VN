// src/components/patient/welcome-banner.tsx

import React from 'react';
import Link from 'next/link';

interface WelcomeBannerProps {
  userName: string;
  streak: number;
  bookletNumber: string;
  identityCard?: string;
}

export function WelcomeBanner({
  userName,
  streak,
  bookletNumber,
  identityCard
}: WelcomeBannerProps) {
  return (
    <div className="bg-gradient-to-r from-primary-900 to-primary-500 rounded-3xl p-6 sm:p-8 text-white shadow-lg flex flex-col md:flex-row justify-between items-center gap-6 shrink-0 text-center md:text-left">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl sm:text-3xl font-bold">Chào buổi sáng, {userName}! 👋</h1>
        <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-2 text-xs sm:text-sm font-semibold">
          <span className="bg-white/10 px-3.5 py-1.5 rounded-xl border border-white/20 flex items-center gap-1.5">
            Mã số sổ y tế: <span className="font-mono font-black">{bookletNumber}</span>
          </span>
          {identityCard && (
            <span className="bg-white/10 px-3.5 py-1.5 rounded-xl border border-white/20 flex items-center gap-1.5">
              CCCD/CMND: <span className="font-mono font-black">{identityCard}</span>
            </span>
          )}
        </div>
      </div>
      <Link href="/device-scan" className="px-6 py-3 sm:px-8 sm:py-3 bg-white text-primary-900 font-black rounded-xl shadow-md hover:scale-105 transition-transform flex items-center justify-center gap-2 shrink-0 text-sm sm:text-base w-full md:w-auto">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        BẮT ĐẦU BÀI TẬP
      </Link>
    </div>
  );
}
