import { AudioLines } from 'lucide-react'
import { Card, CardContent } from '../components/ui/card'

interface AlbumCardProps {
  album: {
    id: number
    name: string
    artist: string
    image: string
  }
}

export function AlbumCard({ album }: AlbumCardProps) {
  return (
    <Card className="group relative overflow-hidden transition-colors hover:bg-zinc-800/50">
      <CardContent className="p-4">
        <div className="relative aspect-square overflow-hidden rounded-md">
          <img 
            src="/api/placeholder/200/200"
            alt={album.name}
            className="object-cover transition-transform group-hover:scale-105"
          />
          <button className="absolute bottom-2 right-2 rounded-full bg-purple-400 p-3 opacity-0 transition-opacity group-hover:opacity-100">
            <AudioLines className="h-5 w-5 text-black" />
          </button>
        </div>
        <div className="mt-2">
          <h3 className="font-semibold">{album.name}</h3>
          <p className="text-sm text-zinc-400">{album.artist}</p>
        </div>
      </CardContent>
    </Card>
  )
}