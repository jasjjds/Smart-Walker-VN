import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const role = request.cookies.get('userRole')?.value;
  const path = request.nextUrl.pathname;

  const isAuthRoute = path.startsWith('/auth');
  const isDashboardRoute = path.startsWith('/dashboard');

  // Special handling for change password page
  if (path === '/auth/change-password') {
    if (!token) {
      return NextResponse.redirect(new URL('/auth', request.url));
    }
    return NextResponse.next();
  }

  // 1. Nếu chưa đăng nhập mà truy cập dashboard -> chuyển hướng về /auth
  if (isDashboardRoute && !token) {
    return NextResponse.redirect(new URL('/auth', request.url));
  }

  // 2. Nếu đã đăng nhập mà truy cập trang auth -> chuyển hướng về trang dashboard tương ứng
  if (isAuthRoute && token) {
    if (role === 'DOCTOR') {
      return NextResponse.redirect(new URL('/dashboard/doctor/patients', request.url));
    }
    if (role === 'ADMIN') {
      return NextResponse.redirect(new URL('/dashboard/admin/users', request.url));
    }
    return NextResponse.redirect(new URL('/dashboard/patient', request.url));
  }

  // 3. Phân quyền chi tiết cho các route dashboard
  if (isDashboardRoute && token) {
    const isDoctorRoute = path.startsWith('/dashboard/doctor');
    const isAdminRoute = path.startsWith('/dashboard/admin');
    const isPatientRoute = path.startsWith('/dashboard/patient');

    if (isDoctorRoute && role !== 'DOCTOR' && role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }

    if (isAdminRoute && role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }

    if (isPatientRoute && role !== 'PATIENT' && role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/auth/:path*'],
};
