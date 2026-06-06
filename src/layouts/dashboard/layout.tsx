"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { NavVertical } from "./nav-vertical";
import { NavMobile } from "./nav-mobile";
import { menuGroups } from "./config-navigation";

export default function DashboardLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Accordion groups toggle state (open by default)
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    admin: true,
    doctor: true,
    patient: true
  });

  // Automatically open group containing current path on mount / path change
  useEffect(() => {
    setOpenGroups(prev => {
      const newState = { ...prev };
      menuGroups.forEach(group => {
        const hasActiveItem = group.items.some(item =>
          item.path === '/dashboard' ? pathname === '/dashboard' : pathname.startsWith(item.path)
        );
        if (hasActiveItem) newState[group.id] = true;
      });
      return newState;
    });
  }, [pathname]);

  const toggleGroup = (id: string) => {
    setOpenGroups(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Get Page Title for Header
  const getPageTitle = () => {
    if (pathname.includes('/doctor/cog')) return "Phân tích Trọng tâm (CoG)";
    if (pathname.includes('/doctor/force')) return "Cân bằng lực tỳ tay";
    if (pathname.includes('/doctor/gait')) return "Phân tích Chu kỳ dáng đi";
    if (pathname.includes('/doctor/risk')) return "Chỉ số Nguy cơ Té ngã";

    for (const group of menuGroups) {
      const activeItem = group.items.find(item =>
        item.path === '/dashboard' ? pathname === '/dashboard' : pathname.startsWith(item.path)
      );
      if (activeItem) return activeItem.name;
    }
    return "Bảng điều khiển";
  };

  return (
    <div className="flex h-screen w-full bg-[#f0f9ff] overflow-hidden text-[#0c4a6e]">
      
      {/* 1. DESKTOP SIDEBAR NAVIGATION */}
      <div className="hidden lg:flex h-full shrink-0">
        <NavVertical 
          pathname={pathname}
          openGroups={openGroups}
          toggleGroup={toggleGroup}
        />
      </div>

      {/* 2. MOBILE DRAWER NAVIGATION */}
      <NavMobile 
        pathname={pathname}
        isOpen={isMobileOpen}
        onClose={() => setIsMobileOpen(false)}
        openGroups={openGroups}
        toggleGroup={toggleGroup}
      />

      {/* 3. RIGHT CONTENT CONTAINER */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        
        {/* HEADER BAR */}
        <header className="h-20 w-full bg-white/60 backdrop-blur-md border-b border-[#0ea5e9]/10 flex items-center justify-between px-4 sm:px-6 lg:px-8 z-10 shadow-sm shrink-0">
          
          <div className="flex items-center gap-3">
            {/* Hamburger Button for Mobile */}
            <button
              onClick={() => setIsMobileOpen(true)}
              className="p-2 text-[#0c4a6e] hover:text-[#0ea5e9] hover:bg-slate-100 rounded-xl transition-colors lg:hidden"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-[#0c4a6e] truncate">
              {getPageTitle()}
            </h1>
          </div>

          <div className="flex items-center gap-4 sm:gap-6">
            {/* Notification Button */}
            <button className="relative p-2 text-[#0c4a6e]/70 hover:text-[#0ea5e9] transition-colors rounded-full hover:bg-white">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span className="absolute top-1.5 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>

            {/* Profile Section */}
            <div className="flex items-center gap-2 sm:gap-3 pl-3 sm:pl-4 border-l border-[#0ea5e9]/20 cursor-pointer group">
              <div className="text-right hidden sm:block">
                <p className="text-xs sm:text-sm font-bold text-[#0c4a6e] leading-tight">Admin System</p>
                <p className="text-[10px] sm:text-xs font-medium text-[#0ea5e9] mt-0.5">Quản trị viên</p>
              </div>
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#0ea5e9]/10 border-2 border-[#0ea5e9] flex items-center justify-center text-[#0ea5e9] font-bold group-hover:bg-[#0ea5e9] group-hover:text-white transition-colors text-sm sm:text-base">
                AD
              </div>
            </div>
          </div>
        </header>

        {/* MAIN WORKSPACE CONTENT */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-5 md:p-6 lg:p-8 relative flex flex-col min-h-0 bg-transparent">
          {children}
        </main>
      </div>
    </div>
  );
}
