//client\src\app\track\[id]\page.tsx

'use client';

import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { trackApi } from "@/app/services/track-api";
import { useAudioPlayer } from '@/app/hooks/use-audio-player';
import { 
  Heart, 
  PlayCircle,
  Pause,
  Share2, 
  MoreHorizontal,
  Clock,
  Music,
  User,
  Album,
  Edit,
  Trash
} from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { toast } from "sonner";
import { formatTime } from "@/app/lib/utils";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { useAuth } from '@/app/components/contexts/auth-context';
import Link from "next/link";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/app/components/ui/dropdown-menu";

export default function TrackPage() {
  const params = useParams();
  const router = useRouter();
  const trackId = params.id as string;
  const { user } = useAuth();
  const { playTrack, currentTrack, isPlaying, togglePlay } = useAudioPlayer();
  const [isFavorite, setIsFavorite] = useState(false);

  const { data: track, isLoading, error } = useQuery({
    queryKey: ['track', trackId],
    queryFn: () => trackApi.getTrack(trackId),
    retry: 1,
    staleTime: 1000 * 60 * 5, // 5 минут кэш
  });

  useEffect(() => {
    if (track) {
      setIsFavorite(track.isLiked || false);
    }
  }, [track]);

  const handlePlay = () => {
    if (track?.audioUrl) {
      if (currentTrack?.id === track.id) {
        togglePlay();
      } else {
        playTrack({
          id: track.id,
          title: track.title,
          artist: track.artist,
          coverUrl: track.coverUrl,
          url: track.audioUrl,
          duration: track.duration
        });
      }
    } else {
      toast.error('Не удалось загрузить аудио файл');
    }
  };

  const handleAddToFavorites = async () => {
    try {
      if (isFavorite) {
        await trackApi.unlikeTrack(trackId);
      } else {
        await trackApi.likeTrack(trackId);
      }
      setIsFavorite(!isFavorite);
      toast.success(isFavorite ? "Удалено из избранного" : "Добавлено в избранное");
    } catch (err) {
      toast.error("Не удалось изменить статус избранного");
    }
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Ссылка скопирована в буфер обмена");
    } catch (err) {
      toast.error("Не удалось скопировать ссылку");
    }
  };
  
  const handleDeleteTrack = async () => {
    if (confirm('Вы уверены, что хотите удалить этот трек?')) {
      try {
        await trackApi.deleteTrack(trackId);
        toast.success('Трек успешно удален');
        router.push('/profile');
      } catch (error) {
        toast.error('Не удалось удалить трек');
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-zinc-400 border-t-purple-500"></div>
          <p className="text-zinc-400">Загрузка информации о треке...</p>
        </div>
      </div>
    );
  }

  if (error || !track) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] gap-4">
        <Music className="h-16 w-16 text-zinc-500" />
        <h2 className="text-2xl font-semibold text-zinc-300">Трек не найден</h2>
        <p className="text-zinc-400">Возможно, трек больше не доступен или был удален</p>
        <Button onClick={() => window.history.back()}>Вернуться назад</Button>
      </div>
    );
  }

  const isCurrentTrack = currentTrack?.id === track.id;
  const isOwnTrack = user && user.id === track.userId;

  return (
    <div className="space-y-8">
      {/* Основная информация о треке */}
      <div className="flex flex-col md:flex-row md:items-end gap-6">
        <div className="relative aspect-square w-full md:w-48 overflow-hidden rounded-lg">
          <img 
            src={track.coverUrl || '/api/placeholder/200/200'}
            alt={track.title}
            className="h-full w-full object-cover"
          />
          <button 
            className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity hover:opacity-100"
            onClick={handlePlay}
          >
            {isCurrentTrack && isPlaying ? (
              <Pause className="h-12 w-12 text-white" />
            ) : (
              <PlayCircle className="h-12 w-12 text-white" />
            )}
          </button>
        </div>
        
        <div className="flex-1">
          <div className="flex items-center gap-2 text-sm text-zinc-400 mb-2">
            <Music className="h-4 w-4" />
            <span>Трек</span>
            {track.album && (
              <>
                <span>•</span>
                <Link href={`/album/${track.album.id}`} className="hover:underline">
                  {track.album.title}
                </Link>
              </>
            )}
          </div>
          
          <h1 className="text-2xl md:text-4xl font-bold">{track.title}</h1>
          <div className="mt-2 text-lg text-zinc-400">
            {track.artist}
          </div>
          
          <div className="mt-2 flex items-center gap-2 text-sm text-zinc-500">
            {track.duration && (
              <>
                <Clock className="h-4 w-4" />
                <span>{formatTime(track.duration)}</span>
              </>
            )}
            {track.genre && (
              <>
                <span>•</span>
                <span>{track.genre}</span>
              </>
            )}
            <span>•</span>
            <span>{track.likesCount} лайков</span>
          </div>
          
          <div className="mt-5 flex flex-wrap gap-3">
            <Button 
              className="gap-2 bg-purple-600 hover:bg-purple-700"
              onClick={handlePlay}
            >
              {isCurrentTrack && isPlaying ? (
                <>
                  <Pause className="h-4 w-4" />
                  Пауза
                </>
              ) : (
                <>
                  <PlayCircle className="h-4 w-4" />
                  Воспроизвести
                </>
              )}
            </Button>
            <Button 
              variant={isFavorite ? "default" : "outline"}
              className={isFavorite ? "gap-2 bg-red-600 hover:bg-red-700" : "gap-2"}
              onClick={handleAddToFavorites}
            >
              <Heart className={`h-4 w-4 ${isFavorite ? "fill-current" : ""}`} />
              {isFavorite ? "В избранном" : "В избранное"}
            </Button>
            <Button 
              variant="ghost"
              className="gap-2"
              onClick={handleShare}
            >
              <Share2 className="h-4 w-4" />
              Поделиться
            </Button>
            
            {isOwnTrack && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-zinc-900 border-zinc-800">
                  <Link href={`/track/${trackId}/edit`}>
                    <DropdownMenuItem className="cursor-pointer">
                      <Edit className="mr-2 h-4 w-4" />
                      Редактировать
                    </DropdownMenuItem>
                  </Link>
                  <DropdownMenuItem onClick={handleDeleteTrack} className="text-red-500 cursor-pointer">
                    <Trash className="mr-2 h-4 w-4" />
                    Удалить
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </div>

      {/* Дополнительная информация */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Music className="h-5 w-5" />
              О треке
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {track.duration && (
                <div>
                  <h3 className="text-sm text-zinc-400">Длительность</h3>
                  <p className="font-medium">{formatTime(track.duration)}</p>
                </div>
              )}
              
              <div>
                <h3 className="text-sm text-zinc-400">Исполнитель</h3>
                <p className="font-medium">{track.artist}</p>
              </div>
              
              {track.genre && (
                <div>
                  <h3 className="text-sm text-zinc-400">Жанр</h3>
                  <p className="font-medium">{track.genre}</p>
                </div>
              )}
              
              <div>
                <h3 className="text-sm text-zinc-400">Добавлен</h3>
                <p className="font-medium">{new Date(track.createdAt).toLocaleDateString()}</p>
              </div>
              
              <div>
                <h3 className="text-sm text-zinc-400">Количество лайков</h3>
                <p className="font-medium">{track.likesCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {track.album && (
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Album className="h-5 w-5" />
                Альбом
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Link href={`/album/${track.album.id}`}>
                <div className="flex items-center gap-4 p-2 rounded-md hover:bg-zinc-800/50 transition-colors">
                  <div className="h-16 w-16 overflow-hidden rounded-md flex-shrink-0">
                    <img 
                      src={track.album.coverUrl || '/api/placeholder/64/64'} 
                      alt={track.album.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-medium">{track.album.title}</h3>
                    <p className="text-sm text-zinc-400">{track.album.artist}</p>
                  </div>
                </div>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
    );
  }