'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function HomeHeader() {
  // State quản lý trạng thái đóng/mở của mobile menu
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuItems = [
    'Giới thiệu',
    'Lorem input',
    'Lorem input',
    'Lorem input',
    'Lorem input'
  ];

  return (
    <header
      className="w-full h-40 md:h-52 lg:h-64 relative transition-all duration-300 ease-in-out z-50"
      style={{
        background: 'linear-gradient(180deg, #075985 0%, #075985 25%, #0ea5e9 70%, #f0f9ff 100%)'
      }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12 pt-6 md:pt-8 flex justify-between items-center relative z-10">

        {/* 1. LOGO */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-10 h-10 bg-primary-50 rounded-lg opacity-90"></div>
          <h1 className="text-xl md:text-2xl font-bold text-primary-50 tracking-wide">
            StepAid - LBK
          </h1>
        </div>

        {/* 2. NAVIGATION MENU (DESKTOP) */}
        <nav className="hidden lg:flex items-center gap-8">
          {menuItems.map((title, index) => (
            <div key={index} className="group relative">
              <button className="flex items-center gap-1 text-primary-50 hover:text-primary-500 font-medium transition-colors py-2">
                {title}
                <svg className="w-4 h-4 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Khối Dropdown Menu (Desktop) */}
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <div className="h-4 w-full"></div>

                <div className="relative bg-primary-50 shadow-xl rounded-sm border-2 border-primary-800 py-2">
                  <div className="absolute -top-[9px] left-1/2 -translate-x-1/2 w-4 h-4 bg-primary-50 rotate-45 border-l-2 border-t-2 border-primary-800"></div>

                  <div className="relative z-10 flex flex-col">
                    <Link href="#" className="px-5 py-2.5 text-primary-500 hover:text-primary-800 hover:bg-primary-500/10 transition-colors font-medium">Lorem input</Link>
                    <Link href="#" className="px-5 py-2.5 text-primary-500 hover:text-primary-800 hover:bg-primary-500/10 transition-colors font-medium">Lorem input</Link>
                    <Link href="#" className="px-5 py-2.5 text-primary-500 hover:text-primary-800 hover:bg-primary-500/10 transition-colors font-medium">Lorem input</Link>
                    <Link href="#" className="px-5 py-2.5 text-primary-500 hover:text-primary-800 hover:bg-primary-500/10 transition-colors font-medium">Lorem input</Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </nav>

        {/* 3. CALL TO ACTION (CTA) & HAMBURGER BUTTON */}
        <div className="flex items-center">
          {/* Nút 3 gạch */}
          <button
            className="lg:hidden text-primary-50 p-2 focus:outline-none"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              // Icon X khi menu đang mở
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              // Icon 3 gạch khi menu đóng
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>

          {/* Nút Đăng nhập (Desktop) */}
          <Link href="/auth" className="hidden lg:block border border-primary-50 text-primary-50 px-8 py-2.5 rounded hover:bg-primary-50 hover:text-primary-800 font-semibold tracking-wide transition-all duration-300">
            ĐĂNG NHẬP
          </Link>
        </div>

      </div>

      {/* 4. MOBILE MENU DROPDOWN */}
      {isMobileMenuOpen && (
        <div className="absolute top-20 left-0 w-full px-6 lg:hidden z-40">
          <div className="bg-primary-800 rounded-md shadow-xl border border-primary-50/20 p-4 flex flex-col gap-2">
            {menuItems.map((title, index) => (
              <Link
                key={index}
                href="#"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-primary-50 font-medium py-3 border-b border-primary-50/10 hover:text-primary-500 transition-colors"
              >
                {title}
              </Link>
            ))}
            <Link
              href="/auth"
              onClick={() => setIsMobileMenuOpen(false)}
              className="mt-4 bg-primary-50 text-primary-800 text-center font-bold py-3 rounded hover:bg-primary-100 transition-colors"
            >
              ĐĂNG NHẬP
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}