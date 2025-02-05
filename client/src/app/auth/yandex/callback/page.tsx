'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';

export default function YandexCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const code = searchParams.get('code');
    
    if (!code) {
      toast.error('Ошибка авторизации: код не получен');
      router.push('/auth/login');
      return;
    }

    // После успешного обмена кода route.ts перенаправит нас на /profile
    toast.success('Авторизация успешна');

  }, [router, searchParams]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-900">
      <div className="text-center">
        <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-zinc-400 border-t-purple-500 mx-auto"></div>
        <h2 className="text-xl font-semibold text-zinc-100">Выполняется вход...</h2>
        <p className="mt-2 text-zinc-400">Подождите, пока мы завершим авторизацию через Яндекс</p>
      </div>
    </div>
  );
}