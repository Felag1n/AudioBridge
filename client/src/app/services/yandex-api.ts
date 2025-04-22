//client\src\app\services\yandex-api.ts

import api from './api';

export interface Artist {
  id: string;
  name: string;
}

export interface Album {
  id: string;
  title: string;
  coverUrl: string | null;
}

export interface Track {
  id: string;
  title: string;
  artists: Artist[];
  album: Album;
  duration: number;
  downloadUrl?: string;
}

export const yandexMusicApi = {
  // Получение трека по ID
  getTrack: async (trackId: string): Promise<Track> => {
    const { data } = await api.get(`/yandex/tracks/${trackId}/`);
    return data;
  },

  // Поиск треков
  searchTracks: async (query: string, page = 0): Promise<Track[]> => {
    const { data } = await api.get('/yandex/tracks/search/', {
      params: { query, page }
    });
    return data;
  },

  // Получение популярных треков
  getPopularTracks: async (): Promise<Track[]> => {
    const { data } = await api.get('/yandex/tracks/popular/');
    return data;
  },
};

// Вспомогательные функции
export const formatDuration = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

export const getArtistNames = (artists: Artist[]): string => {
  return artists.map(artist => artist.name).join(', ');
};