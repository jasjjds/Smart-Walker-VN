// src/components/common/chatbox.tsx

import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { ChatContact, ChatMessage } from '@/services/chatService';

interface ChatboxProps {
  isChatOpen: boolean;
  setIsChatOpen: (val: boolean) => void;
  activeChat: number | null;
  setActiveChat: (id: number | null) => void;
  contacts: ChatContact[];
  pendingContacts: ChatContact[];
  messages: ChatMessage[];
  currentContact: ChatContact | null;
  totalUnread: number;
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  searchResults: ChatContact[];
  isSearching: boolean;
  sendMessage: (content: string) => void;
  acceptChat: (connectionId: number) => void;
  togglePinChat: (connectionId: number, pin: boolean) => void;
  handleCloseChat: (e: React.MouseEvent) => void;
}

export function Chatbox({
  isChatOpen,
  setIsChatOpen,
  activeChat,
  setActiveChat,
  contacts,
  pendingContacts,
  messages,
  currentContact,
  totalUnread,
  searchQuery,
  setSearchQuery,
  searchResults,
  isSearching,
  sendMessage,
  acceptChat,
  togglePinChat,
  handleCloseChat
}: ChatboxProps) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'chats' | 'pending'>('chats');
  const [messageText, setMessageText] = useState('');
  
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Cuộn xuống cuối cuộc hội thoại khi có tin nhắn mới hoặc khi mở chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (activeChat) {
      scrollToBottom();
    }
  }, [messages, activeChat]);

  const handleSend = () => {
    if (!messageText.trim()) return;
    sendMessage(messageText);
    setMessageText('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  // Xác định xem cuộc hội thoại đang pending và mình là người nhận (cần accept)
  const isPendingForMe = currentContact && 
    currentContact.status === 'pending' && 
    currentContact.initiated_by_id !== user?.id;

  // Xác định xem cuộc hội thoại đang pending và mình là người gửi (đang chờ accept)
  const isPendingSentByMe = currentContact && 
    currentContact.status === 'pending' && 
    currentContact.initiated_by_id === user?.id;

  return (
    // Ẩn nút Chatbox nổi ở mobile (dưới md screen)
    <div className="hidden md:flex fixed bottom-4 right-4 sm:bottom-6 sm:right-8 z-45 flex-col items-end font-sans">
      
      {/* Cửa sổ Chat */}
      <div
        className={`transition-all duration-300 origin-bottom-right ease-out ${isChatOpen ? 'scale-100 opacity-100 mb-4' : 'scale-0 opacity-0 h-0 w-0 m-0 pointer-events-none'}`}
      >
        <div className="w-[340px] h-[480px] bg-white rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.15)] border border-primary-200 flex flex-col overflow-hidden">
          
          {/* VIEW 1: DANH SÁCH LIÊN HỆ */}
          {activeChat === null ? (
            <div className="flex-1 flex flex-col h-full bg-white">
              {/* Header Danh sách */}
              <div className="bg-primary-900 p-4 flex justify-between items-center text-white shrink-0">
                <h3 className="font-bold text-lg">Tin nhắn</h3>
                <button onClick={handleCloseChat} className="p-1 hover:bg-white/20 rounded-full transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Thanh tìm kiếm */}
              <div className="p-3 border-b border-gray-100 shrink-0">
                <div className="bg-gray-100 rounded-full flex items-center px-3 py-2 text-gray-500">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Tìm theo tên, SĐT..."
                    className="bg-transparent border-none outline-none w-full text-sm placeholder-gray-400 font-medium"
                  />
                  {searchQuery && (
                    <button onClick={() => setSearchQuery('')} className="text-gray-400 hover:text-gray-600">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>

              {/* PHÂN TAB TIN NHẮN (Chỉ hiện khi không tìm kiếm) */}
              {!searchQuery && (
                <div className="flex border-b border-gray-100 text-sm shrink-0">
                  <button
                    onClick={() => setActiveTab('chats')}
                    className={`flex-1 py-2.5 text-center font-bold relative transition-colors ${
                      activeTab === 'chats' ? 'text-primary-900' : 'text-gray-400 hover:text-gray-600'
                    }`}
                  >
                    Hội thoại
                    {activeTab === 'chats' && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-900"></span>
                    )}
                  </button>
                  <button
                    onClick={() => setActiveTab('pending')}
                    className={`flex-1 py-2.5 text-center font-bold relative transition-colors ${
                      activeTab === 'pending' ? 'text-primary-900' : 'text-gray-400 hover:text-gray-600'
                    }`}
                  >
                    Chờ duyệt
                    {pendingContacts.length > 0 && (
                      <span className="ml-1.5 px-1.5 py-0.5 text-[10px] bg-red-500 text-white rounded-full font-black leading-none">
                        {pendingContacts.length}
                      </span>
                    )}
                    {activeTab === 'pending' && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-900"></span>
                    )}
                  </button>
                </div>
              )}

              {/* DANH SÁCH CUỘC TRÒ CHUYỆN */}
              <div className="flex-1 overflow-y-auto">
                {/* 1. Màn hình Tìm kiếm */}
                {searchQuery ? (
                  isSearching ? (
                    <div className="flex justify-center items-center py-10 text-slate-400">
                      <svg className="w-6 h-6 animate-spin text-primary-500 mr-2" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      <span className="text-xs font-bold">Đang tìm kiếm...</span>
                    </div>
                  ) : searchResults.length === 0 ? (
                    <div className="text-center py-10 text-gray-400 text-xs font-semibold">
                      Không tìm thấy liên hệ nào.
                    </div>
                  ) : (
                    searchResults.map((contact) => (
                      <div
                        key={contact.id}
                        onClick={() => {
                          setActiveChat(contact.id);
                          setSearchQuery('');
                        }}
                        className="flex items-center gap-3 p-3 hover:bg-primary-50 cursor-pointer transition-colors border-b border-gray-50"
                      >
                        <div className="w-10 h-10 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center font-black text-sm shrink-0 border border-primary-200">
                          {contact.avatar}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-sm text-primary-900 truncate">{contact.name}</h4>
                          <p className="text-xs text-gray-400 font-medium truncate">
                            {contact.phone} • {contact.role}
                          </p>
                        </div>
                        <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded text-gray-500 font-bold shrink-0">
                          {contact.status === 'accepted' ? 'Đã kết nối' : contact.status === 'pending' ? 'Chờ duyệt' : 'Mới'}
                        </span>
                      </div>
                    ))
                  )
                ) : (
                  /* 2. Màn hình Mặc định (Tabs) */
                  (activeTab === 'chats' ? contacts : pendingContacts).length === 0 ? (
                    <div className="text-center py-20 text-gray-400 text-xs font-semibold">
                      {activeTab === 'chats' 
                        ? 'Chưa có cuộc trò chuyện nào.' 
                        : 'Không có tin nhắn chờ nào.'}
                    </div>
                  ) : (
                    (activeTab === 'chats' ? contacts : pendingContacts).map((contact) => (
                      <div
                        key={contact.id}
                        onClick={() => setActiveChat(contact.id)}
                        className="flex items-center gap-3 p-3 hover:bg-primary-50 cursor-pointer transition-colors border-b border-gray-50 group"
                      >
                        {/* Avatar */}
                        <div className="relative shrink-0">
                          <div className="w-11 h-11 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center font-black text-base border border-primary-200">
                            {contact.avatar}
                          </div>
                          {contact.online && (
                            <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-white rounded-full"></span>
                          )}
                        </div>

                        {/* Meta info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-center mb-0.5">
                            <h4 className="font-bold text-sm text-primary-900 truncate pr-2">{contact.name}</h4>
                            {contact.last_message && (
                              <span className="text-[10px] text-gray-400 font-bold shrink-0">
                                {new Date(contact.last_message.created_at).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-400 font-medium truncate">
                            {contact.role} {contact.is_assigned_doctor && '• Bác sĩ điều trị'}
                          </p>
                          {contact.last_message && (
                            <p className={`text-xs mt-0.5 truncate ${contact.unread > 0 ? 'font-bold text-black' : 'text-gray-400'}`}>
                              {contact.last_message.sender_id === user?.id ? 'Bạn: ' : ''}
                              {contact.last_message.content}
                            </p>
                          )}
                        </div>

                        {/* Pin & Unread display */}
                        <div className="flex flex-col items-end gap-1.5 shrink-0">
                          {/* Pin Toggle Button */}
                          {activeTab === 'chats' && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                togglePinChat(contact.connection_id, !contact.is_pinned);
                              }}
                              className={`p-1 rounded-full transition-all hover:bg-gray-100 ${
                                contact.is_pinned 
                                  ? 'text-amber-500 scale-105' 
                                  : 'text-gray-300 opacity-0 group-hover:opacity-100 hover:text-amber-400'
                              }`}
                              title={contact.is_pinned ? "Bỏ ghim cuộc trò chuyện" : "Ghim lên đầu"}
                            >
                              <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                                <path d="M10 2a1 1 0 01.993.883L11 3v4.585l1.707 1.707A1 1 0 0113 10v1a1 1 0 01-.883.993L12 12h-1.585l-.707 3.707a1 1 0 01-1.936-.366L8 15v-3H6.883a1 1 0 01-.993-.883L5.75 11v-1a1 1 0 01.293-.707L7.75 7.585V3a1 1 0 011-1h1.25z" />
                              </svg>
                            </button>
                          )}

                          {contact.unread > 0 && (
                            <span className="w-4.5 h-4.5 bg-red-500 rounded-full flex items-center justify-center text-white text-[9px] font-black leading-none">
                              {contact.unread}
                            </span>
                          )}
                        </div>
                      </div>
                    ))
                  )
                )}
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
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <div className="min-w-0 max-w-[170px]">
                    <h4 className="font-bold text-sm truncate">{currentContact?.name}</h4>
                    <p className="text-[9px] text-sky-100 font-semibold">
                      {currentContact?.online ? "Đang hoạt động" : "Ngoại tuyến"} • {currentContact?.role}
                    </p>
                  </div>
                </div>
                <button onClick={() => setIsChatOpen(false)} className="p-1.5 hover:bg-white/20 rounded-full transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Danh sách tin nhắn */}
              <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-3">
                {messages.length === 0 ? (
                  <div className="flex-1 flex flex-col justify-center items-center text-center text-xs text-gray-400 gap-2 font-medium">
                    <svg className="w-8 h-8 opacity-25 text-primary-500 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    Hãy bắt đầu cuộc trò chuyện tư vấn sức khỏe...
                  </div>
                ) : (
                  messages.map((msg) => {
                    const isMine = msg.sender_id === user?.id;
                    return (
                      <div
                        key={msg.id}
                        className={`flex flex-col max-w-[80%] ${isMine ? 'self-end items-end' : 'self-start items-start'}`}
                      >
                        <div
                          className={`px-3 py-2 rounded-2xl text-xs font-semibold shadow-2xs leading-relaxed ${
                            isMine
                              ? 'bg-primary-500 text-white rounded-tr-none'
                              : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none'
                          }`}
                        >
                          {msg.content}
                        </div>
                        <span className="text-[9px] text-gray-400 mt-1 font-bold">
                          {new Date(msg.created_at).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Khung nhập tin nhắn hoặc Trạng thái Pending */}
              {isPendingForMe ? (
                /* 1. Tin nhắn chờ đối phương gửi - hiển thị Xác nhận */
                <div className="p-4 bg-white border-t border-gray-100 flex flex-col items-center gap-3 shrink-0 text-center shadow-md">
                  <p className="text-xs text-slate-500 font-bold leading-normal">
                    ⚠️ Người này gửi tin nhắn yêu cầu kết nối chat. Bạn có muốn đồng ý kết nối để trả lời tin nhắn không?
                  </p>
                  <button
                    onClick={() => acceptChat(currentContact.connection_id)}
                    className="w-full py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-black text-xs rounded-xl shadow-md transition-all active:scale-[0.98] tracking-wider"
                  >
                    ĐỒNG Ý KẾT NỐI (XÁC NHẬN)
                  </button>
                </div>
              ) : isPendingSentByMe ? (
                /* 2. Tin nhắn chờ do mình gửi đi */
                <div className="p-4 bg-white border-t border-gray-100 text-center shrink-0 text-xs text-gray-400 font-bold">
                  ⌛ Bạn đã gửi yêu cầu kết nối. Đang chờ người này xác nhận...
                </div>
              ) : (
                /* 3. Đã kết nối, nhắn tin bình thường */
                <div className="p-3 bg-white border-t border-gray-100 flex items-center gap-2 shrink-0">
                  <input
                    type="text"
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Nhập tin nhắn..."
                    className="flex-grow bg-gray-100 text-xs sm:text-sm px-4 py-2 rounded-full outline-none focus:bg-slate-50 focus:ring-1 focus:ring-primary-500 transition-all font-semibold text-slate-800"
                  />
                  <button
                    onClick={handleSend}
                    className="text-primary-500 hover:text-primary-900 transition-colors p-1.5 hover:bg-slate-100 rounded-full shrink-0"
                  >
                    <svg className="w-5 h-5 transform rotate-90" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                    </svg>
                  </button>
                </div>
              )}
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
