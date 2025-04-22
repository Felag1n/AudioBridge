//client\src\app\components\track-row.tsx

import { Play } from 'lucide-react'
import Link from 'next/link'
import { Track } from '@/app/components/data/testTracks'

interface TrackRowProps {
  track: Track
}

export function TrackRow({ track }: TrackRowProps) {
  const handlePlay = (e: React.MouseEvent) => {
    e.preventDefault() // Prevent navigation when clicking play
    // Add your play logic here
    console.log('Playing track:', track.url)
  }

  return (
    <Link href={`/track/${track.id}`}>
      <div className="group flex items-center gap-4 rounded-md p-2 hover:bg-zinc-800/50 cursor-pointer">
        <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-md">
          <img 
            src={track.coverUrl}
            alt={track.title}
            className="object-cover"
          />
          <button 
            onClick={handlePlay}
            className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100"
          >
            <Play className="h-5 w-5" />
          </button>
        </div>
        <div className="flex-1">
          <h4 className="font-medium group-hover:text-purple-400 transition-colors">{track.title}</h4>
          <p className="text-sm text-zinc-400">{track.artist}</p>
        </div>
      </div>
    </Link>
  )
}