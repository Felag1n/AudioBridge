'use client';

import { useState, useRef } from 'react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Music, Upload, X, Check } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { trackApi } from '@/app/services/track-api';

export function TrackUploadForm() {
  const router = useRouter();
  const [isUploading, setIsUploading] = useState(false);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [album, setAlbum] = useState('');
  const [genre, setGenre] = useState('');
  
  const audioInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const handleAudioSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('audio/')) {
        toast.error('Пожалуйста, выберите аудио файл');
        return;
      }

      // Проверяем размер файла (максимум 20MB)
      if (file.size > 20 * 1024 * 1024) {
        toast.error('Размер файла не должен превышать 20MB');
        return;
      }

      setAudioFile(file);
      
      // Автоматически заполняем название, если оно пустое
      if (!title) {
        // Удаляем расширение файла и заменяем подчеркивания на пробелы
        const fileName = file.name.replace(/\.[^/.]+$/, "").replace(/_/g, " ");
        setTitle(fileName);
      }
    }
  };

  const handleCoverSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('Пожалуйста, выберите изображение');
        return;
      }

      // Проверяем размер файла (максимум 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Размер файла не должен превышать 5MB');
        return;
      }

      setCoverFile(file);
      
      // Создаем превью обложки
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeCover = () => {
    setCoverFile(null);
    setCoverPreview(null);
    if (coverInputRef.current) {
      coverInputRef.current.value = '';
    }
  };

  const removeAudio = () => {
    setAudioFile(null);
    if (audioInputRef.current) {
      audioInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!audioFile) {
      toast.error('Пожалуйста, загрузите аудио файл');
      return;
    }
    
    if (!title || !artist) {
      toast.error('Пожалуйста, заполните название и исполнителя');
      return;
    }
    
    setIsUploading(true);
    
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('artist', artist);
      formData.append('audio_file', audioFile);
      
      if (album) formData.append('album', album);
      if (genre) formData.append('genre', genre);
      if (coverFile) formData.append('cover_image', coverFile);
      
      const response = await trackApi.uploadTrack(formData);
      
      toast.success('Трек успешно загружен!');
      router.push(`/track/${response.id}`);
    } catch (error) {
      console.error('Ошибка при загрузке трека:', error);
      toast.error('Не удалось загрузить трек. Пожалуйста, попробуйте снова.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card className="bg-zinc-900 text-zinc-50 border-zinc-800">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Music className="h-5 w-5" />
          Загрузка нового трека
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Загрузка аудио файла */}
          <div className="space-y-2">
            <Label htmlFor="audio-file">Аудио файл (MP3, WAV)</Label>
            <div className="flex items-center gap-3">
              <input
                ref={audioInputRef}
                id="audio-file"
                type="file"
                accept="audio/*"
                onChange={handleAudioSelect}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                className="border-dashed border-zinc-700 text-zinc-400 hover:text-zinc-100 flex-1"
                onClick={() => audioInputRef.current?.click()}
              >
                {audioFile ? (
                  <div className="flex items-center justify-between w-full">
                    <span className="truncate">{audioFile.name}</span>
                    <Check className="h-4 w-4 text-green-500 ml-2" />
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Upload className="h-4 w-4" />
                    Выберите аудио файл
                  </div>
                )}
              </Button>
              {audioFile && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="text-zinc-400 hover:text-zinc-100"
                  onClick={removeAudio}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
          
          {/* Информация о треке */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Название трека *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="bg-zinc-800 border-zinc-700 text-zinc-100"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="artist">Исполнитель *</Label>
              <Input
                id="artist"
                value={artist}
                onChange={(e) => setArtist(e.target.value)}
                className="bg-zinc-800 border-zinc-700 text-zinc-100"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="album">Альбом</Label>
              <Input
                id="album"
                value={album}
                onChange={(e) => setAlbum(e.target.value)}
                className="bg-zinc-800 border-zinc-700 text-zinc-100"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="genre">Жанр</Label>
              <Input
                id="genre"
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                className="bg-zinc-800 border-zinc-700 text-zinc-100"
                placeholder="Например: Рок, Поп, Хип-хоп"
              />
            </div>
          </div>
          
          {/* Загрузка обложки */}
          <div className="space-y-2">
            <Label htmlFor="cover-image">Обложка трека (опционально)</Label>
            <div className="flex items-center gap-4">
              <div className="relative h-24 w-24 overflow-hidden rounded-md bg-zinc-800 flex-shrink-0">
                {coverPreview ? (
                  <>
                    <img
                      src={coverPreview}
                      alt="Cover preview"
                      className="h-full w-full object-cover"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-1 right-1 h-6 w-6 rounded-full"
                      onClick={removeCover}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </>
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-zinc-400">
                    <Music className="h-8 w-8" />
                  </div>
                )}
              </div>
              <div>
                <input
                  ref={coverInputRef}
                  id="cover-image"
                  type="file"
                  accept="image/*"
                  onChange={handleCoverSelect}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  className="border-zinc-700 text-zinc-400 hover:text-zinc-100"
                  onClick={() => coverInputRef.current?.click()}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Выбрать обложку
                </Button>
              </div>
            </div>
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-purple-600 hover:bg-purple-700" 
            disabled={isUploading}
          >
            {isUploading ? 'Загрузка...' : 'Загрузить трек'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}