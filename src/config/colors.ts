// src/config/colors.ts

/**
 * Bảng màu hệ thống cố định (Fixed Colors)
 * Dùng để đồng bộ giao diện, tránh viết mã màu tùy tiện (hardcode) trong dự án.
 * 
 * Cách sử dụng:
 * 1. Trong CSS/Tailwind: Sử dụng các class như `bg-primary`, `text-neutral-700`, `border-success`
 * 2. Trong React/TS (inline style hoặc canvas/chart): `import { COLORS } from '@/config/colors'`
 */
export const COLORS = {
  // Màu chủ đạo (Brand Primary) - Professional Sky Blue (khớp với thương hiệu hiện tại)
  primary: {
    50: '#f0f9ff',
    100: '#e0f2fe',
    200: '#bae6fd',
    300: '#7dd3fc',
    400: '#38bdf8',
    500: '#0ea5e9', // Main Primary (Sky Blue)
    600: '#0284c7', // Hover Primary
    700: '#0369a1',
    800: '#075985',
    900: '#0c4a6e',
    DEFAULT: '#0ea5e9',
  },

  // Màu phụ (Accent/Secondary) - Vibrant Violet/Indigo
  secondary: {
    50: '#f5f3ff',
    100: '#ede9fe',
    200: '#ddd6fe',
    300: '#c4b5fd',
    400: '#a78bfa',
    500: '#8b5cf6', // Main Accent
    600: '#7c3aed',
    700: '#6d28d9',
    800: '#5b21b6',
    900: '#4c1d95',
    DEFAULT: '#8b5cf6',
  },

  // Hệ màu trung tính (Neutral) - Slate Gray
  neutral: {
    50: '#f8fafc',  // Nền phụ
    100: '#f1f5f9', // Nền chính (body background)
    200: '#e2e8f0', // Border, chia vạch
    300: '#cbd5e1', // Placeholder, border đậm hơn
    400: '#94a3b8', // Text phụ, icon nhạt
    500: '#64748b', // Text phụ, ghi chú
    600: '#475569', // Text phụ đậm
    700: '#334155', // Text chính (body text)
    800: '#1e293b', // Text tiêu đề (heading text)
    900: '#0f172a', // Màu gần đen
    white: '#ffffff',
    black: '#000000',
    DEFAULT: '#334155',
  },

  // Màu ngữ nghĩa (Semantic Colors)
  success: {
    light: '#f0fdf4',
    border: '#bbf7d0',
    main: '#22c55e',   // Success
    dark: '#16a34a',
    DEFAULT: '#22c55e',
  },

  warning: {
    light: '#fffbeb',
    border: '#fef3c7',
    main: '#eab308',   // Warning
    dark: '#ca8a04',
    DEFAULT: '#eab308',
  },

  error: {
    light: '#fef2f2',
    border: '#fee2e2',
    main: '#ef4444',   // Error/Danger
    dark: '#dc2626',
    DEFAULT: '#ef4444',
  },

  info: {
    light: '#f0f9ff',
    border: '#e0f2fe',
    main: '#06b6d4',   // Info/Cyan
    dark: '#0891b2',
    DEFAULT: '#06b6d4',
  },
} as const;

export type SystemColors = typeof COLORS;
