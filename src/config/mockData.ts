// src/config/mockData.ts

export interface Contact {
  id: string;
  name: string;
  role: string;
  online: boolean;
  unread: number;
  avatar: string;
}

export interface DailyExercise {
  id: number;
  name: string;
  duration: string;
  status: 'completed' | 'today' | 'upcoming';
  instruction: string;
}

export const MOCK_CONTACTS: Contact[] = [
  { id: 'bs_b', name: 'Bác sĩ Trần Văn B', role: 'Khoa Phục hồi chức năng', online: true, unread: 1, avatar: 'BS' },
  { id: 'bs_c', name: 'Bác sĩ Lê Thị C', role: 'Khoa Cơ xương khớp', online: false, unread: 0, avatar: 'LC' },
  { id: 'support', name: 'Hỗ trợ kỹ thuật', role: 'CSKH', online: true, unread: 0, avatar: 'HT' }
];

export const MOCK_DAILY_EXERCISES: DailyExercise[] = [
  { id: 1, name: "Tập giữ thăng bằng tại chỗ", duration: "10 phút", status: "completed", instruction: "Đứng vững, tay vịn nhẹ vào Smart Walker." },
  { id: 2, name: "Tập bước đi thẳng (Gait Training)", duration: "15 phút", status: "today", instruction: "Đi thẳng 20m, chú ý dồn lực đều 2 tay." },
  { id: 3, name: "Tập xoay người 180 độ", duration: "5 phút", status: "upcoming", instruction: "Xoay chậm, giữ trọng tâm ở giữa." }
];

export const MOCK_PATIENT_STATS = {
  defaultStreak: 5,
};
