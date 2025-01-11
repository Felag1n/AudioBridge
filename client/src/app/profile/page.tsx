"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { Card, CardContent } from "../components/ui/card"
import { EditProfileDialog } from "../components/profile/edit-profile-dialog"
import { AlbumCard } from "../components/album-card"
import { TrackRow } from "../components/track-row"

// Временные данные для демонстрации
const likedAlbums = [
  { id: 1, name: 'Любимый альбом 1', artist: 'Исполнитель 1', image: '/placeholder.jpg' },
  { id: 2, name: 'Любимый альбом 2', artist: 'Исполнитель 2', image: '/placeholder.jpg' },
  { id: 3, name: 'Любимый альбом 3', artist: 'Исполнитель 3', image: '/placeholder.jpg' },
]

const likedTracks = [
  { id: 1, name: 'Любимый трек 1', artist: 'Исполнитель 1', duration: '3:45' },
  { id: 2, name: 'Любимый трек 2', artist: 'Исполнитель 2', duration: '4:20' },
  { id: 3, name: 'Любимый трек 3', artist: 'Исполнитель 3', duration: '3:15' },
]

export default function ProfilePage() {
  return (
    <div className="space-y-8">
      {/* Профиль пользователя */}
      <div className="flex items-center gap-6">
        <div className="h-32 w-32 overflow-hidden rounded-full">
          <img
            src="/api/placeholder/128/128"
            alt="Аватар пользователя"
            className="h-full w-full object-cover"
          />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Имя пользователя</h1>
          <div className="mt-4 flex gap-3">
            <EditProfileDialog />
          </div>
        </div>
      </div>

      {/* Статистика */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6">
            <div className="text-3xl font-bold">142</div>
            <div className="text-sm text-zinc-400">Любимых треков</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6">
            <div className="text-3xl font-bold">23</div>
            <div className="text-sm text-zinc-400">Альбома</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6">
            <div className="text-3xl font-bold">15</div>
            <div className="text-sm text-zinc-400">Плейлистов</div>
          </CardContent>
        </Card>
      </div>

      {/* Вкладки с контентом */}
      <Tabs defaultValue="tracks" className="space-y-6">
        <TabsList>
          <TabsTrigger value="tracks">Любимые треки</TabsTrigger>
          <TabsTrigger value="albums">Альбомы</TabsTrigger>
        </TabsList>
        <TabsContent value="tracks" className="space-y-4">
          <Card>
            <CardContent className="p-6">
              {likedTracks.map((track) => (
                <TrackRow key={track.id} track={track} />
              ))}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="albums">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {likedAlbums.map((album) => (
              <AlbumCard key={album.id} album={album} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}