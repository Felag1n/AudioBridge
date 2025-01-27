import axios, { AxiosError } from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Добавляем интерцептор для добавления токена к запросам
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Добавляем интерцептор для обработки ошибок
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Если получаем 401, очищаем токен
      localStorage.removeItem('token');
    }
    return Promise.reject(error);
  }
);

export interface RegisterData {
  username: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    username: string;
  };
  token: string;
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}

export const authApi = {
  register: async (data: RegisterData): Promise<AuthResponse> => {
    try {
      const response = await api.post<AuthResponse>('/auth/register', data);
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw {
          message: error.response.data.message || 'Ошибка при регистрации',
          errors: error.response.data.errors
        } as ApiError;
      }
      throw { message: 'Ошибка сети' } as ApiError;
    }
  },
  
  login: async (data: LoginData): Promise<AuthResponse> => {
    try {
      const response = await api.post<AuthResponse>('/auth/login', data);
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw {
          message: error.response.data.message || 'Ошибка при входе',
          errors: error.response.data.errors
        } as ApiError;
      }
      throw { message: 'Ошибка сети' } as ApiError;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
  },

  checkAuth: async (): Promise<boolean> => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return false;
      
      await api.get('/auth/verify'); // Предполагаемый endpoint для проверки токена
      return true;
    } catch {
      localStorage.removeItem('token');
      return false;
    }
  }
};

// Хелпер для проверки, авторизован ли пользователь
export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem('token');
};

export default api;