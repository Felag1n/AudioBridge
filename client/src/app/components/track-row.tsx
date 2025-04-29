//client\src\app\components\track-row.tsx

import { Play, Pause, Heart } from 'lucide-react'
import Link from 'next/link'
import { useAudioPlayer } from '@/app/hooks/use-audio-player'
import { formatTime } from '@/app/lib/utils'
import { cn } from '@/app/lib/utils'
import { useState } from 'react'
import { trackApi } from '@/app/services/track-api'
import { toast } from 'sonner'

export interface TrackProps {
  id: string
  title: string
  artist: string
  url: string
  coverUrl?: string
  duration?: number
  isLiked?: boolean
}

interface TrackRowProps {
  track: TrackProps
  index?: number
  showLike?: boolean
  onPlay?: () => void
}

export function TrackRow({ track, index, showLike = false, onPlay }: TrackRowProps) {
  const { currentTrack, isPlaying, playTrack, togglePlay } = useAudioPlayer()
  const isCurrentTrack = currentTrack?.id === track.id
  const [isLiked, setIsLiked] = useState(track.isLiked || false)
  
  const handlePlay = (e: React.MouseEvent) => {
    e.preventDefault() // Prevent navigation when clicking play
    
    if (onPlay) {
      onPlay()
    } else {
      if (isCurrentTrack) {
        togglePlay()
      } else {
        playTrack(track)
      }
    }
  }
  
  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault() // Prevent navigation
    e.stopPropagation() // Prevent triggering parent click handlers
    
    try {
      if (isLiked) {
        await trackApi.unlikeTrack(track.id)
      } else {
        await trackApi.likeTrack(track.id)
      }
      
      setIsLiked(!isLiked)
      toast.success(isLiked ? 'Удалено из избранного' : 'Добавлено в избранное')
    } catch (error) {
      toast.error('Не удалось изменить статус трека')
    }
  }

  return (
    <Link href={`/track/${track.id}`}>
      <div className={cn(
        "group flex items-center gap-4 rounded-md p-2 transition-colors hover:bg-zinc-800/50 cursor-pointer",
        isCurrentTrack && "bg-zinc-800/80"
      )}>
        {index !== undefined && (
          <div className="w-8 text-center text-sm font-medium text-zinc-500 group-hover:text-zinc-300">
            {index}
          </div>
        )}
        
        <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-md">
          <img 
            src={track.coverUrl || '/api/placeholder/48/48'}
            alt={track.title}
            className="h-full w-full object-cover"
          />
          <button 
            onClick={handlePlay}
            className={cn(
              "absolute inset-0 flex items-center justify-center bg-black/50",
              isCurrentTrack ? "opacity-100" : "opacity-0 group-hover:opacity-100"
            )}
          >
            {isCurrentTrack && isPlaying ? (
              <Pause className="h-5 w-5" />
            ) : (
              <Play className="h-5 w-5" />
            )}
          </button>
        </div>
        
        <div className="flex-1 min-w-0">
          <h4 className={cn(
            "font-medium truncate",
            isCurrentTrack ? "text-purple-400" : "group-hover:text-purple-400"
          )}>
            {track.title}
          </h4>
          <p className="text-sm text-zinc-400 truncate">{track.artist}</p>
        </div>
        
        <div className="flex items-center gap-3">
          {showLike && (
            <button
              onClick={handleLike}
              className={cn(
                "opacity-0 group-hover:opacity-100 transition-opacity p-1",
                isLiked && "opacity-100 text-red-500"
              )}
            >
              <Heart className={cn("h-4 w-4", isLiked && "fill-current")} />
            </button>
          )}
          
          {track.duration && (
            <span className="text-sm text-zinc-500 group-hover:text-zinc-300">
              {formatTime(track.duration)}
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}