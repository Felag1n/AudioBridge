import { Music } from 'lucide-react'
import { Track } from '../services/track-api'

interface TrackListProps {
    tracks: Track[]
    onPlayTrack: (track: Track) => void
}

export function TrackList({ tracks, onPlayTrack }: TrackListProps) {
    return (
        <div className="space-y-2">
            {tracks.map((track) => (
                <div
                    key={track.id}
                    className="flex items-center gap-4 rounded-lg bg-zinc-800/50 p-4 hover:bg-zinc-800/70 transition-colors cursor-pointer"
                    onClick={() => onPlayTrack(track)}
                >
                    <div className="h-10 w-10 rounded-md bg-zinc-800 flex-shrink-0 overflow-hidden">
                        {track.cover_url ? (
                            <img
                                src={track.cover_url}
                                alt={track.title}
                                className="h-full w-full object-cover"
                            />
                        ) : (
                            <div className="flex h-full w-full items-center justify-center text-zinc-500">
                                <Music className="h-5 w-5" />
                            </div>
                        )}
                    </div>
                    <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium truncate">{track.title}</h3>
                        <p className="text-xs text-zinc-400 truncate">{track.artist}</p>
                    </div>
                    <div className="text-xs text-zinc-400">
                        {track.duration ? formatDuration(track.duration) : '--:--'}
                    </div>
                </div>
            ))}
        </div>
    )
}

function formatDuration(seconds: number): string {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = Math.floor(seconds % 60)
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
} 