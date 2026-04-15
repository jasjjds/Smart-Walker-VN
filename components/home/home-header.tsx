// components/dashboard/dashboard-header.tsx
import Link from 'next/link';

export default function HomeHeader() {
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
      <div className="max-w-7xl mx-auto px-6 lg:px-12 pt-6 md:pt-8 flex justify-between items-center">

        {/* 1. LOGO */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-10 h-10 bg-[#f0f9ff] rounded-lg opacity-90"></div>
          <h1 className="text-xl md:text-2xl font-bold text-[#f0f9ff] tracking-wide">
            Smart Walker
          </h1>
        </div>

        {/* 2. NAVIGATION MENU */}
        <nav className="hidden lg:flex items-center gap-8">
          {menuItems.map((title, index) => (
            <div key={index} className="group relative">
              <button className="flex items-center gap-1 text-[#f0f9ff] hover:text-[#0ea5e9] font-medium transition-colors py-2">
                {title}
                <svg className="w-4 h-4 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Khối Dropdown Menu */}
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <div className="h-4 w-full"></div>

                <div className="relative bg-[#f0f9ff] shadow-xl rounded-sm border-2 border-[#075985] py-2">
                  <div className="absolute -top-[9px] left-1/2 -translate-x-1/2 w-4 h-4 bg-[#f0f9ff] rotate-45 border-l-2 border-t-2 border-[#075985]"></div>

                  <div className="relative z-10 flex flex-col">
                    <Link href="#" className="px-5 py-2.5 text-[#0ea5e9] hover:text-[#075985] hover:bg-[#0ea5e9]/10 transition-colors font-medium">Lorem input</Link>
                    <Link href="#" className="px-5 py-2.5 text-[#0ea5e9] hover:text-[#075985] hover:bg-[#0ea5e9]/10 transition-colors font-medium">Lorem input</Link>
                    <Link href="#" className="px-5 py-2.5 text-[#0ea5e9] hover:text-[#075985] hover:bg-[#0ea5e9]/10 transition-colors font-medium">Lorem input</Link>
                    <Link href="#" className="px-5 py-2.5 text-[#0ea5e9] hover:text-[#075985] hover:bg-[#0ea5e9]/10 transition-colors font-medium">Lorem input</Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </nav>

        {/* 3. CALL TO ACTION (CTA) */}
        <div className="flex items-center">
          <button className="lg:hidden text-[#f0f9ff] p-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* Đã sửa href thành /auth ở đây */}
          <Link href="/auth" className="hidden lg:block border border-[#f0f9ff] text-[#f0f9ff] px-8 py-2.5 rounded hover:bg-[#f0f9ff] hover:text-[#075985] font-semibold tracking-wide transition-all duration-300">
            ĐĂNG NHẬP
          </Link>
        </div>

      </div>
    </header>
  );
}