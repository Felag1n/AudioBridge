export interface Track {
    id: string
    title: string
    artist: string
    file_path: string
    file_url: string
    cover?: string
    cover_url?: string
    duration: number
    created_at: string
    user: {
        id: string
        username: string
    }
}

export const testTracks: Track[] = [
    {
        id: '1',
        title: 'FUEL!',
        artist: 'Saluki',
        file_path: '/SALUKI_-_FUEL_78562414.mp3',
        file_url: '/SALUKI_-_FUEL_78562414.mp3',
        cover_url: 'https://avatars.yandex.net/get-music-content/14662984/23125fd7.a.33932468-3/150x150',
        duration: 180,
        created_at: '2024-03-25T12:00:00Z',
        user: {
            id: '1',
            username: 'test_user'
        }
    },
    {
        id: '2',
        title: 'NIGHTRIDERZ',
        artist: 'fleurnothappy, euro91',
        file_path: '/fleurnothappy_euro91_-_NIGHTRIDERZ_78813536.mp3',
        file_url: '/fleurnothappy_euro91_-_NIGHTRIDERZ_78813536.mp3',
        cover_url: 'https://static.hitmcdn.com/covers/a/f34/b29/861384.jpg',
        duration: 180,
        created_at: '2024-03-25T12:00:00Z',
        user: {
            id: '1',
            username: 'test_user'
        }
    },
    {
        id: '3',
        title: 'What happened again?',
        artist: 'Hugo Loud',
        file_path: '/Hugo_Loud_-_What_happend_again_76963157 (1).mp3',
        file_url: '/Hugo_Loud_-_What_happend_again_76963157 (1).mp3',
        cover_url: 'https://static.hitmcdn.com/covers/a/bd4/72b/800015.jpg',
        duration: 180,
        created_at: '2024-03-25T12:00:00Z',
        user: {
            id: '1',
            username: 'test_user'
        }
    }
]