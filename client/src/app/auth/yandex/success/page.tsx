// src/app/auth/yandex/success/page.tsx
'use client'

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function YandexSuccessPage() {
  const router = useRouter();
  const [status, setStatus] = useState('Обработка данных авторизации...');
  const [debug, setDebug] = useState([]);

  // Добавляем отладочную информацию
  const addDebug = (msg) => {
    console.log(msg);
    setDebug(prev => [...prev, msg]);
  };

  useEffect(() => {
    try {
      addDebug('Начало обработки данных авторизации');
      
      // Получаем данные из hash части URL (без символа #)
      const hash = window.location.hash.substring(1);
      addDebug(`Hash URL: ${hash ? hash.substring(0, 20) + '...' : 'отсутствует'}`);
      
      if (!hash) {
        setStatus('Ошибка: данные авторизации отсутствуют');
        toast.error('Не удалось получить данные авторизации');
        setTimeout(() => router.push('/auth/login'), 2000);
        return;
      }
      
      // Парсим параметры из hash
      const params = {};
      hash.split('&').forEach(param => {
        const [key, value] = param.split('=');
        params[key] = decodeURIComponent(value);
      });
      
      const { token, userData } = params;
      addDebug(`Токен получен: ${token ? 'Да' : 'Нет'}`);
      addDebug(`Данные пользователя получены: ${userData ? 'Да' : 'Нет'}`);
      
      if (!token || !userData) {
        setStatus('Ошибка: неполные данные авторизации');
        toast.error('Неполные данные авторизации');
        setTimeout(() => router.push('/auth/login'), 2000);
        return;
      }
      
      // Сохраняем токен в localStorage
      localStorage.setItem('token', token);
      addDebug('Токен сохранен в localStorage');
      
      // Парсим и сохраняем данные пользователя
      const userDataObj = JSON.parse(userData);
      localStorage.setItem('userData', JSON.stringify(userDataObj));
      addDebug('Данные пользователя сохранены в localStorage');
      
      // Проверяем, что данные сохранились
      const savedToken = localStorage.getItem('token');
      const savedUserData = localStorage.getItem('userData');
      addDebug(`Проверка сохранения: token=${!!savedToken}, userData=${!!savedUserData}`);
      
      setStatus('Авторизация успешно завершена!');
      toast.success('Вы успешно вошли в систему');
      
      // Выполняем перенаправление немного позже
      addDebug('Подготовка к перенаправлению на /profile');
      setTimeout(() => {
        addDebug('Выполнение перенаправления');
        window.location.href = '/profile'; // Используем прямое перенаправление вместо router.push
      }, 2000);
    } catch (error) {
      console.error('Ошибка при обработке данных авторизации:', error);
      addDebug(`Ошибка: ${error.message}`);
      setStatus('Произошла ошибка при обработке данных авторизации');
      toast.error('Ошибка при обработке данных авторизации');
      setTimeout(() => router.push('/auth/login'), 2000);
    }
  }, [router]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-900 p-4">
      <div className="text-center max-w-md w-full">
        <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-zinc-400 border-t-purple-500 mx-auto"></div>
        <h2 className="text-xl font-semibold text-zinc-100 mb-2">{status}</h2>
        <p className="mb-6 text-zinc-400">Пожалуйста, подождите...</p>
        
        {/* Отладочная информация */}
        <div className="mt-8 text-left text-xs text-zinc-500 overflow-auto max-h-48 bg-zinc-800/50 p-2 rounded">
          <h3 className="font-bold mb-1">Отладочная информация:</h3>
          {debug.map((msg, i) => (
            <div key={i} className="mb-1">{msg}</div>
          ))}
        </div>
        
        {/* Ручное перенаправление */}
        <button 
          onClick={() => window.location.href = '/profile'} 
          className="mt-4 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
        >
          Перейти в профиль вручную
        </button>
      </div>
    </div>
  );
}