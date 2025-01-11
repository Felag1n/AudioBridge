'use client';

import { Search, Home, MessageSquare } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSearchStore } from '../lib/store/search-store';
import { cn } from '../lib/utils';
import { SearchModal } from './modals/SearchModal';

export function Sidebar() {
  const pathname = usePathname();
  const { openSearch } = useSearchStore();

  const isActive = (path: string) => pathname === path;

  return (
    <div className="w-64 flex-shrink-0 border-r border-zinc-800 p-4">
      <div className="flex flex-col gap-6">
        <Link href="/" className="flex items-center gap-2 text-xl font-semibold">
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500" />
          AudioBridge
        </Link>

        <nav className="flex flex-col gap-4">
          <Link
            href="/"
            className={cn(
              "flex items-center gap-2 rounded-md p-2 transition-colors",
              isActive('/') 
                ? "bg-zinc-800 text-zinc-100" 
                : "text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-100"
            )}
          >
            <Home size={20} />
            Главная
          </Link>

          <button
            onClick={openSearch}
            className="flex items-center gap-2 rounded-md p-2 text-zinc-400 transition-colors hover:bg-zinc-800/50 hover:text-zinc-100"
          >
            <Search size={20} />
            Поиск
          </button>

          <Link
            href="/chat"
            className={cn(
              "flex items-center gap-2 rounded-md p-2 transition-colors",
              isActive('/chat')
                ? "bg-zinc-800 text-zinc-100"
                : "text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-100"
            )}
          >
            <MessageSquare size={20} />
            Чат
          </Link>
        </nav>
      </div>
      <SearchModal />
    </div>
  );
}