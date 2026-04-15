import { redirect } from 'next/navigation';

export default function DashboardRoot() {
  // ---------------------------------------------------------
  // TODO: TƯƠNG LAI KHI TÍCH HỢP AUTHENTICATION (VD: NextAuth)
  // ---------------------------------------------------------
  // const session = await getSession();
  // const role = session?.user?.role;
  // 
  // if (role === 'doctor') redirect('/dashboard/doctor');
  // else if (role === 'admin') redirect('/dashboard/admin/users');
  // else redirect('/dashboard/patient');
  // ---------------------------------------------------------

  // Hiện tại: Chuyển hướng mặc định (Hardcode) về trang Bệnh nhân để test
  redirect('/dashboard/patient');
}