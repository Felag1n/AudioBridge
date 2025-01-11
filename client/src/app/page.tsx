'use client';

import { AudioLines, Shuffle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from './components/ui/card';
import { Button } from './components/ui/button';
import Link from 'next/link';
import { motion } from 'framer-motion';

// Оставляем ваши существующие данные
const genres = [
  { id: 1, name: 'Рок', color: 'bg-red-500' },
  { id: 2, name: 'Электронная', color: 'bg-blue-500' },
  { id: 3, name: 'Поп', color: 'bg-pink-500' },
  { id: 4, name: 'Хип-хоп', color: 'bg-purple-500' },
  { id: 5, name: 'Джаз', color: 'bg-yellow-500' },
  { id: 6, name: 'Классика', color: 'bg-green-500' },
];

const albums = [
  { id: 1, name: 'Альбом 1', artist: 'Исполнитель 1', image: '/placeholder.jpg' },
  { id: 2, name: 'Альбом 2', artist: 'Исполнитель 2', image: '/placeholder.jpg' },
  { id: 3, name: 'Альбом 3', artist: 'Исполнитель 3', image: '/placeholder.jpg' },
  { id: 4, name: 'Альбом 4', artist: 'Исполнитель 4', image: '/placeholder.jpg' },
  { id: 5, name: 'Альбом 5', artist: 'Исполнитель 5', image: '/placeholder.jpg' },
];

const tracks = [
  { id: 1, name: 'Трек 1', artist: 'Исполнитель 1', duration: '3:45' },
  { id: 2, name: 'Трек 2', artist: 'Исполнитель 2', duration: '4:20' },
  { id: 3, name: 'Трек 3', artist: 'Исполнитель 3', duration: '3:15' },
  { id: 4, name: 'Трек 4', artist: 'Исполнитель 4', duration: '5:10' },
  { id: 5, name: 'Трек 5', artist: 'Исполнитель 5', duration: '3:30' },
];

function AlbumCard({ album }: { album: typeof albums[0] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="group relative overflow-hidden transition-colors hover:bg-zinc-800/50">
        <CardContent className="p-4">
          <div className="relative aspect-square overflow-hidden rounded-md">
            <img 
              src="/api/placeholder/200/200"
              alt={album.name}
              className="object-cover transition-transform group-hover:scale-105"
            />
            <motion.button 
              initial={{ opacity: 0 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              animate={{ opacity: 0 }}
              className="absolute bottom-2 right-2 rounded-full bg-purple-400 p-3 group-hover:opacity-100"
            >
              <AudioLines className="h-5 w-5 text-black" />
            </motion.button>
          </div>
          <div className="mt-2">
            <h3 className="font-semibold">{album.name}</h3>
            <p className="text-sm text-zinc-400">{album.artist}</p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function TrackRow({ track, index }: { track: typeof tracks[0]; index: number }) {
  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className="group flex items-center gap-4 rounded-md p-2 hover:bg-zinc-800/50"
    >
      <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-md">
        <img 
          src="/api/placeholder/48/48"
          alt={track.name}
          className="object-cover"
        />
        <motion.button 
          initial={{ opacity: 0 }}
          whileHover={{ scale: 1.1 }}
          className="absolute inset-0 flex items-center justify-center bg-black/50 group-hover:opacity-100"
        >
          <AudioLines className="h-5 w-5" />
        </motion.button>
      </div>
      <div className="flex-1">
        <h4 className="font-medium">{track.name}</h4>
        <p className="text-sm text-zinc-400">{track.artist}</p>
      </div>
      <div className="text-sm text-zinc-400">{track.duration}</div>
    </motion.div>
  );
}

export default function Home() {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-12"
    >
      {/* Hero секция с кнопкой воспроизведения */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden rounded-lg bg-gradient-to-br from-blue-400 via-purple-600 to-pink-500 p-8"
      >
        <div className="flex items-center justify-between">
          <div>
            <motion.h1 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-4xl font-bold"
            >
              Добро пожаловать
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mt-2 text-xl text-zinc-200"
            >
              Откройте для себя новую музыку
            </motion.p>
          </div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button size="lg" className="gap-2">
              <Shuffle className="h-5 w-5" />
              Случайный плейлист
            </Button>
          </motion.div>
        </div>
      </motion.section>

      {/* Секция жанров */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <motion.h2 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-6 text-2xl font-bold"
        >
          Жанры
        </motion.h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {genres.map((genre, index) => (
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

      {/* Секция альбомов */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <motion.h2 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-6 text-2xl font-bold"
        >
          Популярные альбомы
        </motion.h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {albums.map((album, index) => (
            <AlbumCard key={album.id} album={album} />
          ))}
        </div>
      </motion.section>

      {/* Секция треков */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <motion.h2 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-6 text-2xl font-bold"
        >
          Рекомендуемые треки
        </motion.h2>
        <Card>
          <CardContent className="p-6">
            <div className="space-y-2">
              {tracks.map((track, index) => (
                <TrackRow key={track.id} track={track} index={index} />
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.section>
    </motion.div>
  );
}