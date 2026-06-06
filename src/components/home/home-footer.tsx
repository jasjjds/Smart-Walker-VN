// components/dashboard/dashboard-footer.tsx
import Link from 'next/link';

export default function HomeFooter() {
  // Cấu trúc dữ liệu tuân thủ Quy tắc số lẻ (3 cột link)
  const footerColumns = [
    {
      title: 'Liên hệ',
      links: ['Lorem input', 'Lorem input', 'Lorem input'],
    },
    {
      title: '', // Cố tình để trống để ép Visual Hierarchy ngang hàng với cột 1
      links: ['Lorem input', 'Lorem input', 'Lorem input'],
    },
    {
      title: '',
      links: ['Lorem input', 'Lorem input', 'Lorem input'],
    },
  ];

  return (
    <footer className="w-full bg-[#075985] text-[#f0f9ff] border-t border-[#f0f9ff]/10">
      {/* WHITESPACE & CONSISTENCY: 
          Dùng chung max-w-7xl và px-6 lg:px-12 như Header để tạo dải lề thẳng tắp từ trên xuống dưới.
          Padding trên dưới (py-12) cực rộng để thiết kế có không gian "thở".
      */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-12 md:py-16">

        {/* GRID SYSTEM 12 CỘT:
            - Mobile: 1 cột (xếp chồng).
            - Tablet (md): 2 cột.
            - Desktop (lg): 12 cột. Chia tỷ lệ 3:3:3:3 để tạo sự cân bằng bất đối xứng (Logo bên trái, 3 cụm text bên phải).
        */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">

          {/* CỘT 1: Logo & Thông tin (Chiếm 3/12 cột lưới) - F-Shape Layout điểm bắt đầu */}
          <div className="lg:col-span-3 flex flex-col gap-4">
            <div className="flex items-center gap-3 shrink-0">
              <div className="w-10 h-10 bg-[#f0f9ff] rounded-lg opacity-90"></div>
              <h2 className="text-xl font-bold tracking-wide">
                Smart Walker
              </h2>
            </div>
            <p className="text-[#f0f9ff]/70 text-sm leading-relaxed mt-2 max-w-xs">
              Hệ thống theo dõi và phục hồi chức năng thông minh, đồng hành cùng sức khỏe của bạn.
            </p>
          </div>

          {/* 3 CỘT LINKS (Mỗi cột chiếm 3/12 cột lưới) */}
          {footerColumns.map((col, index) => (
            <div key={index} className="lg:col-span-3 flex flex-col">

              {/* Tiêu đề & Đường kẻ (Visual Hierarchy) */}
              {/* Dùng h-6 để fix cứng chiều cao, đảm bảo các đường kẻ ngang luôn bằng nhau dù có chữ hay không */}
              <div className="h-6">
                <h3 className="font-semibold text-[15px] tracking-wide">
                  {col.title}
                </h3>
              </div>

              {/* Đường kẻ ngang mô phỏng chính xác trong hình */}
              <div className="w-10 h-px bg-[#f0f9ff] mt-2 mb-5 opacity-60"></div>

              {/* Danh sách Links */}
              <ul className="flex flex-col gap-3">
                {col.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    {/* Tương phản (Contrast): Trạng thái bình thường mờ 80%, khi hover sáng rực lên 100% */}
                    <Link
                      href="#"
                      className="text-[#f0f9ff]/80 hover:text-[#f0f9ff] text-sm font-medium transition-colors duration-200"
                    >
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

        </div>

        {/* Phần Bottom Bar (Copyright) */}
        <div className="mt-16 pt-8 border-t border-[#f0f9ff]/20 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-[#f0f9ff]/60">
          <p>© 2026 Smart Walker VN. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="#" className="hover:text-[#f0f9ff] transition-colors">Chính sách bảo mật</Link>
            <Link href="#" className="hover:text-[#f0f9ff] transition-colors">Điều khoản sử dụng</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}