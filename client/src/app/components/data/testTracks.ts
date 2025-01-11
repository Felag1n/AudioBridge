export interface Track {
    id: string
    title: string
    artist: string
    url: string
    coverUrl: string
  }

  export const testTracks: Track[] = [
    {
        id: '1',
        title: 'FUEL!',
        artist: 'Saluki',
        url: 'SALUKI_-_FUEL_78562414.mp3', // Пример публичного аудиофайла
        coverUrl: 'https://avatars.yandex.net/get-music-content/14662984/23125fd7.a.33932468-3/150x150' // Используем placeholder изображение
      },
      {
          id: '2',
          title: ' NIGHTRIDERZ',
          artist: 'fleurnothappy, euro91',
          url: 'fleurnothappy_euro91_-_NIGHTRIDERZ_78813536.mp3',
          coverUrl: 'https://static.hitmcdn.com/covers/a/f34/b29/861384.jpg'
        },
        {
          id: '3',
          title: 'What happend again?',
          artist: 'Hugo Loud',
          url: 'Hugo_Loud_-_What_happend_again_76963157 (1).mp3',
          coverUrl: 'https://static.hitmcdn.com/covers/a/bd4/72b/800015.jpg'
        }
      ]