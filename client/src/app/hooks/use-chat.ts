//client\src\app\hooks\use-chat.ts


"use client"


import { useEffect, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';

// Типы данных
interface User {
  id: string;
  name: string;
  avatar?: string;
  online?: boolean;
  lastMessage?: {
    content: string;
    timestamp: string;
    unread?: boolean;
  };
}

interface Message {
  id: string;
  content: string;
  timestamp: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  status?: 'sent' | 'delivered' | 'read';
}

interface ChatState {
  users: User[];
  messages: Record<string, Message[]>;
  activeChat: string | null;
  isTyping: Record<string, boolean>;
  error: string | null;
}

const INITIAL_STATE: ChatState = {
  users: [],
  messages: {},
  activeChat: null,
  isTyping: {},
  error: null,
};

export const useChat = (currentUserId: string) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [state, setState] = useState<ChatState>(INITIAL_STATE);

  // Инициализация WebSocket соединения
  useEffect(() => {
    const socketInstance = io(process.env.NEXT_PUBLIC_WEBSOCKET_URL || 'http://localhost:3001', {
      auth: {
        userId: currentUserId,
      },
    });

    socketInstance.on('connect', () => {
      console.log('WebSocket connected');
    });

    socketInstance.on('connect_error', (error) => {
      setState(prev => ({ ...prev, error: 'Failed to connect to chat server' }));
      console.error('WebSocket connection error:', error);
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, [currentUserId]);

  // Прослушивание событий WebSocket
  useEffect(() => {
    if (!socket) return;

    // Получение списка пользователей
    socket.on('users', (users: User[]) => {
      setState(prev => ({ ...prev, users }));
    });

    // Получение истории сообщений
    socket.on('chat_history', ({ chatId, messages }: { chatId: string, messages: Message[] }) => {
      setState(prev => ({
        ...prev,
        messages: {
          ...prev.messages,
          [chatId]: messages,
        },
      }));
    });

    // Получение нового сообщения
    socket.on('new_message', ({ chatId, message }: { chatId: string, message: Message }) => {
      setState(prev => ({
        ...prev,
        messages: {
          ...prev.messages,
          [chatId]: [...(prev.messages[chatId] || []), message],
        },
      }));
    });

    // Обновление статуса сообщения
    socket.on('message_status', ({ messageId, chatId, status }: { messageId: string, chatId: string, status: Message['status'] }) => {
      setState(prev => ({
        ...prev,
        messages: {
          ...prev.messages,
          [chatId]: prev.messages[chatId]?.map(msg => 
            msg.id === messageId ? { ...msg, status } : msg
          ) || [],
        },
      }));
    });

    // Получение статуса набора текста
    socket.on('typing_status', ({ chatId, isTyping }: { chatId: string, isTyping: boolean }) => {
      setState(prev => ({
        ...prev,
        isTyping: {
          ...prev.isTyping,
          [chatId]: isTyping,
        },
      }));
    });

    // Обновление онлайн статуса пользователей
    socket.on('user_status', ({ userId, online }: { userId: string, online: boolean }) => {
      setState(prev => ({
        ...prev,
        users: prev.users.map(user => 
          user.id === userId ? { ...user, online } : user
        ),
      }));
    });

    return () => {
      socket.off('users');
      socket.off('chat_history');
      socket.off('new_message');
      socket.off('message_status');
      socket.off('typing_status');
      socket.off('user_status');
    };
  }, [socket]);

  // Отправка сообщения
  const sendMessage = useCallback((chatId: string, content: string) => {
    if (!socket) return;

    const messageId = `temp-${Date.now()}`;
    const tempMessage: Message = {
      id: messageId,
      content,
      timestamp: new Date().toISOString(),
      senderId: currentUserId,
      senderName: 'Me', // Будет заменено на серверной стороне
      status: 'sent',
    };

    // Оптимистичное обновление
    setState(prev => ({
      ...prev,
      messages: {
        ...prev.messages,
        [chatId]: [...(prev.messages[chatId] || []), tempMessage],
      },
    }));

    socket.emit('send_message', { chatId, content }, (error: any) => {
      if (error) {
        // Откат оптимистичного обновления в случае ошибки
        setState(prev => ({
          ...prev,
          messages: {
            ...prev.messages,
            [chatId]: prev.messages[chatId]?.filter(msg => msg.id !== messageId) || [],
          },
          error: 'Failed to send message',
        }));
      }
    });
  }, [socket, currentUserId]);

  // Установка активного чата
  const setActiveChat = useCallback((chatId: string | null) => {
    setState(prev => ({ ...prev, activeChat: chatId }));
    if (chatId && socket) {
      socket.emit('join_chat', { chatId });
      socket.emit('get_chat_history', { chatId });
    }
  }, [socket]);

  // Отправка статуса набора текста
  const sendTypingStatus = useCallback((chatId: string, isTyping: boolean) => {
    if (!socket) return;
    socket.emit('typing_status', { chatId, isTyping });
  }, [socket]);

  // Отправка статуса прочтения сообщений
  const markMessagesAsRead = useCallback((chatId: string) => {
    if (!socket) return;
    socket.emit('mark_messages_read', { chatId });
  }, [socket]);

  return {
    users: state.users,
    messages: state.messages,
    activeChat: state.activeChat,
    isTyping: state.isTyping,
    error: state.error,
    sendMessage,
    setActiveChat,
    sendTypingStatus,
    markMessagesAsRead,
  };
};