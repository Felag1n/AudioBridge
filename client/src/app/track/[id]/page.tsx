'use client';

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { yandexMusicApi, formatDuration, getArtistNames } from "@/app/services/yandex-api";
import { useAudioPlayer } from '@/app/hooks/use-audio-player';
import { 
  Heart, 
  PlayCircle,
  Pause,
  Share2, 
  MoreHorizontal 
} from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { toast } from "sonner";
import { Card, CardContent } from "@/app/components/ui/card";

export default function TrackPage() {
  const params = useParams();
  const trackId = params.id as string;
  const { playTrack, currentTrack, isPlaying, togglePlay } = useAudioPlayer();

  const { data: track, isLoading } = useQuery({
    queryKey: ['track', trackId],
    queryFn: () => yandexMusicApi.getTrack(trackId)
  });

  const handlePlay = () => {
    if (track?.downloadUrl) {
      if (currentTrack?.id === track.id) {
        togglePlay();
      } else {
        playTrack({
          ...track,
          url: track.downloadUrl
        });
      }
    } else {
      toast.error('Не удалось загрузить аудио');
    }
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Ссылка скопирована");
    } catch (err) {
      toast.error("Не удалось скопировать ссылку");
    }
  };

  if (isLoading) {
    return <div className="text-center">Загрузка...</div>;
  }

  if (!track) {
    return <div className="text-center">Трек не найден</div>;
  }

  const isCurrentTrack = currentTrack?.id === track.id;

  return (
    <div className="space-y-8">
      <div className="flex items-end gap-6">
        <div className="relative aspect-square w-48 overflow-hidden rounded-lg">
          <img 
            src={track.album.coverUrl || '/placeholder-album.jpg'}
            alt={track.title}
            className="object-cover"
          />
          <button 
            className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity hover:opacity-100"
            onClick={handlePlay}
          >
            {isCurrentTrack && isPlaying ? (
              <Pause className="h-12 w-12" />
            ) : (
              <PlayCircle className="h-12 w-12" />
            )}
          </button>
        </div>
        
        <div className="flex-1">
          <h1 className="text-4xl font-bold">{track.title}</h1>
          <div className="mt-2 text-lg text-zinc-400">
            {getArtistNames(track.artists)}
          </div>
          {track.album.title && (
            <div className="mt-1 text-sm text-zinc-500">
              Альбом: {track.album.title}
            </div>
          )}
        </div>

        <div className="flex items-center gap-4">
          <Button 
            size="icon" 
            variant="ghost"
            onClick={handleShare}
          >
            <Share2 className="h-6 w-6" />
          </Button>
          <Button size="icon" variant="ghost">
            <MoreHorizontal className="h-6 w-6" />
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}