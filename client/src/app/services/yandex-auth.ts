//client\src\app\services\yandex-auth.ts

import api from './api';

const REDIRECT_URI = 'http://localhost:3001/auth/yandex/callback'; // Убедитесь, что это точно совпадает с URL в настройках приложения

export const yandexAuth = {
  initiateAuth: () => {
    const clientId = process.env.NEXT_PUBLIC_YANDEX_CLIENT_ID;
    const url = `https://oauth.yandex.ru/authorize?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}`;
    window.location.href = url;
  },

  exchangeCode: async (code: string) => {
    try {
      const response = await api.post('/auth/yandex/', { 
        code,
        redirect_uri: REDIRECT_URI // Добавляем redirect_uri к запросу
      });
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('userData', JSON.stringify(response.data.user));
      }

      return response.data;
    } catch (error) {
      console.error('Ошибка авторизации через Яндекс:', error);
      throw error;
    }
  }
};