"use client";

export function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="w-full bg-white/40 border-t border-[#0ea5e9]/10 py-4 px-6 flex flex-col sm:flex-row items-center justify-between text-xs text-[#0c4a6e]/70 gap-2 shrink-0">
      <div className="font-semibold">
        &copy; {currentYear} Smart Walker VN. Bảo lưu mọi quyền.
      </div>
      <div className="flex items-center gap-4">
        <a href="#" className="hover:text-[#0ea5e9] transition-colors font-medium">Điều khoản sử dụng</a>
        <span className="text-[#0ea5e9]/20">|</span>
        <a href="#" className="hover:text-[#0ea5e9] transition-colors font-medium">Chính sách bảo mật</a>
      </div>
    </footer>
  );
}
