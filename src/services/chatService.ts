import axiosClient from '@/lib/axios';

export interface ChatContact {
  connection_id: number;
  id: number;
  name: string;
  phone: string;
  role: string;
  online: boolean;
  avatar: string;
  unread: number;
  is_pinned: boolean;
  is_doctor: boolean;
  is_assigned_doctor: boolean;
  status: 'pending' | 'accepted';
  initiated_by_id: number;
  last_message: {
    content: string;
    created_at: string;
    sender_id: number;
  } | null;
}

export interface ChatMessage {
  id: number;
  sender_id: number;
  receiver_id: number;
  content: string;
  is_read: boolean;
  created_at: string;
  connection_id?: number;
  status?: string;
}

export const chatService = {
  getContacts: () => {
    return axiosClient.get<{ accepted: ChatContact[]; pending: ChatContact[] }>('/v1/chats/contacts');
  },

  getMessages: (otherUserId: string | number) => {
    return axiosClient.get<ChatMessage[]>(`/v1/chats/history/${otherUserId}`);
  },

  searchContacts: (query: string) => {
    return axiosClient.get<ChatContact[]>('/v1/chats/search', { params: { query } });
  },

  acceptConnection: (connectionId: string | number) => {
    return axiosClient.patch(`/v1/chats/connections/${connectionId}/accept`);
  },

  pinConnection: (connectionId: string | number, pin: boolean) => {
    return axiosClient.patch(`/v1/chats/connections/${connectionId}/pin`, { pin });
  }
};
