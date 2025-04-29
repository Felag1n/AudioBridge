'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Textarea } from '@/app/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Album, Upload, X, Plus, Check, Music } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { albumApi } from '@/app/services/album-api';
import { trackApi } from '@/app/services/track-api';

interface Track {
  id: string;
  title: string;
  artist: string;
  coverUrl?: string;
}

export function AlbumCreateForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [description, setDescription] = useState('');
  const [releaseDate, setReleaseDate] = useState('');
  const [genre, setGenre] = useState('');
  const [userTracks, setUserTracks] = useState<Track[]>([]);
  const [selectedTracks, setSelectedTracks] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const coverInputRef = useRef<HTMLInputElement>(null);

  // Загружаем треки пользователя для выбора
  useEffect(() => {
    const fetchUserTracks = async () => {
      try {
        setIsLoading(true);
        const tracks = await trackApi.getUserTracks();
        setUserTracks(tracks);
      } catch (error) {
        console.error('Ошибка при загрузке треков:', error);
        toast.error('Не удалось загрузить ваши треки');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserTracks();
  }, []);

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

  const toggleTrackSelection = (trackId: string) => {
    setSelectedTracks(prev => 
      prev.includes(trackId)
        ? prev.filter(id => id !== trackId)
        : [...prev, trackId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !artist) {
      toast.error('Пожалуйста, заполните название и исполнителя');
      return;
    }
    
    if (selectedTracks.length === 0) {
      toast.error('Пожалуйста, выберите хотя бы один трек');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('artist', artist);
      formData.append('tracks', JSON.stringify(selectedTracks));
      
      if (description) formData.append('description', description);
      if (genre) formData.append('genre', genre);
      if (releaseDate) formData.append('release_date', releaseDate);
      if (coverFile) formData.append('cover_image', coverFile);
      
      const response = await albumApi.createAlbum(formData);
      
      toast.success('Альбом успешно создан!');
      router.push(`/album/${response.id}`);
    } catch (error) {
      console.error('Ошибка при создании альбома:', error);
      toast.error('Не удалось создать альбом. Пожалуйста, попробуйте снова.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="bg-zinc-900 text-zinc-50 border-zinc-800">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Album className="h-5 w-5" />
          Создание нового альбома
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Информация об альбоме */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Название альбома *</Label>
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
              <Label htmlFor="genre">Жанр</Label>
              <Input
                id="genre"
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                className="bg-zinc-800 border-zinc-700 text-zinc-100"
                placeholder="Например: Рок, Поп, Хип-хоп"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="releaseDate">Дата выпуска</Label>
              <Input
                id="releaseDate"
                type="date"
                value={releaseDate}
                onChange={(e) => setReleaseDate(e.target.value)}
                className="bg-zinc-800 border-zinc-700 text-zinc-100"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Описание</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-zinc-800 border-zinc-700 text-zinc-100 min-h-24"
              placeholder="Расскажите об альбоме..."
            />
          </div>
          
          {/* Загрузка обложки */}
          <div className="space-y-2">
            <Label htmlFor="cover-image">Обложка альбома</Label>
            <div className="flex items-center gap-4">
              <div className="relative h-32 w-32 overflow-hidden rounded-md bg-zinc-800 flex-shrink-0">
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
                    <Album className="h-10 w-10" />
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
                  {coverFile ? 'Изменить обложку' : 'Загрузить обложку'}
                </Button>
              </div>
            </div>
          </div>
          
          {/* Выбор треков */}
          <div className="space-y-3">
            <Label>Выберите треки для альбома *</Label>
            
            {isLoading ? (
              <div className="flex justify-center p-4">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-400 border-t-purple-500"></div>
              </div>
            ) : userTracks.length > 0 ? (
              <div className="border border-zinc-800 rounded-md divide-y divide-zinc-800 max-h-80 overflow-y-auto">
                {userTracks.map((track) => (
                  <div
                    key={track.id}
                    className={`flex items-center gap-3 p-3 cursor-pointer transition-colors ${
                      selectedTracks.includes(track.id) ? 'bg-zinc-800' : 'hover:bg-zinc-800/50'
                    }`}
                    onClick={() => toggleTrackSelection(track.id)}
                  >
                    <div className={`flex-shrink-0 h-5 w-5 rounded-full border ${
                      selectedTracks.includes(track.id)
                        ? 'bg-purple-600 border-purple-600'
                        : 'border-zinc-600'
                    } flex items-center justify-center`}>
                      {selectedTracks.includes(track.id) && (
                        <Check className="h-3 w-3 text-white" />
                      )}
                    </div>
                    
                    <div className="h-10 w-10 rounded-md bg-zinc-800 flex-shrink-0 overflow-hidden">
                      {track.coverUrl ? (
                        <img
                          src={track.coverUrl}
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
                      <div className="font-medium truncate">{track.title}</div>
                      <div className="text-sm text-zinc-400 truncate">{track.artist}</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center p-4 bg-zinc-800/30 rounded-md">
                <p className="text-zinc-400">У вас пока нет треков</p>
                <Button 
                  variant="link"
                  className="text-purple-400"
                  onClick={() => router.push('/upload')}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Загрузить треки
                </Button>
              </div>
            )}
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-purple-600 hover:bg-purple-700" 
            disabled={isSubmitting || selectedTracks.length === 0}
          >
            {isSubmitting ? 'Создание альбома...' : 'Создать альбом'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}