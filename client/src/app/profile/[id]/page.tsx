import { trackApi } from '@/app/services/track-api';
import { TrackRow } from '@/app/components/track-row';
import { formatTime } from '@/app/lib/utils';
import { User } from 'lucide-react';

export default async function ProfilePage({ params }: { params: { id: string } }) {
  const tracks = await trackApi.getUserTracks(params.id);

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <div className="h-20 w-20 rounded-full bg-zinc-800 flex items-center justify-center">
          <User className="h-10 w-10 text-zinc-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Профиль пользователя</h1>
          <p className="text-zinc-400">{tracks.length} треков</p>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Треки</h2>
        <div className="space-y-2">
          {tracks.map((track) => (
            <TrackRow
              key={track.id}
              track={{
                id: track.id.toString(),
                title: track.title,
                artist: track.artist,
                url: track.file_url,
                coverUrl: track.cover_url,
                duration: track.duration,
                isLiked: track.is_liked,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
} 