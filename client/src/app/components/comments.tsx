import { useEffect, useState } from 'react';
import { useCommentService } from '../services/comment-service';
import { useAuth } from '../contexts/auth-context';
import { formatDistanceToNow } from 'date-fns';
import { ru } from 'date-fns/locale';

interface CommentsProps {
  trackId: string;
}

export const Comments = ({ trackId }: CommentsProps) => {
  const { user } = useAuth();
  const [newComment, setNewComment] = useState('');
  const {
    comments,
    isLoading,
    error,
    addComment,
    deleteComment,
    startPolling,
    stopPolling
  } = useCommentService();

  useEffect(() => {
    startPolling(trackId);
    return () => stopPolling();
  }, [trackId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    
    await addComment(trackId, newComment);
    setNewComment('');
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Комментарии</h2>
      
      {error && (
        <div className="text-red-500 text-sm">{error}</div>
      )}

      {user && (
        <form onSubmit={handleSubmit} className="space-y-2">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Напишите комментарий..."
            className="w-full p-2 border rounded-md"
            rows={3}
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            disabled={isLoading}
          >
            Отправить
          </button>
        </form>
      )}

      {isLoading ? (
        <div className="text-center">Загрузка комментариев...</div>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <div key={comment.id} className="border rounded-md p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {comment.user.avatar ? (
                    <img
                      src={comment.user.avatar}
                      alt={comment.user.username}
                      className="w-8 h-8 rounded-full"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                      {comment.user.username[0].toUpperCase()}
                    </div>
                  )}
                  <span className="font-medium">{comment.user.username}</span>
                </div>
                <span className="text-sm text-gray-500">
                  {formatDistanceToNow(new Date(comment.created_at), {
                    addSuffix: true,
                    locale: ru
                  })}
                </span>
              </div>
              <p className="mt-2">{comment.content}</p>
              {user?.id === comment.user.id.toString() && (
                <button
                  onClick={() => deleteComment(comment.id)}
                  className="mt-2 text-sm text-red-500 hover:text-red-700"
                >
                  Удалить
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}; 