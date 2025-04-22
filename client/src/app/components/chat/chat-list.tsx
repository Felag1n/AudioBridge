//client\src\app\components\chat\chat-list.tsx

import React from 'react';
import { ScrollArea } from "../ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Input } from "../ui/input";
import { Search } from 'lucide-react';

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
  
  interface ChatListProps {
    users: User[];
    activeUserId?: string | null;
    onUserSelect: (userId: string) => void;
  }
  
  const ChatList = ({ users, activeUserId, onUserSelect }: ChatListProps) => {
    const [searchQuery, setSearchQuery] = React.useState('');
  
    const filteredUsers = users.filter(user => 
      user.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  
    const formatLastSeen = (timestamp: string) => {
      const date = new Date(timestamp);
      const now = new Date();
      const diff = now.getTime() - date.getTime();
      
      if (diff < 24 * 60 * 60 * 1000) {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      }
      if (diff < 7 * 24 * 60 * 60 * 1000) {
        return date.toLocaleDateString([], { weekday: 'short' });
      }
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    };
  
    return (
      <>
        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
            <Input
              placeholder="Поиск в сообщениях..."
              className="pl-9 bg-zinc-800/50 border-zinc-700 text-zinc-100 placeholder:text-zinc-400
                focus-visible:ring-zinc-700 focus-visible:border-zinc-700"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
        <ScrollArea className="flex-1">
          <div className="flex flex-col">
            {filteredUsers.map((user) => (
              <div
                key={user.id}
                onClick={() => onUserSelect(user.id)}
                className={cn(
                  "flex items-center gap-3 p-4 cursor-pointer transition-colors",
                  "hover:bg-zinc-800/50",
                  activeUserId === user.id ? 'bg-zinc-800' : '',
                  user.lastMessage?.unread ? 'bg-zinc-800/30' : ''
                )}
              >
                <div className="relative">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback className="bg-zinc-700 text-zinc-100">
                      {user.name[0]}
                    </AvatarFallback>
                  </Avatar>
                  {user.online && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full 
                      ring-2 ring-zinc-900" />
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <span className="font-medium text-zinc-100 truncate">
                      {user.name}
                    </span>
                    {user.lastMessage && (
                      <span className="text-xs text-zinc-400 ml-2">
                        {formatLastSeen(user.lastMessage.timestamp)}
                      </span>
                    )}
                  </div>
                  
                  {user.lastMessage && (
                    <div className="flex items-center gap-2">
                      <span className={cn(
                        "text-sm truncate",
                        user.lastMessage.unread 
                          ? 'text-zinc-100 font-medium' 
                          : 'text-zinc-400'
                      )}>
                        {user.lastMessage.content}
                      </span>
                      {user.lastMessage.unread && (
                        <span className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full" />
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </>
    );
  };
  
  export default ChatList;