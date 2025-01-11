// src/services/api.ts
import { mockTrack, mockComments } from '../lib/mock-data'

// Имитация задержки API
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// Мок API для пользователя
export const userApi = {
  updateProfile: async (data: { nickname: string, avatar?: File }) => {
    await delay(1000) // Имитируем задержку сети
    console.log('Updating profile with:', { nickname: data.nickname, hasAvatar: !!data.avatar })
    return {
      success: true,
      data: {
        nickname: data.nickname,
        avatarUrl: data.avatar ? URL.createObjectURL(data.avatar) : null
      }
    }
  },

  getProfile: async () => {
    await delay(1000)
    return {
      id: '1',
      nickname: 'Test User',
      avatarUrl: '/api/placeholder/96/96'
    }
  },

  getLikedTracks: async () => {
    await delay(1000)
    return {
      data: []
    }
  },

  getLikedAlbums: async () => {
    await delay(1000)
    return {
      data: []
    }
  }
}

// Мок API для треков
export const trackApi = {
  getTrack: async (id: string) => {
    await delay(1000)
    return mockTrack
  },

  getComments: async (id: string) => {
    await delay(1000)
    return mockComments
  },

  addComment: async (id: string, content: string) => {
    await delay(500)
    return {
      id: Date.now(),
      content,
      createdAt: 'Только что',
      user: {
        nickname: 'Вы',
        avatarUrl: '/api/placeholder/32/32'
      }
    }
  },

  toggleLike: async (id: string) => {
    await delay(300)
    return { success: true }
  }
}

// Реальный API (закомментирован до готовности бэкенда)
/*
import axios from 'axios'

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const userApi = {
  getProfile: () => api.get('/user/profile'),

  updateProfile: (data: { nickname: string, avatar?: File }) => {
    const formData = new FormData()
    formData.append('nickname', data.nickname)
    if (data.avatar) {
      formData.append('avatar', data.avatar)
    }
    return api.patch('/user/profile', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },

  getLikedTracks: () => api.get('/user/tracks/liked'),
  getLikedAlbums: () => api.get('/user/albums/liked'),
}

export const trackApi = {
  getTrack: (id: string) => api.get(`/tracks/${id}`),
  toggleLike: (id: string) => api.post(`/tracks/${id}/toggle-like`),
  getComments: (id: string) => api.get(`/tracks/${id}/comments`),
  addComment: (id: string, content: string) => 
    api.post(`/tracks/${id}/comments`, { content }),
}

export const albumApi = {
  getAlbum: (id: string) => api.get(`/albums/${id}`),
  toggleLike: (id: string) => api.post(`/albums/${id}/toggle-like`),
  getTracks: (id: string) => api.get(`/albums/${id}/tracks`),
}

export const artistApi = {
  getArtist: (id: string) => api.get(`/artists/${id}`),
  getAlbums: (id: string) => api.get(`/artists/${id}/albums`),
  getTopTracks: (id: string) => api.get(`/artists/${id}/top-tracks`),
}

export const searchApi = {
  search: (query: string) => api.get(`/search`, { params: { q: query } }),
  searchByType: (type: 'track' | 'album' | 'artist' | 'user', query: string) =>
    api.get(`/search/${type}`, { params: { q: query } }),
}

export default api;
*/