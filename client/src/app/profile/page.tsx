//client\src\app\profile\page.tsx

"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card"
import { EditProfileDialog } from "@/app/profile/edit-profile-dialog"
import { TrackRow } from "@/app/components/track-row"
import { useAuth } from "@/app/components/contexts/auth-context"
import { Avatar, AvatarImage, AvatarFallback } from "@/app/components/ui/avatar"
import { Button } from "@/app/components/ui/button"
import { Plus, Music, Disc, Heart } from "lucide-react"
import Link from "next/link"
import { useQuery } from "@tanstack/react-query"
import { trackApi } from "@/app/services/track-api"
import { albumApi } from "@/app/services/album-api"
import { motion } from "framer-motion"
import { Track, Album } from '@/app/types/track'

function AlbumCard({ album }: { album: Album }) {
  return (
    <Link href={`/album/${album.id}`}>
      <Card className="group relative overflow-hidden transition-colors hover:bg-zinc-800/50 bg-zinc-900 border-zinc-800">
        <CardContent className="p-4">
          <div className="relative aspect-square overflow-hidden rounded-md">
            <img 
              src={album.coverUrl || "/api/placeholder/200/200"}
              alt={album.title}
              className="object-cover transition-transform group-hover:scale-105 h-full w-full"
            />
          </div>
          <div className="mt-2">
            <h3 className="font-semibold truncate">{album.title}</h3>
            <p className="text-sm text-zinc-400 truncate">{album.artist}</p>
            <div className="mt-1 flex items-center gap-1 text-xs text-zinc-500">
              <Music className="h-3 w-3" />
              <span>{album.tracksCount} треков</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

export default function ProfilePage() {
  const router = useRouter();
  const { user, isLoading: isAuthLoading } = useAuth();
  const [activeTab, setActiveTab] = useState("tracks");

  useEffect(() => {
    if (!isAuthLoading && !user) {
      router.push('/auth/login');
    }
  }, [user, isAuthLoading, router]);

  // Запрос треков пользователя
  const { data: userTracks, isLoading: isTracksLoading } = useQuery({
    queryKey: ['userTracks'],
    queryFn: () => trackApi.getUserTracks(),
    enabled: !!user,
    staleTime: 1000 * 60 * 5, // 5 минут кэш
  });
  
  // Запрос альбомов пользователя
  const { data: userAlbums, isLoading: isAlbumsLoading } = useQuery({
    queryKey: ['userAlbums'],
    queryFn: () => albumApi.getUserAlbums(),
    enabled: !!user,
    staleTime: 1000 * 60 * 5,
  });

  if (isAuthLoading) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-zinc-400 border-t-purple-500"></div>
          <p className="text-zinc-400">Загрузка...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Редирект обработан в useEffect
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      {/* Профиль пользователя */}
      <div className="flex items-center gap-6">
        <Avatar className="h-32 w-32 ring-2 ring-zinc-700">
          <AvatarImage 
            src={user?.avatarUrl} 
            alt={user?.username || 'Пользователь'} 
          />
          <AvatarFallback>
            {user?.username?.[0] || 'U'}
          </AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-3xl font-bold">{user?.username || 'Пользователь'}</h1>
          <p className="text-zinc-400">{user?.email}</p>
          <div className="mt-4 flex gap-3">
            <EditProfileDialog />
            <Link href="/upload">
              <Button variant="outline" className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Загрузить контент
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Статистика */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="bg-zinc-900 border-zinc-800">
          <CardContent className="flex flex-col items-center justify-center p-6">
            <div className="text-3xl font-bold">{userTracks?.length || 0}</div>
            <div className="text-sm text-zinc-400 flex items-center gap-1">
              <Music className="h-4 w-4" />
              Треков
            </div>
          </CardContent>
        </Card>
        <Card className="bg-zinc-900 border-zinc-800">
          <CardContent className="flex flex-col items-center justify-center p-6">
            <div className="text-3xl font-bold">{userAlbums?.length || 0}</div>
            <div className="text-sm text-zinc-400 flex items-center gap-1">
              <Disc className="h-4 w-4" />
              Альбомов
            </div>
          </CardContent>
        </Card>
        <Card className="bg-zinc-900 border-zinc-800">
          <CardContent className="flex flex-col items-center justify-center p-6">
            <div className="text-3xl font-bold">0</div>
            <div className="text-sm text-zinc-400 flex items-center gap-1">
              <Heart className="h-4 w-4" />
              Лайков получено
            </div>
          </CardContent>
        </Card>
      </div>
    
      {/* Вкладки с контентом */}
      <Tabs 
        defaultValue="tracks" 
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="bg-zinc-800">
          <TabsTrigger 
            value="tracks"
            className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
          >
            <Music className="h-4 w-4 mr-2" />
            Мои треки
          </TabsTrigger>
          <TabsTrigger 
            value="albums"
            className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
          >
            <Disc className="h-4 w-4 mr-2" />
            Мои альбомы
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="tracks" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Music className="h-5 w-5" />
              Мои треки
            </h2>
            <Link href="/upload">
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <Plus className="h-4 w-4" />
                Загрузить трек
              </Button>
            </Link>
          </div>
          
          <Card className="bg-zinc-900 border-zinc-800">
            <CardContent className="p-6">
              {isTracksLoading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, index) => (
                    <div key={`track-skeleton-${index}`} className="flex items-center gap-4">
                      <div className="h-12 w-12 bg-zinc-800 rounded-md animate-pulse"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-5 bg-zinc-800 rounded animate-pulse w-1/3"></div>
                        <div className="h-4 bg-zinc-800 rounded animate-pulse w-1/4"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : userTracks && userTracks.length > 0 ? (
                <div className="space-y-2">
                  {userTracks.map((track: Track) => (
                    <TrackRow 
                      key={`track-${track.id}`} 
                      track={{
                        id: track.id.toString(),
                        title: track.title,
                        artist: track.artist,
                        coverUrl: track.cover_url,
                        url: track.file_url,
                        duration: track.duration,
                        isLiked: track.is_liked || false
                      }}
                      showLike
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-zinc-400">
                  <p>У вас пока нет загруженных треков</p>
                  <Link href="/upload">
                    <Button variant="link" className="text-purple-400 mt-2">
                      <Plus className="h-4 w-4 mr-2" />
                      Загрузить первый трек
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="albums">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Disc className="h-5 w-5" />
              Мои альбомы
            </h2>
            <Link href="/upload?tab=album">
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <Plus className="h-4 w-4" />
                Создать альбом
              </Button>
            </Link>
          </div>
          
          {isAlbumsLoading ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
              {[...Array(4)].map((_, index) => (
                <Card key={`album-skeleton-${index}`} className="bg-zinc-900 border-zinc-800">
                  <CardContent className="p-4">
                    <div className="aspect-square bg-zinc-800 rounded-md animate-pulse mb-2"></div>
                    <div className="h-5 bg-zinc-800 rounded animate-pulse mb-2"></div>
                    <div className="h-4 bg-zinc-800 rounded animate-pulse w-2/3"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : userAlbums && userAlbums.length > 0 ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
              {userAlbums.map((album) => (
                <AlbumCard key={`album-${album.id}`} album={album} />
              ))}
            </div>
          ) : (
            <Card className="bg-zinc-900 border-zinc-800">
              <CardContent className="text-center py-8 text-zinc-400">
                <p>У вас пока нет созданных альбомов</p>
                <Link href="/upload?tab=album">
                  <Button variant="link" className="text-purple-400 mt-2">
                    <Plus className="h-4 w-4 mr-2" />
                    Создать первый альбом
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}