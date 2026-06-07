"use client";

import { useState, useEffect, useCallback } from "react";
import { usePathname } from "next/navigation";
import { NavVertical } from "./nav-vertical";
import { NavMobile } from "./nav-mobile";
import { menuGroups } from "./config-navigation";
import { Header } from "./header";
import { Footer } from "./footer";
import { ProfileDrawer } from "./profile-drawer";

export default function DashboardLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Sidebar resize state
  const [sidebarWidth, setSidebarWidth] = useState(280);
  const [isResizing, setIsResizing] = useState(false);

  const startResizing = useCallback(() => {
    setIsResizing(true);
    document.body.style.userSelect = 'none';
  }, []);

  const stopResizing = useCallback(() => {
    setIsResizing(false);
    document.body.style.userSelect = '';
  }, []);

  const resize = useCallback((mouseMoveEvent: MouseEvent) => {
    if (isResizing) {
      const newWidth = Math.min(Math.max(mouseMoveEvent.clientX, 200), 450);
      setSidebarWidth(newWidth);
    }
  }, [isResizing]);

  useEffect(() => {
    window.addEventListener("mousemove", resize);
    window.addEventListener("mouseup", stopResizing);
    return () => {
      window.removeEventListener("mousemove", resize);
      window.removeEventListener("mouseup", stopResizing);
    };
  }, [resize, stopResizing]);

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

  return (
    <div className="flex h-screen w-full bg-[#f0f9ff] overflow-hidden text-[#0c4a6e]">
      
      {/* 1. DESKTOP SIDEBAR NAVIGATION */}
      <div className="hidden lg:flex h-full shrink-0 relative group">
        <NavVertical 
          pathname={pathname}
          openGroups={openGroups}
          toggleGroup={toggleGroup}
          width={sidebarWidth}
        />
        {/* Thanh kéo để resize */}
        <div 
          onMouseDown={startResizing}
          className="absolute top-0 right-0 w-1.5 h-full cursor-col-resize hover:bg-[#0ea5e9] opacity-0 hover:opacity-100 transition-opacity z-30"
          style={{ opacity: isResizing ? 1 : undefined, backgroundColor: isResizing ? '#0ea5e9' : undefined }}
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
        <Header 
          onMenuOpen={() => setIsMobileOpen(true)}
          onProfileOpen={() => setIsProfileOpen(true)}
        />

        {/* MAIN WORKSPACE CONTENT */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-5 md:p-6 lg:p-8 relative flex flex-col min-h-0 bg-transparent">
          <div className="flex-grow flex flex-col">
            {children}
          </div>
        </main>

        {/* FOOTER BAR */}
        <Footer />
      </div>

      {/* 4. USER PROFILE RIGHT DRAWER */}
      <ProfileDrawer 
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
      />
    </div>
  );
}
