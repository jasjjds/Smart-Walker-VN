'use client'

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { BackButton } from '@/components/custom/back-button';

export default function UnauthorizedPage() {
  const router = useRouter();

  return (
    <div className="h-screen w-full bg-primary-50 flex flex-col items-center justify-center text-primary-900">
      <div className="w-24 h-24 mb-6 text-primary-500">
        {/* Icon Cảnh báo (SVG) */}
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      <h1 className="text-4xl font-bold mb-2">Truy cập bị từ chối</h1>
      <p className="text-lg opacity-80 mb-8">Bạn không có quyền truy cập vào khu vực này của hệ thống.</p>

      <div className="flex items-center gap-6">
        <BackButton onClick={() => router.back()} />
        <span className="text-slate-300">|</span>
        <BackButton href="/dashboard" />
      </div>
    </div>
  );
}