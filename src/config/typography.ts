// src/config/typography.ts

/**
 * Cấu hình hệ thống Typography thống nhất (Roboto Font)
 * Đồng bộ hóa font chữ, cỡ chữ, độ đậm (font weight) và chiều cao dòng (line height).
 * 
 * Cách sử dụng:
 * 1. Qua Tailwind classes: `font-roboto`, `text-h1`, `font-semibold`, `tracking-wide`
 * 2. Trong React/TS (inline style hoặc Canvas/Chart): `import { TYPOGRAPHY } from '@/config/typography'`
 */
export const TYPOGRAPHY = {
  // Font Family mặc định của toàn hệ thống là Roboto
  fontFamily: {
    roboto: '"Roboto", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    DEFAULT: '"Roboto", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  },

  // Cỡ chữ tiêu chuẩn kèm line-height tương ứng (Được dịch lên 1 mức)
  fontSize: {
    xs: {
      size: '0.875rem',     // 14px
      lineHeight: '1.25rem', // 20px
      description: 'Dành cho caption, chú thích nhỏ, thông tin phụ'
    },
    sm: {
      size: '1rem',        // 16px
      lineHeight: '1.5rem', // 24px
      description: 'Dành cho văn bản nhỏ, mô tả phụ, label của form'
    },
    base: {
      size: '1.125rem',    // 18px (Cỡ mặc định cho body)
      lineHeight: '1.75rem', // 28px
      description: 'Cỡ chữ chuẩn cho toàn bộ văn bản (Body text)'
    },
    lg: {
      size: '1.25rem',     // 20px
      lineHeight: '1.875rem', // 30px
      description: 'Tiêu đề nhỏ, chữ nhấn mạnh, thẻ card title'
    },
    xl: {
      size: '1.5rem',      // 24px
      lineHeight: '2rem',  // 32px
      description: 'Tiêu đề cột, tiêu đề phụ (Sub-heading)'
    },
    '2xl': {
      size: '1.875rem',    // 30px
      lineHeight: '2.25rem', // 36px
      description: 'Tiêu đề chính trong các trang nhỏ'
    },
    '3xl': {
      size: '2.25rem',     // 36px
      lineHeight: '2.5rem', // 40px
      description: 'Tiêu đề chính của trang (Page Title)'
    },
    '4xl': {
      size: '2.5rem',      // 40px
      lineHeight: '3rem',  // 48px
      description: 'Tiêu đề trang lớn, thống kê, dashboard hero'
    },
  },

  // Cấu hình tiêu đề chuẩn (Semantic Headings)
  headings: {
    h1: {
      size: '2.25rem',     // 36px
      lineHeight: '2.5rem',
      fontWeight: '700',
    },
    h2: {
      size: '1.875rem',    // 30px
      lineHeight: '2.25rem',
      fontWeight: '600',
    },
    h3: {
      size: '1.5rem',      // 24px
      lineHeight: '2rem',
      fontWeight: '600',
    },
    h4: {
      size: '1.25rem',     // 20px
      lineHeight: '1.875rem',
      fontWeight: '600',
    },
    h5: {
      size: '1.125rem',    // 18px
      lineHeight: '1.75rem',
      fontWeight: '500',
    },
  },

  // Độ đậm của chữ (Font Weight)
  fontWeight: {
    light: '300',
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },

  // Khoảng cách giữa các chữ (Letter Spacing)
  letterSpacing: {
    tighter: '-0.05em',
    tight: '-0.025em',
    normal: '0em',
    wide: '0.025em',
    wider: '0.05em',
    widest: '0.1em',
  },
} as const;

export type SystemTypography = typeof TYPOGRAPHY;
