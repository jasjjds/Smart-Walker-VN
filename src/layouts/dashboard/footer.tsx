import { BRAND_CONFIG } from "@/config/brand";

export function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="w-full bg-white/40 border-t border-primary-500/10 py-4 px-6 flex flex-col sm:flex-row items-center justify-between text-xs text-primary-900/70 gap-2 shrink-0">
      <div className="font-semibold">
        &copy; {currentYear} {BRAND_CONFIG.footer.copyright}
      </div>
      <div className="flex items-center gap-4">
        <a href="#" className="hover:text-primary-500 transition-colors font-medium">Điều khoản sử dụng</a>
        <span className="text-primary-500/20">|</span>
        <a href="#" className="hover:text-primary-500 transition-colors font-medium">Chính sách bảo mật</a>
      </div>
    </footer>
  );
}
