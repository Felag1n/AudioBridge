import { api } from './api';

// Интерфейс для комментария
export interface Comment {
  id: string;
  user: {
    id: string;
    username: string;
    avatar_url?: string;
  };
  content: string;
  created_at: string;
  track_id: string;
}

// Интерфейс для создания комментария
export interface CreateCommentData {
  content: string;
  track_id: string;
}

// API для работы с комментариями
export const commentApi = {
  // Получение комментариев для трека
  getTrackComments: async (trackId: string): Promise<Comment[]> => {
    try {
      const response = await api.get(`/tracks/${trackId}/comments/`);
      return response.data;
    } catch (error) {
      console.error('Ошибка при получении комментариев:', error);
      throw error;
    }
  },

  // Создание нового комментария
  createComment: async (data: CreateCommentData): Promise<Comment> => {
    try {
      const response = await api.post(`/tracks/${data.track_id}/comments/`, {
        content: data.content
      });
      return response.data;
    } catch (error) {
      console.error('Ошибка при создании комментария:', error);
      throw error;
    }
  },

  // Удаление комментария
  deleteComment: async (trackId: string, commentId: string): Promise<void> => {
    try {
      await api.delete(`/tracks/${trackId}/comments/${commentId}/`);
    } catch (error) {
      console.error('Ошибка при удалении комментария:', error);
      throw error;
    }
  },

  // Обновление комментария
  updateComment: async (trackId: string, commentId: string, content: string): Promise<Comment> => {
    try {
      const response = await api.patch(`/tracks/${trackId}/comments/${commentId}/`, {
        content
      });
      return response.data;
    } catch (error) {
      console.error('Ошибка при обновлении комментария:', error);
      throw error;
    }
  }
}; 