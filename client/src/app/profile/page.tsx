"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs"
import { Card, CardContent } from "@/app/components/ui/card"
import { EditProfileDialog } from "@/app/components/profile/edit-profile-dialog"
import { AlbumCard } from "@/app/components/album-card"
import { TrackRow } from "@/app/components/track-row"
import { isAuthenticated } from "@/app/services/api"
import { Avatar, AvatarImage, AvatarFallback } from "@/app/components/ui/avatar";

interface UserProfile {
  username: string;
  email: string;
  library?: {
    tracks_count: number;
    albums_count: number;
    playlists_count: number;
  }
}

export default function ProfilePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [likedTracks, setLikedTracks] = useState([]);
  const [likedAlbums, setLikedAlbums] = useState([]);

  useEffect(() => {
    const checkAuth = async () => {
      if (!isAuthenticated()) {
        router.push('/auth/login');
        return;
      }

      try {
        setIsLoading(true);
        const userData = localStorage.getItem('userData');
        if (userData) {
          setProfile(JSON.parse(userData));
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Загрузка...</div>;
  }

  return (
    <div className="space-y-8">
      {/* Профиль пользователя */}
      <div className="flex items-center gap-6">
  <Avatar className="h-32 w-32 ring-2 ring-zinc-700">
    <AvatarImage 
      src={profile?.avatarUrl} 
      alt={profile?.username || 'Пользователь'} 
    />
    <AvatarFallback>
      {profile?.username?.[0] || 'U'}
    </AvatarFallback>
  </Avatar>
  <div>
    <h1 className="text-3xl font-bold">{profile?.username || 'Пользователь'}</h1>
    <p className="text-zinc-400">{profile?.email}</p>
    <div className="mt-4 flex gap-3">
      <EditProfileDialog />
    </div>
  </div>
</div>

      {/* Статистика */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6">
            <div className="text-3xl font-bold">{profile?.library?.tracks_count || 0}</div>
            <div className="text-sm text-zinc-400">Любимых треков</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6">
            <div className="text-3xl font-bold">{profile?.library?.albums_count || 0}</div>
            <div className="text-sm text-zinc-400">Альбома</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6">
            <div className="text-3xl font-bold">{profile?.library?.playlists_count || 0}</div>
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
              {likedTracks.length > 0 ? (
                likedTracks.map((track) => (
                  <TrackRow key={track.id} track={track} />
                ))
              ) : (
                <div className="text-center py-8 text-zinc-400">
                  Нет добавленных треков
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="albums">
          {likedAlbums.length > 0 ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {likedAlbums.map((album) => (
                <AlbumCard key={album.id} album={album} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-8 text-zinc-400">
                Нет добавленных альбомов
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}