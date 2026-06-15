"use client";

import Link from "next/link";
import { useEffect } from "react";
import { menuGroups } from "./config-navigation";
import { Logo } from "@/components/logo";
import { useAuth } from "@/lib/auth-context";
import { BRAND_CONFIG } from "@/config/brand";

interface NavMobileProps {
  pathname: string;
  isOpen: boolean;
  onClose: () => void;
  openGroups: Record<string, boolean>;
  toggleGroup: (id: string) => void;
}

export function NavMobile({ pathname, isOpen, onClose, openGroups, toggleGroup }: NavMobileProps) {
  const { logout, user } = useAuth();
  
  const filteredMenuGroups = menuGroups
    .filter((group) => {
      if (group.allowedRoles && (!user || !group.allowedRoles.includes(user.role_id))) {
        return false;
      }
      const visibleItems = group.items.filter((item) => {
        if (item.allowedRoles && (!user || !item.allowedRoles.includes(user.role_id))) {
          return false;
        }
        return true;
      });
      return visibleItems.length > 0;
    })
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => {
        if (item.allowedRoles && (!user || !item.allowedRoles.includes(user.role_id))) {
          return false;
        }
        return true;
      }),
    }));

  // Tự động đóng drawer khi chuyển route
  useEffect(() => {
    if (isOpen) {
      onClose();
    }
  }, [pathname]); // eslint-disable-next-line react-hooks/exhaustive-deps

  return (
    <div className={`fixed inset-0 z-50 transition-opacity duration-300 lg:hidden ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
      
      {/* Lớp phủ mờ (Backdrop) */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300" 
        onClick={onClose}
      />

      {/* Nội dung Drawer trượt từ bên trái */}
      <aside className={`absolute top-0 left-0 w-[280px] h-full bg-primary-900 flex flex-col shadow-2xl transition-transform duration-300 ease-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        
        {/* Khu vực Logo & Close Button */}
        <div className="h-24 w-full flex items-center justify-between px-6 border-b border-white/10 mt-2 shrink-0">
          <div className="flex items-center">
            <div className="w-12 h-12 rounded-xl bg-white/5 p-1.5 shadow-inner mr-4 flex-shrink-0">
              <Logo />
            </div>
            <div className="flex flex-col">
              <span className="text-primary-500 font-bold text-lg leading-tight uppercase tracking-wide">{BRAND_CONFIG.brand.name}</span>
              <span className="text-primary-50/70 font-medium text-xs tracking-widest uppercase mt-0.5">{BRAND_CONFIG.brand.region}</span>
            </div>
          </div>
          
          <button onClick={onClose} className="p-2 text-white/50 hover:text-white rounded-full hover:bg-white/10 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Danh sách Menu */}
        <nav className="flex-1 overflow-y-auto py-4 flex flex-col custom-scrollbar">
          {filteredMenuGroups.map((group, groupIndex) => {
            const groupOpen = openGroups[group.id];

            return (
              <div key={group.id} className={groupIndex > 0 ? "mt-2" : ""}>
                
                {/* Tiêu đề nhóm */}
                <div
                  className="px-6 py-2 mb-1 flex items-center justify-between cursor-pointer group/header"
                  onClick={() => toggleGroup(group.id)}
                >
                  <h3 className="text-[11px] font-bold text-primary-50/40 uppercase tracking-widest group-hover/header:text-primary-50/80 transition-colors">
                    {group.groupLabel}
                  </h3>
                  <svg
                    className={`w-3.5 h-3.5 text-primary-50/40 group-hover/header:text-primary-500 transition-transform duration-300 ${groupOpen ? 'rotate-180' : ''}`}
                    fill="none" stroke="currentColor" viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>

                {/* Danh sách Menu bên trong */}
                <div
                  className={`flex flex-col gap-1 px-4 overflow-hidden transition-all duration-300 ease-in-out ${
                    groupOpen ? 'max-h-[500px] opacity-100 mb-4' : 'max-h-0 opacity-0 mb-0'
                  }`}
                >
                  {group.items.map((item) => {
                    const isActive =
                      item.path === '/dashboard' || item.path === '/dashboard/doctor'
                        ? pathname === item.path
                        : pathname === item.path || pathname.startsWith(item.path + '/');

                    return (
                      <Link
                        key={item.name}
                        href={item.path}
                        className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 font-medium text-[14px] ${
                          isActive
                            ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-md shadow-primary-500/20'
                            : 'text-primary-50/60 hover:bg-white/10 hover:text-white'
                        }`}
                      >
                        <svg className={`w-4 h-4 ${isActive ? 'text-white' : 'text-primary-50/40'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon} />
                        </svg>
                        {item.name}
                      </Link>
                    );
                  })}
                </div>

                {groupIndex < filteredMenuGroups.length - 1 && (
                  <div className="mx-6 border-b border-white/5 my-2"></div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Nút Đăng xuất */}
        <div className="p-4 border-t border-white/10 shrink-0">
          <button
            onClick={logout}
            className="flex items-center gap-4 px-4 py-3.5 w-full rounded-xl text-primary-50/70 hover:bg-red-500/10 hover:text-red-400 transition-colors font-medium cursor-pointer text-left"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Đăng xuất
          </button>
        </div>
      </aside>
    </div>
  );
}
