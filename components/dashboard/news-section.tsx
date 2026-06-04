import Link from 'next/link';

// Cấu trúc dữ liệu mẫu (Mock Data)
// 📝 NOTE CHO TƯƠNG LAI: 
// Sau này bạn chỉ cần thay đổi nội dung trong mảng này thành dữ liệu thật (lấy từ Database, API hoặc CMS).
const mockArticles = [
  {
    id: 1,
    title: 'Lorem input',
    date: 'Lorem input',
    excerpt: 'Lorem input',
    image: 'linear-gradient(135deg, #0ea5e9, #075985)', // Dùng màu gradient làm ảnh tạm
  },
  {
    id: 2,
    title: 'Lorem input',
    date: 'Lorem input',
    excerpt: 'Lorem input',
    image: 'linear-gradient(135deg, #f0f9ff, #bae6fd)',
  },
  {
    id: 3,
    title: 'Lorem input',
    date: 'Lorem input',
    excerpt: 'Lorem input',
    image: 'linear-gradient(135deg, #e0f2fe, #7dd3fc)',
  },
];

// Component con để render khung Tiêu đề (có 2 đường gạch ngang)
const SectionHeader = ({ title }: { title: string }) => (
  <div className="flex items-center justify-center w-full mb-8">
    <div className="h-px bg-[#075985]/20 flex-1"></div>
    <div className="px-6 py-2 border border-[#075985]/20 bg-[#f0f9ff] text-[#075985] font-bold text-lg uppercase tracking-wider mx-4 shadow-sm">
      {title}
    </div>
    <div className="h-px bg-[#075985]/20 flex-1"></div>
  </div>
);

// Component con để render danh sách bài viết
const ArticleGrid = () => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
    {mockArticles.map((article) => (
      <div key={article.id} className="flex flex-col group cursor-pointer">
        {/* Khung Ảnh & Ngày tháng */}
        <div className="relative w-full h-48 mb-4 rounded-sm overflow-hidden bg-slate-100">
          <div
            className="absolute inset-0 transition-transform duration-500 group-hover:scale-105"
            style={{ background: article.image }}
          ></div>

          {/* Badge Ngày Tháng giống trong hình */}
          <div className="absolute top-0 left-0 bg-[#075985] text-white px-3 py-1.5 flex flex-col items-center text-xs font-bold shadow-md">
            <span className="text-sm">{article.date.split(' ')[0]}</span>
            <span className="font-normal">{article.date.split(' ')[1]}</span>
          </div>
        </div>

        {/* Khung Text */}
        <h3 className="text-[#075985] font-bold text-[15px] leading-snug mb-2 group-hover:text-[#0ea5e9] transition-colors line-clamp-2">
          {article.title}
        </h3>
        <p className="text-slate-600 text-sm leading-relaxed mb-2 line-clamp-3">
          {article.excerpt}
        </p>
        <Link href="/" className="text-sm font-semibold text-[#075985] hover:underline mt-auto">
          [Xem thêm...]
        </Link>
      </div>
    ))}
  </div>
);

export default function NewsSection() {
  return (
    <section className="w-full bg-[#f8fafc] py-16">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 flex flex-col gap-16">

        {/* Khối Mới Nhất */}
        <div>
          <SectionHeader title="Bài viết mới nhất" />
          <ArticleGrid />
        </div>

        {/* Khối Nổi Bật */}
        <div>
          <SectionHeader title="Bài viết nổi bật" />
          <ArticleGrid />
        </div>

      </div>
    </section>
  );
}