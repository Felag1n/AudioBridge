//client\src\app\chat\page.tsx

'use client';

import React from 'react';
import { useChat } from '../hooks/use-chat';
import ChatList from '../components/chat/chat-list';
import ChatMessages from '../components/chat/chat-messages';
import ChatHeader from '../components/chat/chat-header';
import MessageInput from '../components/chat/message-input';
import { MessageCircle } from 'lucide-react';

// Временный ID пользователя, в реальном приложении получаем из авторизации
const CURRENT_USER_ID = 'current-user-id';

export default function ChatPage() {
  const {
    users,
    messages,
    activeChat,
    isTyping,
    sendMessage,
    setActiveChat,
    sendTypingStatus,
    markMessagesAsRead,
  } = useChat(CURRENT_USER_ID);

  const activeChatMessages = activeChat ? messages[activeChat] || [] : [];
  const activeUser = users.find(user => user.id === activeChat);

  const handleTypingStart = () => {
    if (activeChat) {
      sendTypingStatus(activeChat, true);
    }
  };

  const handleTypingEnd = () => {
    if (activeChat) {
      sendTypingStatus(activeChat, false);
    }
  };

  const handleSendMessage = (content: string) => {
    if (activeChat) {
      sendMessage(activeChat, content);
      handleTypingEnd();
    }
  };

  const handleChatSelect = (userId: string) => {
    setActiveChat(userId);
    markMessagesAsRead(userId);
  };

  return (
    <main className="flex h-[calc(100vh-80px)] bg-zinc-900">
      {/* Список чатов */}
      <div className="w-80 border-r border-zinc-800 flex flex-col bg-zinc-900">
        <div className="p-4 border-b border-zinc-800">
          <h2 className="text-xl font-semibold text-zinc-100">Сообщения</h2>
        </div>
        <ChatList
          users={users}
          activeUserId={activeChat}
          onUserSelect={handleChatSelect}
        />
      </div>

      {/* Основная область чата */}
      <div className="flex-1 flex flex-col bg-zinc-900">
        {activeUser ? (
          <>
            <ChatHeader user={activeUser} />
            <ChatMessages
              messages={activeChatMessages}
              currentUserId={CURRENT_USER_ID}
              isTyping={isTyping[activeChat || '']}
            />
            <MessageInput
              onSendMessage={handleSendMessage}
              onTypingStart={handleTypingStart}
              onTypingEnd={handleTypingEnd}
            />
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-zinc-400">
            <MessageCircle className="h-12 w-12 mb-4" />
            <h3 className="text-lg font-medium mb-2 text-zinc-100">Добро пожаловать в чат</h3>
            <p className="text-sm text-center max-w-sm">
              Выберите пользователя из списка слева, чтобы начать общение
            </p>
          </div>
        )}
      </div>
    </main>
  );
}