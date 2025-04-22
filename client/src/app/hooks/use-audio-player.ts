//client\src\app\hooks\use-audio-player.ts

"use client"
import { create } from 'zustand'
import { useRef, useEffect } from 'react'
import { Track } from '../components/data/testTracks'

interface AudioStore {
  currentTrack: Track | null
  playlist: Track[]
  currentTrackIndex: number
  isPlaying: boolean
  volume: number
  progress: number
  duration: number
  setTrack: (track: Track | null) => void
  setPlaylist: (playlist: Track[]) => void
  setCurrentTrackIndex: (index: number) => void
  setIsPlaying: (playing: boolean) => void
  setVolume: (volume: number) => void
  setProgress: (progress: number) => void
  setDuration: (duration: number) => void
}

const useAudioStore = create<AudioStore>((set) => ({
  currentTrack: null,
  playlist: [],
  currentTrackIndex: 0,
  isPlaying: false,
  volume: 1,
  progress: 0,
  duration: 0,
  setTrack: (track) => set({ currentTrack: track }),
  setPlaylist: (playlist) => set({ playlist }),
  setCurrentTrackIndex: (index) => set({ currentTrackIndex: index }),
  setIsPlaying: (isPlaying) => set({ isPlaying }),
  setVolume: (volume) => set({ volume }),
  setProgress: (progress) => set({ progress }),
  setDuration: (duration) => set({ duration })
}))

const audio = typeof window !== 'undefined' ? new Audio() : null

export function useAudioPlayer() {
  const {
    currentTrack,
    playlist,
    currentTrackIndex,
    isPlaying,
    volume,
    progress,
    duration,
    setTrack,
    setPlaylist,
    setCurrentTrackIndex,
    setIsPlaying,
    setVolume,
    setProgress,
    setDuration
  } = useAudioStore()

  // Эффект для отслеживания событий аудио
  useEffect(() => {
    if (!audio) return

    const handleTimeUpdate = () => {
      setProgress(audio.currentTime)
    }

    const handleLoadedMetadata = () => {
      setDuration(audio.duration)
    }

    const handleEnded = () => {
      if (currentTrackIndex < playlist.length - 1) {
        const nextIndex = currentTrackIndex + 1
        setCurrentTrackIndex(nextIndex)
        setTrack(playlist[nextIndex])
        setIsPlaying(true)
      } else {
        setIsPlaying(false)
        setProgress(0)
      }
    }

    audio.addEventListener('timeupdate', handleTimeUpdate)
    audio.addEventListener('loadedmetadata', handleLoadedMetadata)
    audio.addEventListener('ended', handleEnded)

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate)
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata)
      audio.removeEventListener('ended', handleEnded)
    }
  }, [currentTrackIndex, playlist, setProgress, setDuration, setIsPlaying, setCurrentTrackIndex, setTrack])

  // Эффект для управления громкостью
  useEffect(() => {
    if (!audio) return
    audio.volume = volume
  }, [volume])

  // Эффект для загрузки нового трека
  useEffect(() => {
    if (!audio || !currentTrack) return
    
    // Сохраняем текущую позицию воспроизведения
    const wasPlaying = !audio.paused

    // Загружаем новый трек
    audio.src = currentTrack.url
    audio.load()

    // Если трек играл до смены, продолжаем воспроизведение
    if (wasPlaying) {
      audio.play()
    }
  }, [currentTrack]) // Теперь реагируем только на смену трека

  // Отдельный эффект для управления воспроизведением
  useEffect(() => {
    if (!audio) return

    const playPromise = isPlaying ? audio.play() : Promise.resolve();
    
    playPromise.then(() => {
      if (!isPlaying) {
        audio.pause();
      }
    }).catch(error => {
      console.error('Ошибка воспроизведения:', error);
    });
  }, [isPlaying])

  const togglePlay = () => {
    setIsPlaying(!isPlaying)
  }

  const seekTo = (time: number) => {
    if (!audio) return
    audio.currentTime = time
    setProgress(time)
  }

  const playNext = () => {
    if (currentTrackIndex < playlist.length - 1) {
      const nextIndex = currentTrackIndex + 1
      setCurrentTrackIndex(nextIndex)
      setTrack(playlist[nextIndex])
      setIsPlaying(true)
    }
  }

  const playPrevious = () => {
    if (currentTrackIndex > 0) {
      const prevIndex = currentTrackIndex - 1
      setCurrentTrackIndex(prevIndex)
      setTrack(playlist[prevIndex])
      setIsPlaying(true)
    }
  }

  return {
    currentTrack,
    playlist,
    currentTrackIndex,
    isPlaying,
    volume,
    progress,
    duration,
    togglePlay,
    seekTo,
    setVolume,
    setTrack,
    setPlaylist,
    playNext,
    playPrevious
  }
}