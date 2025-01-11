'use client'

import { useAudioPlayer } from '../hooks/use-audio-player'
import { Button } from './ui/button'
import { Player } from './player'

import { testTracks } from '../components/data/testTracks'



export function TestPlayer() {
  const { setTrack, setPlaylist } = useAudioPlayer()

  const handlePlayTest = () => {
    setPlaylist(testTracks)  // Устанавливаем плейлист
    setTrack(testTracks[0])  // Начинаем с первого трека
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-4">
      <h1 className="text-2xl font-bold">Тестирование аудиоплеера</h1>
      
      <Button 
        onClick={handlePlayTest}
        className="rounded-full bg-white px-6 py-2 text-black hover:bg-zinc-200"
      >
        Загрузить тестовый плейлист
      </Button>

      <div className="fixed bottom-0 left-0 right-0">
        <Player />
      </div>
    </div>
  )
}