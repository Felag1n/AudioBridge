//client\src\app\auth\auth-form.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { authApi } from '@/app/services/api';
import { yandexAuth } from '@/app/services/yandex-auth'; // Добавляем импорт
import { toast } from 'sonner';
import { useAuth } from '@/app/components/contexts/auth-context';

interface AuthFormProps {
  mode: 'login' | 'register';
}

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const { setUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        const isAuthed = await authApi.checkAuth();
        if (isAuthed) {
          router.push('/profile');
        } else {
          // Clear invalid token
          localStorage.removeItem('token');
          localStorage.removeItem('userData');
        }
      }
    };
    checkAuth();
  }, [router]);

  // Обновленная функция для входа через Яндекс
  const handleYandexLogin = () => {
    try {
      yandexAuth.initiateAuth();
    } catch (error) {
      console.error('Ошибка при инициализации входа через Яндекс:', error);
      toast.error('Не удалось выполнить вход через Яндекс');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (mode === 'register') {
      if (!formData.username) {
        newErrors.username = 'Имя пользователя обязательно';
      }
      if (!formData.email) {
        newErrors.email = 'Email обязателен';
      } else if (!formData.email.includes('@')) {
        newErrors.email = 'Введите корректный email';
      }
      if (!formData.password) {
        newErrors.password = 'Пароль обязателен';
      } else if (formData.password.length < 8) {
        newErrors.password = 'Пароль должен содержать минимум 8 символов';
      }
      if (mode === 'register' && formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Пароли не совпадают';
      }
    } else {
      if (!formData.email) {
        newErrors.email = 'Email обязателен';
      }
      if (!formData.password) {
        newErrors.password = 'Пароль обязателен';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});
  
    try {
      let response;
      if (mode === 'register') {
        response = await authApi.register({
          username: formData.username,
          email: formData.email,
          password: formData.password
        });
        toast.success('Регистрация успешна!');
      } else {
        response = await authApi.login({ 
          email: formData.email, 
          password: formData.password 
        });
        toast.success('Вход выполнен успешно!');
      }
      
      if (response.user) {
        const userData = {
          ...response.user,
          avatarUrl: (response.user as any).avatar_url || null
        };
        localStorage.setItem('userData', JSON.stringify(userData));
        setUser(userData);
      }
      
      router.push('/profile');
    } catch (error: any) {
      if (error.message) {
        toast.error(error.message);
      } else {
        toast.error('Произошла ошибка');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md bg-zinc-900/50 backdrop-blur-sm text-zinc-50 border-zinc-800 shadow-xl">
      <CardHeader>
        <div className="flex flex-col items-center gap-4">
          <div className="h-20 w-20 rounded-full bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 p-1 animate-pulse">
            <div className="flex h-full w-full items-center justify-center rounded-full bg-zinc-900">
              <svg className="h-10 w-10 text-zinc-50" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 3L12 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <path d="M8 7L8 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <path d="M16 7L16 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <path d="M4 11L4 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <path d="M20 11L20 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <path d="M6 9L6 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <path d="M18 9L18 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
          </div>
          <div className="space-y-1 text-center">
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
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
            <div className="space-y-2">
              <Input
                name="username"
                placeholder="Имя пользователя"
                value={formData.username}
                onChange={handleChange}
                disabled={isLoading}
                className={`bg-zinc-800/50 border-zinc-700 text-zinc-100 placeholder:text-zinc-400 focus:border-purple-500 focus:ring-purple-500 ${errors.username ? 'border-red-500' : ''}`}
                required
              />
              {errors.username && (
                <p className="text-sm text-red-500">{errors.username}</p>
              )}
            </div>
          )}
          <div className="space-y-2">
            <Input
              name="email"
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              disabled={isLoading}
              className={`bg-zinc-800/50 border-zinc-700 text-zinc-100 placeholder:text-zinc-400 focus:border-purple-500 focus:ring-purple-500 ${errors.email ? 'border-red-500' : ''}`}
              required
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email}</p>
            )}
          </div>
          <div className="space-y-2">
            <Input
              name="password"
              type="password"
              placeholder="Пароль"
              value={formData.password}
              onChange={handleChange}
              disabled={isLoading}
              className={`bg-zinc-800/50 border-zinc-700 text-zinc-100 placeholder:text-zinc-400 focus:border-purple-500 focus:ring-purple-500 ${errors.password ? 'border-red-500' : ''}`}
              required
            />
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password}</p>
            )}
          </div>
          {mode === 'register' && (
            <div className="space-y-2">
              <Input
                name="confirmPassword"
                type="password"
                placeholder="Подтвердите пароль"
                value={formData.confirmPassword}
                onChange={handleChange}
                disabled={isLoading}
                className={`bg-zinc-800/50 border-zinc-700 text-zinc-100 placeholder:text-zinc-400 focus:border-purple-500 focus:ring-purple-500 ${errors.confirmPassword ? 'border-red-500' : ''}`}
                required
              />
              {errors.confirmPassword && (
                <p className="text-sm text-red-500">{errors.confirmPassword}</p>
              )}
            </div>
          )}
          <Button 
            type="submit" 
            className="w-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 text-white font-medium" 
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
              </div>
            ) : (
              mode === 'login' ? 'Войти' : 'Зарегистрироваться'
            )}
          </Button>
        </form>
        
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-zinc-700" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-zinc-900/50 px-2 text-zinc-400">
              или
            </span>
          </div>
        </div>

        <Button 
          onClick={handleYandexLogin}
          className="w-full bg-[#FC3F1D] text-white hover:bg-[#FC3F1D]/90 transition-colors duration-200"
          disabled={isLoading}
        >
          <YandexIcon className="mr-2 h-5 w-5" />
          Войти через Яндекс
        </Button>

        <div className="text-center text-sm text-zinc-400">
          {mode === 'login' ? (
            <>
              Нет аккаунта?{' '}
              <Link href="/auth/register" className="text-purple-400 hover:text-purple-300 transition-colors duration-200">
                Зарегистрироваться
              </Link>
            </>
          ) : (
            <>
              Уже есть аккаунт?{' '}
              <Link href="/auth/login" className="text-purple-400 hover:text-purple-300 transition-colors duration-200">
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