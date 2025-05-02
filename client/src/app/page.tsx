//client\src\app\page.tsx

'use client';

import { AudioLines, Shuffle, Plus, TrendingUp, Clock } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from './components/ui/card';
import { Button } from './components/ui/button';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { TrackRow } from '@/app/components/track-row';
import { useQuery } from '@tanstack/react-query';
import { trackApi, Track, PopularTrack } from './services/track-api';
import { albumApi } from './services/album-api';
import { useAudioPlayer } from './components/contexts/audio-player-context';
import { useState } from 'react';
import { toast } from 'sonner';
import { useAuth } from '@/app/contexts/auth-context';

// Обновленные данные жанров
const genres = [
  { id: 1, name: 'Рок', color: 'bg-red-500' },
  { id: 2, name: 'Электронная', color: 'bg-blue-500' },
  { id: 3, name: 'Поп', color: 'bg-pink-500' },
  { id: 4, name: 'Хип-хоп', color: 'bg-purple-500' },
  { id: 5, name: 'Джаз', color: 'bg-yellow-500' },
  { id: 6, name: 'Классика', color: 'bg-green-500' },
];

interface Album {
  id: string;
  title: string;
  artist: string;
  coverUrl?: string;
  likesCount: number;
}

function AlbumCard({ album }: { album: Album }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
    >
      <Link href={`/album/${album.id}`}>
        <Card className="group relative overflow-hidden transition-colors hover:bg-zinc-800/50 bg-zinc-900 border-zinc-800">
          <CardContent className="p-4">
            <div className="relative aspect-square overflow-hidden rounded-md">
              <img 
                src={album.coverUrl || "/api/placeholder/200/200"}
                alt={album.title}
                className="object-cover transition-transform group-hover:scale-105 h-full w-full"
              />
              <motion.button 
                initial={{ opacity: 0 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="absolute bottom-2 right-2 rounded-full bg-purple-400 p-3 opacity-0 group-hover:opacity-100"
              >
                <AudioLines className="h-5 w-5 text-black" />
              </motion.button>
            </div>
            <div className="mt-2">
              <h3 className="font-semibold truncate">{album.title}</h3>
              <p className="text-sm text-zinc-400 truncate">{album.artist}</p>
              <div className="mt-1 flex items-center gap-1 text-xs text-zinc-500">
                <TrendingUp className="h-3 w-3" />
                <span>{album.likesCount} лайков</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}

export default function Home() {
  const { currentTrack, isPlaying, togglePlay, playTrack } = useAudioPlayer();
  const [showAllGenres, setShowAllGenres] = useState(false);
  const { user, isLoading: isAuthLoading } = useAuth();
  
  // Запрос популярных треков
  const { data: popularTracks, isLoading: isLoadingTracks } = useQuery({
    queryKey: ['popularTracks'],
    queryFn: () => trackApi.getPopularTracks(5),
    staleTime: 1000 * 60 * 5, // 5 минут кэш
  });
  
  // Запрос популярных альбомов
  const { data: popularAlbums, isLoading: isLoadingAlbums } = useQuery({
    queryKey: ['popularAlbums'],
    queryFn: () => albumApi.getPopularAlbums(5),
    staleTime: 1000 * 60 * 5,
  });
  
  // Запрос недавно добавленных треков
  const { data: recentTracks, isLoading: isLoadingRecentTracks } = useQuery({
    queryKey: ['recentTracks'],
    queryFn: () => trackApi.getRecentTracks(5),
    staleTime: 1000 * 60 * 5,
  });
  
  // Функция для перемешивания и воспроизведения плейлиста из популярных треков
  const handleShufflePlay = () => {
    if (!popularTracks || popularTracks.length === 0) {
      toast.error('Нет доступных треков для воспроизведения');
      return;
    }
    
    // Создаем копию массива треков для перемешивания
    const tracks = [...popularTracks];
    
    // Алгоритм перемешивания Fisher-Yates
    for (let i = tracks.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [tracks[i], tracks[j]] = [tracks[j], tracks[i]];
    }
    
    // Создаем плейлист для аудиоплеера и начинаем воспроизведение
    const tracksForPlayer = tracks.map(track => ({
      id: track.id,
      title: track.title,
      artist: track.artist,
      album: track.album,
      duration: track.duration,
      file_path: track.file_path,
      file_url: track.file_url,
      cover_url: track.cover_url,
      created_at: track.created_at,
      user: track.user,
      is_liked: track.is_liked
    }));
    
    // Начинаем воспроизведение с первого трека
    if (tracksForPlayer.length > 0) {
      playTrack(tracksForPlayer[0]);
      toast.success('Воспроизведение случайного плейлиста');
    }
  };
  
  // Фильтруем жанры для отображения
  const displayedGenres = showAllGenres ? genres : genres.slice(0, 4);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-12 pb-32"
    >
      {/* Hero секция с кнопкой воспроизведения */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden rounded-lg bg-gradient-to-br from-blue-400 via-purple-600 to-pink-500 p-8"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <motion.h1 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-4xl font-bold"
            >
              Добро пожаловать в AudioBridge
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mt-2 text-xl text-zinc-200"
            >
              Создавайте, слушайте и делитесь музыкой
            </motion.p>
          </div>
          <div className="flex flex-wrap gap-4">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button 
                size="lg" 
                className="gap-2 bg-white text-purple-600 hover:bg-zinc-100"
                onClick={handleShufflePlay}
              >
                <Shuffle className="h-5 w-5" />
                Случайный плейлист
              </Button>
            </motion.div>
            {!isAuthLoading && (
              user ? (
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link href="/upload">
                    <Button 
                      size="lg" 
                      variant="outline" 
                      className="gap-2 border-white text-white hover:bg-white/20"
                    >
                      <Plus className="h-5 w-5" />
                      Загрузить трек
                    </Button>
                  </Link>
                </motion.div>
              ) : (
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link href="/auth/login">
                    <Button 
                      size="lg" 
                      variant="outline" 
                      className="gap-2 border-white text-white hover:bg-white/20"
                    >
                      <Plus className="h-5 w-5" />
                      Войдите, чтобы загрузить
                    </Button>
                  </Link>
                </motion.div>
              )
            )}
          </div>
        </div>
      </motion.section>

      {/* Секция жанров */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center justify-between mb-6">
          <motion.h2 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-2xl font-bold"
          >
            Жанры
          </motion.h2>
          <Button 
            variant="ghost" 
            onClick={() => setShowAllGenres(!showAllGenres)}
          >
            {showAllGenres ? 'Скрыть' : 'Показать все'}
          </Button>
        </div>
        
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {displayedGenres.map((genre, index) => (
            <motion.div
              key={genre.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                href={`/genre/${genre.id}`}
                className={`${genre.color} flex h-24 items-center justify-center rounded-lg p-4 font-semibold`}
              >
                {genre.name}
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Секция популярных альбомов */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex items-center justify-between mb-6">
          <motion.h2 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-2xl font-bold flex items-center gap-2"
          >
            <TrendingUp className="h-5 w-5" />
            Популярные альбомы
          </motion.h2>
          <Link href="/albums/popular">
            <Button variant="ghost">Смотреть все</Button>
          </Link>
        </div>
        
        {isLoadingAlbums ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {[...Array(5)].map((_, index) => (
              <Card key={index} className="bg-zinc-900 border-zinc-800">
                <CardContent className="p-4">
                  <div className="aspect-square bg-zinc-800 rounded-md animate-pulse mb-2"></div>
                  <div className="h-5 bg-zinc-800 rounded animate-pulse mb-2"></div>
                  <div className="h-4 bg-zinc-800 rounded animate-pulse w-2/3"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : popularAlbums && popularAlbums.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {popularAlbums.map((album) => (
              <AlbumCard key={album.id} album={album} />
            ))}
          </div>
        ) : (
          <Card className="bg-zinc-900 border-zinc-800">
            <CardContent className="p-6 text-center text-zinc-400">
              <p>Пока нет популярных альбомов</p>
              <Link href="/upload">
                <Button variant="link" className="mt-2">
                  <Plus className="h-4 w-4 mr-2" />
                  Создать альбом
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </motion.section>

      {/* Секция популярных треков */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className="flex items-center justify-between mb-6">
          <motion.h2 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-2xl font-bold flex items-center gap-2"
          >
            <TrendingUp className="h-5 w-5" />
            Популярные треки
          </motion.h2>
          <Link href="/tracks/popular">
            <Button variant="ghost">Смотреть все</Button>
          </Link>
        </div>
        
        <Card className="bg-zinc-900 border-zinc-800">
          <CardContent className="p-6">
            {isLoadingTracks ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="w-8 text-center text-sm font-medium text-zinc-500">
                      {index + 1}
                    </div>
                    <div className="h-12 w-12 bg-zinc-800 rounded-md animate-pulse"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-5 bg-zinc-800 rounded animate-pulse w-1/3"></div>
                      <div className="h-4 bg-zinc-800 rounded animate-pulse w-1/4"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : popularTracks && popularTracks.length > 0 ? (
              <div className="space-y-2">
                {popularTracks.map((track, index) => (
                  <TrackRow 
                    key={track.id} 
                    track={{
                      id: track.id.toString(),
                      title: track.title,
                      artist: track.artist,
                      coverUrl: track.cover_url,
                      url: track.file_url,
                      duration: track.duration,
                      isLiked: track.is_liked
                    }}
                    index={index + 1}
                    showLike
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-zinc-400">
                <p>Пока нет популярных треков</p>
                <Link href="/upload">
                  <Button variant="link" className="mt-2">
                    <Plus className="h-4 w-4 mr-2" />
                    Загрузить трек
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.section>
      
      {/* Секция недавно добавленных треков */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="flex items-center justify-between mb-6">
          <motion.h2 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-2xl font-bold flex items-center gap-2"
          >
            <Clock className="h-5 w-5" />
            Новые треки
          </motion.h2>
          <Link href="/tracks/recent">
            <Button variant="ghost">Смотреть все</Button>
          </Link>
        </div>
        
        <Card className="bg-zinc-900 border-zinc-800">
          <CardContent className="p-6">
            {isLoadingRecentTracks ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="h-12 w-12 bg-zinc-800 rounded-md animate-pulse"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-5 bg-zinc-800 rounded animate-pulse w-1/3"></div>
                      <div className="h-4 bg-zinc-800 rounded animate-pulse w-1/4"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : recentTracks && recentTracks.length > 0 ? (
              <div className="space-y-2">
                {recentTracks.map((track) => (
                  <TrackRow 
                    key={track.id} 
                    track={{
                      id: track.id.toString(),
                      title: track.title,
                      artist: track.artist,
                      coverUrl: track.cover_url,
                      url: track.file_url,
                      duration: track.duration,
                      isLiked: track.is_liked
                    }}
                    showLike
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-zinc-400">
                <p>Пока нет треков</p>
                <Link href="/upload">
                  <Button variant="link" className="mt-2">
                    <Plus className="h-4 w-4 mr-2" />
                    Загрузить трек
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.section>
    </motion.div>
  );
}