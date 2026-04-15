"use client";

import React, { useState } from 'react';
import Link from 'next/link';

export default function PatientOverviewPage() {
  // Trạng thái mở/đóng toàn bộ Chatbox
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Trạng thái xem đang chat với ai (null = đang ở Danh sách liên hệ)
  const [activeChat, setActiveChat] = useState<string | null>(null);

  const patientStats = {
    name: "Nguyễn Văn A",
    streak: 5,
    totalWorkouts: 24,
    avgStability: 85,
    nextSession: "15:00 - Chiều nay"
  };

  // Danh sách liên hệ giả lập
  const contacts = [
    { id: 'bs_b', name: 'Bác sĩ Trần Văn B', role: 'Khoa Phục hồi chức năng', online: true, unread: 1, avatar: 'BS' },
    { id: 'bs_c', name: 'Bác sĩ Lê Thị C', role: 'Khoa Cơ xương khớp', online: false, unread: 0, avatar: 'LC' },
    { id: 'support', name: 'Hỗ trợ kỹ thuật', role: 'CSKH', online: true, unread: 0, avatar: 'HT' }
  ];

  // Tính tổng tin nhắn chưa đọc để hiện chấm đỏ ngoài nút chính
  const totalUnread = contacts.reduce((sum, contact) => sum + contact.unread, 0);

  // Lấy thông tin người đang chat hiện tại
  const currentContact = contacts.find(c => c.id === activeChat);

  // Hàm xử lý đóng chat
  const handleCloseChat = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsChatOpen(false);
  };

  return (
    <div className="w-full h-full flex flex-col gap-6 text-[#0c4a6e] overflow-y-auto custom-scrollbar pr-2 relative">

      {/* 1. KHỐI CHÀO MỪNG */}
      <div className="bg-gradient-to-r from-[#0c4a6e] to-[#0ea5e9] rounded-3xl p-8 text-white shadow-lg flex flex-col md:flex-row justify-between items-center gap-6 shrink-0">
        <div>
          <h1 className="text-3xl font-bold mb-2">Chào buổi sáng, {patientStats.name}! 👋</h1>
          <p className="text-[#f0f9ff]/80 font-medium">
            Bạn đã giữ vững phong độ tập luyện <span className="font-bold text-white bg-white/20 px-2 py-0.5 rounded-md">{patientStats.streak} ngày liên tiếp</span>. Hãy tiếp tục phát huy nhé!
          </p>
        </div>
        <Link href="/dashboard/progress" className="px-8 py-3 bg-white text-[#0c4a6e] font-black rounded-xl shadow-md hover:scale-105 transition-transform flex items-center gap-2 shrink-0">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          BẮT ĐẦU BÀI TẬP
        </Link>
      </div>

      {/* 2. CHỈ SỐ TÓM TẮT */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 shrink-0">
        <div className="bg-white rounded-2xl p-6 border border-[#bae6fd] shadow-sm flex items-center gap-5 hover:shadow-md transition-shadow">
          <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <div>
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Độ ổn định trung bình</h3>
            <div className="flex items-end gap-1 mt-1">
              <span className="text-3xl font-black text-[#0c4a6e]">{patientStats.avgStability}</span>
              <span className="text-sm font-bold text-gray-400 pb-1">/100</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-[#bae6fd] shadow-sm flex items-center gap-5 hover:shadow-md transition-shadow">
          <div className="w-14 h-14 rounded-full bg-[#e0f2fe] flex items-center justify-center text-[#0ea5e9] shrink-0">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
          </div>
          <div>
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Tổng số buổi đã tập</h3>
            <div className="flex items-end gap-1 mt-1">
              <span className="text-3xl font-black text-[#0c4a6e]">{patientStats.totalWorkouts}</span>
              <span className="text-sm font-bold text-gray-400 pb-1">buổi</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-[#bae6fd] shadow-sm flex items-center gap-5 hover:shadow-md transition-shadow">
          <div className="w-14 h-14 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 shrink-0">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <div>
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Lịch tập sắp tới</h3>
            <div className="flex items-end gap-1 mt-1">
              <span className="text-xl font-black text-[#0c4a6e]">{patientStats.nextSession}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. HOẠT ĐỘNG GẦN NHẤT */}
      <div className="flex-1 min-h-0 bg-white rounded-2xl p-6 border border-[#bae6fd] shadow-sm flex flex-col">
        <div className="flex justify-between items-center mb-6 shrink-0">
          <h3 className="text-lg font-bold">Lịch sử hoạt động gần đây</h3>
          <Link href="/dashboard/progress" className="text-sm font-bold text-[#0ea5e9] hover:underline">Xem lịch tập chi tiết</Link>
        </div>

        <div className="flex flex-col gap-4 overflow-y-auto pr-2 custom-scrollbar">
          {[
            { date: "Hôm qua, 15:30", duration: "15 phút", score: 88, status: "Tốt" },
            { date: "Thứ Hai, 09:00", duration: "20 phút", score: 82, status: "Tốt" },
            { date: "Thứ Bảy tuần trước", duration: "10 phút", score: 65, status: "Cần cố gắng" },
            { date: "Thứ Sáu tuần trước", duration: "20 phút", score: 90, status: "Xuất sắc" },
          ].map((log, index) => (
            <div key={index} className="flex items-center justify-between p-4 rounded-xl bg-[#f0f9ff] border border-[#e0f2fe] hover:border-[#bae6fd] transition-colors cursor-pointer">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-black ${log.score >= 80 ? 'bg-emerald-100 text-emerald-600' : 'bg-orange-100 text-orange-600'}`}>
                  {log.score}
                </div>
                <div>
                  <p className="font-bold text-[#0c4a6e]">{log.date}</p>
                  <p className="text-xs text-gray-500 mt-0.5">Thời gian tập: {log.duration}</p>
                </div>
              </div>
              <div className="text-right">
                <span className={`text-sm font-bold px-3 py-1.5 rounded-full ${log.score >= 80 ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'bg-orange-50 text-orange-600 border border-orange-200'}`}>
                  {log.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ========================================================= */}
      {/* 4. FACEBOOK-STYLE FLOATING CHATBOX */}
      {/* ========================================================= */}
      <div className="fixed bottom-6 right-8 z-50 flex flex-col items-end">

        {/* Cửa sổ Chat */}
        <div
          className={`transition-all duration-300 origin-bottom-right ease-out ${isChatOpen ? 'scale-100 opacity-100 mb-4' : 'scale-0 opacity-0 h-0 w-0 m-0 pointer-events-none'
            }`}
        >
          <div className="w-[340px] h-[480px] bg-white rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.15)] border border-[#bae6fd] flex flex-col overflow-hidden">

            {/* ============================== */}
            {/* VIEW 1: DANH SÁCH LIÊN HỆ      */}
            {/* ============================== */}
            {activeChat === null ? (
              <div className="flex-1 flex flex-col h-full bg-white">
                {/* Header Danh sách */}
                <div className="bg-[#0c4a6e] p-4 flex justify-between items-center text-white shrink-0">
                  <h3 className="font-bold text-lg">Tin nhắn</h3>
                  <button onClick={handleCloseChat} className="p-1 hover:bg-white/20 rounded-full transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>

                {/* Thanh tìm kiếm */}
                <div className="p-3 border-b border-gray-100 shrink-0">
                  <div className="bg-gray-100 rounded-full flex items-center px-3 py-2 text-gray-500">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                    <input type="text" placeholder="Tìm kiếm..." className="bg-transparent border-none outline-none w-full text-sm" />
                  </div>
                </div>

                {/* Danh sách người dùng */}
                <div className="flex-1 overflow-y-auto">
                  {contacts.map((contact) => (
                    <div
                      key={contact.id}
                      onClick={() => setActiveChat(contact.id)}
                      className="flex items-center gap-3 p-3 hover:bg-[#f0f9ff] cursor-pointer transition-colors border-b border-gray-50"
                    >
                      {/* Avatar */}
                      <div className="relative shrink-0">
                        <div className="w-12 h-12 bg-[#e0f2fe] text-[#0ea5e9] rounded-full flex items-center justify-center font-black text-lg border border-[#bae6fd]">
                          {contact.avatar}
                        </div>
                        {contact.online && (
                          <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-400 border-2 border-white rounded-full"></span>
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm truncate ${contact.unread > 0 ? 'font-bold text-[#0c4a6e]' : 'font-medium text-gray-700'}`}>
                          {contact.name}
                        </p>
                        <p className={`text-xs truncate ${contact.unread > 0 ? 'font-bold text-[#0ea5e9]' : 'text-gray-500'}`}>
                          {contact.role}
                        </p>
                      </div>

                      {/* Unread Badge */}
                      {contact.unread > 0 && (
                        <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-[10px] font-bold shrink-0 shadow-sm">
                          {contact.unread}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

            ) : (

              /* ============================== */
              /* VIEW 2: KHUNG CHAT CHI TIẾT  */
              /* ============================== */
              <div className="flex-1 flex flex-col h-full bg-[#f8fafc]">
                {/* Header Cửa sổ Chat */}
                <div className="bg-gradient-to-r from-[#0c4a6e] to-[#0ea5e9] p-3 flex justify-between items-center text-white shrink-0 shadow-sm">
                  <div className="flex items-center gap-2">
                    {/* Nút Quay lại (Back) */}
                    <button
                      onClick={() => setActiveChat(null)}
                      className="p-1.5 hover:bg-white/20 rounded-full transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" /></svg>
                    </button>

                    <div className="relative">
                      <div className="w-9 h-9 bg-white text-[#0ea5e9] rounded-full flex items-center justify-center font-black text-sm shadow-inner">
                        {currentContact?.avatar}
                      </div>
                      {currentContact?.online && (
                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-[#0ea5e9] rounded-full"></span>
                      )}
                    </div>
                    <div>
                      <p className="font-bold text-sm leading-tight">{currentContact?.name}</p>
                      <p className="text-[10px] text-[#e0f2fe] font-medium">{currentContact?.online ? 'Đang hoạt động' : 'Ngoại tuyến'}</p>
                    </div>
                  </div>
                  <button onClick={handleCloseChat} className="p-1.5 hover:bg-white/20 rounded-full transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>

                {/* Vùng Tin nhắn */}
                <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-4">
                  <div className="text-center">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Hôm nay, 08:45 AM</span>
                  </div>

                  {currentContact?.id === 'bs_b' ? (
                    <>
                      {/* Nội dung mẫu nếu chat với Bác sĩ B */}
                      <div className="flex items-end gap-2 max-w-[85%]">
                        <div className="w-7 h-7 rounded-full bg-[#0c4a6e] flex items-center justify-center text-white text-[10px] font-bold shrink-0">{currentContact?.avatar}</div>
                        <div className="bg-[#e0f2fe] border border-[#bae6fd] text-[#0c4a6e] text-[13px] p-3 rounded-2xl rounded-bl-sm shadow-sm leading-relaxed">
                          Chào anh A, kết quả phân tích dáng đi tuần này cho thấy anh đang dồn lực hơi nhiều sang tay phải. <br /><br />
                          Trong buổi tập chiều nay, anh chú ý đứng thẳng người và cố gắng chia đều lực sang cả tay trái nhé.
                        </div>
                      </div>
                      <div className="flex items-end gap-2 max-w-[85%] self-end">
                        <div className="bg-[#0ea5e9] text-white text-[13px] p-3 rounded-2xl rounded-br-sm shadow-sm leading-relaxed">
                          Vâng thưa bác sĩ, tôi sẽ chú ý hơn vào buổi tập chiều nay ạ!
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-center text-gray-400">
                      <svg className="w-12 h-12 mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                      <p className="text-xs">Bắt đầu cuộc trò chuyện với<br /><span className="font-bold">{currentContact?.name}</span></p>
                    </div>
                  )}
                </div>

                {/* Input nhập tin nhắn */}
                <div className="p-3 bg-white border-t border-gray-100 flex items-center gap-2">
                  <button className="text-[#0ea5e9] hover:bg-[#f0f9ff] p-2 rounded-full transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg>
                  </button>
                  <input
                    type="text"
                    placeholder="Nhập tin nhắn..."
                    className="flex-1 bg-gray-100 text-sm px-4 py-2.5 rounded-full outline-none focus:ring-2 focus:ring-[#0ea5e9]/30 transition-all"
                  />
                  <button className="text-[#0ea5e9] hover:bg-[#f0f9ff] p-2 rounded-full transition-colors">
                    <svg className="w-5 h-5 transform rotate-90" fill="currentColor" viewBox="0 0 20 20"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" /></svg>
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Nút Floating Action Button (Icon Tin nhắn) */}
        <button
          onClick={() => setIsChatOpen(!isChatOpen)}
          className={`relative w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 z-50 ${isChatOpen ? 'bg-white text-gray-400 border border-gray-200' : 'bg-[#0ea5e9] text-white hover:bg-[#0c4a6e]'
            }`}
        >
          {isChatOpen ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
          ) : (
            <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" /></svg>
          )}

          {/* Chấm đỏ thông báo tổng (Chỉ hiện khi khung chat đóng và có tin nhắn chưa đọc) */}
          {!isChatOpen && totalUnread > 0 && (
            <span className="absolute top-0 right-0 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 border-2 border-white flex items-center justify-center text-[8px] font-bold text-white">
                {totalUnread}
              </span>
            </span>
          )}
        </button>
      </div>

    </div>
  );
}