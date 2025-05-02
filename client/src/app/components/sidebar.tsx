//client\src\app\components\sidebar.tsx

'use client';

import { Search, Home, MessageSquare, Upload, User, Music, Disc } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSearchStore } from '../lib/store/search-store';
import { cn } from '../lib/utils';
import { SearchModal } from './modals/SearchModal';
import { useAuth } from '../components/contexts/auth-context';
import { motion } from 'framer-motion';

export function Sidebar() {
  const pathname = usePathname();
  const { openSearch } = useSearchStore();
  const { user } = useAuth();

  const isActive = (path: string) => pathname === path;

  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="w-64 flex-shrink-0 border-r border-zinc-800/50 bg-gradient-to-b from-zinc-900 to-zinc-950 p-6"
    >
      <div className="flex flex-col gap-8">
        <Link href="/" className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500" />
          <span className="text-lg font-semibold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            AudioBridge
          </span>
        </Link>

        <nav className="flex flex-col gap-1">
          <Link
            href="/"
            className={cn(
              "flex items-center gap-3 rounded-lg p-2.5 transition-all duration-200",
              isActive('/') 
                ? "bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-zinc-100" 
                : "text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-100"
            )}
          >
            <Home size={20} className="shrink-0" />
            <span className="text-sm font-medium">Главная</span>
          </Link>

          {user && (
            <>
              <button
                onClick={openSearch}
                className="flex items-center gap-3 rounded-lg p-2.5 text-zinc-400 transition-all duration-200 hover:bg-zinc-800/50 hover:text-zinc-100 text-left"
              >
                <Search size={20} className="shrink-0" />
                <span className="text-sm font-medium">Поиск</span>
              </button>

              <Link
                href="/chat"
                className={cn(
                  "flex items-center gap-3 rounded-lg p-2.5 transition-all duration-200",
                  isActive('/chat')
                    ? "bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-zinc-100"
                    : "text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-100"
                )}
              >
                <MessageSquare size={20} className="shrink-0" />
                <span className="text-sm font-medium">Чат</span>
              </Link>
            </>
          )}
          
          {user && (
            <>
              <div className="mt-6 mb-2 px-2">
                <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                  Библиотека
                </span>
              </div>
              
              <Link
                href="/upload"
                className={cn(
                  "flex items-center gap-3 rounded-lg p-2.5 transition-all duration-200",
                  isActive('/upload')
                    ? "bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-zinc-100"
                    : "text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-100"
                )}
              >
                <Upload size={20} className="shrink-0" />
                <span className="text-sm font-medium">Загрузить</span>
              </Link>
              
              <Link
                href="/profile"
                className={cn(
                  "flex items-center gap-3 rounded-lg p-2.5 transition-all duration-200",
                  pathname.startsWith('/profile')
                    ? "bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-zinc-100"
                    : "text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-100"
                )}
              >
                <User size={20} className="shrink-0" />
                <span className="text-sm font-medium">Мой профиль</span>
              </Link>
              
              <Link
                href="/profile/tracks"
                className={cn(
                  "flex items-center gap-3 rounded-lg p-2.5 transition-all duration-200",
                  pathname.startsWith('/profile/tracks')
                    ? "bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-zinc-100"
                    : "text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-100"
                )}
              >
                <Music size={20} className="shrink-0" />
                <span className="text-sm font-medium">Мои треки</span>
              </Link>
              
              <Link
                href="/profile/albums"
                className={cn(
                  "flex items-center gap-3 rounded-lg p-2.5 transition-all duration-200",
                  pathname.startsWith('/profile/albums')
                    ? "bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-zinc-100"
                    : "text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-100"
                )}
              >
                <Disc size={20} className="shrink-0" />
                <span className="text-sm font-medium">Мои альбомы</span>
              </Link>
            </>
          )}
        </nav>
      </div>
      <SearchModal />
    </motion.div>
  );
}