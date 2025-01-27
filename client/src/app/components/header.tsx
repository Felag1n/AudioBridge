import { UserButton } from './user-button'
import Link from 'next/link';
import { Button } from './ui/button';
export function Header() {
  // Здесь будет проверка авторизации пользователя
  const isAuthenticated = false; // Временно для демонстрации

  return (
    <header className="border-b border-zinc-800 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Logo will be added here */}
        </div>
        
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <UserButton />
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
  );
}