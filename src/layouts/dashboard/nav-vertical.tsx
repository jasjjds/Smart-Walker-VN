"use client";

import Link from "next/link";
import { menuGroups } from "./config-navigation";
import { Logo } from "@/components/logo";
import { useAuth } from "@/lib/auth-context";

interface NavVerticalProps {
  pathname: string;
  openGroups: Record<string, boolean>;
  toggleGroup: (id: string) => void;
  width: number;
}

export function NavVertical({ pathname, openGroups, toggleGroup, width }: NavVerticalProps) {
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

  return (
    <aside style={{ width: `${width}px` }} className="h-full bg-[#0c4a6e] flex flex-col shadow-2xl relative z-20 overflow-hidden">
      
      {/* Khu vực Logo */}
      <div className="h-24 w-full flex items-center px-6 border-b border-white/10 mt-2 shrink-0">
        <div className="w-12 h-12 rounded-xl bg-white/5 p-1.5 shadow-inner mr-4 flex-shrink-0">
          <Logo />
        </div>
        <div className="flex flex-col">
          <span className="text-[#0ea5e9] font-bold text-lg leading-tight uppercase tracking-wide">Smart Walker</span>
          <span className="text-[#f0f9ff]/70 font-medium text-xs tracking-widest uppercase mt-0.5">Việt Nam</span>
        </div>
      </div>

      {/* Danh sách Menu (Gập Mở Accordion) */}
      <nav className="flex-1 overflow-y-auto py-4 flex flex-col custom-scrollbar">
        {filteredMenuGroups.map((group, groupIndex) => {
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

              {/* Các nút Menu bên trong nhóm */}
              <div
                className={`flex flex-col gap-1 px-4 overflow-hidden transition-all duration-300 ease-in-out ${
                  isOpen ? 'max-h-[500px] opacity-100 mb-4' : 'max-h-0 opacity-0 mb-0'
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

              {/* Dấu gạch ngang mờ */}
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
          className="flex items-center gap-4 px-4 py-3.5 w-full rounded-xl text-[#f0f9ff]/70 hover:bg-red-500/10 hover:text-red-400 transition-colors font-medium cursor-pointer text-left"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Đăng xuất
        </button>
      </div>
    </aside>
  );
}
