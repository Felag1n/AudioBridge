//client\src\app\components\chat\chat-header.tsx

import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

interface User {
  id: string;
  name: string;
  avatar?: string;
  online?: boolean;
}

interface ChatHeaderProps {
  user: User;
}

const ChatHeader = ({ user }: ChatHeaderProps) => {
  return (
    <div className="flex items-center gap-3 p-4 border-b bg-background">
      <div className="relative">
        <Avatar className="h-8 w-8">
          <AvatarImage src={user.avatar} />
          <AvatarFallback>{user.name[0]}</AvatarFallback>
        </Avatar>
        {user.online && (
          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full ring-2 ring-background" />
        )}
      </div>
      <div className="flex flex-col">
        <span className="font-medium text-sm">{user.name}</span>
        <span className="text-xs text-muted-foreground">
          {user.online ? 'Online' : 'Offline'}
        </span>
      </div>
    </div>
  );
};

export default ChatHeader;