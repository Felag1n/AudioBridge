import axios, { AxiosError } from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('userData');
      window.location.href = '/login';
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

export interface UserProfile {
  username: string;
  email: string;
  library: {
    tracks_count: number;
    albums_count: number;
    playlists_count: number;
  };
}

interface UpdateProfileData {
  nickname?: string;
  avatar?: File | null;
}

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

      // Обновляем данные пользователя в localStorage
      if (response.data.user) {
        localStorage.setItem('userData', JSON.stringify(response.data.user));
        window.dispatchEvent(new Event('auth-change'));
      }

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

export const authApi = {
  register: async (data: RegisterData): Promise<AuthResponse> => {
    try {
      const response = await api.post<AuthResponse>('/register/', data);
      if (response.data.token) {
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

  login: async (data: LoginData): Promise<AuthResponse> => {
    try {
      const response = await api.post<AuthResponse>('/login/', data);
      if (response.data.token) {
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

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    window.location.href = '/login';
  },

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

export const profileApi = {
  getProfile: async (): Promise<UserProfile> => {
    const response = await api.get('/profile/');
    return response.data;
  },

  updateProfile: async (data: Partial<UserProfile>): Promise<UserProfile> => {
    const response = await api.patch('/profile/', data);
    return response.data;
  },

  getLibrary: async () => {
    const response = await api.get('/library/');
    return response.data;
  },
};

export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem('token');
};

export default api;
