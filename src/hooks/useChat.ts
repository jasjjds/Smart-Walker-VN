// src/hooks/useChat.ts

import { useState, useMemo } from 'react';
import { MOCK_CONTACTS, Contact } from '@/config/mockData';

export function useChat() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [activeChat, setActiveChat] = useState<string | null>(null);
  
  const contacts: Contact[] = MOCK_CONTACTS;

  const totalUnread = useMemo(() => {
    return contacts.reduce((sum, contact) => sum + contact.unread, 0);
  }, [contacts]);

  const currentContact = useMemo(() => {
    return contacts.find(c => c.id === activeChat) || null;
  }, [activeChat, contacts]);

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
    currentContact,
    totalUnread,
    handleCloseChat,
  };
}
