import React from 'react';
import { Dialog, DialogContent } from '@/app/components/ui/dialog';
import { Card, CardContent } from '@/app/components/ui/card';
import { Play, Pause, SkipBack, SkipForward } from 'lucide-react';
import { useAudioPlayer } from '../hooks/use-audio-player';

export const NowPlayingModal = () => {
  const {
    currentTrack,
    isPlaying,
    progress,
    duration,
    togglePlay,
    playNext,
    playPrevious,
    currentTrackIndex,
    playlist,
  } = useAudioPlayer();

  // Если нет текущего трека, не показываем модальное окно
  if (!currentTrack) return null;

  const formatTime = (time) => {
    if (!time) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const canPlayPrevious = currentTrackIndex > 0;
  const canPlayNext = currentTrackIndex < playlist.length - 1;

  return (
    <Dialog open={true}>
      <DialogContent className="sm:max-w-xl">
        <div className="flex flex-col items-center space-y-6 p-6">
          {/* Album Cover */}
          <div className="h-64 w-64 overflow-hidden rounded-lg bg-zinc-800">
            {currentTrack?.coverUrl ? (
              <img
                src={currentTrack.coverUrl}
                alt={currentTrack.title}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-zinc-400">
                Нет обложки
              </div>
            )}
          </div>

          {/* Track Info */}
          <div className="text-center">
            <h2 className="text-2xl font-bold">{currentTrack.title}</h2>
            <p className="text-zinc-400">{currentTrack.artist}</p>
          </div>

          {/* Progress Bar */}
          <div className="w-full space-y-2">
            <div className="relative h-1 w-full rounded-full bg-zinc-800">
              <div
                className="absolute left-0 top-0 h-full rounded-full bg-white"
                style={{ width: `${(progress / duration) * 100}%` }}
              />
            </div>
            <div className="flex justify-between text-sm text-zinc-400">
              <span>{formatTime(progress)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-6">
            <button
              className={`rounded-full p-3 transition ${
                canPlayPrevious ? 'hover:bg-zinc-800' : 'opacity-50'
              }`}
              onClick={playPrevious}
              disabled={!canPlayPrevious}
            >
              <SkipBack size={24} />
            </button>
            
            <button
              className="rounded-full bg-white p-4 text-black transition hover:bg-zinc-200"
              onClick={togglePlay}
            >
              {isPlaying ? <Pause size={24} /> : <Play size={24} />}
            </button>
            
            <button
              className={`rounded-full p-3 transition ${
                canPlayNext ? 'hover:bg-zinc-800' : 'opacity-50'
              }`}
              onClick={playNext}
              disabled={!canPlayNext}
            >
              <SkipForward size={24} />
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NowPlayingModal;