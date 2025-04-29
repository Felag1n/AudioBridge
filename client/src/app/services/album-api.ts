import api from './api';
import { Track } from './track-api';

export interface Album {
  id: string;
  title: string;
  artist: string;
  coverUrl?: string;
  description?: string;
  genre?: string;
  releaseDate?: string;
  createdAt: string;
  tracksCount: number;
  likesCount: number;
  isLiked?: boolean;
  userId: string;
}

export interface AlbumWithTracks extends Album {
  tracks: Track[];
}

export interface PopularAlbum extends Album {
  rank: number;
}

export const albumApi = {
  // Создание альбома
  createAlbum: async (formData: FormData): Promise<Album> => {
    const { data } = await api.post('/albums/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return data;
  },

  // Получение альбома по ID
  getAlbum: async (albumId: string): Promise<AlbumWithTracks> => {
    const { data } = await api.get(`/albums/${albumId}/`);
    return data;
  },

  // Получение всех альбомов пользователя
  getUserAlbums: async (): Promise<Album[]> => {
    const { data } = await api.get('/albums/user/');
    return data;
  },

  // Получение популярных альбомов
  getPopularAlbums: async (limit = 10): Promise<PopularAlbum[]> => {
    const { data } = await api.get('/albums/popular/', {
      params: { limit },
    });
    return data;
  },

  // Поиск альбомов
  searchAlbums: async (query: string, genre?: string): Promise<Album[]> => {
    const { data } = await api.get('/albums/search/', {
      params: { query, genre },
    });
    return data;
  },

  // Лайк альбома
  likeAlbum: async (albumId: string): Promise<{ success: boolean }> => {
    const { data } = await api.post(`/albums/${albumId}/like/`);
    return data;
  },

  // Удаление лайка
  unlikeAlbum: async (albumId: string): Promise<{ success: boolean }> => {
    const { data } = await api.delete(`/albums/${albumId}/like/`);
    return data;
  },

  // Удаление альбома
  deleteAlbum: async (albumId: string): Promise<{ success: boolean }> => {
    const { data } = await api.delete(`/albums/${albumId}/`);
    return data;
  },

  // Обновление информации об альбоме
  updateAlbum: async (albumId: string, data: Partial<Album>): Promise<Album> => {
    const { data: responseData } = await api.patch(`/albums/${albumId}/`, data);
    return responseData;
  },
  
  // Добавление трека в альбом
  addTrackToAlbum: async (albumId: string, trackId: string): Promise<{ success: boolean }> => {
    const { data } = await api.post(`/albums/${albumId}/tracks/`, { trackId });
    return data;
  },
  
  // Удаление трека из альбома
  removeTrackFromAlbum: async (albumId: string, trackId: string): Promise<{ success: boolean }> => {
    const { data } = await api.delete(`/albums/${albumId}/tracks/${trackId}/`);
    return data;
  },
  
  // Получение альбомов по жанру
  getAlbumsByGenre: async (genre: string, limit = 20): Promise<Album[]> => {
    const { data } = await api.get('/albums/', {
      params: { genre, limit },
    });
    return data;
  },
  
  // Получение недавно созданных альбомов
  getRecentAlbums: async (limit = 20): Promise<Album[]> => {
    const { data } = await api.get('/albums/recent/', {
      params: { limit },
    });
    return data;
  },
};