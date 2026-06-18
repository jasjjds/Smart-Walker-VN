// src/config/brand.ts

/**
 * Cấu hình thương hiệu và văn bản tĩnh hệ thống (Brand & Slogan Config)
 * Giúp quản lý tập trung toàn bộ tên gọi, slogan, và các chuỗi mô tả trong hệ thống.
 * 
 * Khi muốn đổi tên thương hiệu hoặc khẩu hiệu, chỉ cần chỉnh sửa tại file này.
 */
export const BRAND_CONFIG = {
  // Thông tin thương hiệu cơ bản
  brand: {
    name: "StepAid-LBK",        // Tên sản phẩm chính
    suffix: "LBK",               // Hậu tố quốc gia / chi nhánh
    fullName: "StepAid-LBK", // Tên đầy đủ
    region: "Việt Nam",         // Khu vực địa lý
  },

  // Slogan & Metadata mặc định
  slogan: "Hệ thống quản lý và theo dõi xe tập đi thông minh",
  metaDescription: "Hệ thống quản lý và theo dõi xe tập đi thông minh StepAid - LBK Việt Nam",

  // Văn bản trong khu vực xác thực (Auth)
  auth: {
    welcome: "Chào mừng bạn đến với",
    loginTitle: "ĐĂNG NHẬP",
    registerTitle: "ĐĂNG KÝ",
    changePasswordTitle: "ĐỔI MẬT KHẨU",
    loginSlogan: "Hệ thống quản lý xe tập đi thông minh",
  },

  // Các câu mô tả / chỉ dẫn theo phân hệ
  admin: {
    deviceManagementDesc: "Danh sách toàn bộ các xe tập đi StepAid - LBK đăng ký trên hệ thống.",
    systemLogsDesc: "Theo dõi hoạt động và lịch sử truy cập trên hệ thống StepAid - LBK.",
  },

  doctor: {
    overviewDesc: "Nhận dữ liệu từ các thiết bị StepAid - LBK trong khu vực.",
  },

  patient: {
    metricsDesc: "Theo dõi các chỉ số sức khỏe của bạn thông qua thiết bị StepAid - LBK.",
  },

  // Văn bản bản quyền chân trang (Copyrights)
  footer: {
    copyright: "StepAid-LBK. Bảo lưu mọi quyền.",
    shortCopyright: "StepAid-LBK • Healthcare Tech",
    year: "2026",
  }
} as const;

export type SystemBrandConfig = typeof BRAND_CONFIG;
