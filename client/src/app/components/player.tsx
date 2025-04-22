//client\src\app\components\player.tsx
'use client'

import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX } from 'lucide-react'
import React, { useEffect } from 'react'
import { useAudioPlayer } from '../hooks/use-audio-player'

export function Player() {
  const {
    currentTrack,
    currentTrackIndex,
    playlist,
    isPlaying,
    volume,
    progress,
    duration,
    togglePlay,
    seekTo,
    setVolume,
    playNext,
    playPrevious
  } = useAudioPlayer()

  useEffect(() => {
    setVolume(0.4) // Устанавливаем громкость на 40% при монтировании компонента
  }, [setVolume])

  const formatTime = (time: number) => {
    if (!time) return '0:00'
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const percent = (e.clientX - rect.left) / rect.width
    seekTo(percent * duration)
  }

  const handleVolumeClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const percent = (e.clientX - rect.left) / rect.width
    setVolume(Math.max(0, Math.min(1, percent)))
  }

  const canPlayPrevious = currentTrackIndex > 0
  const canPlayNext = currentTrackIndex < playlist.length - 1

  return (
    <div className="fixed bottom-0 left-0 right-0 border-t border-zinc-800 bg-zinc-900 p-4">
      <div className="flex flex-col gap-4">
        {/* Progress bar */}
        <div className="flex items-center gap-2">
          <span className="w-12 text-sm text-zinc-400">{formatTime(progress)}</span>
          <div 
            className="relative h-1 flex-1 cursor-pointer rounded-full bg-zinc-800"
            onClick={handleProgressClick}
          >
            <div 
              className="absolute left-0 top-0 h-full rounded-full bg-white"
              style={{ width: `${(progress / duration) * 100}%` }}
            />
            <div className="absolute -top-2 h-5 w-full" />
          </div>
          <span className="w-12 text-sm text-zinc-400">{formatTime(duration)}</span>
        </div>
        
        {/* Controls and track info */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-md bg-zinc-800">
              {currentTrack?.coverUrl && (
                <img 
                  src={currentTrack.coverUrl} 
                  alt={currentTrack.title}
                  className="h-full w-full rounded-md object-cover"
                />
              )}
            </div>
            <div>
              <div className="font-medium">
                {currentTrack?.title || 'Название трека'}
              </div>
              <div className="text-sm text-zinc-400">
                {currentTrack?.artist || 'Исполнитель'}
              </div>
            </div>
          </div>

          {/* Playback controls */}
          <div className="flex items-center gap-6">
            <button 
              className={`rounded-full p-2 ${
                canPlayPrevious ? 'hover:bg-zinc-800' : 'opacity-50'
              }`}
              onClick={playPrevious}
              disabled={!canPlayPrevious}
            >
              <SkipBack size={20} />
            </button>
            <button 
              className="rounded-full bg-white p-2 text-black hover:bg-zinc-200"
              onClick={togglePlay}
            >
              {isPlaying ? <Pause size={20} /> : <Play size={20} />}
            </button>
            <button 
              className={`rounded-full p-2 ${
                canPlayNext ? 'hover:bg-zinc-800' : 'opacity-50'
              }`}
              onClick={playNext}
              disabled={!canPlayNext}
            >
              <SkipForward size={20} />
            </button>
          </div>

          {/* Volume control */}
          <div className="flex items-center gap-2">
            <button 
              className="rounded-full p-2 hover:bg-zinc-800"
              onClick={() => setVolume(volume === 0 ? 1 : 0)}
            >
              {volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </button>
            <div 
              className="relative h-1 w-24 cursor-pointer rounded-full bg-zinc-800"
              onClick={handleVolumeClick}
            >
              <div 
                className="absolute left-0 top-0 h-full rounded-full bg-white"
                style={{ width: `${volume * 100}%` }}
              />
              <div className="absolute -top-2 h-5 w-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}