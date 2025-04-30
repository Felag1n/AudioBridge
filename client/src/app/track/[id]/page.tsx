//client\src\app\track\[id]\page.tsx

'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { trackApi, Track } from "@/app/services/track-api";
import { commentApi, Comment } from "@/app/services/comment-api";
import { useAudioPlayer } from '@/app/components/contexts/audio-player-context';
import { useAuth } from '@/app/contexts/auth-context';
import {
  Heart,
  MessageSquare,
  Play,
  Pause,
  User,
  Clock,
  Music,
  Share2,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/app/components/ui/avatar";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { formatDistanceToNow } from 'date-fns';
import { ru } from 'date-fns/locale';
import { formatTime, cn } from '@/app/lib/utils';
import { toast } from 'sonner';
import { CommentsSection } from '@/app/components/comments-section';
import { TrackRow } from '@/app/components/track-row';

interface TrackWithLikes extends Track {
  likes_count?: number;
  is_liked?: boolean;
}

export default function TrackPage() {
  const params = useParams();
  const id = Number(params.id);
  const [track, setTrack] = useState<TrackWithLikes | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newComment, setNewComment] = useState("");
  const { user } = useAuth();
  const { currentTrack, isPlaying, togglePlay, playTrack } = useAudioPlayer();
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const isCurrentTrack = currentTrack?.id === id;

  useEffect(() => {
    const fetchTrack = async () => {
      try {
        setIsLoading(true);
        const trackData = await trackApi.getTrack(id.toString()) as TrackWithLikes;
        setTrack(trackData);
        setLikesCount(trackData.likes_count || 0);
        setIsLiked(trackData.is_liked || false);
        const commentsData = await commentApi.getTrackComments(id.toString());
        setComments(commentsData);
      } catch (err) {
        setError("Ошибка при загрузке трека");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTrack();
  }, [id]);

  const handlePlay = () => {
    if (!track) return;
    
    if (isCurrentTrack) {
      togglePlay();
    } else {
      playTrack({
        id: Number(track.id),
        title: track.title,
        artist: track.artist,
        album: track.album,
        duration: track.duration,
        file_path: track.file_path,
        file_url: track.file_url,
        cover_url: track.cover_url,
        created_at: track.created_at,
        user: track.user,
        is_liked: isLiked
      });
    }
  };

  const handleLike = async () => {
    if (!user) {
      toast.error("Войдите, чтобы ставить лайки");
      return;
    }
    
    try {
      let response;
      if (isLiked) {
        response = await trackApi.unlikeTrack(id.toString());
        toast.success("Лайк удален");
      } else {
        response = await trackApi.likeTrack(id.toString());
        toast.success("Трек добавлен в избранное");
      }
      setLikesCount(response.likes_count);
      setIsLiked(response.is_liked);
    } catch (err) {
      console.error("Ошибка при изменении статуса лайка:", err);
      toast.error("Не удалось изменить статус лайка");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const comment = await commentApi.addComment(id.toString(), newComment);
      setComments(prev => [comment, ...prev]);
      setNewComment("");
      toast.success("Комментарий добавлен");
    } catch (err) {
      console.error("Ошибка при отправке комментария:", err);
      toast.error("Не удалось отправить комментарий");
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    try {
      await commentApi.deleteComment(id.toString(), commentId);
      setComments(prev => prev.filter(c => c.id !== commentId));
      toast.success("Комментарий удален");
    } catch (err) {
      console.error("Ошибка при удалении комментария:", err);
      toast.error("Не удалось удалить комментарий");
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-zinc-400 border-t-purple-500"></div>
      </div>
    );
  }

  if (error || !track) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500">{error || "Трек не найден"}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-start gap-6">
        <div className="relative h-48 w-48 flex-shrink-0 overflow-hidden rounded-lg">
          <img
            src={track.cover_url || '/api/placeholder/192/192'}
            alt={track.title}
            className="h-full w-full object-cover"
          />
          <button
            onClick={handlePlay}
            className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 hover:opacity-100 transition-opacity"
          >
            {isCurrentTrack && isPlaying ? (
              <Pause className="h-12 w-12" />
            ) : (
              <Play className="h-12 w-12" />
            )}
          </button>
        </div>

        <div className="flex-1 space-y-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">{track.title}</h1>
            <button
              onClick={handleLike}
              className={cn(
                "p-2 transition-colors",
                isLiked ? "text-red-500" : "text-zinc-400 hover:text-red-500"
              )}
            >
              <Heart className={cn("h-6 w-6", isLiked && "fill-current")} />
            </button>
          </div>

          <div className="space-y-1">
            <p className="text-lg text-zinc-400">{track.artist}</p>
            {track.album && <p className="text-zinc-500">{track.album}</p>}
            <p className="text-sm text-zinc-500">{formatTime(track.duration)}</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Комментарии</h2>
        <CommentsSection trackId={id.toString()} />
      </div>
    </div>
  );
}