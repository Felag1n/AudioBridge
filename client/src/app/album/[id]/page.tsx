'use client';

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { albumApi } from "@/app/services/album-api";
import { useAudioPlayer } from '@/app/hooks/use-audio-player';
import { 
  Heart, 
  PlayCircle,
  Pause,
  Share2, 
  MoreHorizontal,
  Disc,
  User,
  Calendar,
  Music,
  Edit
} from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { Track } from "@/app/services/track-api";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { TrackRow } from "@/app/components/track-row";
import { formatTime } from "@/app/lib/utils";
import { useAuth } from '@/app/components/contexts/auth-context';
import Link from "next/link";

export default function AlbumPage() {
  const params = useParams();
  const albumId = params.id as string;
  const { user } = useAuth();
  const { playTrack, setPlaylist, currentTrack, isPlaying, togglePlay } = useAudioPlayer();
  const [isFavorite, setIsFavorite] = useState(false);

  const { data: album, isLoading, error } = useQuery({
    queryKey: ['album', albumId],
    queryFn: () => albumApi.getAlbum(albumId),
    retry: 1,
    staleTime: 1000 * 60 * 5, // 5 минут кэш
  });

  useEffect(() => {
    if (album) {
      setIsFavorite(album.isLiked || false);
    }
  }, [album]);

  const handlePlayAlbum = () => {
    if (album && album.tracks.length > 0) {
      // Преобразуем треки альбома в формат для плеера
      const tracksForPlayer = album.tracks.map(track => ({
        id: track.id,
        title: track.title,
        artist: track.artist,
        coverUrl: track.coverUrl || album.coverUrl,
        url: track.audioUrl,
        duration: track.duration
      }));
      
      setPlaylist(tracksForPlayer);
      playTrack(tracksForPlayer[0]);
    } else {
      toast.error('В альбоме нет треков');
    }
  };
  
  const isAlbumPlaying = () => {
    if (!album || !currentTrack || !isPlaying) return false;
    return album.tracks.some(track => track.id === currentTrack.id);
  };

  const handleTogglePlay = () => {
    if (isAlbumPlaying()) {
      togglePlay();
    } else {
      handlePlayAlbum();
    }
  };

  const handleAddToFavorites = async () => {
    try {
      if (isFavorite) {
        await albumApi.unlikeAlbum(albumId);
      } else {
        await albumApi.likeAlbum(albumId);
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

  // Вычисляем общую длительность альбома
  const getTotalDuration = () => {
    if (!album || !album.tracks.length) return 0;
    return album.tracks.reduce((total, track) => total + track.duration, 0);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-zinc-400 border-t-purple-500"></div>
          <p className="text-zinc-400">Загрузка информации об альбоме...</p>
        </div>
      </div>
    );
  }

  if (error || !album) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] gap-4">
        <Disc className="h-16 w-16 text-zinc-500" />
        <h2 className="text-2xl font-semibold text-zinc-300">Альбом не найден</h2>
        <p className="text-zinc-400">Возможно, альбом больше не доступен или был удален</p>
        <Button onClick={() => window.history.back()}>Вернуться назад</Button>
      </div>
    );
  }

  const isOwnAlbum = user && user.id === album.userId;
  const formattedDuration = formatTime(getTotalDuration());

  return (
    <div className="space-y-8">
      {/* Основная информация об альбоме */}
      <div className="flex flex-col md:flex-row gap-6">
        <div className="relative aspect-square w-full md:w-64 overflow-hidden rounded-lg">
          <img 
            src={album.coverUrl || '/api/placeholder/200/200'}
            alt={album.title}
            className="h-full w-full object-cover"
          />
          <button 
            className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity hover:opacity-100"
            onClick={handleTogglePlay}
          >
            {isAlbumPlaying() ? (
              <Pause className="h-16 w-16 text-white" />
            ) : (
              <PlayCircle className="h-16 w-16 text-white" />
            )}
          </button>
        </div>
        
        <div className="flex-1">
          <div className="flex items-center gap-2 text-sm text-zinc-400 mb-2">
            <Disc className="h-4 w-4" />
            <span>Альбом</span>
            {album.releaseDate && (
              <>
                <span>•</span>
                <span>{new Date(album.releaseDate).getFullYear()}</span>
              </>
            )}
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold">{album.title}</h1>
          <div className="mt-2 text-lg text-zinc-400">
            {album.artist}
          </div>
          
          <div className="mt-2 flex items-center gap-2 text-sm text-zinc-500">
            <span>{album.tracksCount} треков</span>
            <span>•</span>
            <span>{formattedDuration}</span>
            {album.genre && (
              <>
                <span>•</span>
                <span>{album.genre}</span>
              </>
            )}
          </div>
          
          {album.description && (
            <p className="mt-4 text-zinc-300 line-clamp-3">{album.description}</p>
          )}
          
          <div className="mt-5 flex flex-wrap gap-3">
            <Button 
              className="gap-2 bg-purple-600 hover:bg-purple-700"
              onClick={handleTogglePlay}
            >
              {isAlbumPlaying() ? (
                <>
                  <Pause className="h-4 w-4" />
                  Пауза
                </>
              ) : (
                <>
                  <PlayCircle className="h-4 w-4" />
                  Слушать
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
            {isOwnAlbum && (
              <Link href={`/album/${albumId}/edit`}>
                <Button variant="outline" className="gap-2">
                  <Edit className="h-4 w-4" />
                  Редактировать
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Список треков */}
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Music className="h-5 w-5" />
            Треки
          </CardTitle>
        </CardHeader>
        <CardContent>
          {album.tracks.length > 0 ? (
            <div className="space-y-1">
              {album.tracks.map((track, index) => (
                <TrackRow
                  key={track.id}
                  track={{
                    id: track.id,
                    title: track.title,
                    artist: track.artist,
                    coverUrl: track.coverUrl || album.coverUrl,
                    url: track.audioUrl,
                    duration: track.duration
                  }}
                  index={index + 1}
                  onPlay={() => {
                    // Создаем плейлист из треков альбома и начинаем с выбранного трека
                    const tracksForPlayer = album.tracks.map(t => ({
                      id: t.id,
                      title: t.title,
                      artist: t.artist,
                      coverUrl: t.coverUrl || album.coverUrl,
                      url: t.audioUrl,
                      duration: t.duration
                    }));
                    
                    setPlaylist(tracksForPlayer);
                    playTrack(tracksForPlayer[index]);
                  }}
                />
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center py-8 text-zinc-400">
              <p>В этом альбоме пока нет треков</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Дополнительная информация */}
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Disc className="h-5 w-5" />
            Об альбоме
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm text-zinc-400">Исполнитель</h3>
              <p className="font-medium">{album.artist}</p>
            </div>
            
            {album.releaseDate && (
              <div>
                <h3 className="text-sm text-zinc-400">Дата выпуска</h3>
                <p className="font-medium">{new Date(album.releaseDate).toLocaleDateString()}</p>
              </div>
            )}
            
            {album.genre && (
              <div>
                <h3 className="text-sm text-zinc-400">Жанр</h3>
                <p className="font-medium">{album.genre}</p>
              </div>
            )}
            
            <div>
              <h3 className="text-sm text-zinc-400">Количество лайков</h3>
              <p className="font-medium">{album.likesCount}</p>
            </div>
          </div>
          
          {album.description && (
            <div>
              <h3 className="text-sm text-zinc-400 mb-2">Описание</h3>
              <p className="text-zinc-300">{album.description}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}