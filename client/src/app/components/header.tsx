"use client"

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { UserButton } from '@/app/components/user-button';
import { Button } from '@/app/components/ui/button';
import { useAuth } from '@/app/components/contexts/auth-context';

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
      className="sticky top-0 z-50 bg-zinc-900 border-b border-zinc-800"
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between px-6 h-16">
          <div className="flex-1">
            {/* Add your logo or other header content here */}
          </div>
          
          <AnimatePresence mode="wait">
            {!isLoading && (
              user ? (
                <motion.div
                  key="user-profile"
                  {...fadeInOut}
                  className="flex items-center gap-2"
                >
                  <div className="flex items-center gap-3 text-zinc-400">
                    <div className="h-8 w-8 rounded-full overflow-hidden ring-2 ring-zinc-700">
                      <img
                        src={user.avatarUrl || "/default-avatar.jpg"}
                        alt={user.username}
                        className="h-full w-full object-cover"
                      />
                    </div>
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
                  className="flex items-center gap-2"
                >
                  <Link href="/auth/login">
                    <Button 
                      variant="ghost" 
                      className="text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50"
                    >
                      Войти
                    </Button>
                  </Link>
                  <Link href="/auth/register">
                    <Button className="bg-zinc-800 text-zinc-200 hover:bg-zinc-700 transition-colors">
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