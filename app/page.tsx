import { redirect } from 'next/navigation';

export default function Home() {
  // Chuyển hướng người dùng từ trang chủ gốc (/) thẳng vào màn hình Dashboard
  redirect('/home');
}