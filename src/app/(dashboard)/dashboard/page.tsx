import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function DashboardRoot() {
  const cookieStore = await cookies();
  const role = cookieStore.get('userRole')?.value;

  if (role === 'DOCTOR') {
    redirect('/dashboard/doctor/patients');
  } else if (role === 'ADMIN') {
    redirect('/dashboard/admin/users');
  } else {
    redirect('/dashboard/patient');
  }
}