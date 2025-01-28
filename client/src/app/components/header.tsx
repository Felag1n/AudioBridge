"use client"

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { UserButton } from './user-button'
import { Button } from './ui/button'
import { isAuthenticated } from '@/app/services/api'

interface User {
  username: string;
  email: string;
}

export function Header() {
  const [user, setUser] = useState<User | null>(null)
  const [isAuth, setIsAuth] = useState(false)

  useEffect(() => {
    const checkAuth = () => {
      const auth = isAuthenticated()
      setIsAuth(auth)
      
      if (auth) {
        const userData = localStorage.getItem('userData')
        if (userData) {
          setUser(JSON.parse(userData))
        }
      }
    }

    // Начальная проверка
    checkAuth()

    // Обновление при изменении localStorage
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'userData' || e.key === 'token') {
        checkAuth()
      }
    }

    window.addEventListener('storage', handleStorageChange)
    
    // Дополнительное событие для обновления состояния
    window.addEventListener('auth-change', checkAuth)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('auth-change', checkAuth)
    }
  }, [])

  return (
    <header className="border-b border-zinc-800 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-xl font-bold">
            AudioBridge
          </Link>
        </div>
        
        <div className="flex items-center gap-3">
          {isAuth && user ? (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 overflow-hidden rounded-full bg-zinc-800">
                  <img
                    src="/api/placeholder/32/32"
                    alt={user.username}
                    className="h-full w-full object-cover"
                  />
                </div>
                <span className="text-sm font-medium text-zinc-100">
                  {user.username}
                </span>
              </div>
              <UserButton />
            </div>
          ) : (
            <>
              <Link href="/auth/login">
                <Button variant="ghost" className="text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800">
                  Войти
                </Button>
              </Link>
              <Link href="/auth/register">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Регистрация
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}