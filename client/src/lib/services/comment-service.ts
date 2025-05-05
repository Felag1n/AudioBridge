import { create } from 'zustand';
import api from '../api';
import { Comment } from '../types/comment';

interface CommentState {
  comments: Comment[];
  isLoading: boolean;
  error: string | null;
  pollInterval: NodeJS.Timeout | null;
  fetchComments: (trackId: string) => Promise<void>;
  addComment: (trackId: string, text: string) => Promise<void>;
  deleteComment: (trackId: string, commentId: number) => Promise<void>;
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
      const { data } = await api.get(`/tracks/${trackId}/comments/`);
      set({ comments: data, isLoading: false });
    } catch (error) {
      set({ 
        error: 'Ошибка при загрузке комментариев',
        isLoading: false 
      });
      console.error('Error fetching comments:', error);
    }
  },

  addComment: async (trackId: string, text: string) => {
    try {
      set({ error: null });
      const { data } = await api.post(`/tracks/${trackId}/comments/`, { text });
      set((state) => ({
        comments: [data, ...state.comments]
      }));
    } catch (error) {
      set({ error: 'Ошибка при отправке комментария' });
      console.error('Error adding comment:', error);
    }
  },

  deleteComment: async (trackId: string, commentId: number) => {
    try {
      set({ error: null });
      await api.delete(`/tracks/${trackId}/comments/${commentId}/`);
      set((state) => ({
        comments: state.comments.filter(comment => comment.id !== commentId)
      }));
    } catch (error) {
      set({ error: 'Ошибка при удалении комментария' });
      console.error('Error deleting comment:', error);
    }
  },

  startPolling: (trackId: string) => {
    get().stopPolling();
    get().fetchComments(trackId);
    
    const interval = setInterval(() => {
      get().fetchComments(trackId);
    }, 5000);
    
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