//client\src\app\components\contexts\audio-player-context.tsx

import { createContext, useContext, useState, useEffect, useRef } from 'react'
import { Track } from '@/app/services/track-api'
import { toast } from 'sonner'

interface AudioPlayerContextType {
  currentTrack: Track | null
  playlist: Track[]
  isPlaying: boolean
  volume: number
  progress: number
  duration: number
  currentTrackIndex: number
  playTrack: (track: Track) => void
  togglePlay: () => void
  setVolume: (volume: number) => void
  seekTo: (time: number) => void
  playNext: () => void
  playPrevious: () => void
}

const AudioPlayerContext = createContext<AudioPlayerContextType | undefined>(undefined)

export function AudioPlayerProvider({ children }: { children: React.ReactNode }) {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null)
  const [playlist, setPlaylist] = useState<Track[]>([])
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(0.4)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0)

  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    // Создаем новый аудио элемент
    const audio = new Audio()
    audio.volume = volume
    audioRef.current = audio

    const handleTimeUpdate = () => {
      setProgress(audio.currentTime)
    }

    const handleDurationChange = () => {
      setDuration(audio.duration)
    }

    const handleEnded = () => {
      setIsPlaying(false)
      setProgress(0)
    }

    const handleSeeking = () => {
      setProgress(audio.currentTime)
    }

    const handleSeeked = () => {
      setProgress(audio.currentTime)
    }

    audio.addEventListener('timeupdate', handleTimeUpdate)
    audio.addEventListener('durationchange', handleDurationChange)
    audio.addEventListener('ended', handleEnded)
    audio.addEventListener('seeking', handleSeeking)
    audio.addEventListener('seeked', handleSeeked)

    return () => {
      audio.pause()
      audio.removeEventListener('timeupdate', handleTimeUpdate)
      audio.removeEventListener('durationchange', handleDurationChange)
      audio.removeEventListener('ended', handleEnded)
      audio.removeEventListener('seeking', handleSeeking)
      audio.removeEventListener('seeked', handleSeeked)
      audioRef.current = null
    }
  }, [])

  const seekTo = (time: number) => {
    if (!audioRef.current) return
    
    // Устанавливаем новое время
    audioRef.current.currentTime = time
    setProgress(time)
  }

  const playTrack = (track: Track) => {
    if (!track || typeof track !== 'object') {
      console.error('Invalid track data:', track)
      toast.error('Failed to play track: Invalid track data')
      return
    }

    const audioUrl = track.file_url || track.file_path
    if (!audioUrl) {
      console.error('No audio URL found in track:', track)
      toast.error('Failed to play track: No audio URL available')
      return
    }

    let finalUrl = audioUrl
    if (!finalUrl.startsWith('http')) {
      const cleanPath = finalUrl.replace(/^\/+/, '')
      finalUrl = `http://localhost:8000/media/${cleanPath}`
    }

    setCurrentTrack(track)
    setPlaylist([track])
    setProgress(0)
    
    if (audioRef.current) {
      // Останавливаем текущее воспроизведение
      audioRef.current.pause()
      audioRef.current.currentTime = 0
      
      // Устанавливаем новый источник
      audioRef.current.src = finalUrl
      
      // Начинаем воспроизведение
      audioRef.current.play()
        .then(() => {
          setIsPlaying(true)
        })
        .catch(error => {
          console.error('Error playing track:', error)
          toast.error('Failed to play track: ' + error.message)
          setIsPlaying(false)
        })
    }
  }

  const togglePlay = () => {
    if (!audioRef.current) return

    if (isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play()
        .then(() => {
          setIsPlaying(true)
        })
        .catch(error => {
          console.error('Error playing track:', error)
          setIsPlaying(false)
        })
    }
    setIsPlaying(!isPlaying)
  }

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume
    }
  }, [volume])

  const playNext = () => {
    if (currentTrackIndex < playlist.length - 1) {
      const nextTrack = playlist[currentTrackIndex + 1]
      setCurrentTrackIndex(currentTrackIndex + 1)
      playTrack(nextTrack)
    }
  }

  const playPrevious = () => {
    if (currentTrackIndex > 0) {
      const previousTrack = playlist[currentTrackIndex - 1]
      setCurrentTrackIndex(currentTrackIndex - 1)
      playTrack(previousTrack)
    }
  }

  return (
    <AudioPlayerContext.Provider
      value={{
        currentTrack,
        playlist,
        isPlaying,
        volume,
        progress,
        duration,
        currentTrackIndex,
        playTrack,
        togglePlay,
        setVolume,
        seekTo,
        playNext,
        playPrevious
      }}
    >
      {children}
    </AudioPlayerContext.Provider>
  )
}

export function useAudioPlayer() {
  const context = useContext(AudioPlayerContext)
  if (context === undefined) {
    throw new Error('useAudioPlayer must be used within an AudioPlayerProvider')
  }
  return context
}