import { create } from 'zustand'

interface User {
  id: string
  nickname: string
  avatarUrl: string
  stats: {
    tracksCount: number
    albumsCount: number
    playlistsCount: number
  }
}

interface UserStore {
  user: User | null
  likedTracks: any[]
  likedAlbums: any[]
  setUser: (user: User | null) => void
  updateProfile: (nickname: string, avatarUrl: string) => void
  setLikedTracks: (tracks: any[]) => void
  setLikedAlbums: (albums: any[]) => void
}

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  likedTracks: [],
  likedAlbums: [],
  
  setUser: (user) => set({ user }),
  
  updateProfile: (nickname, avatarUrl) => 
    set((state) => ({
      user: state.user ? {
        ...state.user,
        nickname,
        avatarUrl
      } : null
    })),
    
  setLikedTracks: (tracks) => set({ likedTracks: tracks }),
  setLikedAlbums: (albums) => set({ likedAlbums: albums })
}))

