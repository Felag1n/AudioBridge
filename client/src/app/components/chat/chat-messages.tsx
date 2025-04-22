//client\src\app\components\chat\chat-messages.tsx

import React, { useEffect, useRef } from 'react';
import { ScrollArea } from "../ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Check, CheckCheck } from 'lucide-react';

interface Message {
  id: string;
  content: string;
  timestamp: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  status?: 'sent' | 'delivered' | 'read';
}

interface ChatMessagesProps {
  messages: Message[];
  currentUserId: string;
  isTyping?: boolean;
}

const ChatMessages = ({ messages, currentUserId, isTyping }: ChatMessagesProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const lastMessageRef = useRef<HTMLDivElement>(null);

  // Автопрокрутка при новых сообщениях
  useEffect(() => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const formatMessageTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  // Группировка сообщений по отправителю для визуального объединения
  const groupMessages = (messages: Message[]) => {
    return messages.reduce((groups, message, index) => {
      const prevMessage = messages[index - 1];
      const nextMessage = messages[index + 1];
      
      const isFirstInGroup = !prevMessage || 
        prevMessage.senderId !== message.senderId || 
        new Date(message.timestamp).getTime() - new Date(prevMessage.timestamp).getTime() > 5 * 60 * 1000;
      
      const isLastInGroup = !nextMessage || 
        nextMessage.senderId !== message.senderId || 
        new Date(nextMessage.timestamp).getTime() - new Date(message.timestamp).getTime() > 5 * 60 * 1000;

      return [...groups, { ...message, isFirstInGroup, isLastInGroup }];
    }, [] as (Message & { isFirstInGroup: boolean; isLastInGroup: boolean })[]);
  };

  const groupedMessages = groupMessages(messages);

  const MessageStatus = ({ status }: { status?: Message['status'] }) => {
    if (!status) return null;
    
    return (
      <span className="ml-2">
        {status === 'sent' && <Check className="h-3 w-3 text-muted-foreground" />}
        {status === 'delivered' && <CheckCheck className="h-3 w-3 text-muted-foreground" />}
        {status === 'read' && <CheckCheck className="h-3 w-3 text-blue-500" />}
      </span>
    );
  };

  return (
    <ScrollArea className="flex-1 p-4">
      <div ref={scrollRef} className="space-y-4">
        {groupedMessages.map((message, index) => {
          const isOwnMessage = message.senderId === currentUserId;
          const ref = index === messages.length - 1 ? lastMessageRef : null;

          return (
            <div
              key={message.id}
              ref={ref}
              className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex ${isOwnMessage ? 'flex-row-reverse' : 'flex-row'} items-end gap-2 max-w-[70%]`}>
                {message.isLastInGroup && !isOwnMessage && (
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={message.senderAvatar} />
                    <AvatarFallback>{message.senderName[0]}</AvatarFallback>
                  </Avatar>
                )}
                
                <div className={`group flex flex-col ${isOwnMessage ? 'items-end' : 'items-start'}`}>
                  {message.isFirstInGroup && !isOwnMessage && (
                    <span className="text-xs text-muted-foreground ml-2 mb-1">
                      {message.senderName}
                    </span>
                  )}
                  
                  <div
                    className={`px-3 py-2 rounded-2xl break-words ${
                      isOwnMessage 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-muted'
                    } ${
                      message.isFirstInGroup 
                        ? isOwnMessage ? 'rounded-tr-md' : 'rounded-tl-md'
                        : ''
                    } ${
                      message.isLastInGroup 
                        ? isOwnMessage ? 'rounded-br-md' : 'rounded-bl-md'
                        : ''
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  </div>
                  
                  <div className={`flex items-center text-xs text-muted-foreground mt-1 opacity-0 group-hover:opacity-100 transition-opacity ${
                    isOwnMessage ? 'flex-row-reverse' : 'flex-row'
                  }`}>
                    <span>{formatMessageTime(message.timestamp)}</span>
                    {isOwnMessage && <MessageStatus status={message.status} />}
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {isTyping && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <div className="flex gap-1">
              <span className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" />
              <span className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce [animation-delay:0.2s]" />
              <span className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce [animation-delay:0.4s]" />
            </div>
            <span className="text-sm">Typing...</span>
          </div>
        )}
      </div>
    </ScrollArea>
  );
};

export default ChatMessages;