export const mockTrack = {
    id: '1',
    title: 'Awesome Track',
    artist: {
      name: 'Cool Artist',
      avatarUrl: '/api/placeholder/32/32'
    },
    duration: '3:45',
    coverUrl: '/api/placeholder/192/192'
  }
  
  export const mockComments = {
    data: [
      {
        id: 1,
        content: 'Отличный трек! 🎵',
        createdAt: '2 часа назад',
        user: {
          nickname: 'User1',
          avatarUrl: '/api/placeholder/32/32'
        }
      },
      {
        id: 2,
        content: 'Крутой бит!',
        createdAt: '3 часа назад',
        user: {
          nickname: 'User2',
          avatarUrl: '/api/placeholder/32/32'
        }
      },
      {
        id: 3,
        content: 'Очень атмосферно',
        createdAt: '5 часов назад',
        user: {
          nickname: 'User3',
          avatarUrl: '/api/placeholder/32/32'
        }
      }
    ]
  }