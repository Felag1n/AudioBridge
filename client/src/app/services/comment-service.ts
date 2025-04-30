import { create } from 'zustand';
import axios from 'axios';

interface Comment {
  id: number;
  content: string;
  user: {
    id: number;
    username: string;
    avatar: string | null;
  };
  created_at: string;
}

interface CommentState {
  comments: Comment[];
  isLoading: boolean;
  error: string | null;
  pollInterval: NodeJS.Timeout | null;
  fetchComments: (trackId: string) => Promise<void>;
  addComment: (trackId: string, content: string) => Promise<void>;
  deleteComment: (commentId: number) => Promise<void>;
  startPolling: (trackId: string) => void;
  stopPolling: () => void;
}

export const useCommentService = create<CommentState>((set, get) => ({
  comments: [],
  isLoading: false,
  error: null,
  pollInterval: null,

  fetchComments: async (trackId: string) => {
    try {
      set({ isLoading: true, error: null });
      const response = await axios.get(`/api/tracks/${trackId}/comments/`);
      set({ comments: response.data, isLoading: false });
    } catch (error) {
      set({ 
        error: 'Ошибка при загрузке комментариев',
        isLoading: false 
      });
      console.error('Error fetching comments:', error);
    }
  },

  addComment: async (trackId: string, content: string) => {
    try {
      set({ error: null });
      const response = await axios.post(`/api/tracks/${trackId}/comments/`, { content });
      set((state) => ({
        comments: [response.data, ...state.comments]
      }));
    } catch (error) {
      set({ error: 'Ошибка при отправке комментария' });
      console.error('Error adding comment:', error);
    }
  },

  deleteComment: async (commentId: number) => {
    try {
      set({ error: null });
      await axios.delete(`/api/comments/${commentId}/`);
      set((state) => ({
        comments: state.comments.filter(comment => comment.id !== commentId)
      }));
    } catch (error) {
      set({ error: 'Ошибка при удалении комментария' });
      console.error('Error deleting comment:', error);
    }
  },

  startPolling: (trackId: string) => {
    // Остановить существующий интервал, если есть
    get().stopPolling();
    
    // Сначала загрузим комментарии
    get().fetchComments(trackId);
    
    // Установим интервал для периодического обновления
    const interval = setInterval(() => {
      get().fetchComments(trackId);
    }, 5000); // Обновляем каждые 5 секунд
    
    set({ pollInterval: interval });
  },

  stopPolling: () => {
    const { pollInterval } = get();
    if (pollInterval) {
      clearInterval(pollInterval);
      set({ pollInterval: null });
    }
  }
})); 