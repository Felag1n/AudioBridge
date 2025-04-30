import api from './api';

export interface Comment {
  id: number;
  text: string;
  user: {
    id: number;
    username: string;
    avatar_url?: string;
  };
  created_at: string;
}

export const commentApi = {
  // Получение комментариев трека
  getTrackComments: async (trackId: string): Promise<Comment[]> => {
    try {
      const { data } = await api.get(`/tracks/${trackId}/comments/`);
      return data;
    } catch (error) {
      console.error('Error fetching comments:', error);
      throw error;
    }
  },

  // Добавление комментария
  addComment: async (trackId: string, text: string): Promise<Comment> => {
    try {
      const { data } = await api.post(`/tracks/${trackId}/comments/`, { text });
      return data;
    } catch (error) {
      console.error('Error adding comment:', error);
      throw error;
    }
  },

  // Удаление комментария
  deleteComment: async (trackId: string, commentId: number): Promise<void> => {
    try {
      await api.delete(`/tracks/${trackId}/comments/${commentId}/`);
    } catch (error) {
      console.error('Error deleting comment:', error);
      throw error;
    }
  },
}; 