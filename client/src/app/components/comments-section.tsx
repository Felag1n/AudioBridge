'use client'

import { useState, useEffect } from 'react';
import { Comment, commentApi } from '@/app/services/comment-api';
import { useAuth } from '@/app/components/contexts/auth-context';
import { formatDistanceToNow } from 'date-fns';
import { ru } from 'date-fns/locale';
import { toast } from 'sonner';
import Link from 'next/link';
import { Trash2 } from 'lucide-react';

interface CommentsSectionProps {
  trackId: string;
}

export function CommentsSection({ trackId }: CommentsSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    loadComments();
  }, [trackId]);

  const loadComments = async () => {
    try {
      const data = await commentApi.getTrackComments(trackId);
      setComments(data);
    } catch (error) {
      toast.error('Не удалось загрузить комментарии');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      setIsLoading(true);
      const comment = await commentApi.addComment(trackId, newComment);
      setComments([comment, ...comments]);
      setNewComment('');
      toast.success('Комментарий добавлен');
    } catch (error) {
      toast.error('Не удалось добавить комментарий');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (commentId: number) => {
    try {
      await commentApi.deleteComment(trackId, commentId);
      setComments(comments.filter(comment => comment.id !== commentId));
      toast.success('Комментарий удален');
    } catch (error) {
      toast.error('Не удалось удалить комментарий');
    }
  };

  return (
    <div className="space-y-4">
      {user && (
        <form onSubmit={handleSubmit} className="space-y-2">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Напишите комментарий..."
            className="w-full rounded-md bg-zinc-800 p-3 text-sm text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            rows={3}
          />
          <button
            type="submit"
            disabled={isLoading || !newComment.trim()}
            className="rounded-md bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700 disabled:opacity-50"
          >
            {isLoading ? 'Отправка...' : 'Отправить'}
          </button>
        </form>
      )}

      <div className="space-y-4">
        {comments.map((comment) => (
          <div key={comment.id} className="rounded-md bg-zinc-800 p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <Link href={`/profile/${comment.user.id}`}>
                  <img
                    src={comment.user.avatar_url || '/api/placeholder/40/40'}
                    alt={comment.user.username}
                    className="h-10 w-10 rounded-full"
                  />
                </Link>
                <div>
                  <Link
                    href={`/profile/${comment.user.id}`}
                    className="font-medium text-white hover:text-purple-400"
                  >
                    {comment.user.username}
                  </Link>
                  <p className="text-sm text-zinc-400">{comment.text}</p>
                </div>
              </div>
              {user?.id === comment.user.id && (
                <button
                  onClick={() => handleDelete(comment.id)}
                  className="text-zinc-400 hover:text-red-500"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
            <div className="mt-2 text-xs text-zinc-500">
              {formatDistanceToNow(new Date(comment.created_at), {
                addSuffix: true,
                locale: ru,
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 