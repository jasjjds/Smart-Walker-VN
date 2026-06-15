// src/components/common/chatbox.tsx

import React from 'react';
import { Contact } from '@/config/mockData';

interface ChatboxProps {
  isChatOpen: boolean;
  setIsChatOpen: (val: boolean) => void;
  activeChat: string | null;
  setActiveChat: (id: string | null) => void;
  contacts: Contact[];
  currentContact: Contact | null;
  totalUnread: number;
  handleCloseChat: (e: React.MouseEvent) => void;
}

export function Chatbox({
  isChatOpen,
  setIsChatOpen,
  activeChat,
  setActiveChat,
  contacts,
  currentContact,
  totalUnread,
  handleCloseChat
}: ChatboxProps) {
  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-8 z-45 flex flex-col items-end">

      {/* Cửa sổ Chat */}
      <div
        className={`transition-all duration-300 origin-bottom-right ease-out ${isChatOpen ? 'scale-100 opacity-100 mb-4' : 'scale-0 opacity-0 h-0 w-0 m-0 pointer-events-none'}`}
      >
        <div className="w-[calc(100vw-32px)] sm:w-[340px] h-[450px] sm:h-[480px] bg-white rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.15)] border border-primary-200 flex flex-col overflow-hidden">

          {/* VIEW 1: DANH SÁCH LIÊN HỆ */}
          {activeChat === null ? (
            <div className="flex-1 flex flex-col h-full bg-white">
              {/* Header Danh sách */}
              <div className="bg-primary-900 p-4 flex justify-between items-center text-white shrink-0">
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
                    className="flex items-center gap-3 p-3 hover:bg-primary-50 cursor-pointer transition-colors border-b border-gray-55"
                  >
                    {/* Avatar */}
                    <div className="relative shrink-0">
                      <div className="w-11 h-11 sm:w-12 sm:h-12 bg-primary-100 text-primary-500 rounded-full flex items-center justify-center font-black text-base sm:text-lg border border-primary-200">
                        {contact.avatar}
                      </div>
                      {contact.online && (
                        <span className="absolute bottom-0 right-0 w-3 h-3 sm:w-3.5 sm:h-3.5 bg-emerald-400 border-2 border-white rounded-full"></span>
                      )}
                    </div>

                    {/* Meta info */}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-sm text-primary-900 truncate">{contact.name}</h4>
                      <p className="text-xs text-gray-400 font-medium truncate">{contact.role}</p>
                    </div>

                    {/* Unread badge */}
                    {contact.unread > 0 && (
                      <span className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-[10px] font-bold shrink-0">
                        {contact.unread}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* VIEW 2: KHUNG CHAT CHI TIẾT */
            <div className="flex-1 flex flex-col h-full bg-neutral-50">
              {/* Header Chat */}
              <div className="bg-gradient-to-r from-primary-900 to-primary-500 p-3 flex justify-between items-center text-white shrink-0 shadow-sm">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveChat(null)}
                    className="p-1.5 hover:bg-white/20 rounded-full transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" /></svg>
                  </button>
                  <div>
                    <h4 className="font-bold text-sm">{currentContact?.name || "Người dùng"}</h4>
                    <p className="text-[10px] text-sky-100 font-medium">{currentContact?.online ? "Đang hoạt động" : "Ngoại tuyến"}</p>
                  </div>
                </div>
                <button onClick={() => setIsChatOpen(false)} className="p-1.5 hover:bg-white/20 rounded-full transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>

              {/* Nội dung hội thoại */}
              <div className="flex-grow p-4 overflow-y-auto flex flex-col justify-center items-center text-center text-xs text-gray-400 gap-2 font-medium">
                <svg className="w-10 h-10 opacity-30 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                Bắt đầu cuộc trò chuyện tư vấn sức khỏe...
              </div>

              {/* Ô soạn thảo tin nhắn */}
              <div className="p-3 bg-white border-t border-gray-100 flex items-center gap-2 shrink-0">
                <input
                  type="text"
                  placeholder="Nhập tin nhắn..."
                  className="flex-grow bg-gray-100 text-xs sm:text-sm px-4 py-2 rounded-full outline-none focus:bg-slate-50 focus:ring-1 focus:ring-primary-500 transition-all font-medium"
                />
                <button className="text-primary-500 hover:text-primary-900 transition-colors p-1.5 hover:bg-slate-100 rounded-full">
                  <svg className="w-5 h-5 transform rotate-90" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Nút FAB chính mở chatbox */}
      <button
        onClick={() => setIsChatOpen(!isChatOpen)}
        className={`relative w-12 h-12 sm:w-14 sm:h-14 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 transform active:scale-90 ${isChatOpen ? 'bg-white text-gray-400 border border-gray-200 rotate-90' : 'bg-primary-500 text-white hover:scale-105 shadow-primary-500/20'}`}
      >
        {isChatOpen ? (
          <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6 sm:w-7 sm:h-7" fill="currentColor" viewBox="0 0 20 20">
            <path d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" />
          </svg>
        )}
        {!isChatOpen && totalUnread > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 w-5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative rounded-full h-5 w-5 bg-red-500 border-2 border-white text-[8px] flex items-center justify-center font-bold text-white leading-none">
              {totalUnread}
            </span>
          </span>
        )}
      </button>
    </div>
  );
}
