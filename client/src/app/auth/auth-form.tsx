'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { authApi } from '@/app/services/api';
import { toast } from 'sonner';
import { useAuth } from '@/app/components/contexts/auth-context'; // Добавляем импорт useAuth

interface AuthFormProps {
  mode: 'login' | 'register';
}

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const { setUser } = useAuth(); // Получаем setUser из контекста
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });

  useEffect(() => {
    const checkAuth = async () => {
      const isAuthed = await authApi.checkAuth();
      if (isAuthed) {
        router.push('/profile');
      }
    };
    checkAuth();
  }, [router]);

  const handleYandexLogin = () => {
    window.location.href = '/api/auth/yandex';
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let response;
      if (mode === 'register') {
        response = await authApi.register(formData);
        toast.success('Регистрация успешна!');
      } else {
        response = await authApi.login({ 
          email: formData.email, 
          password: formData.password 
        });
        toast.success('Вход выполнен успешно!');
      }
      
      // Сохраняем данные пользователя
      if (response.user) {
        localStorage.setItem('userData', JSON.stringify(response.user));
        setUser(response.user); // Обновляем состояние пользователя в контексте
        window.dispatchEvent(new Event('auth-change')); // Вызываем событие auth-change
      }
      
      router.push('/profile');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Произошла ошибка');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full bg-zinc-900 text-zinc-50">
      <CardHeader>
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 p-1">
            <div className="flex h-full w-full items-center justify-center rounded-full bg-zinc-900">
              <svg className="h-6 w-6 text-zinc-50" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M12 3v7.26L6.37 15.1a1 1 0 0 1-1.64-.77V5.27A2.27 2.27 0 0 1 7 3h5zm1 0h5a2.27 2.27 0 0 1 2.27 2.27v9.06a1 1 0 0 1-1.64.77L13 10.26V3z"
                />
              </svg>
            </div>
          </div>
          <div className="space-y-1 text-center">
            <CardTitle className="text-2xl">
              {mode === 'login' ? 'Вход' : 'Регистрация'}
            </CardTitle>
            <p className="text-sm text-zinc-400">
              {mode === 'login' 
                ? 'Войдите в свой аккаунт'
                : 'Создайте новый аккаунт'}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <Input
              name="username"
              placeholder="Имя пользователя"
              value={formData.username}
              onChange={handleChange}
              disabled={isLoading}
              className="bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-400"
              required
            />
          )}
          <Input
            name="email"
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            disabled={isLoading}
            className="bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-400"
            required
          />
          <Input
            name="password"
            type="password"
            placeholder="Пароль"
            value={formData.password}
            onChange={handleChange}
            disabled={isLoading}
            className="bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-400"
            required
          />
          <Button 
            type="submit" 
            className="w-full" 
            disabled={isLoading}
          >
            {mode === 'login' ? 'Войти' : 'Зарегистрироваться'}
          </Button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-zinc-700" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-zinc-900 px-2 text-zinc-400">
              или
            </span>
          </div>
        </div>

        <Button 
          onClick={handleYandexLogin}
          className="w-full bg-[#FC3F1D] text-white hover:bg-[#FC3F1D]/90"
          disabled={isLoading}
        >
          <YandexIcon className="mr-2 h-5 w-5" />
          Войти через Яндекс
        </Button>

        <div className="text-center text-sm text-zinc-400">
          {mode === 'login' ? (
            <>
              Нет аккаунта?{' '}
              <Link href="/auth/register" className="text-purple-400 hover:underline">
                Зарегистрироваться
              </Link>
            </>
          ) : (
            <>
              Уже есть аккаунт?{' '}
              <Link href="/auth/login" className="text-purple-400 hover:underline">
                Войти
              </Link>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function YandexIcon(props: React.ComponentProps<'svg'>) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M2.04 12c0-5.523 4.476-10 10-10 5.522 0 10 4.477 10 10s-4.478 10-10 10c-5.524 0-10-4.477-10-10zm13.758-2.757L13.252 21h-2.503V9.243l2.503-7.757h2.546V9.243z"
        fill="currentColor"
      />
    </svg>
  );
}