//client\src\app\components\header.tsx

"use client"

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { UserButton } from '@/app/components/user-button';
import { Button } from '@/app/components/ui/button';
import { useAuth } from '@/app/components/contexts/auth-context';
import { Avatar, AvatarImage, AvatarFallback } from "@/app/components/ui/avatar";

export function Header() {
  const { user, isLoading } = useAuth();

  const fadeInOut = {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.3 }
  };

  return (
    <motion.header 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="sticky top-0 z-50 bg-gradient-to-r from-zinc-900 to-zinc-950 border-b border-zinc-800/50 backdrop-blur-sm"
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between px-6 h-16">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2">
      
           
            </Link>
          </div>
          
          <AnimatePresence mode="wait">
            {!isLoading && (
              user ? (
                <motion.div
                  key="user-profile"
                  {...fadeInOut}
                  className="flex items-center gap-3"
                >
                  <div className="flex items-center gap-3 text-zinc-400">
                    <Avatar className="h-8 w-8 ring-2 ring-zinc-700/50">
                      <AvatarImage src={user.avatarUrl} alt={user.username} />
                      <AvatarFallback>{user.username[0]}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium">
                      {user.username}
                    </span>
                  </div>
                  <UserButton />
                </motion.div>
              ) : (
                <motion.div
                  key="auth-buttons"
                  {...fadeInOut}
                  className="flex items-center gap-3"
                >
                  <Link href="/auth/login">
                    <Button 
                      variant="ghost" 
                      className="text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50 transition-colors"
                    >
                      Войти
                    </Button>
                  </Link>
                  <Link href="/auth/register">
                    <Button className="bg-gradient-to-r from-blue-500 to-purple-500 text-zinc-50 hover:from-blue-600 hover:to-purple-600 transition-all">
                      Регистрация
                    </Button>
                  </Link>
                </motion.div>
              )
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.header>
  );
}