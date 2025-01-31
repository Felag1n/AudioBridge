import { createContext, useContext, useState, useEffect, useRef } from 'react'
import { Track } from '@/app/components/data/testTracks'

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
    audioRef.current = new Audio()
    audioRef.current.volume = volume

    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [])

  const playTrack = (track: Track) => {
    if (!audioRef.current) return

    // Если трек уже играет, просто переключаем воспроизведение
    if (currentTrack?.id === track.id) {
      togglePlay()
      return
    }

    // Устанавливаем новый трек
    setCurrentTrack(track)
    setPlaylist([track]) // Пока что просто один трек
    setCurrentTrackIndex(0)
    
    audioRef.current.src = track.url
    audioRef.current.play().catch(console.error)
    setIsPlaying(true)
  }

  const togglePlay = () => {
    if (!audioRef.current || !currentTrack) return

    if (isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play().catch(console.error)
    }
    setIsPlaying(!isPlaying)
  }

  useEffect(() => {
    if (!audioRef.current) return

    const audio = audioRef.current

    const handleTimeUpdate = () => {
      setProgress(audio.currentTime)
    }

    const handleDurationChange = () => {
      setDuration(audio.duration)
    }

    const handleEnded = () => {
      setIsPlaying(false)
    }

    audio.addEventListener('timeupdate', handleTimeUpdate)
    audio.addEventListener('durationchange', handleDurationChange)
    audio.addEventListener('ended', handleEnded)

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate)
      audio.removeEventListener('durationchange', handleDurationChange)
      audio.removeEventListener('ended', handleEnded)
    }
  }, [currentTrack])

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume
    }
  }, [volume])

  const seekTo = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time
    }
  }

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