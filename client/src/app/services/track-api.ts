import api from './api';
import { useAuth } from '@/app/components/contexts/auth-context';
import { AxiosError } from 'axios';

export interface Track {
  id: number;
  title: string;
  artist: string;
  album: string;
  duration: number;
  file_path: string;
  file_url: string;
  cover_url: string;
  created_at: string;
  user: number;
  is_liked?: boolean;
}

export interface PopularTrack extends Track {
  rank: number;
}

export const trackApi = {
  // Получение трека по ID
  getTrack: async (trackId: string): Promise<Track> => {
    try {
      const { data } = await api.get(`/tracks/${trackId}/`);
      return data;
    } catch (error) {
      console.error('Error fetching track:', error);
      throw error;
    }
  },

  // Получение всех треков пользователя
  getUserTracks: async (): Promise<Track[]> => {
    // Check if we're in the browser environment
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }
      const response = await api.get('/profile/tracks/');
      return response.data;
    }
    return [];
  },

  // Загрузка нового трека
  uploadTrack: async (formData: FormData): Promise<Track> => {
    try {
      const { data } = await api.post('/tracks/upload/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return data;
    } catch (error) {
      console.error('Error uploading track:', error);
      throw error;
    }
  },

  // Удаление трека
  deleteTrack: async (trackId: string): Promise<{ success: boolean }> => {
    try {
      const { data } = await api.delete(`/tracks/${trackId}/`);
      return data;
    } catch (error) {
      console.error('Error deleting track:', error);
      throw error;
    }
  },

  // Обновление информации о треке
  updateTrack: async (trackId: string, data: Partial<Track>): Promise<Track> => {
    try {
      const { data: responseData } = await api.patch(`/tracks/${trackId}/`, data);
      return responseData;
    } catch (error) {
      console.error('Error updating track:', error);
      throw error;
    }
  },

  // Лайк трека
  likeTrack: async (trackId: string): Promise<{ status: string, likes_count: number, is_liked: boolean }> => {
    try {
      const { data } = await api.post(`/tracks/${trackId}/like/`);
      return data;
    } catch (error) {
      console.error('Error liking track:', error);
      throw error;
    }
  },

  // Удаление лайка
  unlikeTrack: async (trackId: string): Promise<{ status: string, likes_count: number, is_liked: boolean }> => {
    try {
      const { data } = await api.delete(`/tracks/${trackId}/unlike/`);
      return data;
    } catch (error) {
      console.error('Error unliking track:', error);
      throw error;
    }
  },

  // Получение популярных треков
  getPopularTracks: async (limit = 10): Promise<PopularTrack[]> => {
    try {
      const { data } = await api.get('/tracks/popular/', {
        params: { limit },
      });
      return data;
    } catch (error) {
      console.error('Error fetching popular tracks:', error);
      throw error;
    }
  },

  // Поиск треков
  searchTracks: async (query: string, genre?: string): Promise<Track[]> => {
    try {
      const { data } = await api.get('/tracks/search/', {
        params: { query, genre },
      });
      return data;
    } catch (error) {
      console.error('Error searching tracks:', error);
      throw error;
    }
  },

  // Получение треков по жанру
  getTracksByGenre: async (genre: string, limit = 20): Promise<Track[]> => {
    const { data } = await api.get('/tracks/', {
      params: { genre, limit },
    });
    return data;
  },
  
  // Получение недавно загруженных треков
  getRecentTracks: async (limit = 20): Promise<Track[]> => {
    const { data } = await api.get('/tracks/recent/', {
      params: { limit },
    });
    return data;
  },
}