//client\src\app\track\[id]\page.tsx

'use client';

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { yandexMusicApi } from "@/app/services/yandex-api";
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
  Album 
} from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { useState } from "react";

export default function TrackPage() {
  const params = useParams();
  const trackId = params.id as string;
  const { playTrack, currentTrack, isPlaying, togglePlay } = useAudioPlayer();
  const [isFavorite, setIsFavorite] = useState(false);

  const { data: track, isLoading, error } = useQuery({
    queryKey: ['track', trackId],
    queryFn: () => yandexMusicApi.getTrack(trackId),
    retry: 1,
    staleTime: 1000 * 60 * 5, // 5 минут кэш
  });

  const handlePlay = () => {
    if (track?.downloadUrl) {
      if (currentTrack?.id === track.id) {
        togglePlay();
      } else {
        playTrack({
          id: track.id,
          title: track.title,
          artist: track.artists.map(a => a.name).join(', '),
          coverUrl: track.album?.coverUrl || null,
          url: track.downloadUrl,
          duration: track.duration || 0
        });
      }
    } else {
      toast.error('Не удалось загрузить аудио файл');
    }
  };

  const handleAddToFavorites = async () => {
    try {
      // Здесь должен быть API-запрос к вашему бэкенду для добавления в избранное
      // await api.post(`/library/add/${trackId}/`);
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
        <p className="text-zinc-400">Возможно, трек больше не доступен или вы не авторизованы в Яндекс Музыке</p>
        <Button onClick={() => window.history.back()}>Вернуться назад</Button>
      </div>
    );
  }

  const isCurrentTrack = currentTrack?.id === track.id;
  const artistNames = track.artists.map(artist => artist.name).join(', ');
  
  // Форматирование длительности трека
  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-8">
      {/* Основная информация о треке */}
      <div className="flex flex-col md:flex-row md:items-end gap-6">
        <div className="relative aspect-square w-full md:w-48 overflow-hidden rounded-lg">
          <img 
            src={track.album?.coverUrl || '/api/placeholder/200/200'}
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
          <h1 className="text-2xl md:text-4xl font-bold">{track.title}</h1>
          <div className="mt-2 text-lg text-zinc-400">
            {artistNames}
          </div>
          {track.album?.title && (
            <div className="mt-1 text-sm text-zinc-500">
              Альбом: {track.album.title}
            </div>
          )}
          <div className="mt-3 flex flex-wrap gap-2">
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
          </div>
        </div>
      </div>

      {/* Дополнительная информация */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Music className="h-5 w-5" />
              О треке
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              <div className="text-zinc-400">Длительность:</div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4 text-zinc-500" />
                {formatDuration(track.duration)}
              </div>
              
              <div className="text-zinc-400">Исполнитель:</div>
              <div className="flex items-center gap-1">
                <User className="h-4 w-4 text-zinc-500" />
                {artistNames}
              </div>
              
              {track.album?.title && (
                <>
                  <div className="text-zinc-400">Альбом:</div>
                  <div className="flex items-center gap-1">
                    <Album className="h-4 w-4 text-zinc-500" />
                    {track.album.title}
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Исполнители
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {track.artists.map(artist => (
                <div key={artist.id} className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-zinc-800 flex items-center justify-center">
                    <User className="h-5 w-5 text-zinc-400" />
                  </div>
                  <div>
                    <div className="font-medium">{artist.name}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}