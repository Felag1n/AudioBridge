'use client';

import { TrackRow, TrackProps } from './track-row';
import { useAudioPlayer } from '../hooks/use-audio-player';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Music, Play } from 'lucide-react';
import { Button } from './ui/button';

interface AlbumTrackListProps {
  tracks: TrackProps[];
  albumCover?: string;
  onPlayAll?: () => void;
}

export function AlbumTrackList({ tracks, albumCover, onPlayAll }: AlbumTrackListProps) {
  const { playTrack, setPlaylist } = useAudioPlayer();

  const handlePlayAll = () => {
    if (onPlayAll) {
      onPlayAll();
    } else if (tracks.length > 0) {
      // Настраиваем плейлист для всех треков альбома
      setPlaylist(tracks);
      // Начинаем воспроизведение с первого трека
      playTrack(tracks[0]);
    }
  };

  const handlePlayTrack = (index: number) => {
    // Настраиваем плейлист для всех треков альбома
    setPlaylist(tracks);
    // Начинаем воспроизведение с выбранного трека
    playTrack(tracks[index]);
  };

  return (
    <Card className="bg-zinc-900 border-zinc-800">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Music className="h-5 w-5" />
          Треки
        </CardTitle>
        {tracks.length > 0 && (
          <Button 
            onClick={handlePlayAll}
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
          >
            <Play className="h-4 w-4" />
            Слушать все
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {tracks.length > 0 ? (
          <div className="space-y-1">
            {tracks.map((track, index) => (
              <TrackRow
                key={track.id}
                track={{
                  ...track,
                  // Если у трека нет обложки, используем обложку альбома
                  coverUrl: track.coverUrl || albumCover
                }}
                index={index + 1}
                showLike
                onPlay={() => handlePlayTrack(index)}
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
  );
}