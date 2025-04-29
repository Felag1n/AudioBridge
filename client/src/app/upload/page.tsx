'use client';

import { TrackUploadForm } from '@/app/components/forms/track-upload-form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { AlbumCreateForm } from '@/app/components/forms/album-create-form';
import { motion } from 'framer-motion';
import { Music, Disc } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function UploadPage() {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState('track');
  
  // Получаем значение вкладки из URL-параметра
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam === 'album') {
      setActiveTab('album');
    }
  }, [searchParams]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-3xl mx-auto"
    >
      <h1 className="text-3xl font-bold mb-6">Загрузить контент</h1>
      
      <Tabs 
        value={activeTab} 
        onValueChange={setActiveTab} 
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="track" className="flex items-center gap-2">
            <Music className="h-4 w-4" />
            Загрузить трек
          </TabsTrigger>
          <TabsTrigger value="album" className="flex items-center gap-2">
            <Disc className="h-4 w-4" />
            Создать альбом
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="track">
          <TrackUploadForm />
        </TabsContent>
        
        <TabsContent value="album">
          <AlbumCreateForm />
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}