// src/sections/chat/view/chat-view.tsx

"use client";

import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useChat } from '@/hooks/useChat';
import { BackButton } from '@/components/custom/back-button';

export function ChatView() {
  const { user } = useAuth();
  const {
    activeChat,
    setActiveChat,
    contacts,
    pendingContacts,
    messages,
    loadingContacts,
    loadingMessages,
    searchQuery,
    setSearchQuery,
    searchResults,
    isSearching,
    currentContact,
    sendMessage,
    acceptChat,
    togglePinChat
  } = useChat();

  const [activeTab, setActiveTab] = useState<'chats' | 'pending'>('chats');
  const [messageText, setMessageText] = useState('');
  
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

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

  const isPendingForMe = currentContact && 
    currentContact.status === 'pending' && 
    currentContact.initiated_by_id !== user?.id;

  const isPendingSentByMe = currentContact && 
    currentContact.status === 'pending' && 
    currentContact.initiated_by_id === user?.id;

  return (
    <div className="w-full h-[calc(100vh-140px)] min-h-[450px] bg-white rounded-3xl border border-primary-200 shadow-sm flex overflow-hidden font-sans">
      
      {/* CỘT TRÁI: DANH SÁCH LIÊN HỆ */}
      {/* Ẩn cột trái trên mobile nếu có cuộc chat đang mở */}
      <div className={`w-full md:w-[320px] lg:w-[360px] border-r border-slate-200 flex flex-col shrink-0 ${
        activeChat !== null ? 'hidden md:flex' : 'flex'
      }`}>
        {/* Title & Search */}
        <div className="p-5 pb-3 shrink-0">
          <h2 className="text-xl font-black text-primary-900 mb-4">Trò chuyện</h2>
          
          <div className="bg-slate-100 rounded-2xl flex items-center px-4 py-3 text-slate-500 border border-slate-100 focus-within:bg-white focus-within:border-primary-400 focus-within:ring-1 focus-within:ring-primary-400 transition-all">
            <svg className="w-5 h-5 mr-3 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm theo số điện thoại, tên..."
              className="bg-transparent border-none outline-none w-full text-sm placeholder-slate-400 font-semibold text-slate-800"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="text-slate-400 hover:text-slate-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Tab Selection (Chỉ hiển thị khi không tìm kiếm) */}
        {!searchQuery && (
          <div className="flex border-b border-slate-100 text-sm shrink-0 px-4">
            <button
              onClick={() => setActiveTab('chats')}
              className={`flex-1 py-3 text-center font-extrabold relative transition-colors ${
                activeTab === 'chats' ? 'text-primary-900' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              Hội thoại
              {activeTab === 'chats' && (
                <span className="absolute bottom-0 left-4 right-4 h-0.75 bg-primary-900 rounded-full"></span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('pending')}
              className={`flex-1 py-3 text-center font-extrabold relative transition-colors ${
                activeTab === 'pending' ? 'text-primary-900' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              Yêu cầu chờ
              {pendingContacts.length > 0 && (
                <span className="ml-2 px-2 py-0.5 text-[10px] bg-red-500 text-white rounded-full font-black leading-none">
                  {pendingContacts.length}
                </span>
              )}
              {activeTab === 'pending' && (
                <span className="absolute bottom-0 left-4 right-4 h-0.75 bg-primary-900 rounded-full"></span>
              )}
            </button>
          </div>
        )}

        {/* List of Conversations */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
          {searchQuery ? (
            isSearching ? (
              <div className="flex justify-center items-center py-16 text-slate-400">
                <svg className="w-8 h-8 animate-spin text-primary-500 mr-2" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                <span className="text-xs font-bold">Đang tìm liên hệ...</span>
              </div>
            ) : searchResults.length === 0 ? (
              <div className="text-center py-16 text-slate-400 text-sm font-semibold">
                Không tìm thấy người dùng trùng khớp.
              </div>
            ) : (
              searchResults.map((contact) => (
                <div
                  key={contact.id}
                  onClick={() => {
                    setActiveChat(contact.id);
                    setSearchQuery('');
                  }}
                  className={`flex items-center gap-3.5 p-3.5 rounded-2xl hover:bg-slate-50 cursor-pointer transition-colors ${
                    activeChat === contact.id ? 'bg-primary-50/50' : ''
                  }`}
                >
                  <div className="w-11 h-11 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center font-black text-sm shrink-0 border border-primary-200 shadow-2xs">
                    {contact.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-sm text-primary-900 truncate">{contact.name}</h4>
                    <p className="text-xs text-gray-400 font-medium truncate mt-0.5">
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
            (activeTab === 'chats' ? contacts : pendingContacts).length === 0 ? (
              <div className="text-center py-24 text-slate-400 text-sm font-bold italic">
                {activeTab === 'chats' 
                  ? 'Chưa có lịch sử nhắn tin nào.' 
                  : 'Danh sách tin nhắn chờ trống.'}
              </div>
            ) : (
              (activeTab === 'chats' ? contacts : pendingContacts).map((contact) => (
                <div
                  key={contact.id}
                  onClick={() => setActiveChat(contact.id)}
                  className={`flex items-center gap-3.5 p-3.5 rounded-2xl hover:bg-slate-50 cursor-pointer transition-all border border-transparent group ${
                    activeChat === contact.id ? 'bg-primary-50/80 border-primary-100 shadow-2xs' : ''
                  }`}
                >
                  {/* Avatar */}
                  <div className="relative shrink-0">
                    <div className="w-12 h-12 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center font-black text-base border border-primary-200">
                      {contact.avatar}
                    </div>
                    {contact.online && (
                      <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-400 border-2 border-white rounded-full"></span>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-0.5">
                      <h4 className="font-bold text-sm text-primary-900 truncate pr-2">{contact.name}</h4>
                      {contact.last_message && (
                        <span className="text-[10px] text-gray-400 font-bold shrink-0">
                          {new Date(contact.last_message.created_at).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                      {contact.role} {contact.is_assigned_doctor && '• Bác sĩ điều trị'}
                    </p>
                    {contact.last_message && (
                      <p className={`text-xs mt-1 truncate ${contact.unread > 0 ? 'font-bold text-black' : 'text-slate-500'}`}>
                        {contact.last_message.sender_id === user?.id ? 'Bạn: ' : ''}
                        {contact.last_message.content}
                      </p>
                    )}
                  </div>

                  {/* Pin & Badge status */}
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    {activeTab === 'chats' && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          togglePinChat(contact.connection_id, !contact.is_pinned);
                        }}
                        className={`p-1 rounded-full transition-all hover:bg-slate-200/50 ${
                          contact.is_pinned 
                            ? 'text-amber-500 scale-105 opacity-100' 
                            : 'text-gray-300 opacity-0 group-hover:opacity-100 hover:text-amber-400'
                        }`}
                        title={contact.is_pinned ? "Bỏ ghim" : "Ghim"}
                      >
                        <svg className="w-4.5 h-4.5 fill-current" viewBox="0 0 20 20">
                          <path d="M10 2a1 1 0 01.993.883L11 3v4.585l1.707 1.707A1 1 0 0113 10v1a1 1 0 01-.883.993L12 12h-1.585l-.707 3.707a1 1 0 01-1.936-.366L8 15v-3H6.883a1 1 0 01-.993-.883L5.75 11v-1a1 1 0 01.293-.707L7.75 7.585V3a1 1 0 011-1h1.25z" />
                        </svg>
                      </button>
                    )}

                    {contact.unread > 0 && (
                      <span className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-[10px] font-black leading-none shadow-sm">
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

      {/* CỘT PHẢI: KHUNG CHAT CHI TIẾT */}
      {/* Hiển thị cột phải trên mobile chỉ khi có cuộc chat đang mở */}
      <div className={`flex-1 bg-neutral-50 h-full flex flex-col ${
        activeChat === null ? 'hidden md:flex' : 'flex'
      }`}>
        {activeChat === null ? (
          /* Trạng thái chưa chọn cuộc trò chuyện */
          <div className="flex-1 flex flex-col justify-center items-center text-slate-400 gap-4 p-8">
            <div className="w-20 h-20 bg-primary-50 rounded-full flex items-center justify-center text-primary-500 shadow-inner">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h3 className="font-extrabold text-slate-700 text-lg">Hộp thư tư vấn</h3>
            <p className="text-xs text-slate-400 max-w-xs text-center leading-relaxed font-semibold">
              Chọn một liên hệ từ danh sách bên trái hoặc sử dụng thanh tìm kiếm để bắt đầu cuộc trò chuyện.
            </p>
          </div>
        ) : (
          /* Trạng thái đang chat */
          <div className="flex-grow flex flex-col h-full overflow-hidden">
            {/* Header chat detail */}
            <div className="bg-white px-5 py-4 border-b border-slate-200 flex justify-between items-center shrink-0 shadow-xs">
              <div className="flex items-center gap-3">
                {/* Nút Quay lại cho Mobile */}
                <button
                  onClick={() => setActiveChat(null)}
                  className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-xl transition-all"
                  title="Quay lại danh sách"
                >
                  <svg className="w-5 h-5 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <div className="relative shrink-0">
                  <div className="w-11 h-11 bg-primary-50 text-primary-500 rounded-full flex items-center justify-center font-black text-sm border border-primary-200">
                    {currentContact?.avatar}
                  </div>
                  {currentContact?.online && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-white rounded-full"></span>
                  )}
                </div>
                <div>
                  <h4 className="font-black text-sm text-primary-900 leading-none mb-1">{currentContact?.name}</h4>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider leading-none">
                    {currentContact?.role} • {currentContact?.online ? 'Đang hoạt động' : 'Ngoại tuyến'}
                  </p>
                </div>
              </div>
              <div className="text-xs bg-slate-100 border border-slate-200 px-3.5 py-1.5 rounded-full font-bold shadow-xs text-slate-500 font-mono">
                ID: {currentContact?.id}
              </div>
            </div>

            {/* Khung chứa các tin nhắn */}
            <div className="flex-grow p-6 overflow-y-auto flex flex-col gap-4 custom-scrollbar">
              {loadingMessages ? (
                <div className="flex-grow flex flex-col items-center justify-center gap-2 text-slate-400">
                  <svg className="w-8 h-8 animate-spin text-primary-500" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  <span className="text-xs font-semibold">Đang tải lịch sử tin nhắn...</span>
                </div>
              ) : messages.length === 0 ? (
                <div className="flex-grow flex flex-col justify-center items-center text-center text-xs text-slate-400 gap-2 font-medium">
                  <svg className="w-10 h-10 opacity-25 text-primary-500 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  Gửi tin nhắn đầu tiên để bắt đầu kết nối tư vấn sức khỏe...
                </div>
              ) : (
                messages.map((msg) => {
                  const isMine = msg.sender_id === user?.id;
                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col max-w-[75%] ${isMine ? 'self-end items-end' : 'self-start items-start'}`}
                    >
                      <div
                        className={`px-4 py-3 rounded-2xl text-sm font-semibold shadow-xs leading-relaxed ${
                          isMine
                            ? 'bg-primary-500 text-white rounded-tr-none'
                            : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none'
                        }`}
                      >
                        {msg.content}
                      </div>
                      <span className="text-[9px] text-slate-400 mt-1 font-bold">
                        {new Date(msg.created_at).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Action Footer */}
            {isPendingForMe ? (
              /* Trạng thái tin nhắn chờ - Hiển thị nút Xác nhận */
              <div className="p-5 bg-white border-t border-slate-200 flex flex-col items-center gap-3 shrink-0 text-center shadow-md">
                <p className="text-xs sm:text-sm text-slate-500 font-bold leading-normal max-w-md">
                  ⚠️ Người dùng này đã gửi tin nhắn yêu cầu kết nối chat. Bạn cần xác nhận để bắt đầu trò chuyện qua lại.
                </p>
                <button
                  onClick={() => acceptChat(currentContact.connection_id)}
                  className="w-full max-w-sm py-3.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-black text-sm rounded-2xl shadow-lg hover:shadow-emerald-500/20 transition-all active:scale-[0.98] tracking-wider"
                >
                  ĐỒNG Ý KẾT NỐI (XÁC NHẬN)
                </button>
              </div>
            ) : isPendingSentByMe ? (
              /* Tin nhắn đang chờ đối phương duyệt */
              <div className="p-5 bg-white border-t border-slate-200 text-center shrink-0 text-xs sm:text-sm text-gray-400 font-bold">
                ⌛ Tin nhắn đã được gửi dưới dạng **Yêu cầu chờ kết nối**. Đang chờ người dùng này xác nhận...
              </div>
            ) : (
              /* Đã kết nối, nhắn tin bình thường */
              <div className="p-4 bg-white border-t border-slate-200 flex items-center gap-3 shrink-0">
                <input
                  type="text"
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Soạn tin nhắn tư vấn y tế..."
                  className="flex-grow bg-slate-100 text-sm px-5 py-3.5 rounded-2xl border border-slate-100 outline-none focus:bg-white focus:border-primary-400 focus:ring-1 focus:ring-primary-400 transition-all font-semibold text-slate-800 placeholder-slate-400 shadow-2xs"
                />
                <button
                  onClick={handleSend}
                  className="bg-primary-500 hover:bg-primary-900 text-white transition-all p-3.5 rounded-2xl shrink-0 shadow-md hover:shadow-primary-500/20 active:scale-95"
                >
                  <svg className="w-5 h-5 transform rotate-90 fill-current" viewBox="0 0 20 20">
                    <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        )}
      </div>

    </div>
  );
}
