// src/hooks/useChat.ts

import { useState, useEffect, useRef, useMemo } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from '@/lib/auth-context';
import { chatService, ChatContact, ChatMessage } from '@/services/chatService';

export function useChat() {
  const { user, accessToken } = useAuth();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [activeChat, setActiveChat] = useState<number | null>(null); // other user's ID
  
  const [contacts, setContacts] = useState<ChatContact[]>([]);
  const [pendingContacts, setPendingContacts] = useState<ChatContact[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  
  const [loadingContacts, setLoadingContacts] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<ChatContact[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const socketRef = useRef<Socket | null>(null);

  // 1. Lấy danh sách liên hệ (Contacts)
  const fetchContacts = async () => {
    if (!accessToken) return;
    try {
      setLoadingContacts(true);
      const res = await chatService.getContacts() as any;
      if (res.success && res.data) {
        setContacts(res.data.accepted || []);
        setPendingContacts(res.data.pending || []);
      }
    } catch (err) {
      console.error('Lỗi khi lấy danh sách chat:', err);
    } finally {
      setLoadingContacts(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, [accessToken, isChatOpen]);

  // 2. Thiết lập kết nối WebSockets qua Socket.io
  useEffect(() => {
    if (!accessToken || !user) {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      return;
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3020/api';
    const socketUrl = apiUrl.replace(/\/api$/, '');

    // Khởi tạo socket connection
    const socket = io(socketUrl, {
      auth: { token: accessToken },
      transports: ['websocket']
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('⚡ Connected to socket server successfully!');
    });

    // Lắng nghe sự kiện nhận tin nhắn real-time
    socket.on('receive_message', (message: ChatMessage) => {
      console.log('📩 Nhận tin nhắn mới:', message);
      
      // Nếu tin nhắn thuộc về cuộc trò chuyện hiện tại đang mở, thêm vào list messages
      setActiveChat((currentActiveChat) => {
        if (currentActiveChat && (message.sender_id === currentActiveChat || message.receiver_id === currentActiveChat)) {
          setMessages((prev) => {
            if (prev.some((m) => m.id === message.id)) return prev;
            return [...prev, message];
          });
        }
        return currentActiveChat;
      });

      // Reload danh sách liên hệ để hiển thị tin nhắn mới nhất và update unread count
      fetchContacts();
    });

    // Lắng nghe xác nhận gửi tin nhắn thành công từ server
    socket.on('message_sent', (message: ChatMessage) => {
      console.log('📤 Đã gửi tin nhắn thành công:', message);
      
      setActiveChat((currentActiveChat) => {
        if (currentActiveChat && (message.sender_id === currentActiveChat || message.receiver_id === currentActiveChat)) {
          setMessages((prev) => {
            if (prev.some((m) => m.id === message.id)) return prev;
            return [...prev, message];
          });
        }
        return currentActiveChat;
      });

      fetchContacts();
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [accessToken, user?.id]);

  // 3. Lấy lịch sử cuộc trò chuyện khi click mở một cuộc chat
  useEffect(() => {
    const fetchMessages = async () => {
      if (!accessToken || !activeChat) return;
      try {
        setLoadingMessages(true);
        const res = await chatService.getMessages(activeChat) as any;
        if (res.success && res.data) {
          setMessages(res.data || []);
        }
        
        // Cập nhật lại danh sách contacts để xóa unread count cho chat này
        fetchContacts();
      } catch (err) {
        console.error('Lỗi khi lấy lịch sử tin nhắn:', err);
      } finally {
        setLoadingMessages(false);
      }
    };

    fetchMessages();
  }, [activeChat, accessToken]);

  // 4. Tìm kiếm người dùng theo tên / số điện thoại
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (!searchQuery.trim()) {
        setSearchResults([]);
        setIsSearching(false);
        return;
      }

      try {
        setIsSearching(true);
        const res = await chatService.searchContacts(searchQuery) as any;
        if (res.success && res.data) {
          setSearchResults(res.data || []);
        }
      } catch (err) {
        console.error('Lỗi khi tìm kiếm liên hệ:', err);
      } finally {
        setIsSearching(false);
      }
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  // 5. Gửi tin nhắn qua Socket
  const sendMessage = (content: string) => {
    if (!content.trim() || !activeChat || !socketRef.current) return;
    
    socketRef.current.emit('send_message', {
      receiver_id: activeChat,
      content: content.trim()
    });
  };

  // 6. Chấp nhận yêu cầu tin nhắn chờ (Accept)
  const acceptChat = async (connectionId: number) => {
    if (!accessToken) return;
    try {
      const res = await chatService.acceptConnection(connectionId) as any;
      if (res.success) {
        // Tải lại danh sách liên hệ để chuyển cuộc trò chuyện sang Accepted
        await fetchContacts();
      }
    } catch (err) {
      console.error('Lỗi khi chấp nhận kết nối chat:', err);
    }
  };

  // 7. Ghim / Bỏ ghim cuộc trò chuyện
  const togglePinChat = async (connectionId: number, pin: boolean) => {
    if (!accessToken) return;
    try {
      const res = await chatService.pinConnection(connectionId, pin) as any;
      if (res.success) {
        // Tải lại danh sách liên hệ để cập nhật lại vị trí ghim
        await fetchContacts();
      }
    } catch (err) {
      console.error('Lỗi khi ghim/bỏ ghim cuộc trò chuyện:', err);
    }
  };

  // Tổng số tin nhắn chưa đọc
  const totalUnread = useMemo(() => {
    return contacts.reduce((sum, contact) => sum + contact.unread, 0);
  }, [contacts]);

  // Đối tượng liên hệ hiện tại đang mở chat
  const currentContact = useMemo(() => {
    if (activeChat === null) return null;
    // Tìm trong danh sách accepted, pending, hoặc kết quả search
    return contacts.find(c => c.id === activeChat) || 
           pendingContacts.find(c => c.id === activeChat) || 
           searchResults.find(c => c.id === activeChat) || 
           null;
  }, [activeChat, contacts, pendingContacts, searchResults]);

  const handleCloseChat = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsChatOpen(false);
  };

  return {
    isChatOpen,
    setIsChatOpen,
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
    totalUnread,
    sendMessage,
    acceptChat,
    togglePinChat,
    handleCloseChat,
    refetchContacts: fetchContacts
  };
}
