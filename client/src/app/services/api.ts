import axios, { AxiosError } from 'axios';

// Создание экземпляра axios с базовой конфигурацией
const api = axios.create({
  baseURL: 'http://localhost:8000/api', // Базовый URL для всех запросов
  headers: {
    'Content-Type': 'application/json',
  },
});

// Перехватчик запросов - добавляет токен авторизации к каждому запросу
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Перехватчик ответов - обрабатывает ошибки авторизации
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // При получении 401 ошибки (Unauthorized) - разлогиниваем пользователя
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('userData');
      window.location.href = '/login';
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
    window.location.href = '/auth/login';
  },

  // Проверка авторизации
  checkAuth: async (): Promise<boolean> => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return false;

      await api.get('/verify/');
      return true;
    } catch {
      localStorage.removeItem('token');
      localStorage.removeItem('userData');
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