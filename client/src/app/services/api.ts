//client\src\app\services\api.ts
import axios, { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';

// Создание экземпляра axios с базовой конфигурацией
export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api', // Базовый URL для всех запросов
  headers: {
    'Content-Type': 'application/json',
  },
});

// Перехватчик запросов - добавляет токен авторизации к каждому запросу
api.interceptors.request.use(
  (config) => {
    // Check if we're in the browser environment
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Перехватчик ответов - обрабатывает ошибки авторизации
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Check if we're in the browser environment
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('userData');
        window.location.href = '/auth/login';
      }
    }
    return Promise.reject(error);
  }
);

// Интерфейсы для типизации данных

// Данные для регистрации
export interface RegisterData {
  username: string;
  email: string;
  password: string;
}

// Данные для входа
export interface LoginData {
  email: string;
  password: string;
}

// Ответ сервера при авторизации
export interface AuthResponse {
  user: {
    id: string;
    email: string;
    username: string;
  };
  token: string;
}

// Профиль пользователя
export interface UserProfile {
  username: string;
  email: string;
  library: {
    tracks_count: number;
    albums_count: number;
    playlists_count: number;
  };
}

// Данные для обновления профиля
interface UpdateProfileData {
  nickname?: string;
  avatar?: File | null;
}

// API для работы с пользователем
// API для работы с пользователем
export const userApi = {
  updateProfile: async (data: UpdateProfileData) => {
    try {
      const formData = new FormData();

      if (data.nickname) {
        formData.append('username', data.nickname);
      }

      if (data.avatar) {
        formData.append('avatar', data.avatar);
      }

      const response = await api.patch('/profile/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Get current user data
      const currentUserData = JSON.parse(localStorage.getItem('userData') || '{}');
      
      // Update with new data, preserving existing fields
      const updatedUserData = {
        ...currentUserData,
        ...response.data.user
      };

      localStorage.setItem('userData', JSON.stringify(updatedUserData));
      window.dispatchEvent(new Event('auth-change'));

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Ошибка при обновлении профиля');
      }
      throw error;
    }
  },

  getProfile: async () => {
    try {
      const response = await api.get('/profile/');
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Ошибка при получении профиля');
      }
      throw error;
    }
  },
};

// API для аутентификации
export const authApi = {
  // Регистрация нового пользователя
  register: async (data: RegisterData): Promise<AuthResponse> => {
    try {
      const response = await api.post<AuthResponse>('/register/', data);
      if (response.data.token) {
        // Сохраняем токен и данные пользователя в localStorage
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('userData', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw {
          message: error.response.data.message || 'Ошибка при регистрации',
          errors: error.response.data.errors,
        };
      }
      throw { message: 'Ошибка сети' };
    }
  },

  // Вход в систему
  login: async (data: LoginData): Promise<AuthResponse> => {
    try {
      const response = await api.post<AuthResponse>('/login/', data);
      if (response.data.token) {
        // Сохраняем токен и данные пользователя в localStorage
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('userData', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw {
          message: error.response.data.message || 'Ошибка при входе',
          errors: error.response.data.errors,
        };
      }
      throw { message: 'Ошибка сети' };
    }
  },

  // Выход из системы
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    window.location.href = '/login';
  },

  // Проверка авторизации
  checkAuth: async (): Promise<boolean> => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return false;

      await api.get('/verify/');
      return true;
    } catch {
      // Не удаляем токен при ошибке проверки
      return false;
    }
  },
};

// API для работы с профилем
export const profileApi = {
  // Получение профиля пользователя
  getProfile: async (): Promise<UserProfile> => {
    const response = await api.get('/profile/');
    return response.data;
  },

  // Обновление профиля
  updateProfile: async (data: Partial<UserProfile>): Promise<UserProfile> => {
    const response = await api.patch('/profile/', data);
    return response.data;
  },

  // Получение библиотеки пользователя
  getLibrary: async () => {
    const response = await api.get('/library/');
    return response.data;
  },
};

// Вспомогательная функция для проверки аутентификации
export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem('token');
};

export default api;