"use client";

import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { menuGroups } from "./config-navigation";

interface HeaderProps {
  onMenuOpen: () => void;
  onProfileOpen: () => void;
}
export function Header({ onMenuOpen, onProfileOpen }: HeaderProps) {
  const pathname = usePathname();
  const { user } = useAuth();

  const getPageTitle = () => {
    if (pathname.includes('/doctor/cog')) return "Phân tích Trọng tâm (CoG)";
    if (pathname.includes('/doctor/force')) return "Cân bằng lực tỳ tay";
    if (pathname.includes('/doctor/gait')) return "Phân tích Chu kỳ dáng đi";
    if (pathname.includes('/doctor/risk')) return "Chỉ số Nguy cơ Té ngã";

    for (const group of menuGroups) {
      const activeItem = group.items.find(item => {
        // Đối với các trang chính (Overview/Dashboard), cần so khớp chính xác thay vì khớp tiền tố (prefix)
        if (item.path === '/dashboard' || item.path === '/dashboard/patient') {
          return pathname === item.path;
        }
        return pathname.startsWith(item.path);
      });
      if (activeItem) return activeItem.name;
    }
    return "Bảng điều khiển";
  };

  const getRoleLabel = (roleId?: number) => {
    if (roleId === 1) return "Quản trị viên";
    if (roleId === 3) return "Bác sĩ";
    if (roleId === 2) return "Bệnh nhân";
    return "Người dùng";
  };

  const getInitials = (name?: string) => {
    if (!name) return "UN";
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  return (
    <header className="h-20 w-full bg-white/60 backdrop-blur-md border-b border-primary-500/10 flex items-center justify-between px-4 sm:px-6 lg:px-8 z-10 shadow-sm shrink-0">
      <div className="flex items-center gap-3">
        {/* Hamburger Button for Mobile */}
        <button
          onClick={onMenuOpen}
          className="p-2 text-primary-900 hover:text-primary-500 hover:bg-slate-100 rounded-xl transition-colors lg:hidden"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-primary-900 truncate">
          {getPageTitle()}
        </h1>
      </div>

      <div className="flex items-center gap-4 sm:gap-6">
        {/* Notification Button */}
        <button className="relative p-2 text-primary-900/70 hover:text-primary-500 transition-colors rounded-full hover:bg-white">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          <span className="absolute top-1.5 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>

        {/* Profile Section */}
        <div 
          onClick={onProfileOpen}
          className="flex items-center gap-2 sm:gap-3 pl-3 sm:pl-4 border-l border-primary-500/20 cursor-pointer group"
        >
          <div className="text-right hidden sm:block">
            <p className="text-xs sm:text-sm font-bold text-primary-900 leading-tight truncate max-w-[120px]">
              {user?.full_name || 'Unknown'}
            </p>
            <p className="text-[10px] sm:text-xs font-medium text-primary-500 mt-0.5">
              {getRoleLabel(user?.role_id)}
            </p>
          </div>
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-primary-500/10 border-2 border-primary-500 flex items-center justify-center text-primary-500 font-bold group-hover:bg-primary-500 group-hover:text-white transition-colors text-sm sm:text-base">
            {getInitials(user?.full_name)}
          </div>
        </div>
      </div>
    </header>
  );
}
