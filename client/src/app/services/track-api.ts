import api from './api';

export interface Track {
  id: string;
  title: string;
  artist: string;
  album?: string;
  coverUrl?: string;
  audioUrl: string;
  duration: number;
  genre?: string;
  createdAt: string;
  likesCount: number;
  isLiked?: boolean;
  userId: string;
}

export interface PopularTrack extends Track {
  rank: number;
}

export const trackApi = {
  // Загрузка трека
  uploadTrack: async (formData: FormData): Promise<Track> => {
    const { data } = await api.post('/tracks/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return data;
  },

  // Получение трека по ID
  getTrack: async (trackId: string): Promise<Track> => {
    const { data } = await api.get(`/tracks/${trackId}/`);
    return data;
  },

  // Получение всех треков пользователя
  getUserTracks: async (): Promise<Track[]> => {
    const { data } = await api.get('/tracks/user/');
    return data;
  },

  // Получение популярных треков
  getPopularTracks: async (limit = 10): Promise<PopularTrack[]> => {
    const { data } = await api.get('/tracks/popular/', {
      params: { limit },
    });
    return data;
  },

  // Поиск треков
  searchTracks: async (query: string, genre?: string): Promise<Track[]> => {
    const { data } = await api.get('/tracks/search/', {
      params: { query, genre },
    });
    return data;
  },

  // Лайк трека
  likeTrack: async (trackId: string): Promise<{ success: boolean }> => {
    const { data } = await api.post(`/tracks/${trackId}/like/`);
    return data;
  },

  // Удаление лайка
  unlikeTrack: async (trackId: string): Promise<{ success: boolean }> => {
    const { data } = await api.delete(`/tracks/${trackId}/like/`);
    return data;
  },

  // Удаление трека
  deleteTrack: async (trackId: string): Promise<{ success: boolean }> => {
    const { data } = await api.delete(`/tracks/${trackId}/`);
    return data;
  },

  // Обновление информации о треке
  updateTrack: async (trackId: string, trackData: Partial<Track>): Promise<Track> => {
    const { data } = await api.patch(`/tracks/${trackId}/`, trackData);
    return data;
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