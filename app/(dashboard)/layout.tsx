"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

// ==========================================
// 1. COMPONENT LOGO
// ==========================================
const SmartWalkerLogo = () => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <rect width="100" height="100" rx="24" fill="#0ea5e9" />
    <path d="M32 36C32 36 42 24 50 36C58 48 42 60 50 72C58 84 68 72 68 72" stroke="#f0f9ff" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M32 68L44 42L56 68L68 42" stroke="#0c4a6e" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// ==========================================
// 2. CẤU TRÚC MENU (Thứ tự: Admin -> Bác sĩ -> Bệnh nhân)
// ==========================================
const menuGroups = [
  {
    id: "admin",
    groupLabel: "Quản trị viên (Admin)",
    items: [
      { name: "Quản lý người dùng", path: "/dashboard/admin/users", icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" },
      { name: "Nhật ký hệ thống", path: "/dashboard/admin/logs", icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" },
      { name: "Cài đặt hệ thống", path: "/dashboard/admin/settings", icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z" },
    ]
  },
  {
    id: "doctor",
    groupLabel: "Chuyên môn (Bác sĩ)",
    items: [
      { name: "Phân tích Lâm sàng", path: "/dashboard/doctor", icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" },
      { name: "Danh sách Bệnh nhân", path: "/dashboard/patients", icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" },
      { name: "Quản lý Thiết bị", path: "/dashboard/devices", icon: "M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" },
      { name: "Báo cáo Y tế", path: "/dashboard/reports", icon: "M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" },
    ]
  },
  {
    id: "patient",
    groupLabel: "Cá nhân (Bệnh nhân)",
    items: [
      { name: "Tổng quan cá nhân", path: "/dashboard", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
      { name: "Lịch tập & Tiến độ", path: "/dashboard/patient/progress", icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" },
    ]
  }
];

// ==========================================
// 3. MAIN DASHBOARD LAYOUT
// ==========================================
export default function DashboardLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const pathname = usePathname();

  // Quản lý trạng thái Mở/Đóng của từng Menu Group
  // Mặc định: Mở tất cả (Show hết ra)
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    admin: true,
    doctor: true,
    patient: true
  });

  // Tự động mở group chứa URL hiện tại khi load trang
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

  // Hàm Toggle (Đóng/Mở) cho từng nhóm
  const toggleGroup = (id: string) => {
    setOpenGroups(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Nút tiện ích: Thu gọn tất cả / Mở tất cả
  const isAllOpen = Object.values(openGroups).every(Boolean);
  const toggleAll = () => {
    const newState = isAllOpen ? false : true;
    setOpenGroups({ admin: newState, doctor: newState, patient: newState });
  };

  // Logic lấy Tiêu đề Header
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

      {/* --- SIDEBAR --- */}
      <aside className="w-[280px] h-full bg-[#0c4a6e] flex flex-col shadow-2xl relative z-20 transition-all duration-300">

        {/* Khu vực Logo */}
        <div className="h-24 w-full flex items-center px-6 border-b border-white/10 mt-2 shrink-0">
          <div className="w-12 h-12 rounded-xl bg-white/5 p-1.5 shadow-inner mr-4 flex-shrink-0">
            <SmartWalkerLogo />
          </div>
          <div className="flex flex-col">
            <span className="text-[#0ea5e9] font-bold text-lg leading-tight uppercase tracking-wide">Smart Walker</span>
            <span className="text-[#f0f9ff]/70 font-medium text-xs tracking-widest uppercase mt-0.5">Việt Nam</span>
          </div>
        </div>

        {/* Danh sách Menu (Gập Mở Accordion) */}
        <nav className="flex-1 overflow-y-auto py-4 flex flex-col custom-scrollbar">

          {menuGroups.map((group, groupIndex) => {
            const isOpen = openGroups[group.id];

            return (
              <div key={group.id} className={groupIndex > 0 ? "mt-2" : ""}>

                {/* Tiêu đề nhóm (Clickable) */}
                <div
                  className="px-6 py-2 mb-1 flex items-center justify-between cursor-pointer group/header"
                  onClick={() => toggleGroup(group.id)}
                >
                  <h3 className="text-[11px] font-bold text-[#f0f9ff]/40 uppercase tracking-widest group-hover/header:text-[#f0f9ff]/80 transition-colors">
                    {group.groupLabel}
                  </h3>
                  <svg
                    className={`w-3.5 h-3.5 text-[#f0f9ff]/40 group-hover/header:text-[#0ea5e9] transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                    fill="none" stroke="currentColor" viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>

                {/* Các nút Menu bên trong nhóm (Animation height) */}
                <div
                  className={`flex flex-col gap-1 px-4 overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[500px] opacity-100 mb-4' : 'max-h-0 opacity-0 mb-0'
                    }`}
                >
                  {group.items.map((item) => {
                    const isActive = item.path === '/dashboard'
                      ? pathname === '/dashboard'
                      : pathname.startsWith(item.path);

                    return (
                      <Link
                        key={item.name} href={item.path}
                        className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 font-medium text-[14px] 
                          ${isActive
                            ? 'bg-gradient-to-r from-[#0ea5e9] to-[#0284c7] text-white shadow-md shadow-[#0ea5e9]/20'
                            : 'text-[#f0f9ff]/60 hover:bg-white/10 hover:text-white'
                          }`}
                      >
                        <svg className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#f0f9ff]/40'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon} />
                        </svg>
                        {item.name}
                      </Link>
                    );
                  })}
                </div>

                {/* Dấu gạch ngang mờ (hiện khi có ít nhất 1 cái mở) */}
                {groupIndex < menuGroups.length - 1 && (
                  <div className="mx-6 border-b border-white/5 my-2"></div>
                )}

              </div>
            );
          })}

        </nav>

        {/* Nút Đăng xuất */}
        <div className="p-4 border-t border-white/10 shrink-0">
          <Link href="/auth" className="flex items-center gap-4 px-4 py-3.5 w-full rounded-xl text-[#f0f9ff]/70 hover:bg-red-500/10 hover:text-red-400 transition-colors font-medium">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Đăng xuất
          </Link>
        </div>
      </aside>

      {/* --- RIGHT CONTENT AREA --- */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        <header className="h-20 w-full bg-white/60 backdrop-blur-md border-b border-[#0ea5e9]/10 flex items-center justify-between px-8 z-10 shadow-sm shrink-0">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-[#0c4a6e]">
              {getPageTitle()}
            </h1>
          </div>

          <div className="flex items-center gap-6">
            <button className="relative p-2 text-[#0c4a6e]/70 hover:text-[#0ea5e9] transition-colors rounded-full hover:bg-white">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
              <span className="absolute top-1.5 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-[#f0f9ff]"></span>
            </button>

            <div className="flex items-center gap-3 pl-4 border-l border-[#0ea5e9]/20 cursor-pointer group">
              <div className="text-right hidden md:block">
                <p className="text-sm font-bold text-[#0c4a6e]">Admin System</p>
                <p className="text-xs font-medium text-[#0ea5e9]">Quản trị viên</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-[#0ea5e9]/10 border-2 border-[#0ea5e9] flex items-center justify-center text-[#0ea5e9] font-bold group-hover:bg-[#0ea5e9] group-hover:text-white transition-colors">
                AD
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 relative flex flex-col min-h-0 bg-transparent">
          {children}
        </main>
      </div>
    </div>
  );
}