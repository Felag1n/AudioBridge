import { Play } from 'lucide-react'

interface TrackRowProps {
  track: {
    id: number
    name: string
    artist: string
    duration: string
  }
}
export function TrackRow({ track }: TrackRowProps) {
    return (
      <div className="group flex items-center gap-4 rounded-md p-2 hover:bg-zinc-800/50">
        <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-md">
          <img 
            src="/api/placeholder/48/48"
            alt={track.name}
            className="object-cover"
          />
          <button className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
            <Play className="h-5 w-5" />
          </button>
        </div>
        <div className="flex-1">
          <h4 className="font-medium">{track.name}</h4>
          <p className="text-sm text-zinc-400">{track.artist}</p>
        </div>
        <div className="text-sm text-zinc-400">{track.duration}</div>
      </div>
    )
  }