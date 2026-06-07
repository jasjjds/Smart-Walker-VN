// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // 1. Lấy thông tin Role từ Cookie
  const role = request.cookies.get('userRole')?.value;
  const path = request.nextUrl.pathname;

  // 2. Định nghĩa logic phân quyền
  const isDoctorRoute = path.startsWith('/dashboard/doctor');
  const isAdminRoute = path.startsWith('/dashboard/admin');

  // 3. Kiểm tra và Điều hướng
  // Nếu vào trang Bác sĩ mà không phải Bác sĩ/Admin
  if (isDoctorRoute && role !== 'DOCTOR' && role !== 'ADMIN') {
    return NextResponse.redirect(new URL('/unauthorized', request.url));
  }

  // Nếu vào trang Admin mà không phải Admin
  if (isAdminRoute && role !== 'ADMIN') {
    return NextResponse.redirect(new URL('/unauthorized', request.url));
  }

  // Nếu hợp lệ, cho phép đi tiếp
  return NextResponse.next();
}

// Chỉ áp dụng Middleware cho các route cần thiết để tối ưu hiệu năng
export const config = {
  matcher: ['/dashboard/:path*'],
};